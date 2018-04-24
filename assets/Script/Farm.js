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
    //初始化加载
    this.fatchData();
    this.getToolPositon();
    let canvas = cc.find("Canvas");
    Tool.RunAction(canvas, "fadeIn", 0.3);
    //更新数据监听
    this.node.on("say-hello", function(event) {
      let List = event.detail.data;
      for (let i = 0; i < List.length; i++) {
        self.fatchPlant(i, List);
      }
    });
  },

  //加载植物数据
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

  //加载农作物
  fatchPlant(i, ValueList) {
    var self = this;
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
      cc.loader.loadRes("Farm/fertilize", cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },
  start() {},
  //监听触摸
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
  addListenMove(i, tool) {
    let self = this;
    let farmBox = cc.find("bg", this.node);
    let bg_farm = cc.find("bg_farm", this.node);
    tool.on("touchstart", function(e) {
      bg_farm.opacity = 0; //种子选择的浮窗
      self.Value.toolType = i;
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
  gotoMuChange: function() {
    cc.director.loadScene("index");
  },
  //播种和施肥触发事件
  setBtnShowSeed(e) {
    let self = this;
    let seedBox = cc.find("bg_farm", this.node);
    if (!seedBox.active) {
      for (let i = 0; i < 4; i++) {
        let prefab = cc.instantiate(self.ItemSeed_Prefab);
        let Img = cc.find("ymzz", prefab).getComponent(cc.Sprite);
        let ImgSrc;
        let Label = cc.find("label", prefab).getComponent(cc.Label);
        if (e.target._name == "farm_icon_01") {
          ImgSrc = "Modal/Repertory/ymzz";
          Label.string = "玉米";
        } else {
          ImgSrc = "Modal/Repertory/sd-fl1";
          Label.string = "肥料";
        }
        cc.loader.loadRes(ImgSrc, cc.SpriteFrame, function(err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        self.addListenMove(1, prefab);
        seedBox.addChild(prefab);
      }
      Tool.RunAction(seedBox, "fadeIn", 0.3);
    } else {
      seedBox.active = false;
      seedBox.removeAllChildren();
    }
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
