# Focus Now - Chrome Extension

Focus Now is a powerful productivity tool designed to help you stay focused by blocking distracting websites. Unlike other extensions, Focus Now features an "unblockable" mode, ensuring you stay in the zone until your focus session is complete.

## Features

- **URL & Regex Blocking**: Block specific websites or use powerful regular expressions to match multiple subdomains or patterns.
- **Whitelist Mode**: Invert the logic to block everything *except* a list of allowed websites.
- **Unblockable Sessions**: Once a session starts, the blocking overlay cannot be closed manually until the timer expires.
- **High-Impact Overlay**: A full-screen, immersive blocking screen that injects into web pages.
- **Personalized Motivation**: Set custom motivational messages and media (Images, GIFs, or Videos) to be displayed when you try to visit a blocked site.
- **Real-time Countdown**: A live timer on the blocking screen shows exactly how much time is left.
- **Dynamic Design**: Beautiful glassmorphism UI with automatic light and dark mode support based on your system settings.

## Installation (Development Mode)

Since this extension is currently in development, you can load it into Chrome manually:

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd focus-now
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Build the Project**:
    ```bash
    npm run build
    ```
    This will generate a `dist` folder.
4.  **Load in Chrome**:
    - Open Google Chrome and go to `chrome://extensions`.
    - Enable **Developer mode** using the toggle in the top-right corner.
    - Click **Load unpacked**.
    - Navigate to and select the `dist` folder in your project directory.

## Usage

1.  **Configure Settings**: Click the extension icon and select **Open Settings**, or right-click the extension icon and select **Options**.
2.  **Add URLs**: Add the websites you want to block (e.g., `facebook.com` or `twitter.com`).
3.  **Customize**: Set your motivational message and optionally add a link to an image or video.
4.  **Start Focusing**: Click the extension icon in your toolbar, set your desired duration using the slider, and click **Start Focusing**.

## Project Structure

- `src/background/`: Service worker that manages session timers and storage.
- `src/content/`: Content scripts that handle the URL matching and overlay injection via Shadow DOM.
- `src/options/`: React-based settings page.
- `src/popup/`: Quick-access popup to start focus sessions.
- `src/utils/`: Shared logic for storage and URL matching.
- `public/`: Static assets and the extension manifest.

## Tech Stack

- **React** with **TypeScript**
- **Vite** for fast builds and HMR
- **Vanilla CSS** with modern design patterns
- **Chrome Extension Manifest V3**
