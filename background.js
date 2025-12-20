chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'yt-copy-transcript',
    title: 'Copy Transcript',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.youtube.com/*', 'https://youtube.com/*'],
    enabled: false
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'yt-copy-transcript') {
    chrome.tabs.sendMessage(tab.id, { action: 'copyTranscript' });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'subtitlesAvailable') {
    chrome.contextMenus.update('yt-copy-transcript', {
      enabled: true,
      title: `Copy Transcript [${message.lang || '?'}]`
    });
  }
});
