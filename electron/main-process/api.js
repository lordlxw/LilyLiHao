const { app, ipcMain } = require("electron/main"); // 记得导入ipcMain

async function quit() {
  // 在这里写你的处理函数，记得写return返回，返回的结果会给前端
  app.quit();
}

app.whenReady().then(() => {
  // 在窗口准备好后开始准备监听
  ipcMain.handle("quit", quit);
});
