// Namespace Polyfill - Firefox (browser) ve Chrome (chrome) uyumluluğu
const runtime = typeof browser !== 'undefined' ? browser : chrome;

runtime.runtime.onInstalled.addListener(() => {
  runtime.contextMenus.create({
    id: 'yt-copy-transcript',
    title: 'Copy Transcript',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.youtube.com/watch*', 'https://youtube.com/watch*'],
    enabled: false
  });

  runtime.contextMenus.create({
    id: 'yt-copy-video-link',
    title: 'Copy video URL',
    contexts: ['page'],
    documentUrlPatterns: ['https://www.youtube.com/watch*', 'https://youtube.com/watch*'],
    enabled: false
  });
});

runtime.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'yt-copy-transcript') {
    runtime.tabs.sendMessage(tab.id, { action: 'copyTranscript' });
  } else if (info.menuItemId === 'yt-copy-video-link') {
    runtime.tabs.sendMessage(tab.id, { action: 'copyVideoLink' });
  }
});

runtime.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
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
  } else if (message.action === 'videoPageDetected') {
    runtime.contextMenus.update('yt-copy-video-link', {
      enabled: message.isVideoPage
    }, () => {
      if (runtime.runtime.lastError) {
        console.error('[YT Transcript BG] Video link menu update failed:', runtime.runtime.lastError);
      }
    });

    // Disable transcript button when not on a video page
    if (!message.isVideoPage) {
      runtime.contextMenus.update('yt-copy-transcript', {
        enabled: false,
        title: 'Copy Transcript'
      });
    }
  }

  return true;
});