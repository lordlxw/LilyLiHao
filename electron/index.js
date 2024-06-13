const { app, BrowserWindow, ipcMain, screen } = require("electron");
// 第一步：引入remote
const remote = require("@electron/remote/main");
// 第二步： 初始化remote
remote.initialize();
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
  width: 1440, // 窗口宽度
  height: 900, // 窗口高度
  minWidth: 1440, // 窗口最小宽度
  minHeight: 900, // 窗口最小高度
  maxWidth: 0,
  maxHeight: 0,
  x: "", // 窗口相对于屏幕左侧坐标
  y: "", // 窗口相对于屏幕顶端坐标
  resize: true, // 是否支持缩放
  maximizable: true,
  minimizable: true,
  maximize: false, // 最大化窗口
  isMultiWin: false, // 是否支持多开窗口
  isMainWin: false, // 是否主窗口
  parent: "", // 父窗口（需传入父窗口id）
  modal: false, // 模态窗口（模态窗口是浮于父窗口上，禁用父窗口）
  alwaysOnTop: false, // 置顶窗口
  webPreferences: {},
  sharSession: true,
  transparent: true
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
      show: false,
      autoHideMenuBar: true,
      // titleBarStyle: "hidden",
      resizable: true,
      minimizable: true,
      maximizable: false,
      frame: true,
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
    for (let i in this.winLs) {
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
    if (args.maximizable) opt.maximizable = args.maximizable;

    if (args.maxWidth >= args.minWidth) opt.maxWidth = args.maxWidth;
    if (args.maxHeight >= args.minHeight) opt.maxHeight = args.maxHeight;

    const allWin = this.getAllWin();
    if (args.webPreferences && args.webPreferences.session) {
      opt.webPreferences.session = args.webPreferences.session;
    } else if (args.sharSession && allWin.length > 0) {
      opt.webPreferences.session = allWin[0].webContents.session;
    }

    // 创建窗口对象
    // Menu.setApplicationMenu(null);
    let win = new BrowserWindow(opt);
    // 是否最大化
    if (args.maximize && args.resize && args.maximizable) {
      win.maximize();
    }
    this.winLs[win.id] = {
      route: args.route,
      isMultiWin: args.isMultiWin,
      ...options
    };
    args.id = win.id;

    console.log("current id ", args.id);

    // 加载页面
    let $url;
    if (!args.route) {
      if (process.env.VITE_DEV_SERVER_URL) {
        $url = process.env.VITE_DEV_SERVER_URL;
      } else {
        $url = winURL;
      }
    } else {
      $url = `${winURL}#${args.route}`;
    }
    win.loadURL($url);

    // win.webContents.openDevTools();

    win.once("ready-to-show", () => {
      win.show();
    });

    win.on("close", () => win.setOpacity(0));

    if (args.isMainWin) {
      win.on("close", e => {
        // 阻止默认的窗口关闭
        this.winLs = {};
        e.preventDefault();
        win.setOpacity(0);
        e.defaultPrevented = false;
        win.destroy();
        app.quit();
      });
    } else {
      win.on("close", () => {
        delete this.winLs[win.id];
        win.setOpacity(0);
      });
    }

    // 初始化渲染进程
    win.webContents.on("did-finish-load", () => {
      // win.webContents.send('win-loaded', '加载完成~！')
      win.webContents.send("win-loaded", args);

      win.webContents.on(
        "new-window",
        (event, url, frameName, disposition, options, additionalFeatures) => {
          console.log(
            "router-link action ",
            url.substring(url.indexOf("#") + 1)
          );
          event.preventDefault();
          let isMultiWin = false;
          if (
            url &&
            (url.substring(url.indexOf("#") + 1) === "/fourscreen" ||
              url.substring(url.indexOf("#") + 1) === "/simulation/fourScreen")
          ) {
            isMultiWin = true;
          }
          this.createWin({
            route: url.substring(url.indexOf("#") + 1),
            isMultiWin: isMultiWin,
            webPreferences: {
              session: win.webContents.session
            }
          });
        }
      );
    });

    // ipcMain.on('renderer-ready', (event) => {
    //   const win = BrowserWindow.fromWebContents(event.sender);
    //   if (win) {
    //     // 窗口准备好了，可以关闭加载动画或启动屏幕
    //     win.show();
    //   }
    // });

    // 当窗口获得焦点时，改变头部颜色
    // win.on("focus", () => {
    //   win.setTitle("#0069b4");
    // });

    remote.enable(win.webContents);
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

    if (!app.requestSingleInstanceLock()) {
      app.quit();
    } else {
      app.on("second-instance", () => {
        console.log("=============requestSingleInstanceLock===============");
        const allWin = this.getAllWin();
        if (allWin.length > 0) {
          if (allWin[0].isMinimized()) allWin[0].restore();
          allWin[0].focus();
        }
      });

      const loginArg = {
        width: 650, // 窗口宽度
        height: 480, // 窗口高度
        minWidth: 650, // 窗口最小宽度
        minHeight: 480, // 窗口最小高度
        resize: false, // 是否支持缩放
        maximize: false, // 最大化窗口
        isMultiWin: false, // 是否支持多开窗口
        isMainWin: false, // 是否主窗口
        alwaysOnTop: true, // 置顶窗口
        route: "/login"
      };
      this.createWin(loginArg);
    }

    // app.requestSingleInstanceLock();

    // app.on("second-instance", () => {
    //   console.log("=============requestSingleInstanceLock===============");
    //   const allWin = this.getAllWin();
    //   if (allWin.length > 0) {
    //     if (allWin[0].isMinimized()) allWin[0].restore();
    //     allWin[0].focus();
    //   }
    // });
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

    ipcMain.handle("createWin", (event, args) => this.createWin(args));

    ipcMain.handle("setArgs", (event, args) => {
      let win = BrowserWindow.getFocusedWindow();
      if (args.parent) win.setParentWindow(this.getWin(args.parent));
      if (args.data) this.winLs[win.id].data = args.data;
      if (typeof args.resize === "boolean") win.setResizable(args.resize);
      if (typeof args.alwaysOnTop === "boolean") {
        win.setAlwaysOnTop(args.alwaysOnTop);
      }

      if (args.background) win.setBackgroundColor(args.background);
      if (args.width && args.height) win.setSize(args.width, args.height);
      if (args.minWidth && args.minHeight) {
        win.setMinimumSize(args.minWidth, args.minHeight);
      }
      if (args.x && args.y) win.setBounds(args.x, args.y);
      // 是否最大化
      if (args.maximize && args.resize) {
        win.maximize();
      }
      // console.log("current id ", args.id);
      // console.log("current opt ", opt);

      if (args.route) {
        win.loadURL(`${winURL}#${args.route}`);
      }
    });

    ipcMain.handle("close", (e, data) => {
      const wins = BrowserWindow.getFocusedWindow();
      wins.close();
    });

    ipcMain.on("win-create", (event, args) => this.createWin(args));

    ipcMain.handle("quit", e => {
      this.closeAllWin();
    });

    ipcMain.handle("getAllDisplays", e => {
      return screen.getAllDisplays();
    });

    ipcMain.handle("getWinThis", (event, id) => {
      return this.winLs[id];
    });

    ipcMain.handle("getProfile", (event, id) => {
      if (id) {
        const win = this.getWin(id);
        const { x, y, width, height } = win.getBounds();
        return [{ ...this.win[id], x: x + 1, y: y + 1, width, height }];
      } else {
        const wins = this.getAllWin();
        return wins.map(win => {
          const { x, y, width, height } = win.getBounds();
          return { ...this.winLs[win.id], x: x + 1, y: y + 1, width, height };
        });
      }
    });

    // ...
  }
}

module.exports = MultiWindows;
