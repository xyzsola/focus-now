import React, { useEffect, useState } from 'react';
import { getSettings, Settings } from '../utils/storage';

const Overlay: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const s = await getSettings();
      setSettings(s);
      if (s.blockEndTime) {
        setRemainingTime(Math.max(0, s.blockEndTime - Date.now()));
      }
    };
    init();

    const interval = setInterval(() => {
      setRemainingTime((prev: number) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!settings || !settings.blockEndTime || remainingTime <= 0) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wrapper">
      <div className="glass" style={{ padding: '40px', maxWidth: '600px', width: '90%' }}>
        {settings.customMediaUrl && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            {settings.customMediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video 
                src={settings.customMediaUrl} 
                autoPlay loop muted 
                style={{ maxWidth: '100%', maxHeight: '40vh', objectFit: 'contain', borderRadius: '8px' }} 
              />
            ) : (
              <img 
                src={settings.customMediaUrl} 
                alt="Motivation" 
                style={{ maxWidth: '100%', maxHeight: '40vh', objectFit: 'contain', borderRadius: '8px' }} 
              />
            )}
          </div>
        )}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Focus Mode Active
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          {settings.customMessage}
        </p>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--primary)' }}>
          {formatTime(remainingTime)}
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>
          Unblock option disabled. Keep going!
        </p>
      </div>
    </div>
  );
};

export default Overlay;
