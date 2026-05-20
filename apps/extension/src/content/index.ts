import { buildPageContext } from "../lib/source";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "EXTRACT_CONTEXT") {
    const ctx = buildPageContext(window.location.href, document.title);
    sendResponse(ctx);
  }
  return true;
});
