import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, Settings } from '../utils/storage';
import '../index.css';

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleChange = async (key: keyof Settings, value: any) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const addUrl = () => {
    if (newUrl && settings) {
      const updatedUrls = [...settings.blockedUrls, newUrl];
      handleChange('blockedUrls', updatedUrls);
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    if (settings) {
      const updatedUrls = settings.blockedUrls.filter((_, i) => i !== index);
      handleChange('blockedUrls', updatedUrls);
    }
  };

  if (!settings) return <div className="p-8">Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(to right, var(--primary), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Focus Now Settings
        </h1>
        <p style={{ opacity: 0.7 }}>Configure your productivity environment.</p>
      </header>

      <section className="glass" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Block List Configuration</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="URL or Regex (e.g. facebook\.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)' }}
          />
          <button className="btn btn-primary" onClick={addUrl}>Add</button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.whitelistMode}
              onChange={(e) => handleChange('whitelistMode', e.target.checked)}
            />
            <span>Whitelist Mode (Block all except these)</span>
          </label>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {settings.blockedUrls.map((url, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid var(--border)' }}>
              <code>{url}</code>
              <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => removeUrl(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass" style={{ padding: '30px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Personalization</h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Custom Block Message</label>
          <input
            type="text"
            value={settings.customMessage}
            onChange={(e) => handleChange('customMessage', e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Custom Media URL (Image/GIF/Video)</label>
          <input
            type="text"
            value={settings.customMediaUrl}
            onChange={(e) => handleChange('customMediaUrl', e.target.value)}
            placeholder="https://example.com/motivation.gif"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)' }}
          />
        </div>
      </section>

      <section className="glass" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Default Session</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label>Block Duration (Hours):</label>
          <input
            type="number"
            min="0.1"
            max="24"
            step="0.5"
            value={settings.blockDurationHours}
            onChange={(e) => handleChange('blockDurationHours', parseFloat(e.target.value))}
            style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text)' }}
          />
        </div>
      </section>
    </div>
  );
};

export default Options;
