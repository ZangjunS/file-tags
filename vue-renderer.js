//调界面时关闭
const fs = require("fs");
const path = require("path");
const {
  shell
} = require("electron");
const {
  ipcRenderer
} = require("electron");
const {
  dialog
} = require("electron");
const execSync = require("child_process").execSync;
var cmd = require("node-cmd");

/**/
messager = console.log;

function createVideoHtml(contain, vidWin, source) {
  // const [width, height] = []
  const videoHtml =
    `<video id="${vidWin}" class="video-js vjs-big-play-centered" controls preload="auto"
     style="width: 74vw; height: 49vh" data-setup="{}">
  <source src="${source}" type="video/mp4" >
  </video>`
  document.getElementById(contain).innerHTML = videoHtml
  return document.getElementById(vidWin);
}