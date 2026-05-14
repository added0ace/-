import { useRef, useEffect, useState, useCallback } from 'react';

interface MaskEditorProps {
  imageUrl: string;
  onProcess: (maskCanvas: HTMLCanvasElement) => void;
  onCancel: () => void;
}

type Tool = 'brush' | 'eraser' | 'hand';

export default function MaskEditor({ imageUrl, onProcess, onCancel }: MaskEditorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);

  const [tool, setTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [hasMask, setHasMask] = useState(false);

  // Drawing state refs (not state to avoid re-renders)
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const imageBitmap = useRef<ImageBitmap | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = async () => {
      const bmp = await createImageBitmap(img);
      imageBitmap.current = bmp;
      initCanvases(bmp.width, bmp.height);
      fitToView(bmp.width, bmp.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const initCanvases = (w: number, h: number) => {
    [imageCanvasRef, maskCanvasRef, cursorCanvasRef].forEach((ref) => {
      if (ref.current) {
        ref.current.width = w;
        ref.current.height = h;
      }
    });
    if (imageCanvasRef.current && imageBitmap.current) {
      const ctx = imageCanvasRef.current.getContext('2d')!;
      ctx.drawImage(imageBitmap.current, 0, 0);
    }
    if (maskCanvasRef.current) {
      const ctx = maskCanvasRef.current.getContext('2d')!;
      ctx.clearRect(0, 0, w, h);
    }
  };

  const fitToView = (imgW: number, imgH: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cw = container.clientWidth - 40;
    const ch = container.clientHeight - 40;
    const scale = Math.min(cw / imgW, ch / imgH, 1);
    setZoom(Math.round(scale * 100) / 100);
  };

  const getCanvasPos = (e: React.MouseEvent | MouseEvent): { x: number; y: number } | null => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const drawOnMask = (x: number, y: number, prevX?: number, prevY?: number) => {
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;
    maskCtx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    maskCtx.strokeStyle = 'rgba(255, 50, 50, 0.85)';
    maskCtx.lineWidth = brushSize;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    if (prevX !== undefined && prevY !== undefined) {
      maskCtx.moveTo(prevX, prevY);
      maskCtx.lineTo(x, y);
    } else {
      maskCtx.moveTo(x, y);
      maskCtx.lineTo(x + 0.1, y + 0.1);
    }
    maskCtx.stroke();
    setHasMask(true);
  };

  const drawCursor = (x: number, y: number) => {
    const cursorCtx = cursorCanvasRef.current?.getContext('2d');
    const canvas = cursorCanvasRef.current;
    if (!cursorCtx || !canvas) return;
    cursorCtx.clearRect(0, 0, canvas.width, canvas.height);
    cursorCtx.beginPath();
    cursorCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    cursorCtx.strokeStyle = tool === 'eraser' ? 'rgba(255,255,255,0.8)' : 'rgba(255,80,80,0.9)';
    cursorCtx.lineWidth = 2 / zoom;
    cursorCtx.stroke();
    cursorCtx.fillStyle = tool === 'eraser' ? 'rgba(255,255,255,0.1)' : 'rgba(255,80,80,0.15)';
    cursorCtx.fill();
  };

  const clearCursor = () => {
    const cursorCtx = cursorCanvasRef.current?.getContext('2d');
    const canvas = cursorCanvasRef.current;
    if (!cursorCtx || !canvas) return;
    cursorCtx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (tool === 'hand') {
      isPanning.current = true;
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollRef.current?.scrollLeft || 0,
        scrollTop: scrollRef.current?.scrollTop || 0,
      };
      return;
    }
    isDrawing.current = true;
    const pos = getCanvasPos(e);
    if (!pos) return;
    lastPos.current = pos;
    drawOnMask(pos.x, pos.y);
  }, [tool, brushSize, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tool === 'hand') {
      if (isPanning.current && panStart.current && scrollRef.current) {
        scrollRef.current.scrollLeft = panStart.current.scrollLeft - (e.clientX - panStart.current.x);
        scrollRef.current.scrollTop = panStart.current.scrollTop - (e.clientY - panStart.current.y);
      }
      return;
    }
    const pos = getCanvasPos(e);
    if (!pos) return;
    drawCursor(pos.x, pos.y);
    if (isDrawing.current && lastPos.current) {
      drawOnMask(pos.x, pos.y, lastPos.current.x, lastPos.current.y);
      lastPos.current = pos;
    }
  }, [tool, brushSize, zoom]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    isPanning.current = false;
    lastPos.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearCursor();
    isDrawing.current = false;
    isPanning.current = false;
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom((z) => {
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        return Math.min(5, Math.max(0.1, Math.round(z * factor * 100) / 100));
      });
    }
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasMask(false);
  };

  const handleProcess = () => {
    if (maskCanvasRef.current) {
      onProcess(maskCanvasRef.current);
    }
  };

  const changeZoom = (delta: number) => {
    setZoom((z) => Math.min(5, Math.max(0.1, Math.round((z + delta) * 100) / 100)));
  };

  const imgW = imageBitmap.current?.width || 512;
  const imgH = imageBitmap.current?.height || 512;



  return (
    <div className="card anim-in">
      <div className="card-header">
        <div className="card-header-icon" style={{ background: 'var(--md-secondary-container)', color: 'var(--md-secondary)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </div>
        <div>
          <div className="card-title">Отметьте вотермарк</div>
          <div className="card-subtitle">Закрасьте кистью область с вотермарком, затем нажмите «Удалить»</div>
        </div>
      </div>
      <div className="card-body" style={{ paddingTop: '12px' }}>
        {/* Toolbar */}
        <div className="toolbar" style={{ marginBottom: '12px' }}>
          <button className={`tool-btn${tool === 'brush' ? ' active' : ''}`} onClick={() => setTool('brush')} title="Кисть">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" />
            </svg>
          </button>
          <button className={`tool-btn${tool === 'eraser' ? ' active' : ''}`} onClick={() => setTool('eraser')} title="Ластик">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.77-.78 2.04 0 2.83L5.03 20H6.5h11v-2H11.66l8.79-8.79c.78-.78.78-2.05 0-2.83l-3.9-3.9c-.39-.38-.9-.58-1.41-.48zM6.5 20H4v-2.03L6.5 20z" />
            </svg>
          </button>
          <button className={`tool-btn${tool === 'hand' ? ' active' : ''}`} onClick={() => setTool('hand')} title="Перемещение">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
            </svg>
          </button>

          <div className="toolbar-divider" />

          <div className="brush-size-wrap">
            <span className="brush-size-label">Размер</span>
            <input
              type="range" className="slider"
              min={5} max={200} value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <span className="brush-size-val">{brushSize}</span>
          </div>

          <button className="btn btn-text" onClick={clearMask} style={{ padding: '8px 12px', fontSize: '13px' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            Очистить
          </button>

          <div className="zoom-controls">
            <button className="tool-btn" onClick={() => changeZoom(-0.1)} title="Уменьшить">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm-2-4h5v1h-5z" />
              </svg>
            </button>
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button className="tool-btn" onClick={() => changeZoom(0.1)} title="Увеличить">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm-1-4H7V9h2.5V6.5h1V9H13v1h-2.5v2.5h-1V10z" />
              </svg>
            </button>
            <button
              className="tool-btn"
              onClick={() => fitToView(imgW, imgH)}
              title="По размеру"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="mask-editor-container">
          <div
            className="mask-editor-scroll-container"
            ref={scrollRef}
            onWheel={handleWheel}
          >
            <div
              ref={wrapperRef}
              className="mask-editor-canvas-wrapper"
              style={{
                width: imgW * zoom,
                height: imgH * zoom,
                minWidth: imgW * zoom,
                minHeight: imgH * zoom,
                cursor: tool === 'hand' ? 'grab' : 'none',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <canvas
                ref={imageCanvasRef}
                className="mask-editor-image-canvas"
                style={{ width: imgW * zoom, height: imgH * zoom }}
              />
              <canvas
                ref={maskCanvasRef}
                className="mask-editor-mask-canvas"
                style={{ width: imgW * zoom, height: imgH * zoom, opacity: 0.6 }}
              />
              <canvas
                ref={cursorCanvasRef}
                className="mask-editor-cursor-canvas"
                style={{ width: imgW * zoom, height: imgH * zoom }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-filled" onClick={handleProcess} disabled={!hasMask}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            Удалить вотермарк
          </button>
          <button className="btn btn-outlined" onClick={onCancel}>
            Отмена
          </button>
          <span style={{ fontSize: '13px', color: 'var(--md-on-surface-variant)', marginLeft: 'auto' }}>
            Колёсиком мыши для зума
          </span>
        </div>
      </div>
    </div>
  );
}
