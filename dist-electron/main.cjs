"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    electron_1.app.quit();
}
let mainWindow = null;
const createWindow = () => {
    const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new electron_1.BrowserWindow({
        width: Math.min(1280, width),
        height: Math.min(800, height),
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.cjs'),
            nodeIntegration: true, // We might need this for some file access, or better use contextBridge
            contextIsolation: true,
            webSecurity: false, // Helping with local file loading (video/audio)
            devTools: !electron_1.app.isPackaged
        },
        icon: path_1.default.join(__dirname, '../public/logo.png'),
        show: false,
        backgroundColor: '#f8fafc'
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
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
    }
    else if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=main.cjs.map