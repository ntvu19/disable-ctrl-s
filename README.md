# Disable Ctrl+S

A browser extension for Chromium and Firefox that intercepts and disables the default "Save Page" shortcut (`Ctrl+S` or `Cmd+S`).

## Features

- **Blocks Save Shortcut**: Prevents the browser's "Save Page As" dialog from appearing when pressing `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS).
- **Per-Site Control**: Easily toggle protection on or off for specific websites via the extension popup.
- **Sync Settings**: Your preferences are saved and synced across your browser instances.

## Installation

### For Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/disable-ctrl-s.git
    cd disable-ctrl-s
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Build the extension**
    ```bash
    npm run build
    ```
    This will generate a `dist` folder containing the compiled extension.

### Loading into Browser

#### Chrome / Chromium-based Browsers
1.  Open `chrome://extensions/`.
2.  Enable **Developer mode** (toggle in the top right).
3.  Click **Load unpacked**.
4.  Select the `dist` directory created by the build step.

<!-- 
#### Firefox
1.  Open `about:debugging#/runtime/this-firefox`.
2.  Click **Load Temporary Add-on...**.
3.  Navigate to the `dist` directory and select the `manifest.json` file.
-->

## Development

- **Watch mode**: Automatically rebuilds when files change.
  ```bash
  npm run watch
  ```

- **Production build**:
  ```bash
  npm run build
  ```

## License

MIT
