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

var db = {
  resentAddTag: new LruCache(15),
  resentSeaTag: new LruCache(10),
  fileLibraryDirs: new LruCache(10),
  currentEditTbNode: {},
  staticTags: ["删除标记", "收藏标记"],
};
var dbTools = {
  async dbLoad() {
    return new Promise((res, rej) => {
      try {
        var resentAddTag = JSON.parse(localStorage.getItem("resentAddTag"));
        resentAddTag = resentAddTag == null ? [] : resentAddTag;
        resentAddTag.forEach((element) => {
          db.resentAddTag.put(element);
        });
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
    localStorage.setItem("resentAddTag", JSON.stringify(db.resentAddTag.list));
    localStorage.setItem(
      "fileLibraryDirs",
      JSON.stringify(db.fileLibraryDirs.list)
    );
  },
};
window.onunload = dbTools.dbSave;
