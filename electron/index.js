const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { join } = require("path");
const glob = require("glob");

process.env.ROOT = join(__dirname, "../");

const isDevelopment = process.env.NODE_ENV === "development";
// const winURL = isDevelopment ? 'http://localhost:3000/' : join(__dirname, 'dist/index.html')
const winURL = isDevelopment
  ? "http://localhost:8080"
  : join(process.env.ROOT, "/dist/index.html");

// 配置参数
const defaultConfig = {
  id: null, // 窗口唯一id
  background: "#fff", // 背景色
  route: "", // 路由地址url
  title: "", // 标题
  data: null, // 传入数据参数
  width: "", // 窗口宽度
  height: "", // 窗口高度
  minWidth: "", // 窗口最小宽度
  minHeight: "", // 窗口最小高度
  x: "", // 窗口相对于屏幕左侧坐标
  y: "", // 窗口相对于屏幕顶端坐标
  resize: false, // 是否支持缩放
  maximize: true, // 最大化窗口
  isMultiWin: false, // 是否支持多开窗口
  isMainWin: false, // 是否主窗口
  parent: "", // 父窗口（需传入父窗口id）
  modal: false, // 模态窗口（模态窗口是浮于父窗口上，禁用父窗口）
  alwaysOnTop: false, // 置顶窗口
  webPreferences: {}
};

class MultiWindows {
  constructor() {
    // 主窗口
    this.mainWin = null;
    // 窗口组
    this.winLs = {};

    // ...
  }

  winOpts() {
    return {
      // 窗口图标
      icon: join(process.env.ROOT, "/static/favicon.ico"),
      backgroundColor: "#fff",
      width: 1440,
      height: 900,
      minWidth: 1440,
      minHeight: 900,
      show: false,
      webPreferences: {
        defaultEncoding: "utf-8",
        partition: String(+new Date()),
        sandbox: false,
        contextIsolation: true,
        preload: join(process.env.ROOT, "/electron/preload.js"),
        nodeIntegration: true
        // devTools: true,
        // webSecurity: false
      }
    };
  }

  // 创建新窗口
  createWin(options) {
    const args = Object.assign({}, defaultConfig, options);
    // console.log(args);

    // 判断窗口是否存在
    console.log(this.winLs)
    for (let i in this.winLs) {
      console.log(
        this.getWin(i) &&
          this.winLs[i].route === args.route &&
          !this.winLs[i].isMultiWin
      );
      if (
        this.getWin(i) &&
        this.winLs[i].route === args.route &&
        !this.winLs[i].isMultiWin
      ) {
        this.getWin(i).focus();
        return;
      }
    }

    let opt = this.winOpts();
    if (args.parent) {
      opt.parent = this.getWin(args.parent);
    }

    if (typeof args.modal === "boolean") opt.modal = args.modal;
    if (typeof args.resize === "boolean") opt.resizable = args.resize;
    if (typeof args.alwaysOnTop === "boolean") {
      opt.alwaysOnTop = args.alwaysOnTop;
    }

    if (args.background) opt.backgroundColor = args.background;
    if (args.width) opt.width = args.width;
    if (args.height) opt.height = args.height;
    if (args.minWidth) opt.minWidth = args.minWidth;
    if (args.minHeight) opt.minHeight = args.minHeight;
    if (args.x) opt.x = args.x;
    if (args.y) opt.y = args.y;

    if (args.webPreferences && args.webPreferences.session) {
      opt.webPreferences.session = args.webPreferences.session;
    }

    // 创建窗口对象
    Menu.setApplicationMenu(null);
    let win = new BrowserWindow(opt);
    // 是否最大化
    if (args.maximize && args.resize) {
      win.maximize();
    }
    this.winLs[win.id] = {
      route: args.route,
      isMultiWin: args.isMultiWin
    };
    args.id = win.id;

    console.log("current id ", args.id);
    console.log("current opt ", opt);

    // 加载页面
    let $url;
    if (!args.route) {
      if (process.env.VITE_DEV_SERVER_URL) {
        $url = process.env.VITE_DEV_SERVER_URL;
      } else {
        $url = winURL;
      }
    } else {
      $url = `${args.route}`;
    }
    win.loadURL($url);

    // win.webContents.openDevTools();

    win.once("ready-to-show", () => {
      win.show();
    });

    win.on("close", () => win.setOpacity(0));

    // 初始化渲染进程
    win.webContents.on("did-finish-load", () => {
      // win.webContents.send('win-loaded', '加载完成~！')
      // win.webContents.send("win-loaded", args);

      win.webContents.on(
        "new-window",
        (event, url, frameName, disposition, options, additionalFeatures) => {
          console.log(
            "router-link action ",
            url.substring(url.indexOf("#") + 2)
          );
          event.preventDefault();
          let isMultiWin = false;
          if (url && url.substring(url.indexOf("#") + 2) === "fourscreen") {
            isMultiWin = true;
          }
          let window = new MultiWindows();
          window.createWin({
            route: url,
            isMultiWin: isMultiWin,
            webPreferences: {
              session: win.webContents.session
            }
          });
        }
      );
    });
  }

  // 获取窗口
  getWin(id) {
    return BrowserWindow.fromId(Number(id));
  }

  // 获取全部窗口
  getAllWin() {
    return BrowserWindow.getAllWindows();
  }

  // 关闭全部窗口
  closeAllWin() {
    try {
      for (let i in this.winLs) {
        if (this.getWin(i)) {
          this.getWin(i).close();
        } else {
          app.quit();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  makeSingleInstance() {
    if (process.mas) return;

    app.requestSingleInstanceLock();

    app.on("second-instance", () => {
      if (this.mainWin) {
        if (this.mainWin.isMinimized()) this.mainWin.restore();
        this.mainWin.focus();
      }
    });
  }

  // Require each JS file in the main-process dir
  loadDemos() {
    let pattern = join(process.env.ROOT, "/electron/main-process/**/*.js");
    pattern = pattern.replace(/\\/g, "/");
    // 将反斜杠替换为正斜杠
    const files = glob.sync(pattern);
    files.forEach(file => {
      require(file);
    });
  }

  // 开启主进程监听
  ipcMainListen() {
    // 设置标题
    ipcMain.on("set-title", (e, data) => {
      const webContents = e.sender;
      const wins = BrowserWindow.fromWebContents(webContents);
      wins.setTitle(data);
    });
    // 是否最大化
    ipcMain.handle("isMaximized", e => {
      const win = BrowserWindow.getFocusedWindow();
      return win.isMaximized();
    });

    ipcMain.on("min", e => {
      const win = BrowserWindow.getFocusedWindow();
      win.minimize();
    });
    ipcMain.handle("max2min", e => {
      const win = BrowserWindow.getFocusedWindow();
      if (win.isMaximized()) {
        win.unmaximize();
        return false;
      } else {
        win.maximize();
        return true;
      }
    });
    ipcMain.on("close", (e, data) => {
      // const wins = BrowserWindow.getFocusedWindow()
      // wins.close()
      this.closeAllWin();
    });

    ipcMain.on("win-create", (event, args) => this.createWin(args));

    ipcMain.handle("quit", e => {
      this.closeAllWin();
    });

    // ...
  }
}

module.exports = MultiWindows;
