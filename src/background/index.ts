import { getSettings, saveSettings } from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  console.log('Focus Now Extension Installed');
});

// Check every minute if the block time has expired
chrome.alarms.create('checkBlockStatus', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkBlockStatus') {
    const settings = await getSettings();
    if (settings.blockEndTime && Date.now() > settings.blockEndTime) {
      await saveSettings({ blockEndTime: null });
      console.log('Block period ended.');
    }
  }
});

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRemainingTime') {
    getSettings().then(settings => {
      const remaining = settings.blockEndTime ? Math.max(0, settings.blockEndTime - Date.now()) : 0;
      sendResponse({ remaining });
    });
    return true; // Keep channel open for async response
  }
});
