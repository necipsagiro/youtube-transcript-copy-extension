import { describe, expect, it } from 'vitest';
import { cleanYouTubeUrl } from '../src/url-cleaner.js';

describe('cleanYouTubeUrl', () => {
  describe('tracking parameter removal', () => {
    it('removes si parameter', () => {
      expect(
        cleanYouTubeUrl('https://youtu.be/VHygTMF98Rw?si=abc123'),
      ).toBe('https://youtu.be/VHygTMF98Rw');
    });

    it('removes feature parameter', () => {
      expect(
        cleanYouTubeUrl(
          'https://www.youtube.com/watch?v=VHygTMF98Rw&feature=share',
        ),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('removes pp parameter', () => {
      expect(
        cleanYouTubeUrl('https://www.youtube.com/watch?v=VHygTMF98Rw&pp=ygUF'),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('removes embeds_referring_euri parameter', () => {
      expect(
        cleanYouTubeUrl(
          'https://www.youtube.com/watch?v=VHygTMF98Rw&embeds_referring_euri=https%3A%2F%2Fexample.com',
        ),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('removes source_ve_path parameter', () => {
      expect(
        cleanYouTubeUrl(
          'https://www.youtube.com/watch?v=VHygTMF98Rw&source_ve_path=foo',
        ),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('removes multiple tracking parameters at once', () => {
      expect(
        cleanYouTubeUrl(
          'https://www.youtube.com/watch?v=VHygTMF98Rw&si=abc&feature=share&pp=ygUF',
        ),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('preserves non-tracking parameters like v and t', () => {
      expect(
        cleanYouTubeUrl(
          'https://www.youtube.com/watch?v=VHygTMF98Rw&t=42&si=abc',
        ),
      ).toBe('https://www.youtube.com/watch?v=VHygTMF98Rw&t=42');
    });
  });

  describe('shorts conversion', () => {
    it('converts /shorts/ID to /watch?v=ID', () => {
      expect(
        cleanYouTubeUrl('https://youtube.com/shorts/dPPRwLDCgOg'),
      ).toBe('https://youtube.com/watch?v=dPPRwLDCgOg');
    });

    it('converts shorts on www.youtube.com', () => {
      expect(
        cleanYouTubeUrl('https://www.youtube.com/shorts/dPPRwLDCgOg'),
      ).toBe('https://www.youtube.com/watch?v=dPPRwLDCgOg');
    });

    it('converts shorts and strips tracking params together', () => {
      expect(
        cleanYouTubeUrl(
          'https://youtube.com/shorts/dPPRwLDCgOg?si=abc123&feature=share',
        ),
      ).toBe('https://youtube.com/watch?v=dPPRwLDCgOg');
    });

    it('does not match unrelated paths starting with /shorts', () => {
      expect(cleanYouTubeUrl('https://www.youtube.com/shortsfoo')).toBe(
        'https://www.youtube.com/shortsfoo',
      );
    });
  });

  describe('idempotency and passthrough', () => {
    it('returns clean YouTube URL unchanged', () => {
      const clean = 'https://www.youtube.com/watch?v=VHygTMF98Rw';
      expect(cleanYouTubeUrl(clean)).toBe(clean);
    });

    it('returns short youtu.be URL unchanged when no tracking', () => {
      const clean = 'https://youtu.be/VHygTMF98Rw';
      expect(cleanYouTubeUrl(clean)).toBe(clean);
    });

    it('cleans tracking on subdomains like m.youtube.com', () => {
      expect(
        cleanYouTubeUrl(
          'https://m.youtube.com/watch?v=VHygTMF98Rw&si=abc',
        ),
      ).toBe('https://m.youtube.com/watch?v=VHygTMF98Rw');
    });

    it('cleans tracking on music.youtube.com', () => {
      expect(
        cleanYouTubeUrl(
          'https://music.youtube.com/watch?v=VHygTMF98Rw&si=abc',
        ),
      ).toBe('https://music.youtube.com/watch?v=VHygTMF98Rw');
    });
  });

  describe('non-YouTube and malformed input', () => {
    it('returns non-YouTube URL unchanged', () => {
      const url = 'https://example.com/video?si=abc';
      expect(cleanYouTubeUrl(url)).toBe(url);
    });

    it('returns empty string unchanged', () => {
      expect(cleanYouTubeUrl('')).toBe('');
    });

    it('returns null unchanged', () => {
      expect(cleanYouTubeUrl(null)).toBe(null);
    });

    it('returns undefined unchanged', () => {
      expect(cleanYouTubeUrl(undefined)).toBe(undefined);
    });

    it('does not throw on malformed input that mentions youtube.com', () => {
      const garbled = 'not a url but has youtube.com in it';
      expect(() => cleanYouTubeUrl(garbled)).not.toThrow();
      expect(cleanYouTubeUrl(garbled)).toBe(garbled);
    });
  });
});
