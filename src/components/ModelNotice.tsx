interface ModelNoticeProps {
  modelUrl: string;
  onChange: (url: string) => void;
}

export default function ModelNotice({ modelUrl, onChange }: ModelNoticeProps) {
  return (
    <div className="model-notice">
      <div className="model-notice-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div className="model-notice-title">Требуется LaMa ONNX модель</div>
        <div className="model-notice-text">
          Для удаления вотермарков нужна модель{' '}
          <strong>lama_fp32.onnx</strong>. Разместите её в папке{' '}
          <code style={{ background: 'var(--md-surface-variant)', padding: '1px 5px', borderRadius: '3px' }}>
            src/assets/
          </code>{' '}
          рядом с HTML файлом, или укажите прямую URL ссылку на модель ниже.
        </div>
        <input
          className="model-url-input"
          type="text"
          placeholder="https://... URL к lama_fp32.onnx (опционально)"
          value={modelUrl}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
