interface LogEntry {
  time: string;
  msg: string;
  level: 'info' | 'warn' | 'error';
}

interface ProgressSectionProps {
  label: string;
  sublabel: string;
  progress: number;
  logs: LogEntry[];
  showLogs?: boolean;
}

export default function ProgressSection({ label, sublabel, progress, logs, showLogs = false }: ProgressSectionProps) {
  return (
    <div className="card anim-in">
      <div className="progress-card">
        <div className="progress-spinner">
          <svg viewBox="0 0 50 50">
            <circle className="bg" cx="25" cy="25" r="20" />
            <circle className="track" cx="25" cy="25" r="20" />
          </svg>
        </div>
        <div className="progress-label">{label}</div>
        <div className="progress-sublabel">{sublabel}</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      {showLogs && logs.length > 0 && (
        <div className="log-area">
          {logs.map((entry, i) => (
            <span key={i} className={`log-line log-${entry.level}`}>
              <span className="log-time">{entry.time}</span>
              {entry.msg}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export type { LogEntry };
