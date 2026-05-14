declare const ort: any;

export type LogFn = (msg: string, level?: 'info' | 'warn' | 'error') => void;
export type ProgressFn = (label: string, sub: string, pct: number) => void;

const NUM_THREADS = 2;
const OPTIMIZATION_LEVEL = 'basic';

export const ModelManager = {
  session: null as any,
  modelBuffer: null as Uint8Array | null,
  isInitialized: false,
  initializationPromise: null as Promise<void> | null,

  initRuntime() {
    if (typeof ort === 'undefined') throw new Error('ONNX Runtime not loaded');
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/';
    ort.env.wasm.numThreads = NUM_THREADS;
    ort.env.wasm.proxy = false;
  },

  async fetchWithProgress(url: string, onProgress?: (pct: number, received: number) => void): Promise<Uint8Array> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
    const reader = response.body!.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (contentLength > 0 && onProgress) {
        onProgress(Math.round((received / contentLength) * 100), received);
      }
    }
    const all = new Uint8Array(received);
    let pos = 0;
    for (const c of chunks) { all.set(c, pos); pos += c.length; }
    return all;
  },

  async initialize(
    modelPath: string,
    onProgress: ProgressFn,
    onLog: LogFn
  ): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        this.initRuntime();
        onLog('ONNX Runtime инициализирован', 'info');

        onProgress('Загрузка модели...', 'Скачивание LaMa ONNX модели', 0);
        onLog(`Загрузка модели: ${modelPath}`, 'info');

        this.modelBuffer = await this.fetchWithProgress(modelPath, (pct, received) => {
          const mb = (received / 1024 / 1024).toFixed(1);
          onProgress('Загрузка модели...', `Загружено ${mb} МБ`, pct * 0.6);
          onLog(`Загрузка: ${pct}%`, 'info');
        });

        onLog(`Модель загружена: ${(this.modelBuffer.length / 1024 / 1024).toFixed(1)} МБ`, 'info');
        onProgress('Создание сессии...', 'Инициализация инференса', 65);

        const sessionOptions = {
          executionProviders: ['wasm'],
          graphOptimizationLevel: OPTIMIZATION_LEVEL,
          executionMode: 'sequential',
          enableCpuMemArena: true,
          enableMemPattern: true,
          extra: { session: { use_ort_model_bytes_directly: '1' } },
        };

        this.session = await ort.InferenceSession.create(this.modelBuffer.buffer, sessionOptions);
        onLog('Сессия создана успешно', 'info');
        onProgress('Модель готова!', 'Можно начать обработку', 100);
        this.isInitialized = true;
      } catch (err: any) {
        this.initializationPromise = null;
        throw err;
      }
    })();

    return this.initializationPromise;
  },

  async runInference(feeds: any): Promise<any> {
    if (!this.session) throw new Error('Сессия не инициализирована');
    return await this.session.run(feeds);
  },

  getInputNames(): string[] {
    if (!this.session) return ['image', 'mask'];
    try { return this.session.inputNames; } catch { return ['image', 'mask']; }
  },

  getOutputNames(): string[] {
    if (!this.session) return ['inpainted'];
    try { return this.session.outputNames; } catch { return ['inpainted']; }
  },
};
