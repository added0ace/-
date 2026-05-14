import { MetaInfo } from '../lib/metadataCleaner';

interface ResultSectionProps {
  originalUrl: string;
  resultUrl: string;
  metaInfo: MetaInfo[];
  onReset: () => void;
}

const metaIcon = (type: string) => {
  switch (type) {
    case 'exif':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      );
    case 'synthid':
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
  }
};

export default function ResultSection({ originalUrl, resultUrl, metaInfo, onReset }: ResultSectionProps) {
  return (
    <>
      <div className="card anim-in" id="resultSection">
        <div className="card-header">
          <div className="card-header-icon" style={{ background: 'var(--md-success-container)', color: 'var(--md-success)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div>
            <div className="card-title">Готово!</div>
            <div className="card-subtitle">Вотермарк удалён, метаданные очищены</div>
          </div>
        </div>
        <div className="card-body">
          <div className="result-grid">
            <div className="result-panel">
              <div className="result-panel-header">
                <div className="dot" style={{ background: '#b3261e' }} />
                Оригинал
              </div>
              <img src={originalUrl} alt="Оригинал" />
            </div>
            <div className="result-panel">
              <div className="result-panel-header">
                <div className="dot" style={{ background: '#146c2e' }} />
                Результат
              </div>
              <img src={resultUrl} alt="Результат" />
            </div>
          </div>
          <div className="result-actions">
            <a className="btn btn-filled" href={resultUrl} download="cleanshot-result.png">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Скачать PNG
            </a>
            <button className="btn btn-tonal" onClick={onReset}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
              Новое изображение
            </button>
          </div>
        </div>
      </div>

      {metaInfo.length > 0 && (
        <div className="card anim-in">
          <div className="card-header">
            <div className="card-header-icon" style={{ background: 'var(--md-tertiary-container)', color: 'var(--md-tertiary)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </div>
            <div>
              <div className="card-title">Очищенные метаданные</div>
              <div className="card-subtitle">Все данные ИИ-генерации удалены из файла</div>
            </div>
          </div>
          <div className="card-body">
            <div className="metadata-grid">
              {metaInfo.map((item, i) => (
                <div key={i} className="meta-item removed">
                  <div className="meta-item-icon">{metaIcon(item.type)}</div>
                  <div className="meta-item-content">
                    <div className="meta-item-label">{item.label}</div>
                    <div className="meta-item-value">{item.value}</div>
                  </div>
                  <span className="meta-removed-badge">Удалено</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
