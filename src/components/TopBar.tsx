export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      </div>
      <div className="top-bar-title">
        Clean<span>Shot</span>AI
      </div>
      <div className="badge">Локальная обработка</div>
    </div>
  );
}
