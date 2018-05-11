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
    //设置好友农场名称
    let nameLabel = cc.find('name', this.node).getComponent(cc.Label);
    nameLabel.string = `${Config.friendName}的农场`;


    var self = this;
    //好友农场的好友ID
    self.getHearder(Config.friendOpenId);
    self.getWhether();
    //初始化加载数据
    self.fatchData();

    self.schedule(function () {
      self.onlyUpdataPlant();
      console.warn('60秒刷新一波');
    }, 60);
    //初始加载工具栏
    this.getToolPositon();
    Tool.RunAction(cc.find('Canvas'), 'fadeIn', 0.3);

    //更新于植物状态变动
    this.node.on('updataPlant', function (event) {
      let List = event.detail.data;
      self.clearAllDom(); //清除植物数据
      self.setLocData(List);
      self.fatchPlant(List); //重新加载植物
    });
  },
  getHearder(friendOpenID) {
    let self = this;
    //经验值
    Data.func.GetWholeData(friendOpenID).then(data => {
      if (data.Code === 1) {
        self.level = cc.find('div_header/Lv/level', self.node).getComponent(cc.Label);
        self.level.string = 'LV.' + data.UserModel.Grade;
        self.levelProgressBar = cc.find('div_header/Lv/lv_bar', self.node).getComponent(cc.ProgressBar);
        self.levelProgressBar.progress = data.UserModel.ExperienceValue / data.UserModel.GradeExperienceValue;
      } else {
        console.log('数据加载失败');
      }
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
    self.clearAllDom(); //清除植物数据
    Data.func.getFarmModalData(Config.friendOpenId).then(data => {
      if (data.Code === 1) {
        //土地渲染
        self.setLandOption(data.Model); //重新加载土地
      }
      self.setLocData(data.Model, 'all');
      self.setLocalStorageData(data.Model); //重新加载土地（包括植物）
    });
  },
  //仅仅 更新 植物状态
  onlyUpdataPlant() {
    var self = this;
    self.clearAllDom(); //清除植物数据
    //获取所有数据
    Data.func.getFarmModalData(Config.friendOpenId).then(data => {
      if (data.Code === 1) {
        //土地渲染
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
      imgSrcArr[4] = 'Farm/farmBg'; //农场背景
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
      imgSrcArr[4] = 'Farm/farmBg-wind';
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
      imgSrcArr[4] = 'Farm/farmBg-rain';
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
    console.log(data);
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
    console.log(data);
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
    var self = this;
    for (let i = 0; i < ValueList.length; i++) {
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
    }
  },

  //提示图标的类型切换
  setTipType(ValueList, obj) {
    //浇水tip
    if (ValueList.IsDry && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/water', cc.SpriteFrame, function (err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
    //除草tip
    else if (ValueList.IsWeeds && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/weed', cc.SpriteFrame, function (err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
    //除虫tip
    else if (ValueList.IsDisinsection && ValueList.CropsStatus != 0) {
      cc.loader.loadRes('Farm/disinsection', cc.SpriteFrame, function (err, spriteFrame) {
        obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      obj.active = true;
    }
  },

  //菜单按钮监听触摸
  getToolPositon() {
    let self = this;
    for (let i = 1; i < 7; i++) {
      if (i == 2 || i == 3 || i == 4) {
        let tool = cc.find('tool/layout/farm_icon_0' + i, this.node);
        this.addListenMove(i, tool);
      } else if (i == 6) {
        //偷取好友农作物
        let tool = cc.find('tool/layout/farm_icon_0' + i, this.node);
        tool.on('click', function (e) {
          Data.func.FriendsStealCrops(Config.friendOpenId).then(data => {
            if (data.Code === 1) {
              self.CollectNumber = data.Model;
              setTimeout(function () {
                Msg.show('偷取 × ' + self.CollectNumber);
                self.CollectNumber = 0;
                Data.func.getFarmModalData(Config.friendOpenId).then(data2 => {
                  self.clearAllDom(); //清除植物数据
                  self.setLocData(data2.Model);
                  self.fatchPlant(data2.Model); //重新加载植物
                });
              }, 500);
            } else {
              Msg.show(data.Message);
            }
          });
        });
      }
    }
  },

  //添加触摸事件
  addListenMove(i, tool, otherId) {
    let self = this;

    let farmBox = cc.find('bg', this.node);
    let bg_farm = cc.find('bg_farm', this.node);
    tool.on('touchstart', function (e) {
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
        cc.loader.loadRes(self.imgSrcSelect(i), cc.SpriteFrame, function (err, spriteFrame) {
          Img.spriteFrame = spriteFrame;
        });
        self.Prefab.setPosition(e.getLocation().x - 50, e.getLocation().y + 120);
        farmBox.addChild(self.Prefab, 9);
      }
    });
    tool.on('touchmove', function (e) {
      if (self.Value.toolType != 0) {
        self.Prefab.setPosition(e.getLocation().x - 50, e.getLocation().y + 120);
      }
    });
    tool.on('touchend', function () {
      if (self.Value.toolType != 0) {
        self.Prefab.removeFromParent();
      }
      bg_farm.active = false; //种子选择的浮窗
      bg_farm.opacity = 1;
      bg_farm.removeAllChildren();
    });
    tool.on('touchcancel', function () {
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
    let src_ = '';

    switch (i) {
      case 1:
        {
          src_ = 'Farm/bozhong';
          break;
        }
      case 2:
        {
          src_ = 'Farm/jiaoshui';
          break;
        }
      case 3:
        {
          src_ = 'Farm/chucao';
          break;
        }
      case 4:
        {
          src_ = 'Farm/chuchong';
          break;
        }
      case 5:
        {
          src_ = 'Farm/zhongzi';
          break;
        }
      case 6:
        {
          src_ = 'Farm/liandao';
          break;
        }
    }
    return src_;
  },

  //清空植物
  clearAllDom() {
    let bg = cc.find('bg', this.node);
    for (let i = 0; i < 12; i++) {
      let clearItem = cc.find('Prefab' + i, bg);
      if (clearItem) {
        clearItem.removeFromParent();
      }
    }
  },

  gotoMuChange: function () {
    let self = this;
    cc.director.loadScene('FriendIndex', this.onLoadFadeIn);
  },
  back: function () {
    cc.director.loadScene(Config.backIndexUrl, this.onLoadFadeIn);


  },
  onLoadFadeIn() {
    let canvas = cc.find('Canvas');
    Tool.RunAction(canvas, 'fadeIn', 0.15);
  },
  start() {},

  update(dt) {
    // this.fatchData();
  }
});