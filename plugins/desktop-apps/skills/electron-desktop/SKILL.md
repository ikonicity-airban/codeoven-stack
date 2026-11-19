---
name: electron-desktop
description: Build rich cross-platform desktop applications using Electron, Node.js, and Chromium. Use when configuring context isolation, secure IPC preload scripts, native menus, and auto-updaters.
---

# Electron Desktop Architecture Guide

## 1. Security Architecture (Context Isolation & Preload)
- **Always** enable `contextIsolation: true` and disable `nodeIntegration: false`.
- Expose strictly scoped APIs to the renderer through `contextBridge` in `preload.ts`:

```ts
// preload.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApi", {
  saveFile: (data: string) => ipcRenderer.invoke("save-file", data),
  onStatusUpdate: (callback: (status: string) => void) =>
    ipcRenderer.on("status-update", (_event, value) => callback(value)),
});
```
