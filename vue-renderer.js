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
var tagTools = {
  tagToHead: true,
  strNotEmpty(value) {
    //正则表达式用于判斷字符串是否全部由空格或换行符组成
    var reg = /^\s*$/;
    //返回值为true表示不是空字符串
    return value != null && value != undefined && !reg.test(value);
  },
  renameFile(pathToFile, newPathToFile) {

    try {
      fs.renameSync(pathToFile, newPathToFile)
      console.log("Successfully renamed the file!");
      return newPathToFile;
    } catch (error) {
      console.log(`重命名${pathToFile}出错...`)
    }
    return null;
  },
  getTags(fileName) {
    fileName = new String(fileName);
    var tagStart = fileName.indexOf("[");
    var tagEnd = fileName.lastIndexOf("]");
    if (tagStart == -1 || tagEnd == -1) {
      return [];
    }
    var tagstr = fileName.substring(tagStart, tagEnd);

    tagstr = tagstr.replace(/[\] []/g, " ");
    return [...new Set(tagstr.split(" "))].filter(this.strNotEmpty);
  },
  addTags(fileName, addtags) {
    var newTags = new Set(addtags);
    this.getTags(fileName).forEach((a) => newTags.add(a));
    return this.reSetTag(fileName, newTags);
  },
  delTags(fileName, deltags) {
    deltags = new Set(deltags);
    var newTags = [...this.getTags(fileName)].filter((n) => !deltags.has(n));
    return this.reSetTag(fileName, newTags);
  },
  reSetTag(fileName, newTags) {
    fileName = fileName + "";
    var fileSuffix = path.extname(fileName);
    var fileNameNotag = fileName.replace(fileSuffix, "");
    var tagStart = fileName.indexOf("[");
    var tagEnd = fileName.lastIndexOf("]");
    if (tagStart != -1 && tagEnd != -1) {
      var oTags = fileName.substring(tagStart, tagEnd + 1);
      fileNameNotag = fileNameNotag.replace(oTags, "");
    }

    var tagStr = "[" + [...newTags].filter(this.strNotEmpty).sort().join(" ") + "]";
    console.log(fileNameNotag);
    if (this.tagToHead == true) {
      return tagStr + fileNameNotag + fileSuffix;
    }
    return fileNameNotag + tagStr + fileSuffix;
  },
  getTagsFromFile(filePath) {
    var basename = path.basename(filePath);
    return this.getTags(basename);
  },
  headTagsToFile(filePath) {
    var basename = path.basename(filePath);
    var dirname = path.dirname(filePath);
    var newFileName = this.addTags(basename, [" "], true);
    if (basename == newFileName) {
      return filePath;
    }
    this.renameFile(filePath, path.join(dirname, newFileName));
    return path.join(dirname, newFileName);
  },
  addTagsToFile(filePath, addtags) {
    if (typeof addtags == 'string') {
      addtags = addtags.split(" ");
    }
    var basename = path.basename(filePath);
    var dirname = path.dirname(filePath);
    var newFileName = this.addTags(basename, addtags);
    if (basename == newFileName) {
      return filePath;
    }

    return this.renameFile(filePath, path.join(dirname, newFileName));
  },
  delTagsToFile(filePath, deltags) {
    var basename = path.basename(filePath);
    var dirname = path.dirname(filePath);
    var newFileName = this.delTags(basename, deltags);

    return this.renameFile(filePath, path.join(dirname, newFileName));
  },
};

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