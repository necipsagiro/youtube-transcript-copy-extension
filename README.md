# YouTube Transcript Copy

A Chrome extension that lets you copy YouTube video transcripts via the right-click menu.

## Installation

1. Clone this repo
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder

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

## Disclaimer

This extension is for personal use only. Use at your own risk.

## Credits

The XMLHttpRequest interception technique is inspired by [Kagi Translate](https://kagi.com/translate) browser extension.

## Privacy Policy

This extension does not collect, store, or transmit any user data. All operations are performed locally in your browser. The extension only accesses YouTube subtitle data when you explicitly request it via the context menu, and this data is copied directly to your clipboard without being sent anywhere.
