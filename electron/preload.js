// const { contextBridge, ipcRenderer } = require("electron");
const isElectron = require("is-electron");
const { contextBridge, ipcRenderer } = require("electron");

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
  quit: () => ipcRenderer.invoke("quit")
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
