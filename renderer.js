// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const fs = require("fs");
const path = require("path");
const { shell } = require("electron");
const { ipcRenderer } = require("electron");
const { dialog } = require("electron");
const execSync = require("child_process").execSync;
var cmd = require("node-cmd");
var $;
layui.use(["layer", "form", "jquery", "table", "element"], async function () {
  window.nodeRequire = require;
  delete window.require;
  var layer = layui.layer;
  var form = layui.form;
  var element = layui.element;
  $ = layui.$;
  var table = layui.table;
  var tagTools = {
    tagToHead: false,
    strNotEmpty(value) {
      //正则表达式用于判斷字符串是否全部由空格或换行符组成
      var reg = /^\s*$/;
      //返回值为true表示不是空字符串
      return value != null && value != undefined && !reg.test(value);
    },
    renameFile(pathToFile, newPathToFile) {
      fs.rename(pathToFile, newPathToFile, function (err) {
        if (err) {
          layer.msg(`重命名${pathToFile}出错...`);
          throw err;
        } else {
          console.log("Successfully renamed the fie!");
        }
      });
    },
    getTags(fileName) {
      fileName = new String(fileName);
      var tagStart = fileName.indexOf("[");
      var tagEnd = fileName.lastIndexOf("]");
      if (tagStart == -1 || tagEnd == -1) {
        return [];
      }
      var tagstr = fileName.substring(tagStart, tagEnd);
      // tagstr = tagstr.replace("[", " ");
      // tagstr = tagstr.replace("]", " ");
      // tagstr = tagstr.replace(/ /g, " ");
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
      var tagStr = "[" + [...newTags].filter(this.strNotEmpty).join(" ") + "]";
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
    addTagsToFile(filePath, addtags, tagToHead) {
      var basename = path.basename(filePath);
      var dirname = path.dirname(filePath);
      var newFileName = this.addTags(basename, addtags, tagToHead);
      if (basename == newFileName) {
        return filePath;
      }
      this.renameFile(filePath, path.join(dirname, newFileName));
      return path.join(dirname, newFileName);
    },
    delTagsToFile(filePath, deltags) {
      var basename = path.basename(filePath);
      var dirname = path.dirname(filePath);
      var newFileName = this.delTags(basename, deltags);
      this.renameFile(filePath, path.join(dirname, newFileName));
      return path.join(dirname, newFileName);
    },
  };
  var searchTools = {
    search(sParam) {
      var cmds = `CHCP 65001>nul && "es.exe" `;
      if ($("#pathAsLabel")[0].checked) {
        sParam += " -p";
      }
      if ($("#noSub")[0].checked) {
        sParam = " -parent " + sParam;
      }
      var cmdRes = new TextDecoder("utf-8").decode(execSync(cmds + sParam));
      var res = cmdRes.split(/[\r\n]+/);
      return new Promise((resolve) => {
        resolve(res.filter(tagTools.strNotEmpty));
      });
      // return new Promise((resolve) => {
      //   cmd.get(cmds, (err, data) => {
      //     var res = data.split(/[\r\n]+/).filter(tagTools.strNotEmpty);
      //     resolve(res);
      //   });
      // });
    },
    createTable(data) {
      //执行渲染
      resTable = table.render({
        elem: "#searchRes", //指定原始表格元素选择器（推荐id选择器）
        cols: [
          [
            { field: "check", type: "radio", width: "5%" },
            { field: "LAY_TABLE_INDEX", title: "序号", width: "10%" },
            {
              field: "fileName",
              title: "文件名",
              sort: true,
              width: "40%",
              templet: `<div> <div> <a  class="fileLink" tIdx={{d.LAY_TABLE_INDEX}} style:" display:inline;"> {{d.fileName}} </a></div> </div>`,
            },
            {
              field: "filePath",
              title: "文件路径",
              sort: true,
              width: "40%",
              templet: `<div> <div  class="filePath" tIdx={{d.LAY_TABLE_INDEX}}> {{d.filePath}}  </div> </div>`,
            },
          ],
        ], //设置表头
        data: data,
        page: true, //开启分页
        limit: 500,
      });
    },
  };
  // 初始化操作
  //searcher
  function createLibraryDivs() {
    $("#fileLibraryDirsDiv").html("");
    db.fileLibraryDirs.list.forEach((path) => {
      $("#fileLibraryDirsDiv").append(
        $(`<div class=" fileLibraryDir">${path}</div>`)
      );
    });
  }
  $("#etsearcher-btn").click(async () => {
    var searcher = $("#etsearcher");
    var searchFiles;
    try {
      searchFiles = await searchTools.search(searcher.val());
    } catch (error) {
      layer.msg("我们不建议搜索过多的数据...");
      return;
    }
    var tableData = searchFiles.map((filePath, idx) => {
      return {
        fileName: path.basename(filePath),
        filePath: filePath,
      };
    });
    searchTools.createTable(tableData);
    $("#fileTags").html("");
  });
  $("#settingFolder").click(() => {
    layer.open({
      type: 1,
      offset: "5px",
      title: "搜索设置",
      area: ["300px", "200px"],
      shade: 0,
      shadeClose: false,
      content: $("#searchSettings"),
    });
  });
  $("#fileLibraryFolder").click(() => {
    layer.open({
      type: 1,
      offset: "5px",
      title: "仓库",
      area: ["300px", "200px"],
      shade: 0,
      shadeClose: false,
      content: $("#fileLibraryActWin"),
    });
  });
  $("#addFileLibrary").click(() => {
    ipcRenderer.send("wantAdir", "hello");
    ipcRenderer.on("aaa", (event, args) => {
      console.log(args);
    });
    ipcRenderer.on("retAdir", (event, path) => {
      db.fileLibraryDirs.put(path);
      createLibraryDivs();
    });
  });
  $("body").on("click", ".fileLibraryDir", function (a) {
    $("#etsearcher").val($(this).html());
  });
  // searchResWin
  //监听行单击事件
  table.on("row(searchRes)", function (obj) {
    //选中行样式
    obj.tr
      .addClass("layui-table-click")
      .siblings()
      .removeClass("layui-table-click");
    //选中radio样式
    obj.tr.find('i[class="layui-anim layui-icon"]').trigger("click");
  });
  table.on("radio(searchRes)", function (obj) {
    db.currentEditTbNode = obj;
    createTagDivs(obj);
  });
  // 点击文件名打开文件
  $("body").on("click", ".fileLink", function (a) {
    var val = $(this).attr("tIdx");
    shell.openPath(table.cache.searchRes[val].filePath);
  });
  $("body").on("click", ".filePath", function (a) {
    var val = $(this).attr("tIdx");
    shell.showItemInFolder(table.cache.searchRes[val].filePath);
  });

  //tagActWin
  function tableNodeUpdate(fileAct, tags, tagToHead) {
    var tbNode = db.currentEditTbNode;
    var filePath = tbNode.data.filePath;
    var newFilePath = tagTools[fileAct](filePath, tags, tagToHead);
    var newTbData = {
      fileName: path.basename(newFilePath),
      filePath: newFilePath,
    };
    tbNode.update(newTbData);
    $(".layui-table-click .layui-form-radio").click();
  }
  //
  function createTagDivs(fileRow) {
    var tags = tagTools.getTags(fileRow.data.fileName);
    var tagDivs = tags.map((tag) => {
      var atagDiv = $(
        `<div class="layui-btn-group">
        <div class="layui-badge layui-bg-green">${tag}</div> 
        <div delTag="${tag}" filePath="${fileRow.data.filePath}" 
        class="layui-badge tagDeler" >x</div>
        </div>`
      );
      return atagDiv;
    });
    $("#fileTags").html("");
    $("#fileTags").append(tagDivs);
  }
  //历史标签
  function createHisTags(tags) {
    var tagDivs = tags.map((tag) => {
      return $(
        ` 
        <div class="layui-badge layui-bg-green hisTag">${tag}</div> 
        <span class="layui-badge-dot layui-bg-gray"></span>
         `
      );
    });
    $("#hisTags").html("");
    $("#hisTags").append(tagDivs);
  }
  // 这里要获取那个双击的obj,然后回调update
  $("#addTagBtn").click(() => {
    var newTagsStr = `[${$("#newTagsIpt").val()}]`;
    var newTags = tagTools.getTags(newTagsStr);
    tableNodeUpdate("addTagsToFile", newTags);
    newTags.forEach((t) => {
      db.resentAddTag.put(t);
    });
    createHisTags(db.resentAddTag.list);
  });
  form.on("switch(tagToHeadSwitch)", (obj) => {
    tagTools.tagToHead = obj.elem.checked;
  });

  $("body").on("click", ".hisTag", function (e) {
    var addTag = $(this).html();
    tableNodeUpdate("addTagsToFile", [addTag]);
    db.resentAddTag.put(addTag);
    createHisTags(db.resentAddTag.list);
  });
  $("body").on("click", ".tagDeler", function (e) {
    var delTag = $(this).attr("delTag");
    tableNodeUpdate("delTagsToFile", [delTag]);
  });
  // 界面初始化

  $("#etsearcher").val(cmdArgs[1]);

  setTimeout(() => {
    dbTools
      .dbLoad()
      .then((data) => {
        console.log("done");
        createHisTags(db.resentAddTag.list);
        db.staticTags.forEach((ele) => {
          $("#staticTags").append(
            $(
              `<div class="layui-badge layui-bg-green hisTag">${ele}</div> 
      <span class="layui-badge-dot layui-bg-gray"></span>`
            )
          );
        });
        createLibraryDivs();
      })
      .catch((err) => {
        console.log(err);
      });
  }, 500);
});
