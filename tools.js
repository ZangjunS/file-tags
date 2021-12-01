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