const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const { join } = require("path");
const glob = require("glob");

const MultiWindows = require("./electron");

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const createWindow = () => {
  let window = new MultiWindows();
  // background.js
  // 多窗口数据存储
  global.sharedObject = {
    independentWindow: new Map()
  };

  window.loadProcess();
  window.makeSingleInstance();
  window.ipcMainListen();
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// app.on('will-quit', () => {
//   // 注销所有快捷键
//   globalShortcut.unregisterAll()
// })
