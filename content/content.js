// Get title and URL from page
const pageTitle = document.title;
const pageUrl = window.location.href;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PAGE_INFO") {
    sendResponse({ title: pageTitle, url: pageUrl });
  }
});
