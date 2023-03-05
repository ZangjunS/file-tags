var DateUtil = {
  /**
   * 当前时间，格式 yyyy-MM-dd HH:mm:ss
   *
   * @return 当前时间的标准形式字符串
   */
  now: function () {
    return new Date().format("yyyy-MM-dd HH:mm:ss");
  },
  nowDay: function () {
    return DateUtil.formatDateTime(new Date(), DateUtil.date_formate.normDatePattern);
  },
  /**
   * 格式化日期时间
   * 格式 yyyy-MM-dd HH:mm:ss
   *
   * @param date 被格式化的日期
   * @param format 格式化 参考 {@link date_formate}
   * @return 格式化后的日期
   */
  formatDateTime: function (date, format) {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    };
    date = new Date(date);
    if (format == undefined || format == null) {
      format = "yyyy-MM-dd HH:mm:ss";
    }

    return date.format(format);
  },
  /**
   * 只支持毫秒级别时间戳，如果需要秒级别时间戳，请自行×1000
   *
   * @param timestamp 时间戳
   * @return 时间对象
   */
  date: function (timestamp) {
    return new Date(timestamp);
  },
  /** 日期格式 命名参考hutool工具类 */
  date_formate: {
    /** 标准日期格式：yyyy-MM-dd */
    normDatePattern: "yyyy-MM-dd",
    /** 标准时间格式：hh:mm:ss */
    normTimePattern: "HH:mm:ss",
    /** 标准日期时间格式，精确到分：yyyy-MM-dd HH:mm */
    normDatetimeMinutePattern: "yyyy-MM-dd HH:mm",
    /** 标准日期时间格式，精确到秒：yyyy-MM-dd HH:mm:ss */
    normDatetimePattern: "yyyy-MM-dd HH:mm:ss",
    /** 标准日期时间格式，精确到毫秒：yyyy-MM-dd HH:mm:ss.SSS */
    normDatetimeMsPattern: "yyyy-MM-dd HH:mm:ss.SSS",
    /** 标准日期格式：yyyy年MM月dd日 */
    chineseDatePattern: "yyyy年MM月dd日",
    /** 标准日期格式：yyyyMMdd */
    pureDatePattern: "yyyyMMdd",
    /** 标准日期格式：HHmmss */
    pureTimePattern: "HHmmss",
    /** 标准日期格式：yyyyMMddHHmmss */
    pureDatetimePattern: "yyyyMMddHHmmss",
    /** 标准日期格式：yyyyMMddHHmmssSSS */
    pureDatetimeMsPattern: "yyyyMMddHHmmssSSS",
  }
};


function LruCache(capacity) {
  this.capacity = capacity; //缓存容量
  this.list = []; //实现双向链表

  //向缓存中存放节点
  this.put = function (value) {
    if (this.list.includes(value)) {
      //删除value
      this.list.splice(this.list.indexOf(value), 1);
    }
    if (this.list.length == capacity) {
      this.list.pop();
    }
    this.list.unshift(value);
  };

  this.getVals = function () {
    return this.list;
  };
}

function CounterSortList(initMap, ignoreVals) {
  this.list = [];
  this.countMap = initMap;
  this.ignoreVals = [].concat(ignoreVals);
  this.wordHeadLists = {};
  this.put = function (value) {
    if (this.ignoreVals.includes(value)) {
      return;
    }
    if (this.countMap[value] == null) {
      this.countMap[value] = 0;
    }
    this.countMap[value] += 1;
  };
  this.getTop = function (head, n) {
    n == null ? n = 1000 : null;
    var countList = Object.entries(this.countMap);
    countList.sort((a, b) => {
      return b[1] - a[1]
    });
    if (head != "*") {
      countList = countList.filter((count) => {
        return head == getWordHead(count[0]).toUpperCase();
      })
    }
    var idx = 0;
    var ret = []
    countList.forEach(ele => {
      if (idx < n) {
        ret.push(ele[0]);
        idx++;
      }
    })
    return ret;
  }
}

function getWordHead(word) {
  var part = pySegSort([word]);
  if (part[0] != null) {
    return part[0].letter;
  }
  return word[0];
}

function pySegSort(arr, empty) {
  if (!String.prototype.localeCompare)
    return null;

  var letters = "*abcdefghjklmnopqrstwxyz".split('');
  var zh = "阿八嚓哒妸发旮哈讥咔垃妈拏噢妑七呥仨它穵夕丫咋a".split('');

  var segs = [];
  var curr;
  letters.forEach((word, i) => {
    curr = {
      letter: word,
      data: []
    };
    arr.forEach((ele) => {
      if ((zh[i - 1] && zh[i - 1].localeCompare(ele, "zh") <= 0) && ele.localeCompare(zh[i], "zh") == -1) {
        curr.data.push(ele);
      }
    });
    if (empty || curr.data.length) {
      segs.push(curr);
      curr.data.sort(function (a, b) {
        return a.localeCompare(b, "zh");
      });
    }
  })
  return segs;
}

function sleep(ms) {
  return new Promise((res, rej) => {
    setTimeout(res, ms)
  })
}


var tagTools = {
  headWord: "*ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  staticTags: ["删除标记", "收藏标记", "1星", "2星", "3星"],
  tagCache: true,
  tagOnHead: true,
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
    if (this.tagOnHead == true) {
      return tagStr + fileNameNotag + fileSuffix;
    }
    return fileNameNotag + tagStr + fileSuffix;
  },
  getTagsFromFile(filePath) {
    var basename = path.basename(filePath);
    return this.getTags(basename);
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

var FileDetecter = {
  detectFile() {
    var utf8CharCodes = new TextDecoder("utf-8").decode(execSync(`${sys.path}\\getfile.exe`)).trim();
    // FileDetecter.file.fileName = cmdRes;
    if (utf8CharCodes == "NNNNN") {
      return "NNNNN";
    }
    var spath = utf8CharCodes.split(",").map(c => String.fromCharCode(c)).join("").trim();
    return spath;
  },
  esSearch(sParam) {
    var sCmd = `CHCP 65001>nul && "${sys.path}\\es.exe" -instance 1.5a ${sParam.searchOneLayer?"-parent ":""} ${sParam.val} ${sParam.withPath?"-p":""} `;
    var cmdRes = new TextDecoder("utf-8").decode(execSync(sCmd));
    var res = cmdRes.split(/[\r\n]+/);
    return new Promise((resolve) => {
      resolve(res.filter(tagTools.strNotEmpty));
    });
  },
}

