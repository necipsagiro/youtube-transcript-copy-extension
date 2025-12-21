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
    console.log('[YT Transcript BG] Received message, updating menu to:', message.lang);
    chrome.contextMenus.update('yt-copy-transcript', {
      enabled: true,
      title: `Copy Transcript [${message.lang || '?'}]`
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('[YT Transcript BG] Menu update failed:', chrome.runtime.lastError);
      } else {
        console.log('[YT Transcript BG] Menu updated successfully');
      }
    });
  }
});
