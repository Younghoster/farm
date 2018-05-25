var Data = require('Data');
var ToolJs = require('Tool');
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
    this.nameLabel = cc.find('name', this.node).getComponent(cc.Label);
    this.nameLabel.string = `${Config.realName}的农场`;
    this.oldData = null;
    let self = this;
    this.func = {
      getWeed: this.getWeed,
      touchstart: this.touchstart,
      touchmove: this.touchmove
    };
    if (Config.firstLogin) farmGuid.getPrefab(1);
    self.addPersist();
    self.getWhether();

    //初始化加载数据
    self.fatchData();

    self.schedule(function() {
      self.onlyUpdataPlant();
      console.warn('60秒刷新一波');
    }, 60);
    //初始加载工具栏
    this.getToolPositon();
    Tool.RunAction(cc.find('Canvas'), 'fadeIn', 0.3);

    //更新于植物状态变动
    this.node.on('updataPlant', function(event) {
      let List = event.detail.data;
      self.clearAllDom(List); //清除植物数据
      self.setLocData(List);
      self.fatchPlant(List); //重新加载植物
    });

    //更新于土地拓建
    this.node.on('unLockLand', function(event) {
      let ListData = event.detail.data;
      self.clearAllDom(ListData); //清除植物数据
      self.setLandOption(ListData); //重新加载土地
      self.setLocData(ListData);
      self.setLocalStorageData(ListData); //重新加载土地（包括植物）
    });
  },
  //获取天气
  getWhether() {
    let self = this;
    let bgNode = cc.find('bg', this.node);
    let cloud01 = cc.find('cloud01', this.node);
    let cloud02 = cc.find('cloud02', this.node);
    let fengcheHome = cc.find('New Node/fengcheHome', this.node);
    let fengche = cc.find('New Node/fengche', this.node);
    let ParticleRain = cc.find('ParticleRain', this.node);
    if (Config.weather == -1) {
      ParticleRain.active = true;
    }
    self.setWhetherIcon(bgNode, 4);
    self.setWhetherIcon(cloud01, 5);
    self.setWhetherIcon(cloud02, 6);
    self.setWhetherIcon(fengcheHome, 7);
    self.setWhetherIcon(fengche, 8);
  },
  //初始加载所有数据
  fatchData() {
    var self = this;

    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.clearAllDom(data.Model); //清除植物数据
        self.setLandOption(data.Model); //重新加载土地
      }
      self.setLocData(data.Model, 'all');
      self.setLocalStorageData(data.Model); //重新加载土地（包括植物）
    });
  },
  //仅仅 更新 植物状态
  onlyUpdataPlant() {
    var self = this;

    //获取所有数据
    Data.func.getFarmModalData().then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.clearAllDom(data.Model); //清除植物数据
        self.fatchPlant(data.Model); //重新加载植物
      }
    });
  },

  //仅仅更新土地
  setLandOption(data) {
    let self = this;
    let mapNew = cc.find('bg/mapNew', this.node);
    self.setWhetherIcon(mapNew, 13);
    for (let i = 0; i < data.length; i++) {
      let itemBoxNode = cc.find('bg/mapNew/item' + i, this.node);
      let itemBox = cc.find('bg/mapNew/item' + i, this.node);

      //是否解锁土地
      if (data[i].IsLock) {
        self.setWhetherIcon(itemBox, 1);
      } else {
        self.setWhetherIcon(itemBox, 2);
      }
    }
  },
  setWhetherIcon(dom, i) {
    if (!dom) {
      return;
    }
    let imgSrcArr = [];
    if (Config.weather == 1) {
      imgSrcArr[1] = 'Farm/itemG'; //草地
      imgSrcArr[2] = 'Farm/item'; //土地
      imgSrcArr[3] = 'Farm/extend'; //拓建
      imgSrcArr[4] = 'jpg/farmBg'; //农场背景
      imgSrcArr[5] = 'index/sun/cloud01'; //云1
      imgSrcArr[6] = 'index/sun/cloud02'; //云2
      imgSrcArr[7] = 'Farm/fengcheHome'; //风车
      imgSrcArr[8] = 'Farm/fengche'; //风车
      imgSrcArr[9] = 'Farm/itemdemo-xs'; //幼苗
      imgSrcArr[10] = 'Farm/itemdemo-md';
      imgSrcArr[11] = 'Farm/itemdemo-lg';
      imgSrcArr[12] = 'Farm/itemdemo-ok'; //成熟植物
      imgSrcArr[13] = 'Farm/mapNew';
    } else if (Config.weather == 0) {
      imgSrcArr[1] = 'Farm/itemG-wind';
      imgSrcArr[2] = 'Farm/item-wind';
      imgSrcArr[3] = 'Farm/extend-wind';
      imgSrcArr[4] = 'jpg/farmBg-wind';
      imgSrcArr[5] = 'index/cloud/cloud01';
      imgSrcArr[6] = 'index/cloud/cloud02';
      imgSrcArr[7] = 'Farm/fengcheHome-wind';
      imgSrcArr[8] = 'Farm/fengche-wind';
      imgSrcArr[9] = 'Farm/itemdemo-xs-wind';
      imgSrcArr[10] = 'Farm/itemdemo-md-wind';
      imgSrcArr[11] = 'Farm/itemdemo-lg-wind';
      imgSrcArr[12] = 'Farm/itemdemo-ok-wind';
      imgSrcArr[13] = 'Farm/mapNew-wind';
    } else if (Config.weather == -1) {
      imgSrcArr[1] = 'Farm/itemG-rain';
      imgSrcArr[2] = 'Farm/item-rain';
      imgSrcArr[3] = 'Farm/extend-rain';
      imgSrcArr[4] = 'jpg/farmBg-rain';
      imgSrcArr[5] = 'index/rain/cloud01';
      imgSrcArr[6] = 'index/rain/cloud02';
      imgSrcArr[7] = 'Farm/fengcheHome-rain';
      imgSrcArr[8] = 'Farm/fengche-rain';
      imgSrcArr[9] = 'Farm/itemdemo-xs-rain';
      imgSrcArr[10] = 'Farm/itemdemo-md-rain';
      imgSrcArr[11] = 'Farm/itemdemo-lg-rain';
      imgSrcArr[12] = 'Farm/itemdemo-ok-rain';
      imgSrcArr[13] = 'Farm/mapNew-rain';
    }
    cc.loader.loadRes(imgSrcArr[i], cc.SpriteFrame, (err, spriteFrame) => {
      dom.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
  },
  setLocData(data, all) {
    let self = this;
    if (all) {
      this.Value = {
        List: data,
        toolType: 0
      };
    }
    //不清除toolType工具id
    else {
      this.Value.List = data;
    }
    //缓存数据并加载植物
    cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.Value));
  },
  //缓存数据并刷新数据
  setLocalStorageData(data) {
    let self = this;
    this.Value = {
      List: data,
      toolType: 0
    };
    //缓存数据并加载植物
    cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.Value));
    if (self.Value.List !== null) {
      let newValueList = self.Value.List;
      self.fatchPlant(newValueList);
    }
  },

  //加载农作物
  fatchPlant(ValueList) {
    let self = this;
    for (let i = 0; i < ValueList.length; i++) {
      if (self.oldData !== null) {
        if (
          self.oldData[i].CropsIsFertilization !== ValueList[i].CropsIsFertilization ||
          self.oldData[i].CropsStatus !== ValueList[i].CropsStatus ||
          self.oldData[i].IsDisinsection !== ValueList[i].IsDisinsection ||
          self.oldData[i].IsDry !== ValueList[i].IsDry ||
          self.oldData[i].IsWeeds !== ValueList[i].IsWeeds ||
          self.oldData[i].IsLock !== ValueList[i].IsLock
        ) {
          console.log(i);
          self.upData(ValueList, i);
        }
      }
      if (self.oldData == null) {
        self.upData(ValueList, i);
      }
    }
    self.oldData = ValueList;
  },
  upData(ValueList, i) {
    let self = this;
    let bg = cc.find('bg', this.node);
    let Prefab = cc.instantiate(self.Item_Prefab);
    if (Prefab) {
      //浮动小提示dom
      let PrefabPlant_xs = cc.find('plant-xs', Prefab);
      let PrefabPlant_md = cc.find('plant-md', Prefab);
      let PrefabPlant_lg = cc.find('plant-lg', Prefab);
      let PrefabPlant_ok = cc.find('plant-ok', Prefab);
      let PrefabExtend = cc.find('extend', Prefab);
      let PrefabPlant_tip = cc.find('New Node/reap', Prefab);
      //天气图标变化
      self.setWhetherIcon(PrefabExtend, 3);
      self.setWhetherIcon(PrefabPlant_xs, 9);
      self.setWhetherIcon(PrefabPlant_md, 10);
      self.setWhetherIcon(PrefabPlant_lg, 11);
      self.setWhetherIcon(PrefabPlant_ok, 12);
      //初始化清空显示
      PrefabPlant_xs.active = false;
      PrefabPlant_md.active = false;
      PrefabPlant_lg.active = false;
      PrefabPlant_ok.active = false;
      PrefabExtend.active = false;
      PrefabPlant_tip.active = false;
      //提示图标的类型切换
      self.setTipType(ValueList[i], PrefabPlant_tip);
      let itemBox = cc.find('bg/mapNew/item' + i, this.node);
      let itemPos = itemBox.getPosition();
      let pos = itemBox.getNodeToWorldTransformAR(itemPos);
      if (ValueList[i].IsLock) {
        //拓展
        PrefabExtend.active = true;
        Tool.RunAction(PrefabExtend, 'fadeIn', 0.3);
      }
      if (ValueList[i].CropsStatus == 1) {
        //小树苗
        PrefabPlant_xs.active = true;
        Tool.RunAction(PrefabPlant_xs, 'fadeIn', 0.3);
      } else if (ValueList[i].CropsStatus == 2) {
        //中端
        PrefabPlant_md.active = true;
        Tool.RunAction(PrefabPlant_md, 'fadeIn', 0.3);
      } else if (ValueList[i].CropsStatus == 3) {
        //成熟
        PrefabPlant_lg.active = true;
        Tool.RunAction(PrefabPlant_lg, 'fadeIn', 0.3);
      } else if (ValueList[i].CropsStatus == 4) {
        //成熟
        PrefabPlant_ok.active = true;
        PrefabPlant_tip.active = true; //显示可收割
        Tool.RunAction(PrefabPlant_ok, 'fadeIn', 0.3);
        Tool.RunAction(PrefabPlant_tip, 'fadeIn', 0.3);
      }
      //重置名字赋值
      Prefab.name = 'Prefab' + i;
      //定位于碰撞事件触发的点
      Prefab.setPosition(pos.tx, pos.ty);
      bg.addChild(Prefab);
    }
  },
  //提示图标的类型切换
  setTipType(ValueList, obj) {
    //浇水tip
    if (ValueList.IsDry && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/water', cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
    //播种tip
    if (!ValueList.IsLock && ValueList.CropsStatus == 0) {
      cc.loader.loadRes('Farm/seed', cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
    //除草tip
    else if (ValueList.IsWeeds && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/weed', cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
    //除虫tip
    else if (ValueList.IsDisinsection && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/disinsection', cc.SpriteFrame, function(err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },
  //种子列表
  getSeed() {
    let self = this;
    let seedBox = cc.find('bg_farm', self.node);
    if (!seedBox.active) {
      seedBox.active = false;
      let theCount = 0;
      seedBox.removeAllChildren();
      Data.func.GetSeedList().then(data => {
        if (data.Code === 1) {
          for (let i = 0; i < data.List.length; i++) {
            theCount = theCount + data.List[i].Count;
            let prefab = cc.instantiate(self.ItemSeed_Prefab);
            let Img = cc.find('ymzz', prefab).getComponent(cc.Sprite);
            let ImgSrc;
            let Label = cc.find('label', prefab).getComponent(cc.Label);
            ImgSrc = 'Modal/Repertory/ymzz';
            Label.string = data.List[i].PropName + '×' + data.List[i].Count;
            self.addListenMove(1, prefab, data.List[i].PropertyID);
            cc.loader.loadRes(ImgSrc, cc.SpriteFrame, function(err, spriteFrame) {
              Img.spriteFrame = spriteFrame;
            });
            seedBox.addChild(prefab, 999);
          }
          if (theCount == 0) {
            Msg.show('请到商城购买种子！');
          }
          Tool.RunAction(seedBox, 'fadeIn', 0.3);
        } else {
          Msg.show('请到商城购买种子！');
        }
      });
    } else {
      seedBox.active = false;
      seedBox.removeAllChildren();
    }
  },
  //菜单按钮监听触摸
  getToolPositon() {
    let self = this;
    for (let i = 1; i < 7; i++) {
      let tool = cc.find('tool/layout/farm_icon_0' + i, this.node);
      if (i !== 1 && i !== 5) {
        this.addListenMove(i, tool);
      }
      if (i == 1) {
        tool.on('touchstart', function() {
          self.getSeed();
        });
      }
      if (i == 5) {
        tool.on('touchstart', function() {
          let seedBox = cc.find('bg_farm', self.node);
          if (!seedBox.active) {
            seedBox.active = false;
            let theCount = 0;
            seedBox.removeAllChildren();
            Data.func.GetFertilizerList().then(data => {
              if (data.Code === 1) {
                for (let i = 0; i < data.List.length; i++) {
                  let prefab = cc.instantiate(self.ItemSeed_Prefab);
                  let Img = cc.find('ymzz', prefab).getComponent(cc.Sprite);
                  let ImgSrc;
                  let Label = cc.find('label', prefab).getComponent(cc.Label);
                  if (data.List[i].PropName == '超级肥料') {
                    ImgSrc = 'Shop/cjfl_1';
                  } else {
                    ImgSrc = 'Shop/fertilizer';
                  }
                  Label.string = data.List[i].PropName + '×' + data.List[i].Count;
                  self.addListenMove(5, prefab, data.List[i].PropertyTypeID);
                  cc.loader.loadRes(ImgSrc, cc.SpriteFrame, function(err, spriteFrame) {
                    Img.spriteFrame = spriteFrame;
                  });
                  seedBox.addChild(prefab);
                }
                if (theCount == 0) {
                  Msg.show('请到商城购买肥料！');
                }
                Tool.RunAction(seedBox, 'fadeIn', 0.3);
              } else {
                Msg.show('请到商城购买肥料！');
              }
            });
          } else {
            seedBox.active = false;
            seedBox.removeAllChildren();
          }
        });
      }
    }
  },

  //添加触摸事件
  addListenMove(i, tool, otherId) {
    let self = this;

    let farmBox = cc.find('bg', this.node);
    let bg_farm = cc.find('bg_farm', this.node);
    tool.on('touchstart', function(e) {
      self.touchstart(i, e.getLocation().x - 50, e.getLocation().y + 120, otherId);
    });
    tool.on('touchmove', function(e) {
      self.touchmove(i, e.getLocation().x - 50, e.getLocation().y);
    });
    tool.on('touchend', function() {
      self.touchend(i);
    });
    tool.on('touchcancel', function() {
      self.touchcancel(i);
    });
  },
  touchstart(i, posX, posY, otherId) {
    let self = this;
    let bg_farm = cc.find('bg_farm', this.node);
    let farmBox = cc.find('bg', this.node);
    bg_farm.opacity = 0; //种子选择的浮窗
    self.Value.toolType = i;
    //播种时传入种子ID
    if (i == 1) {
      Config.propertyId = otherId;
    }
    //施肥时传入肥料类型
    else if (i == 5) {
      Config.fertilizerId = otherId;
    }
    if (self.Value.toolType != 0) {
      cc.sys.localStorage.setItem('FarmData', JSON.stringify(self.Value)); //缓存机制
      self.Prefab = cc.instantiate(self.Tool_Prefab);
      let Img = cc.find('tool', self.Prefab).getComponent(cc.Sprite);
      cc.loader.loadRes(self.imgSrcSelect(i), cc.SpriteFrame, function(err, spriteFrame) {
        Img.spriteFrame = spriteFrame;
      });
      self.Prefab;
      farmBox.addChild(self.Prefab, 9);
    }
  },
  touchmove(i, posX, posY) {
    let self = this;
    if (self.Value.toolType != 0) {
      self.Prefab.setPosition(posX, posY);
    }
  },
  touchend(i) {
    let self = this;
    let bg_farm = cc.find('bg_farm', this.node);
    if (self.Value.toolType != 0) {
      self.Prefab.removeFromParent();
    }
    bg_farm.active = false; //种子选择的浮窗
    bg_farm.opacity = 1;
    bg_farm.removeAllChildren();
  },
  touchcancel(i) {
    let self = this;
    let bg_farm = cc.find('bg_farm', this.node);
    if (self.Value.toolType != 0) {
      self.Prefab.removeFromParent();
    }
    bg_farm.active = false; //种子选择的浮窗
    bg_farm.opacity = 1;
    bg_farm.removeAllChildren();
  },

  //工具图片显示  浇水、除草、种子、镰刀
  imgSrcSelect(i) {
    var self = this;
    let src_ = '';

    switch (i) {
      case 1: {
        src_ = 'Farm/bozhong';
        break;
      }
      case 2: {
        src_ = 'Farm/jiaoshui';
        break;
      }
      case 3: {
        src_ = 'Farm/chucao';
        break;
      }
      case 4: {
        src_ = 'Farm/chuchong';
        break;
      }
      case 5: {
        src_ = 'Farm/zhongzi';
        break;
      }
      case 6: {
        src_ = 'Farm/liandao';
        break;
      }
    }
    return src_;
  },

  //清空植物
  clearAllDom(ValueList) {
    let self = this;
    let bg = cc.find('bg', this.node);
    for (let i = 0; i < 12; i++) {
      if (self.oldData !== null && ValueList[i].CropsID > 0) {
        if (
          self.oldData[i].CropsIsFertilization !== ValueList[i].CropsIsFertilization ||
          self.oldData[i].CropsStatus !== ValueList[i].CropsStatus ||
          self.oldData[i].IsDisinsection !== ValueList[i].IsDisinsection ||
          self.oldData[i].IsDry !== ValueList[i].IsDry ||
          self.oldData[i].IsWeeds !== ValueList[i].IsWeeds
        ) {
          console.log(i);
          let clearItem = cc.find('Prefab' + i, bg);
          if (clearItem) {
            clearItem.removeFromParent();
          }
        }
      }
      if (self.oldData == null) {
        let clearItem = cc.find('Prefab' + i, bg);
        if (clearItem) {
          clearItem.removeFromParent();
        }
      }
    }
  },

  gotoMuChange: function() {
    cc.director.loadScene('index');
  },

  start() {},
  addPersist() {
    Config.backIndexUrl = 'farm';
    if (Config.menuNode) {
      Config.menuNode.active = true;
      Config.hearderNode.active = true;
    }
  },
  update(dt) {
    // this.fatchData();
  }
});
