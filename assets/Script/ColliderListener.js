var Data = require('Data');
cc.Class({
  extends: cc.Component,

  properties: {},
  dataList: null,
  // use this for initialization
  onLoad: function() {
    cc.director.getCollisionManager().enabled = true;
    this.touchingNumber = 0;
    this.CollectNumber = 0;
  },

  onCollisionEnter: function(other) {
    let self = this;
    other.node.color = cc.Color.GREEN;

    this.touchingNumber++;

    this.dataList = JSON.parse(cc.sys.localStorage.getItem('FarmData')); //缓存机制
    this.FarmJs = cc.find('Canvas');
    let id = Number(other.node.name.slice(4));
    let propertyId = Config.propertyId; //种子ID
    let type = Config.fertilizerId; //肥料ID
    clearTimeout(this.timers); //清理定时器
    if (self.dataList.toolType == 1) {
      self.crops(id, propertyId);
    } else if (self.dataList.toolType == 2) {
      self.water(id);
    } else if (self.dataList.toolType == 3) {
      self.weed(id);
    } else if (self.dataList.toolType == 4) {
      self.disinsection(id);
    } else if (self.dataList.toolType == 5) {
      self.cropsSertilize(id, type);
    } else if (self.dataList.toolType == 6) {
      self.collectCrops(id);
    }
  },
  //播种
  crops(id, propertyId) {
    let self = this;
    let landId = this.dataList.List[id].ID;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    if (CropsID == 0 && !IsLock) {
      Data.func.addCrops(landId, propertyId).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code == 1) {
            Data.func.getFarmModalData().then(data2 => {
              // FarmJsFarmJs.fn.setLocalStorageData.call(FarmJs, data2);
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          } else {
            Msg.show(data.Message);
          }
        }, 1000);
      });
    }
  },
  //浇水
  water(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsWater = this.dataList.List[id].IsDry;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsWater) {
      Data.func.CropsWatering(CropsID).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code === 1) {
            Data.func.getFarmModalData().then(data2 => {
              // FarmJs.fn.setLocalStorageData.call(FarmJs, data2);
              Msg.show(data.Message);
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          } else {
            Msg.show(data.Message);
          }
        }, 1000);
      });
    } else {
      self.timers = setTimeout(function() {
        Msg.show('我现在不需要浇水哦~');
      }, 1000);
    }
  },
  //除草
  weed(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsWeeds = this.dataList.List[id].IsWeeds;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsWeeds) {
      Data.func.CropsWeeding(CropsID).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code === 1) {
            Data.func.getFarmModalData().then(data2 => {
              Msg.show(data.Message);
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          } else {
            Msg.show(data.Message);
          }
        }, 1000);
      });
    } else {
      self.timers = setTimeout(function() {
        Msg.show('我现在不需要除草哦~');
      }, 1000);
    }
  },
  //除虫
  disinsection(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsDisinsection = this.dataList.List[id].IsDisinsection;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsDisinsection) {
      Data.func.CropsDisinsection(CropsID).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code === 1) {
            Data.func.getFarmModalData().then(data2 => {
              Msg.show(data.Message);
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          } else {
            Msg.show(data.Message);
          }
        }, 1000);
      });
    } else {
      self.timers = setTimeout(function() {
        Msg.show('我现在不需要除虫哦~');
      }, 1000);
    }
  },
  //施肥
  cropsSertilize(id, type) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock) {
      Data.func.CropsSertilize(CropsID, type).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code === 1) {
            Data.func.getFarmModalData().then(data2 => {
              Msg.show(data.Message);
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          } else {
            Msg.show(data.Message);
          }
        }, 1000);
      });
    }
  },
  //收取农作物
  collectCrops(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus == 4 && !IsLock) {
      Data.func.CollectCrops(CropsID).then(data => {
        if (data.Code === 1) {
          self.CollectNumber += Number(data.Model);
          self.timers = setTimeout(function() {
            Msg.show('收取 × ' + self.CollectNumber);
            self.CollectNumber = 0;
            Data.func.getFarmModalData().then(data2 => {
              self.FarmJs.emit('updataPlant', {
                data: data2.Model
              });
            });
          }, 1000);
        } else {
          Msg.show(data.Message);
        }
      });
    } else {
      self.timers = setTimeout(function() {
        Msg.show('我现在还不能收取哦~');
      }, 1000);
    }
  },
  onCollisionStay: function(other) {},

  onCollisionExit: function(other) {
    //碰撞后的状态显示
    this.touchingNumber--;
    if (this.touchingNumber === 0) {
      other.node.color = cc.Color.WHITE;
    }
    //找到当前预置资源
    let id = Number(other.node.name.slice(4));
    let ParentNodes = other.node.parent.parent;
    let PlantNodes = cc.find('Prefab' + id, ParentNodes);
    let PlantNodesTip = cc.find('Prefab' + id + '/New Node/reap', ParentNodes);
    //是否存在预置资源

    if (PlantNodes) {
      //是否成熟并且选择是镰刀收割工具
      if (
        this.dataList.List[id].CropsStatus == 4 &&
        this.dataList.toolType == 6 &&
        !this.dataList.List[id].IsDisinsection &&
        !this.dataList.List[id].IsDry &&
        !this.dataList.List[id].IsWeeds
      ) {
        var action = cc.sequence(cc.moveBy(0.3, 0, 20), cc.fadeOut(0.5), cc.callFunc(PlantNodes.removeFromParent));
        PlantNodes.runAction(action);
      }
      //浇水
      if (this.dataList.List[id].IsDry && this.dataList.toolType == 2) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
      //除草
      if (this.dataList.List[id].IsWeeds && this.dataList.toolType == 3) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
      //除虫
      if (this.dataList.List[id].IsDisinsection && this.dataList.toolType == 4) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
    }
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
