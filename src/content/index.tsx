import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Overlay from './Overlay';
import { getSettings, isUrlBlocked, Settings } from '../utils/storage';

let root: Root | null = null;
let container: HTMLDivElement | null = null;

const INJECTED_STYLES = `
  :host {
    all: initial;
    display: block;
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    background-color: #0f172a; /* Fallback for very early render */
  }
  
  :host {
    --primary: #00ffcc;
    --primary-hover: #00e6b8;
    --bg-dark: #0f172a;
    --bg-light: #f8fafc;
    --text-dark: #f8fafc;
    --text-light: #0f172a;
    --bg: var(--bg-dark);
    --text: var(--text-dark);
  }

  @media (prefers-color-scheme: light) {
    :host {
      --bg: var(--bg-light);
      --text: var(--text-light);
    }
  }

  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg);
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }
`;

const updateOverlay = async () => {
  const settings = await getSettings();
  const currentUrl = window.location.href;
  const isBlocked = isUrlBlocked(currentUrl, settings);
  const isActive = settings.blockEndTime && Date.now() < settings.blockEndTime;

  console.log('[Focus Now] Check:', { currentUrl, isBlocked, isActive, blockEndTime: settings.blockEndTime });

  if (isBlocked && isActive) {
    if (!container) {
      console.log('[Focus Now] Injecting overlay...');
      container = document.createElement('div');
      container.id = 'focus-now-overlay-root';
      document.documentElement.appendChild(container);
      
      const shadowRoot = container.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = INJECTED_STYLES;
      shadowRoot.appendChild(style);

      const reactRoot = document.createElement('div');
      shadowRoot.appendChild(reactRoot);
      root = createRoot(reactRoot);
      root.render(<Overlay />);
    }
  } else {
    if (container) {
      console.log('[Focus Now] Removing overlay...');
      container.remove();
      container = null;
      root = null;
    }
  }
};

// Initial check
updateOverlay();

// Listen for storage changes (e.g. session started/ended)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockEndTime || changes.blockedUrls || changes.whitelistMode) {
    console.log('[Focus Now] Settings changed, updating...');
    updateOverlay();
  }
});

// Handle SPAs
let lastUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    console.log('[Focus Now] URL changed, updating...');
    updateOverlay();
  }
}, 1000);
