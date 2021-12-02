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
const {
  clipboard
} = require('electron')

const {
  Menu,
  MenuItem
} = remote
/*init*/
messager = console.log;
getContextMenu();


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



function getContextMenu() {
  //new一个菜单

  // 监听contextmenu，实现自定义右键菜单
  window.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    let menu = new Menu()

    // ↓ 情况二：可复制时，显示复制，可粘贴时显示粘贴
    let flag = false // menu中是否有菜单项，true有，false没有
    const tagName = document.activeElement.tagName // 焦点元素的tagName
    const str = clipboard.readText() // 剪贴板中的内容
    const selectStr = getSelection2() // 选中的内容
    const text = e.target.innerText || '' // 目标标签的innerText
    const value = e.target.value || '' // 目标标签的value

    if (selectStr) { // 如果有选中内容
      flag = true
      // 在 选中的元素或者输入框 上面点右键，这样在选中后点别处就不会出现右键复制菜单
      if (text.indexOf(selectStr) !== -1 || value.indexOf(selectStr) !== -1) menu.append(new MenuItem({
        label: '复制',
        click: copyString
      }))
    }
    if (str && (tagName === 'INPUT' || tagName === 'TEXTAREA')) { // 若为输入框 且 剪贴板中有内容，则显示粘贴菜单
      flag = true
      menu.append(new MenuItem({
        label: '粘贴',
        click: printString
      }))
    }

    // ↑ 情况二


    // menu中有菜单项 且（有选中内容 或 剪贴板中有内容）
    if (flag && (getSelection2() || str)) {
      // 将此menu菜单作为 当前窗口 remote.getCurrentWindow() 中的上下文菜单弹出。
      menu.popup(remote.getCurrentWindow())
    }
  }, false)
  // 写入剪贴板方法
  function copyString() {
    const str = getSelection2() // 获取选中内容
    clipboard.writeText(str) // 写入剪贴板
  }
  // 获取剪贴版内容写入当前焦点元素中
  function printString() {
    if (document.activeElement) {
      const str = clipboard.readText() // 获取剪贴板内容
      document.activeElement.value = str // 写入焦点元素
      // clipboard.clear() // 清空剪贴板
    }
  }
}

// 获取选中内容
function getSelection2() {
  var text = ''
  if (window.getSelection) { // 除IE9以下 之外的浏览器
    text = window.getSelection().toString()
  } else if (document.selection && document.selection.type !== 'Control') { //IE9以下，可不考虑
    text = document.selection.createRange().text
  }
  if (text) {
    return text
  }
}