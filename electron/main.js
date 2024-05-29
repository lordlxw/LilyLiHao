const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV;
if (process.env.NODE_ENV === "development") {
  console.log("正在编译 测试 环境");
} else {
  console.log("正在编译 正式 环境");
}

let mainWindow = null;
let childWindow = null;

const globOptions = {
  width: 1440,
  height: 900,
  minWidth: 1440,
  minHeight: 900,
  center: true
};

function createWindow() {
  Menu.setApplicationMenu(null);
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    ...globOptions,
    webPreferences: {
      defaultEncoding: "utf-8",
      partition: String(+new Date()),
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // 允许网页内使用Node.js特性
      contextIsolation: false, // 在 Electron 12+ 版本中需要明确关闭以使用预加载脚本
      enableRemoteModule: true // 启用 remote 模块支持
    }
  });
  // mainWindow.maximize();
  // mainWindow.webContents.openDevTools()
  mainWindow.show();
  // 如果是开发环境就把当前运行的web端口做成客户端预览
  // 如果是生产环境就把打包后的index做成客户端预览
  mainWindow.loadURL(
    NODE_ENV === "development"
      ? "http://localhost:8080"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  // 监听 router-link 点击事件
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("router-link action");
    mainWindow.webContents.on(
      "new-window",
      (event, url, frameName, disposition, options, additionalFeatures) => {
        console.log("router-link action ", frameName);
        event.preventDefault();
        childWindow = new BrowserWindow({
          ...globOptions,
          modal: true,
          parent: mainWindow,
          webPreferences: {
            devTools: process.env.NODE_ENV === "development",
            nodeIntegration: true,
            contextIsolation: false,
            session: mainWindow.webContents.session // 共享session
          }
        });
        childWindow.loadURL(url);
      }
    );
  });

  mainWindow.on("close", e => {
    // 阻止默认的窗口关闭
    e.preventDefault();
    e.defaultPrevented = false;
    mainWindow.destroy();
    app.quit();
  });

  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }

      if (childWindow) {
        if (childWindow.isMinimized()) childWindow.restore();
        childWindow.focus();
      }
    });

    // 创建 myWindow, 加载应用的其余部分, etc...
    app.on("ready", () => {});
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function() {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
