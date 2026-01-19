import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(800, height),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true, // We might need this for some file access, or better use contextBridge
      contextIsolation: true,
      webSecurity: false, // Helping with local file loading (video/audio)
      devTools: !app.isPackaged
    },
    icon: path.join(__dirname, '../public/logo.png')
  });

  mainWindow.maximize();

  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control || input.meta) {
      if (input.key.toLowerCase() === "r") {
        event.preventDefault();
      }
      if (input.key === "=" || input.key === "-" || input.key === "0") {
        event.preventDefault();
      }
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
