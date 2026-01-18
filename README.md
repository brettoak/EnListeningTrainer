# English Listening Trainer

A powerful, standalone desktop application designed to help you improve your English listening skills through focused practice. Built with Electron, React, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **Advanced Media Player**
    - Support for local audio and video files.
    - **Smart Playback Controls**:
        - Play/Pause.
        - **Rewind/Forward 5s**: Quick navigation to repeat or skip sections.
        - Adjustable playback speed (if supported by player).
    - **Resizable Player**: Toggle between different player sizes for focused viewing or cleaner workspace.

- **Integrated Note Taking**
    - **Rich Text Editor**: Write detailed notes while listening, with support for formatting.
    - **Auto-Save**: Notes are automatically saved locally to prevent data loss.
    - **Import/Export**: Import existing HTML notes or download your session notes as HTML files.

- **Study Tools**
    - **Study Timer**: Track your listening session duration automatically.
    - **File Selector**: easy access to your media files.

- **Customization**
    - **Keyboard Shortcuts**: Fully customizable global shortcuts for playback control (Play/Pause, Rewind, Forward).
    - **Theme Support**: Seamless switching between Light and Dark modes.
    - **Internationalization**: Support for English and Chinese (Simplified) languages.

## 🛠 Tech Stack

- **Core**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State/Logic**: React Hooks, Context API
- **Internationalization**: i18next
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/en-listening-trainer.git
    cd en-listening-trainer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

To run the application in development mode with hot reload:

```bash
npm run dev
```

This command concurrently runs the Vite dev server and the Electron app.

### Building for Production

To create a distributable application (dmg/exe/deb):

```bash
npm run build
```

The output will be in the `dist-electron` or `release` directory depending on configuration.

## ⌨️ Shortcuts

The application comes with default shortcuts which can be customized in Settings:

- **Play/Pause**: (Customizable)
- **Rewind 5s**: (Customizable)
- **Forward 5s**: (Customizable)

## 📄 License

This project is licensed under the MIT License.
