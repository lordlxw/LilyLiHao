const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const glob = require("glob");

const MultiWindows = require("./electron");

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const createWindow = () => {
  let window = new MultiWindows();
  window.makeSingleInstance();
  window.loadDemos();

  window.createWin({ isMainWin: true });
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


