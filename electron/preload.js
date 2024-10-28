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
    const win = remote.getCurrentWindow();
    return win.close();
  },
  minimize: () => {
    const win = remote.getCurrentWindow();
    return win.minimize();
  },
  maximize: () => {
    const win = remote.getCurrentWindow();
    return win.isMaximized() ? win.unmaximize() : win.maximize();
  },
  isMaximized: () => {
    const win = remote.getCurrentWindow();
    return win.isMaximized();
  },
  focus: () => {
    const win = remote.getCurrentWindow();
    return win.focus();
  },
  focusByID: args => {
    const id = remote.getGlobal("sharedObject").independentWindow.get(args);
    return ipcRenderer.invoke("focusByID", { id });
  },
  isFocusedWindow: remote.getCurrentWindow().isFocused(),
  isAlwaysOnTop: remote.getCurrentWindow().isAlwaysOnTop(),
  quit: () => ipcRenderer.invoke("quit"),
  restart: () => ipcRenderer.invoke("restart"),
  setArgs: args => ipcRenderer.invoke("setArgs", args),
  createWin: args => ipcRenderer.invoke("createWin", args),
  getAllDisplays: () => ipcRenderer.invoke("getAllDisplays"),
  getProfile: id => ipcRenderer.invoke("getProfile", id),
  hasWins: args => {
    return ipcRenderer.invoke("hasWins", args);
  },
  hasWinsById: args => {
    const id = remote.getGlobal("sharedObject").independentWindow.get(args);
    return ipcRenderer.invoke("hasWinsById", id);
  },
  getWinThis: () => {
    const win = remote.getCurrentWindow();
    return ipcRenderer.invoke("getWinThis", win.id);
  },
  ipcRenderer: (arg, fun) => {
    return {
      On: (arg, fun) => {
        ipcRenderer.on(arg, fun);
      }
    };
  },
  getNetwork: () => {
    var os = require("os");

    // var networkInterfaces = os.networkInterfaces();
    // for (var i in networkInterfaces) {
    //   for (var j in networkInterfaces[i]) {
    //     if (
    //       networkInterfaces[i][j]["family"] === "IPv4" &&
    //       networkInterfaces[i][j]["mac"] !== "00:00:00:00:00:00" &&
    //       networkInterfaces[i][j]["address"] !== "127.0.0.1"
    //     ) {
    //       sessionStorage.mac = networkInterfaces[i][j]["mac"];
    //     }
    //   }
    // }
    const isZeroMac = mac => {
      return /^(0{1,2}[:-]){5}0{1,2}$/.test(mac);
    };
    const getMac = (family = "IPv4") => {
      const nif = os.networkInterfaces();
      for (const list of Object.values(nif)) {
        const item = list.find(
          d =>
            !d.internal &&
            !isZeroMac(d.mac) &&
            (!d.family || d.family === family)
        );
        if (item) return item.mac;
      }

      return "";
    };
    sessionStorage.mac = getMac()
    sessionStorage.name = os.hostname();
    return { mac: sessionStorage.mac, name: os.hostname() };
  },
  sendWinMsg: args => {
    const id = remote.getGlobal("sharedObject").independentWindow.get(args.id);
    console.log("sendTo : " + id);
    // ipcRenderer.sendTo(id, args.fun, args.data);
    ipcRenderer.invoke("sendWinMsg", { ...args, id });
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
