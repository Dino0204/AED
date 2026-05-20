import type { ExtensionSettings } from "./types";

const DEFAULTS: ExtensionSettings = { aedUrl: "", ghToken: null };

export async function getSettings(): Promise<ExtensionSettings> {
  const stored = await chrome.storage.local.get(["aedUrl", "ghToken"]);
  return { ...DEFAULTS, ...stored } as ExtensionSettings;
}

export async function setSettings(partial: Partial<ExtensionSettings>): Promise<void> {
  return chrome.storage.local.set(partial);
}

export function onSettingsChanged(callback: (settings: ExtensionSettings) => void): () => void {
  const listener = () => getSettings().then(callback);
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
