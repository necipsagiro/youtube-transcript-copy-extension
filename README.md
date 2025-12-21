# YouTube Transcript Copy

A browser extension that lets you copy YouTube video transcripts via the right-click menu.

## Browser Support

- **Chrome** / Chromium-based browsers
- **Firefox** 140+

## Installation

### Chrome

1. Clone this repo
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `src` folder

### Firefox

1. Clone this repo
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file inside the `src` folder (e.g., `manifest.json`)

## Usage

1. Go to any YouTube video with subtitles
2. **Enable subtitles on the video** (the context menu item only becomes active after subtitles are turned on)
3. Right-click anywhere on the page
4. Click "Copy Transcript [LANG]"
5. Paste wherever you need it

The transcript is copied with timestamps:

```txt
[0:00] Hello everyone
[0:03] Welcome to this video
[0:07] Today we'll talk about...
```

## How it works

The extension intercepts YouTube's subtitle requests using XMLHttpRequest hooks, then fetches and formats the transcript when you click the context menu item.

## Development

```bash
# Install dependencies
pnpm install

# Run in Firefox
pnpm dev:firefox

# Run in Chrome
pnpm dev:chrome

# Build for both browsers
pnpm build

# Lint (validate manifest for Firefox AMO)
pnpm lint
```

## Disclaimer

This extension is for personal use only. Use at your own risk.

## Credits

- The XMLHttpRequest interception technique is inspired by [Kagi Translate](https://kagi.com/translate) browser extension.
- Subtitle JSON structure reference: [yt-timedtext-srt](https://github.com/nuhman/yt-timedtext-srt)

## Privacy Policy

This extension does not collect, store, or transmit any user data. All operations are performed locally in your browser. The extension only accesses YouTube subtitle data when you explicitly request it via the context menu, and this data is copied directly to your clipboard without being sent anywhere.
