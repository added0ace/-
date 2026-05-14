import { useState, useCallback } from 'react';
import TopBar from './components/TopBar';
import FeatureChips from './components/FeatureChips';
import UploadCard from './components/UploadCard';
import ModelNotice from './components/ModelNotice';
import MaskEditor from './components/MaskEditor';
import ProgressSection, { LogEntry } from './components/ProgressSection';
import ResultSection from './components/ResultSection';
import Toast, { ToastData } from './components/Toast';
import { MetadataCleaner, MetaInfo } from './lib/metadataCleaner';
import { ModelManager } from './lib/modelManager';
import {
  preprocessImageWithMask,
  postprocessImage,
  composeFinalImageWithMask,
  resizeImageForModel,
} from './lib/imageProcessor';

type AppState = 'upload' | 'edit' | 'processing' | 'result';

interface ProgressState {
  label: string;
  sublabel: string;
  pct: number;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [modelUrl, setModelUrl] = useState('src/assets/lama_fp32.onnx');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [metaInfo, setMetaInfo] = useState<MetaInfo[]>([]);
  const [progress, setProgress] = useState<ProgressState>({ label: '', sublabel: '', pct: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((msg: string, type: 'error' | 'success' | '' = '') => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const addLog = useCallback((msg: string, level: 'info' | 'warn' | 'error' = 'info') => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs((prev) => [...prev.slice(-100), { time, msg, level }]);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setOriginalUrl(url);
    setAppState('edit');
    setLogs([]);

    // Extract metadata in background
    try {
      const info = await MetadataCleaner.extractInfo(file);
      setMetaInfo(info);
    } catch (e) {
      console.warn('Could not extract metadata', e);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setAppState('upload');
    setImageUrl('');
    setUploadedFile(null);
  }, []);

  const handleProcess = useCallback(async (maskCanvas: HTMLCanvasElement) => {
    if (!uploadedFile || !imageUrl) {
      showToast('Изображение не загружено', 'error');
      return;
    }

    setAppState('processing');
    setLogs([]);

    const updateProgress = (label: string, sub: string, pct: number) => {
      setProgress({ label, sublabel: sub, pct });
    };

    try {
      // Step 1: Init / load model
      updateProgress('Инициализация модели...', 'Загрузка LaMa ONNX', 0);
      addLog('Начало обработки', 'info');

      await ModelManager.initialize(
        modelUrl,
        (label, sub, pct) => {
          updateProgress(label, sub, pct);
          addLog(label, 'info');
        },
        addLog
      );

      addLog('Модель инициализирована', 'info');

      // Step 2: Load image as bitmap
      updateProgress('Подготовка изображения...', 'Декодирование файла', 70);
      addLog('Подготовка изображения', 'info');

      const imgBitmap = await createImageBitmap(uploadedFile);
      addLog(`Размер: ${imgBitmap.width}×${imgBitmap.height}`, 'info');

      // Step 3: Resize for model
      updateProgress('Обработка маски...', 'Масштабирование для модели', 75);
      const modelImageData = resizeImageForModel(imgBitmap);

      // Resize mask to model size
      const modelSize = 512;
      const maskResized = document.createElement('canvas');
      maskResized.width = modelSize;
      maskResized.height = modelSize;
      const maskCtx = maskResized.getContext('2d', { willReadFrequently: true })!;
      maskCtx.drawImage(maskCanvas, 0, 0, modelSize, modelSize);
      const maskData = maskCtx.getImageData(0, 0, modelSize, modelSize);

      addLog('Маска масштабирована', 'info');

      // Step 4: Preprocess
      updateProgress('Инференс ИИ...', 'Удаление вотермарка нейросетью', 80);
      addLog('Запуск инференса LaMa', 'info');

      const { imageTensor, maskTensor } = preprocessImageWithMask(modelImageData, maskData);

      const inputNames = ModelManager.getInputNames();
      const outputNames = ModelManager.getOutputNames();

      addLog(`Входы модели: ${inputNames.join(', ')}`, 'info');
      addLog(`Выходы модели: ${outputNames.join(', ')}`, 'info');

      const feeds: Record<string, any> = {};
      feeds[inputNames[0] || 'image'] = imageTensor;
      feeds[inputNames[1] || 'mask'] = maskTensor;

      const results = await ModelManager.runInference(feeds);
      addLog('Инференс завершён', 'info');

      // Step 5: Postprocess
      updateProgress('Постобработка...', 'Сборка результата', 90);
      const outKey = outputNames[0] || Object.keys(results)[0];
      const outputTensor = results[outKey];
      const processedImageData = postprocessImage(outputTensor, modelSize, modelSize);

      // Step 6: Compose final
      updateProgress('Финальная сборка...', 'Наложение результата', 95);
      const finalDataUrl = composeFinalImageWithMask(imgBitmap, processedImageData, maskData);

      // Step 7: Clean metadata
      updateProgress('Очистка метаданных...', 'Удаление EXIF, XMP, SynthID', 97);
      addLog('Очистка метаданных', 'info');
      const cleanDataUrl = await MetadataCleaner.clean(finalDataUrl, uploadedFile);

      updateProgress('Готово!', 'Обработка завершена успешно', 100);
      addLog('Обработка завершена!', 'info');

      setResultUrl(cleanDataUrl);
      setAppState('result');
      showToast('Вотермарк успешно удалён!', 'success');
    } catch (err: any) {
      console.error('Processing error:', err);
      addLog('Ошибка: ' + err.message, 'error');
      showToast('Ошибка обработки: ' + err.message, 'error');
      // Reset model so it can be retried
      ModelManager.isInitialized = false;
      ModelManager.initializationPromise = null;
      ModelManager.session = null;
      setAppState('edit');
    }
  }, [uploadedFile, imageUrl, modelUrl, addLog, showToast]);

  const handleReset = useCallback(() => {
    setAppState('upload');
    setImageUrl('');
    setOriginalUrl('');
    setResultUrl('');
    setUploadedFile(null);
    setLogs([]);
    setMetaInfo([]);
  }, []);

  return (
    <>
      <TopBar />
      <main className="main">
        <FeatureChips />

        {/* Upload */}
        {appState === 'upload' && (
          <>
            <UploadCard onFile={handleFile} />
            <ModelNotice modelUrl={modelUrl} onChange={setModelUrl} />
          </>
        )}

        {/* Mask Editor */}
        {appState === 'edit' && imageUrl && (
          <>
            <MaskEditor
              imageUrl={imageUrl}
              onProcess={handleProcess}
              onCancel={handleCancel}
            />
            <ModelNotice modelUrl={modelUrl} onChange={setModelUrl} />
          </>
        )}

        {/* Processing */}
        {appState === 'processing' && (
          <ProgressSection
            label={progress.label}
            sublabel={progress.sublabel}
            progress={progress.pct}
            logs={logs}
            showLogs={true}
          />
        )}

        {/* Result */}
        {appState === 'result' && resultUrl && (
          <ResultSection
            originalUrl={originalUrl}
            resultUrl={resultUrl}
            metaInfo={metaInfo}
            onReset={handleReset}
          />
        )}
      </main>

      <Toast data={toast} />
    </>
  );
}
