const {
  BrowserWindow,
  Menu,
  MenuItem,
  ipcMain,
  app,
  shell
} = require("electron");

function addContextItems(items, position) {
  const menu = new Menu();
  const version = app.getVersion();

  menu.append(
    new MenuItem({
      label: "Version " + version
    })
  );

  menu.append(
    new MenuItem({
      label: "Check for Update",
      click: () => {
        require("electron").autoUpdater.checkForUpdates();
      }
    })
  );

  menu.append(
    new MenuItem({
      label: "Reload",
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          // on reload, start fresh and close any old
          // open secondary windows
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(win => {
              if (win.id > 1) win.close();
            });
          }
          focusedWindow.reload();
        }
      }
    })
  );

  if (process.env.NODE_ENV === "development") {
    menu.append(
      new MenuItem({
        label: "Toggle Developer Tools",
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }
      })
    );
  }

  menu.append(
    new MenuItem({
      label: "Help",
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => {
            shell.openExternal("https://lilytest.quants.top");
          }
        }
      ]
    })
  );

  app.on("browser-window-created", (event, win) => {
    win.webContents.on("context-menu", (e, params) => {
      menu.popup(win, params.x, params.y);
    });
  });

  ipcMain.on("show-context-menu", event => {
    console.log("=======================");
    const win = BrowserWindow.fromWebContents(event.sender);
    menu.popup(win);
  });
}

// menu.append(
//   new MenuItem({ label: "Electron", type: "checkbox", checked: true })
// );

addContextItems();
