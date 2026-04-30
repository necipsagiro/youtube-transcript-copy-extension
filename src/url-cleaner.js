function cleanYouTubeUrl(text) {
  if (!text || (!text.includes('youtube.com') && !text.includes('youtu.be'))) {
    return text;
  }

  try {
    const url = new URL(text);
    ['si', 'feature', 'pp', 'embeds_referring_euri', 'source_ve_path'].forEach(
      (p) => url.searchParams.delete(p),
    );

    const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
    if (shortsMatch) {
      url.pathname = '/watch';
      url.searchParams.set('v', shortsMatch[1]);
    }

    return url.toString();
  } catch {
    return text;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cleanYouTubeUrl };
}
