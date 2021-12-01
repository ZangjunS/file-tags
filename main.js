// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const dialog = require('electron').dialog;
const {
  videoSupport
} = require('./video/ffmpeg-helper');
const VideoServer = require('./video/VideoServer').VideoServer;
var mainWindow;
// Create the browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
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
  // mainWindow.openDevTools();
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
  dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then((path) => {
    if (path.filePaths[0]) {
      console.log(path);
      event.reply("retAdir", path.filePaths[0]);
      console.log(path[0].replace(/\\\\/g, "\\"));
    }
  });
});

// 设置全局变量

function backLog(message) {
  mainWindow.webContents.send('backLog', message);
}

global.sharedObject = {
  cmdArgs: process.argv
}

//video
var httpServer;
var streamPort;

ipcMain.on("cfgLoaded", (event, args) => {
  streamPort = args.port;
  httpServer = new VideoServer();
  httpServer.createServer(streamPort);
  backLog("createVideoServer success");
});


ipcMain.on("getVideoInfo", (event, vPath) => {
  getVideoInfo(vPath);
});

ipcMain.on("removeOccupy", (event, args) => {
  httpServer.killFfmpegCommand();
  backLog("removeOccupyed")
});


function getVideoInfo(videoFilePath) {

  videoSupport(videoFilePath).then((checkResult) => {
    let playParams = {};
    playParams.type = "stream";
    playParams.fileType = path.extname(videoFilePath);
    playParams.videoSource = videoFilePath;
    playParams.duration = checkResult.duration
    playParams.videoCodecSupport = checkResult.videoCodecSupport;
    playParams.audioCodecSupport = checkResult.audioCodecSupport;
    mainWindow.webContents.send('retVideoInfo', playParams);
  }).catch((err) => {
    backLog("video format error" + err);
  })
}