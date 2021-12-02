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
  this.ignoreVals = ignoreVals;
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