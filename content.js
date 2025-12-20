let capturedSubtitles = null;

function msToTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function parseJsonSubtitles(json) {
  const events = json.events || [];
  const segments = [];

  for (const evt of events) {
    if (!evt.segs || evt.segs.length === 0) continue;

    const text = evt.segs
      .map(seg => seg.utf8 || '')
      .join('')
      .trim();

    if (!text || text === '\n') continue;

    segments.push({
      start: evt.tStartMs || 0,
      text: text
    });
  }

  return segments;
}

function parseXmlSubtitles(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const textElements = xml.querySelectorAll('text');
  const segments = [];

  textElements.forEach(el => {
    const start = parseFloat(el.getAttribute('start')) * 1000;
    const text = el.textContent.trim();

    if (text) {
      segments.push({ start, text });
    }
  });

  return segments;
}

function segmentsToReadableText(segments) {
  return segments
    .map(seg => `[${msToTime(seg.start)}] ${seg.text}`)
    .join('\n');
}

async function fetchSubtitles(url) {
  const response = await fetch(url);
  const text = await response.text();

  let segments;
  try {
    const json = JSON.parse(text);
    segments = parseJsonSubtitles(json);
  } catch {
    segments = parseXmlSubtitles(text);
  }

  if (segments.length === 0) {
    throw new Error('No subtitles found');
  }

  return segments;
}

function getLanguageFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('lang') || 'unknown';
  } catch {
    return 'unknown';
  }
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'copyTranscript' && capturedSubtitles) {
    try {
      const text = segmentsToReadableText(capturedSubtitles);
      await navigator.clipboard.writeText(text);
    } catch {
      alert('Failed to copy transcript');
    }
  }
});

window.addEventListener('yt-transcript-url-captured', async (event) => {
  try {
    const lang = getLanguageFromUrl(event.detail.url);
    capturedSubtitles = await fetchSubtitles(event.detail.url);
    chrome.runtime.sendMessage({ action: 'subtitlesAvailable', lang: lang.toUpperCase() });
  } catch (e) {
    console.error('[YT Transcript] Failed:', e);
  }
});
