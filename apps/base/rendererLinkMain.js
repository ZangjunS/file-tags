var remote = require('electron').remote;
//调界面时关闭
const fs = require("fs");
const path = require("path");
const {
    shell
} = require("electron");
const {
    ipcRenderer,
} = require("electron");
const {
    dialog
} = require("electron");
const execSync = require("child_process").execSync;
var cmd = require("node-cmd");
const {
    clipboard
} = require('electron')

cmdArgs = remote.getGlobal('sharedObject').cmdArgs;
console.log(remote.getGlobal('sharedObject')); // output : ["arg1", "arg2"]

sys = {
    cmdArgs: cmdArgs,
    pathExe: process.execPath,
    path: path.dirname(process.execPath),
    simpleMode: false,

}
apps = [{
    value: 'filetags/index.html',
    label: '标签管理器'
}, {
    value: 'unzip/index.html',
    label: '批量解压'
}, {
    value: 'mergDirToMin/index.html',
    label: '合并文件夹'
},{
    value: 'noname/index.html',
    label: '无名杀' 
}]