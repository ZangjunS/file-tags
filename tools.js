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
  $.each(letters, function (i) {
    curr = {
      letter: this,
      data: []
    };
    $.each(arr, function () {
      if ((zh[i - 1] && zh[i - 1].localeCompare(this, "zh") <= 0) && this.localeCompare(zh[i], "zh") == -1) {
        curr.data.push(this);
      }
    });
    if (empty || curr.data.length) {
      segs.push(curr);
      curr.data.sort(function (a, b) {
        return a.localeCompare(b, "zh");
      });
    }
  });
  return segs;
}
var db = {
  resentSeaTag: new LruCache(10),
  fileLibraryDirs: new LruCache(10),
  currentEditTbNode: {},
  staticTags: ["删除标记", "收藏标记", "1星", "2星", "3星"],
  resentAddTag: new CounterSortList({}, ["删除标记", "收藏标记", "1星", "2星", "3星"])
};
var dbTools = {
  async dbLoad() {
    return new Promise((res, rej) => {
      try {
        var resentAddTag = JSON.parse(localStorage.getItem("resentAddTag"));
        resentAddTag = resentAddTag == null ? {} : resentAddTag;
        db.resentAddTag.countMap = resentAddTag;
        var fileLibraryDirs = JSON.parse(
          localStorage.getItem("fileLibraryDirs")
        );
        if (fileLibraryDirs == null) {
          fileLibraryDirs = [];
        }
        fileLibraryDirs.forEach((element) => {
          db.fileLibraryDirs.put(element);
        });
        res(db);
      } catch (error) {
        rej(error);
      }
    });
  },
  dbSave() {
    localStorage.setItem("resentAddTag", JSON.stringify(db.resentAddTag.countMap));
    localStorage.setItem("fileLibraryDirs", JSON.stringify(db.fileLibraryDirs.list));
  },
};
window.onunload = dbTools.dbSave;