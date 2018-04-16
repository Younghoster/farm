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
  //绑定节点
  bindNode() {
    this.moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    this.level = cc.find("div_header/me/levelbg/label", this.node).getComponent(cc.Label);
  },
  //加载植物
  fatchData() {
    var self = this;
    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //用户信息加载
        self.getUserInfo(data);
        //土地渲染
        self.setLandOption(data);
      }
      self.setLocalStorageData(data);
    });
  },

  //获取用户信息
  getUserInfo(data) {
    let self = this;
    //金币设置
    var RanchMoney = data.userModel.RanchMoney;
    var moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    moneyLabel.string = "￥" + RanchMoney;
    //经验值
    this.level = cc.find("div_header/Lv/level", this.node).getComponent(cc.Label);
    this.level.string = "V" + data.userModel.Grade;
    this.levelProgressBar = cc.find("div_header/Lv/lv_bar", this.node).getComponent(cc.ProgressBar);
    this.levelProgressBar.progress = data.userModel.ExperienceValue / data.userModel.GradeExperienceValue;
    console.log(data);
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
      toolType: 1
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
            self.setLocalStorageData(data);
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
    for (let i = 1; i < 5; i++) {
      let tool = cc.find("tool/bottomTool/toolBox/btn0" + i, this.node);
      tool.on("touchstart", function(e) {
        self.Value.toolType = i;
        cc.sys.localStorage.setItem("FarmData", JSON.stringify(self.Value)); //缓存机制
        self.Prefab = cc.instantiate(self.Tool_Prefab);
        let Img = cc.find("tool", self.Prefab).getComponent(cc.Sprite);
        cc.loader.loadRes(self.imgSrcSelect(i), cc.SpriteFrame, function(err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        console.log(e.getLocation());
        self.Prefab.setPosition(e.getLocation().x - 150, e.getLocation().y - 150);
        farmBox.addChild(self.Prefab);
      });
      tool.on("touchmove", function(e) {
        self.Prefab.setPosition(e.getLocation().x - 150, e.getLocation().y - 150);
      });
      tool.on("touchend", function() {
        self.Prefab.removeFromParent();
      });
      tool.on("touchcancel", function() {
        self.Prefab.removeFromParent();
      });
    }
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
  gotoMuChange: function() {
    cc.director.loadScene("index");
  },
  update(dt) {
    // this.fatchData();
  }
});
