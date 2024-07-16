const { app, globalShortcut } = require("electron");

console.log("globalShortcut loading ...");
// globalShortcut.register('CommandOrControl+Alt+K', () => {
//   dialog.showMessageBox({
//     type: 'info',
//     message: 'Success!',
//     detail: 'You pressed the registered global shortcut keybinding.',
//     buttons: ['OK']
//   })
// })

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
