import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, Settings } from '../utils/storage';
import '../index.css';

const Popup: React.FC = () => {
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
      setRemainingTime(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startSession = async () => {
    if (!settings) return;
    const endTime = Date.now() + settings.blockDurationHours * 3600 * 1000;
    const newSettings = { ...settings, blockEndTime: endTime };
    setSettings(newSettings);
    await saveSettings({ blockEndTime: endTime });
    setRemainingTime(settings.blockDurationHours * 3600 * 1000);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!settings) return <div style={{ width: '300px', padding: '20px' }}>Loading...</div>;

  const isActive = settings.blockEndTime && remainingTime > 0;

  return (
    <div style={{ width: '350px', padding: '24px', textAlign: 'center' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--primary)' }}>Focus Now</h2>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{isActive ? 'Session in progress' : 'Ready to focus?'}</p>
      </header>

      <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
        {isActive ? (
          <>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '10px', color: 'var(--primary)' }}>
              {formatTime(remainingTime)}
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Stop button disabled for maximum focus.</p>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Duration: {settings.blockDurationHours} {settings.blockDurationHours === 1 ? 'hour' : 'hours'}</label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={settings.blockDurationHours}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSettings({ ...settings, blockDurationHours: val });
                  saveSettings({ blockDurationHours: val });
                }}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={startSession}>
              Start Focusing
            </button>
          </>
        )}
      </div>

      <footer style={{ marginTop: '16px' }}>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', fontSize: '0.8rem' }}
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          Open Settings
        </button>
      </footer>
    </div>
  );
};

export default Popup;
