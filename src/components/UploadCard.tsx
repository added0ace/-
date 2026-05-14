import { useRef, useState } from 'react';

interface UploadCardProps {
  onFile: (file: File) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export default function UploadCard({ onFile }: UploadCardProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Неподдерживаемый формат. Используйте PNG, JPEG или WebP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('Файл слишком большой. Максимум 50 МБ.');
      return;
    }
    onFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="card anim-in" id="uploadCard">
      <div className="card-header">
        <div className="card-header-icon" style={{ background: 'var(--md-primary-container)', color: 'var(--md-primary)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        <div>
          <div className="card-title">Загрузить изображение</div>
          <div className="card-subtitle">PNG, JPEG, WebP до 50 МБ</div>
        </div>
      </div>
      <div className="card-body">
        <div
          className={`drop-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
          <div className="drop-zone-title">Перетащите изображение сюда</div>
          <div className="drop-zone-subtitle">или нажмите чтобы выбрать файл из компьютера</div>
          <div className="drop-zone-formats">
            <span className="format-tag">PNG</span>
            <span className="format-tag">JPEG</span>
            <span className="format-tag">WEBP</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
