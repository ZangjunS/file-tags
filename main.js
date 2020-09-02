// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { event } = require("jquery");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 监听渲染进程信息
ipcMain.on("ping", (event, args) => {
  event.reply("pong", args);
});

ipcMain.on("wantAdir", (event, args) => {
  const dialog = require("electron").dialog;
  dialog.showOpenDialog({ properties: ["openDirectory"] }).then((path) => {
    event.reply("aaa", path);
    if (path.filePaths[0]) {
      console.log(path);
      event.reply("retAdir", path.filePaths[0]);
      console.log(path[0].replace(/\\\\/g, "\\"));
    }
  });
});

// 设置全局变量

global.sharedObject = {cmdArgs: process.argv}