// Namespace Polyfill - Firefox (browser) ve Chrome (chrome) uyumluluğu
const runtime = typeof browser !== 'undefined' ? browser : chrome;

runtime.runtime.onInstalled.addListener(() => {
  runtime.contextMenus.create({
    id: 'yt-copy-transcript',
    title: 'Copy Transcript',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.youtube.com/*', 'https://youtube.com/*'],
    enabled: false
  });
});

runtime.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'yt-copy-transcript') {
    runtime.tabs.sendMessage(tab.id, { action: 'copyTranscript' });
  }
});

runtime.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'subtitlesAvailable') {
    console.log('[YT Transcript BG] Received message, updating menu to:', message.lang);
    runtime.contextMenus.update('yt-copy-transcript', {
      enabled: true,
      title: `Copy Transcript [${message.lang || '?'}]`
    }, () => {
      if (runtime.runtime.lastError) {
        console.error('[YT Transcript BG] Menu update failed:', runtime.runtime.lastError);
      } else {
        console.log('[YT Transcript BG] Menu updated successfully');
      }
    });
  }
  // Asenkron yanıt için true döndür
  return true;
});