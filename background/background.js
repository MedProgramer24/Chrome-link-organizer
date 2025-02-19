// Initialize empty links storage on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ links: [] });
});
