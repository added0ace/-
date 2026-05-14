import { useEffect, useState } from 'react';

export interface ToastData {
  msg: string;
  type?: 'error' | 'success' | '';
  id: number;
}

interface ToastProps {
  data: ToastData | null;
}

export default function Toast({ data }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!data) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className={`toast${data?.type ? ' ' + data.type : ''}${visible ? ' show' : ''}`}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <span>{data?.msg}</span>
    </div>
  );
}
