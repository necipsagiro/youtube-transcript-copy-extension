// YouTube Player Bridge - Intercepts subtitle responses

const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, async = true, user, password) {
  this._ytTranscriptUrl = url?.toString();
  return originalOpen.apply(this, [method, url, async, user, password]);
};

XMLHttpRequest.prototype.send = function(body) {
  const url = this._ytTranscriptUrl;

  if (url && typeof url === 'string' &&
      (url.includes('/api/timedtext') || url.includes('timedtext')) &&
      !url.includes('type=list') &&
      url.includes('lang=')) {

    this.addEventListener('load', function() {
      console.log('[YT Transcript] Captured subtitle response for:', url);
      window.dispatchEvent(new CustomEvent('yt-transcript-data-captured', {
        detail: { url, data: this.responseText }
      }));
    });
  }

  return originalSend.apply(this, [body]);
};
