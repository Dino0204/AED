import { detectSource } from "../lib/source";

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

function notifyTabChange(tabId: number) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab.url) return;
    const sourceType = detectSource(tab.url);
    chrome.runtime.sendMessage({
      type: "TAB_CHANGED",
      sourceType,
      url: tab.url,
      title: tab.title ?? "",
    }).catch(() => {});
  });
}

chrome.tabs.onActivated.addListener(({ tabId }) => notifyTabChange(tabId));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    notifyTabChange(tabId);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "GET_PAGE_CONTEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) { sendResponse(null); return; }
      chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_CONTEXT" }, (ctx) => {
        sendResponse(ctx ?? null);
      });
    });
    return true;
  }
});
