var Data = require("Data");

cc.Class({
  extends: cc.Component,
  properties: {
    Tool_Prefab: {
      default: null,
      type: cc.Prefab
    },
    Item_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  Value: null,
  Prefab: null,
  onLoad() {
    var self = this;
    this.fatchData();
    this.getToolPositon();
  },

  //加载植物
  fatchData() {
    var self = this;
    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.setLandOption(data);
      }
      self.setLocalStorageData(data);
    });
  },

  //设置土地信息
  setLandOption(data) {
    let self = this;
    for (let i = 0; i < data.Model.length; i++) {
      let itemBoxNode = cc.find("bg/mapNew/item" + i, this.node);
      let itemBox = cc.find("bg/mapNew/item" + i, this.node).getComponent(cc.Sprite);
      if (data.Model[i].IsLock) {
        cc.loader.loadRes("Farm/itemG", cc.SpriteFrame, (err, spriteFrame) => {
          itemBox.spriteFrame = spriteFrame;
        });
      }
    }
  },
  //缓存机制
  setLocalStorageData(data) {
    let self = this;
    this.Value = {
      List: data.Model,
      toolType: 0
    };
    //缓存数据并加载植物
    cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value));
    for (let i = 0; i < self.Value.List.length; i++) {
      setTimeout(function() {
        self.fatchPlant(i, self.Value.List);
      }, 500);
    }
  },
  //土地点击事件
  landClickEvent(e) {
    let self = this;
    let landId = this.Value.List[Number(e.currentTarget._name.slice(4))].ID;
    let propertyId = 12;
    Data.func.addCrops(landId, propertyId).then(data => {
      if (data.Code === 1) {
        setTimeout(function() {
          Data.func.getFarmModalData().then(data => {
            if (data.Code === 1) {
              self.setLocalStorageData(data);
            }
          });
        }, 500);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //加载农作物
  fatchPlant(i, ValueList) {
    var self = this;
    let bg = cc.find("bg", this.node);
    let Prefab = cc.instantiate(self.Item_Prefab);
    let PrefabPlant_xs = cc.find("plant-xs", Prefab);
    let PrefabPlant_md = cc.find("plant-md", Prefab);
    let PrefabPlant_lg = cc.find("plant-lg", Prefab);
    let PrefabPlant_ok = cc.find("plant-ok", Prefab);
    let PrefabPlant_tip = cc.find("New Node/reap", Prefab);
    //提示图标的类型切换
    self.setTipType(ValueList[i], PrefabPlant_tip);
    let itemBox = cc.find("bg/mapNew/item" + i, this.node);
    let itemPos = itemBox.getPosition();
    let pos = itemBox.getNodeToWorldTransformAR(itemPos);

    if (ValueList[i].CropsStatus == 1) {
      //小树苗
      PrefabPlant_xs.active = true;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = false;
      PrefabPlant_ok.active = false;
    } else if (ValueList[i].CropsStatus == 2) {
      //中端
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = true;
      PrefabPlant_lg.active = false;
      PrefabPlant_ok.active = false;
    } else if (ValueList[i].CropsStatus == 3) {
      //成熟
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = true;
      PrefabPlant_ok.active = false;
      PrefabPlant_tip.active = false;
    } else if (ValueList[i].CropsStatus == 4) {
      //成熟
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = false;
      PrefabPlant_ok.active = true;
      PrefabPlant_tip.active = true; //显示可收割
    }
    //重置名字赋值
    Prefab.name = "Prefab" + i;
    //定位于碰撞事件触发的点
    Prefab.setPosition(pos.tx, pos.ty);
    bg.addChild(Prefab);
  },
  //提示图标的类型切换
  setTipType(ValueList, obj) {
    if (ValueList.IsDry && ValueList.CropsStatus != 0) {
      cc.loader.loadRes("Farm/water", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    } else if (ValueList.IsWeeds && ValueList.CropsStatus != 0) {
      cc.loader.loadRes("Farm/weed", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    } else if (ValueList.CropsIsFertilization && ValueList.CropsStatus != 0) {
      cc.loader.loadRes("Farm/worm", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },
  start() {},
  //监听触摸
  getToolPositon() {
    let self = this;
    let farmBox = cc.find("bg", this.node);
    let tool = cc.find("tool/bottomTool/toolBox/btn0" + i, this.node);
    farmBox.on("touchstart", function(e) {
      if (self.Value.toolType != 0) {
        cc.sys.localStorage.setItem("FarmData", JSON.stringify(self.Value)); //缓存机制
        self.Prefab = cc.instantiate(self.Tool_Prefab);
        let Img = cc.find("tool", self.Prefab).getComponent(cc.Sprite);
        cc.loader.loadRes(self.imgSrcSelect(self.Value.toolType), cc.SpriteFrame, function(err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        self.Prefab.setPosition(e.getLocation().x - 150, e.getLocation().y - 150);
        farmBox.addChild(self.Prefab);
      }
    });
    farmBox.on("touchmove", function(e) {
      if (self.Value.toolType != 0) {
        self.Prefab.setPosition(e.getLocation().x - 150, e.getLocation().y - 150);
      }
    });
    farmBox.on("touchend", function() {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
    });
    farmBox.on("touchcancel", function() {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
    });
  },
  //工具图片显示  浇水、除草、种子、镰刀
  imgSrcSelect(i) {
    var self = this;
    let src_ = "";

    switch (i) {
      case 1: {
        src_ = "Farm/jiaoshui";
        break;
      }
      case 2: {
        src_ = "Farm/chucao";
        break;
      }
      case 3: {
        src_ = "Farm/zhongzi";
        break;
      }
      case 4: {
        src_ = "Farm/liandao";
        break;
      }
    }
    return src_;
  },
  setBtnState(e) {
    let type = e.currentTarget._name.slice(4);
    this.animate(type);
  },
  gotoMuChange: function() {
    cc.director.loadScene("index");
  },
  //按钮变化
  animate(data) {
    let btnStyle = cc.find("tool/bottomTool/toolBox/btn0" + data, this.node);
    let bt1 = cc.find("tool/bottomTool/toolBox/btn01", this.node);
    let bt2 = cc.find("tool/bottomTool/toolBox/btn02", this.node);
    let bt3 = cc.find("tool/bottomTool/toolBox/btn03", this.node);
    let bt4 = cc.find("tool/bottomTool/toolBox/btn04", this.node);
    if (btnStyle.getPositionY() == 0) {
      this.backanimate([bt1, bt2, bt3, bt4]);
      btnStyle.setScale(1.1);
      btnStyle.setPositionY(15);
      this.Value.toolType = Number(data);
      cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value)); //缓存机制
    } else {
      this.backanimate([bt1, bt2, bt3, bt4]);
      this.Value.toolType = 0;
      cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value)); //缓存机制
    }
    console.log(this.Value.toolType);
  },
  backanimate(e) {
    for (let i = 0; i < e.length; i++) {
      e[i].setScale(1);
      e[i].setPositionY(0);
    }
  },
  update(dt) {
    // this.fatchData();
  }
});
