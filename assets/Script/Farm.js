var Data = require("Data");
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;
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
    },
    ItemSeed_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  Value: null,
  Prefab: null,
  onLoad() {
    var self = this;

    //初始化加载数据
    self.fatchData();
    setInterval(function() {
      self.onlyUpdataPlant();
    }, 60000);
    //初始加载工具栏
    this.getToolPositon();
    Tool.RunAction(cc.find("Canvas"), "fadeIn", 0.3);

    //更新于植物状态变动
    this.node.on("updataPlant", function(event) {
      let List = event.detail.data;
      self.clearAllDom(); //清除植物数据
      self.fatchPlant(List); //重新加载植物
    });

    //更新于土地拓建
    this.node.on("unLockLand", function(event) {
      let ListData = event.detail.data;
      self.clearAllDom(); //清除植物数据
      self.setLandOption(ListData); //重新加载土地
      self.setLocalStorageData(ListData); //重新加载土地（包括植物）
    });
  },

  //初始加载所有数据
  fatchData() {
    var self = this;
    self.clearAllDom(); //清除植物数据
    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.setLandOption(data);
      }
      self.setLocalStorageData(data);
    });
  },
  //仅仅 更新 植物状态
  onlyUpdataPlant() {
    var self = this;
    self.clearAllDom(); //清除植物数据
    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.fatchPlant(data.Model); //重新加载植物
      }
    });
  },

  //仅仅更新土地
  setLandOption(data) {
    let self = this;
    for (let i = 0; i < data.Model.length; i++) {
      let itemBoxNode = cc.find("bg/mapNew/item" + i, this.node);
      let itemBox = cc.find("bg/mapNew/item" + i, this.node).getComponent(cc.Sprite);
      if (data.Model[i].IsLock) {
        cc.loader.loadRes("Farm/itemG", cc.SpriteFrame, (err, spriteFrame) => {
          itemBox.spriteFrame = spriteFrame;
        });
      } else {
        cc.loader.loadRes("Farm/item", cc.SpriteFrame, (err, spriteFrame) => {
          itemBox.spriteFrame = spriteFrame;
        });
      }
    }
  },

  //缓存数据并刷新数据
  setLocalStorageData(data) {
    let self = this;
    this.Value = {
      List: data.Model,
      toolType: 0
    };
    //缓存数据并加载植物
    cc.sys.localStorage.setItem("FarmData", JSON.stringify(this.Value));
    setTimeout(function() {
      self.fatchPlant(self.Value.List);
    }, 1000);
  },

  //加载农作物
  fatchPlant(ValueList) {
    var self = this;
    for (let i = 0; i < ValueList.length; i++) {
      let bg = cc.find("bg", this.node);
      let Prefab = cc.instantiate(self.Item_Prefab);
      let PrefabPlant_xs = cc.find("plant-xs", Prefab);
      let PrefabPlant_md = cc.find("plant-md", Prefab);
      let PrefabPlant_lg = cc.find("plant-lg", Prefab);
      let PrefabPlant_ok = cc.find("plant-ok", Prefab);
      let PrefabExtend = cc.find("extend", Prefab);
      let PrefabPlant_tip = cc.find("New Node/reap", Prefab);
      //初始化清空显示
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = false;
      PrefabPlant_ok.active = false;
      PrefabExtend.active = false;
      PrefabPlant_tip.active = false;
      //提示图标的类型切换
      self.setTipType(ValueList[i], PrefabPlant_tip);
      let itemBox = cc.find("bg/mapNew/item" + i, this.node);
      let itemPos = itemBox.getPosition();
      let pos = itemBox.getNodeToWorldTransformAR(itemPos);

      if (ValueList[i].IsLock) {
        //拓展
        PrefabExtend.active = true;
        Tool.RunAction(PrefabExtend, "fadeIn", 0.3);
        PrefabExtend.on("click", function(e) {
          console.log(ValueList[i].ID);
        });
      }
      if (ValueList[i].CropsStatus == 1) {
        //小树苗
        PrefabPlant_xs.active = true;
        Tool.RunAction(PrefabPlant_xs, "fadeIn", 0.3);
      } else if (ValueList[i].CropsStatus == 2) {
        //中端
        PrefabPlant_md.active = true;
        Tool.RunAction(PrefabPlant_md, "fadeIn", 0.3);
      } else if (ValueList[i].CropsStatus == 3) {
        //成熟
        PrefabPlant_lg.active = true;
        Tool.RunAction(PrefabPlant_lg, "fadeIn", 0.3);
      } else if (ValueList[i].CropsStatus == 4) {
        //成熟
        PrefabPlant_ok.active = true;
        PrefabPlant_tip.active = true; //显示可收割
        Tool.RunAction(PrefabPlant_ok, "fadeIn", 0.3);
        Tool.RunAction(PrefabPlant_tip, "fadeIn", 0.3);
      }
      //重置名字赋值
      Prefab.name = "Prefab" + i;
      //定位于碰撞事件触发的点
      Prefab.setPosition(pos.tx, pos.ty);
      bg.addChild(Prefab);
    }
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
    } else if (ValueList.IsDisinsection && ValueList.CropsStatus != 0) {
      cc.loader.loadRes("Farm/disinsection", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },

  //菜单按钮监听触摸
  getToolPositon() {
    let self = this;
    for (let i = 1; i < 7; i++) {
      if (i !== 1 && i !== 5) {
        let tool = cc.find("tool/layout/farm_icon_0" + i, this.node);
        this.addListenMove(i, tool);
      }
    }
  },

  //添加触摸事件
  addListenMove(i, tool, otherId) {
    let self = this;

    let farmBox = cc.find("bg", this.node);
    let bg_farm = cc.find("bg_farm", this.node);
    tool.on("touchstart", function(e) {
      bg_farm.opacity = 0; //种子选择的浮窗
      self.Value.toolType = i;
      if (i == 1) {
        Config.propertyId = otherId;
      } else if (i == 5) {
        Config.fertilizerId = otherId;
      }
      if (self.Value.toolType != 0) {
        cc.sys.localStorage.setItem("FarmData", JSON.stringify(self.Value)); //缓存机制
        self.Prefab = cc.instantiate(self.Tool_Prefab);
        let Img = cc.find("tool", self.Prefab).getComponent(cc.Sprite);
        cc.loader.loadRes(self.imgSrcSelect(i), cc.SpriteFrame, function(err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        self.Prefab.setPosition(e.getLocation().x - 100, e.getLocation().y - 100);
        farmBox.addChild(self.Prefab, 9);
      }
    });
    tool.on("touchmove", function(e) {
      if (self.Value.toolType != 0) {
        self.Prefab.setPosition(e.getLocation().x - 100, e.getLocation().y - 100);
      }
    });
    tool.on("touchend", function() {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
      bg_farm.active = false; //种子选择的浮窗
      bg_farm.opacity = 1;
      bg_farm.removeAllChildren();
    });
    tool.on("touchcancel", function() {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
      bg_farm.active = false; //种子选择的浮窗
      bg_farm.opacity = 1;
      bg_farm.removeAllChildren();
    });
  },

  //播种和施肥触发事件
  setBtnShowSeed(e) {
    let self = this;
    let seedBox = cc.find("bg_farm", this.node);
    if (!seedBox.active) {
      seedBox.active = false;
      seedBox.removeAllChildren();
      if (e.target._name == "farm_icon_01") {
        Data.func.GetSeedList().then(data => {
          if (data.Code === 1) {
            for (let i = 0; i < data.List.length; i++) {
              let prefab = cc.instantiate(self.ItemSeed_Prefab);
              let Img = cc.find("ymzz", prefab).getComponent(cc.Sprite);
              let ImgSrc;
              let Label = cc.find("label", prefab).getComponent(cc.Label);
              ImgSrc = "Modal/Repertory/ymzz";
              Label.string = data.List[i].PropName + "×" + data.List[i].Count;
              self.addListenMove(1, prefab, data.List[i].PropertyID);
              cc.loader.loadRes(ImgSrc, cc.SpriteFrame, function(err, spriteFrame) {
                Img.spriteFrame = spriteFrame;
              });
              seedBox.addChild(prefab);
            }
            Tool.RunAction(seedBox, "fadeIn", 0.3);
          }
        });
      } else {
        Data.func.GetFertilizerList().then(data => {
          if (data.Code === 1) {
            for (let i = 0; i < data.List.length; i++) {
              let prefab = cc.instantiate(self.ItemSeed_Prefab);
              let Img = cc.find("ymzz", prefab).getComponent(cc.Sprite);
              let ImgSrc;
              let Label = cc.find("label", prefab).getComponent(cc.Label);
              if (data.List[i].PropName == "超级肥料") {
                ImgSrc = "Shop/cjfl_1";
              } else {
                ImgSrc = "Shop/fertilizer";
              }
              Label.string = data.List[i].PropName + "×" + data.List[i].Count;
              self.addListenMove(5, prefab, data.List[i].PropertyTypeID);
              cc.loader.loadRes(ImgSrc, cc.SpriteFrame, function(err, spriteFrame) {
                Img.spriteFrame = spriteFrame;
              });
              seedBox.addChild(prefab);
            }
            Tool.RunAction(seedBox, "fadeIn", 0.3);
          }
        });
      }
    } else {
      seedBox.active = false;
      seedBox.removeAllChildren();
    }
  },

  //工具图片显示  浇水、除草、种子、镰刀
  imgSrcSelect(i) {
    var self = this;
    let src_ = "";

    switch (i) {
      case 1: {
        src_ = "Farm/bozhong";
        break;
      }
      case 2: {
        src_ = "Farm/jiaoshui";
        break;
      }
      case 3: {
        src_ = "Farm/chucao";
        break;
      }
      case 4: {
        src_ = "Farm/chuchong";
        break;
      }
      case 5: {
        src_ = "Farm/zhongzi";
        break;
      }
      case 6: {
        src_ = "Farm/liandao";
        break;
      }
    }
    return src_;
  },

  //清空植物
  clearAllDom() {
    let bg = cc.find("bg", this.node);
    for (let i = 0; i < 12; i++) {
      let clearItem = cc.find("Prefab" + i, bg);
      if (clearItem) {
        clearItem.removeFromParent();
      }
    }
  },

  gotoMuChange: function() {
    cc.director.loadScene("index");
  },

  start() {},

  update(dt) {
    // this.fatchData();
  }
});
