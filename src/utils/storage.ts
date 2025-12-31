export interface Settings {
  blockedUrls: string[];
  whitelistMode: boolean;
  customMessage: string;
  customMediaUrl: string;
  blockEndTime: number | null; // Timestamp
  blockDurationHours: number;
}

const DEFAULT_SETTINGS: Settings = {
  blockedUrls: [],
  whitelistMode: false,
  customMessage: "Stay focused! You're almost there.",
  customMediaUrl: "",
  blockEndTime: null,
  blockDurationHours: 1,
};

export const getSettings = async (): Promise<Settings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      resolve(items as Settings);
    });
  });
};

export const saveSettings = async (settings: Partial<Settings>): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
};

export const isUrlBlocked = (url: string, settings: Settings): boolean => {
  const { blockedUrls, whitelistMode } = settings;
  const isMatch = blockedUrls.some((pattern) => {
    try {
      const regex = new RegExp(pattern, 'i');
      return regex.test(url);
    } catch (e) {
      return url.includes(pattern);
    }
  });

  return whitelistMode ? !isMatch : isMatch;
};
