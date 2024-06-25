// const { contextBridge, ipcRenderer } = require("electron");
const isElectron = require("is-electron");
const { contextBridge, ipcRenderer } = require("electron");
const remote = require("@electron/remote");

const isInElectron = isElectron();
console.log("=====================", isInElectron);
const isOsx = isInElectron && window._platform && window._platform === "darwin";

const isWin = isInElectron && window._platform && window._platform === "win32";

const isLinux =
  isInElectron && window._platform && window._platform === "linux";

contextBridge.exposeInMainWorld("v1", {
  isElectron,
  isOsx,
  isWin,
  isLinux,
  close: () => {
    const win = remote.getCurrentWindow()
    return win.close();
  },
  minimize: () => {
    const win = remote.getCurrentWindow()
    return win.minimize();
  },
  quit: () => ipcRenderer.invoke("quit"),
  setArgs: args => ipcRenderer.invoke("setArgs", args),
  createWin: args => ipcRenderer.invoke("createWin", args),
  getAllDisplays: () => ipcRenderer.invoke("getAllDisplays"),
  getProfile: id => ipcRenderer.invoke("getProfile", id),
  getWinThis: () => {
    const win = remote.getCurrentWindow()
    return ipcRenderer.invoke("getWinThis", win.id);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
