"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
// Add any needed IPC methods here
});
//# sourceMappingURL=preload.js.map