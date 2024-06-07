// const { contextBridge, ipcRenderer } = require("electron");
const isElectron = require("is-electron");
const { contextBridge, ipcRenderer } = require("electron");
// 第一步：引入remote
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
  close: () => ipcRenderer.invoke("close"),
  quit: () => ipcRenderer.invoke("quit"),
  setArgs: args => ipcRenderer.invoke("setArgs", args),
  createWin: args => ipcRenderer.invoke("createWin", args),
  getAllDisplays: () => ipcRenderer.invoke("getAllDisplays"),
  getPosition: id => ipcRenderer.invoke("getPosition", id),
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
