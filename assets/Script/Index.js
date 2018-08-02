//Chick.js

// 节点不带_   私有变量_

var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
var utils = require('utils');
var Tool = ToolJs.Tool;

cc.Class({
  extends: cc.Component,

  properties: {
    //Chick 节点 Node
    Chick: {
      default: null,
      type: cc.Node
    },

    treatIcon: cc.SpriteFrame,
    clearIcon: cc.SpriteFrame,
    feedIcon: cc.SpriteFrame
    //仓库跳转后执行相应操作
  },

  init: function() {
    this.eggNode = cc.find('bg/house/shouquEgg', this.node);
    this.houseNode = cc.find('bg/house', this.node);

    this.eggMoreNode = cc.find('eggMore', this.node);
    this.eggCountLabel = cc.find('count', this.eggMoreNode).getComponent(cc.Label);
    //天气
    this.wether = this.node.getChildByName('div_wether');
    //饲料数量
    this.feedCountLabel = cc.find('div_action/feed/icon-tip/count', this.node).getComponent(cc.Label);
    // var chickState = new Chick();
    this.scene = cc.find('Canvas');
    //星星 盒子
    this.starsBox = cc.find('bg/starsBox', this.node);
    this.moon = cc.find('bg/moon', this.node);
    //新手指引step
    this.step = 0;
    this.speakType = 1;
    this.shitBoxNode = cc.find('shit-box', this.node);
    this.ranchRankNode = cc.find('ranch-rank', this.node);

    this.hatchBoxNode = cc.find('hatch-box', this.node);
    this.bgNode = cc.find('bg', this.node);
    this.cloud1Node = cc.find('cloud01', this.bgNode);
    this.cloud2Node = cc.find('cloud02', this.bgNode);
    //风车
    this.windmillNode = cc.find('windmill', this.bgNode);
    this.flabellumNode = cc.find('flabellum', this.windmillNode);

    this.chickList = [];
    let canvas = cc.find('Canvas');
    Tool.RunAction(canvas, 'fadeIn', 0.3);
  },
  //用户头像
  setHeadImg(dom) {
    if (Config.headImg !== '') {
      cc.loader.load({ url: Config.headImg, type: 'png' }, function(err, texture) {
        var frame = new cc.SpriteFrame(texture);
        dom.getComponent(cc.Sprite).spriteFrame = frame;
      });
    }
  },
  initData(data) {
    //新手指引
    let self = this;
    Config.firstLogin = !data.UserModel.IsFinishGuid;
    Config.guideStep = data.UserModel.GuidStep;
    Config.headImg = data.UserModel.Headimgurl;
    Config.UserModel = data.UserModel;
    Config.UserData = data;
    //用户头像
    let headImg = cc.find('div_header/advisor/advisor', this.node.parent);

    this.setHeadImg(headImg);

    //名称
    document.title = `${data.UserModel.RealName}的牧场`;
    Config.realName = data.UserModel.RealName;
    //产蛋棚等级
    let eggsShedRank = data.EggsShed.ShedRank;
    let RanchRank = data.RanchModel.RanchRank;
    this.eggsShedRank = eggsShedRank;
    this.RanchRank = RanchRank;

    //初始化饲料tip的数量
    this.feedCountLabel.string = data.UserModel.Allfeed == null ? 0 : data.UserModel.Allfeed;

    //初始化产蛋棚是否显示鸡蛋
    this.eggNode.active = data.EggsShed.EggCount > 0 ? true : false;
    if (data.EggsShed.IsGoldEgg) {
      cc.loader.loadRes('index/goldegg', cc.SpriteFrame, (err, spriteFrame) => {
        this.eggNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    }
    //初始化牧场是否显示鸡蛋
    this.eggMoreNode.active = data.RanchModel.EggCount > 0 ? true : false;
    this.eggCountLabel.string = `x${data.RanchModel.EggCount}`;
    let upOrDown = true;
    this.schedule(() => {
      let action = upOrDown ? cc.moveBy(0.5, 0, 20) : cc.moveBy(0.5, 0, -20);
      this.eggNode.runAction(action);
      upOrDown = !upOrDown;
    }, 0.5);
    // 初始化 粪便
    for (let i = 0; i < data.RanchModel.FaecesCount; i++) {
      cc.loader.loadRes('Prefab/Index/shit', cc.Prefab, (err, prefab) => {
        let shitNode = cc.instantiate(prefab);
        shitNode.setPosition(Tool.random(0, 400), Tool.random(0, 200));
        this.shitBoxNode.addChild(shitNode);
      });
    }

    //初始化 机器人是否显示
    this.botNode = cc.find('bot', this.node);
    this.botNode.active = data.RanchModel.IsHasCleaningMachine;
    // 初始化跳动的箭头
    // Func.GetFeedTroughFull().then(data => {
    //   if (data.Code === 1) {
    //     this.arrowNode.active = !data.Model;
    //   }
    // });

    this.updateWeatherBox();
    this.updateWeather();
    this.initChick();
    this.initEggShed(eggsShedRank);
    // this.initChickenLayEggTimeFirst();
    this.GetRanchPeopleShowMessage();
    //socket监听

    Config.newSocket.onmessage = function(evt) {
      var obj = eval('(' + evt.data + ')');
      if (obj.name == Func.openID && obj.type == 'updataChat') {
        setTimeout(function() {
          self.GetRanchPeopleShowMessage();
          self.farmSpeak();
          console.log('updataChat');
        }, 1000);
      } else if (obj.name == Func.openID && obj.type == 'friend') {
        self.div_Menu = cc.find('div_menu');
        setTimeout(function() {
          self.div_Menu.emit('upDataFriend', {
            data: ''
          });
        }, 1000);
      } else if (obj.name == Func.openID && obj.type == 'updateEggCount') {
        self.eggNode.active = false;
      }
    };
    // self.schedule(function() {
    //   self.initChickenLayEggTimeFirst();
    // }, 60);

    // self.schedule(function() {
    //   if (this.speakList.length !== 1) {
    //     self.farmSpeak();
    //   }
    // }, 5);
  },
  //只运行一次
  initChick() {
    let self = this;
    //获取正常的鸡
    Func.GetChickList(1).then(data => {
      if (data.Code == 1) {
        //初始化鸡是否显示
        let length = data.List.length;

        //调用setId接口 给鸡传Id 默认最后那只鸡
        for (let i = 0; i < length; i++) {
          let element = data.List[i];

          // cc.loader.loadRes('Prefab/Chick', cc.Prefab, (err, prefab) => {
          var chickNode = cc.find(`Chick${i}`, this.node);
          chickNode.active = true;
          chickNode.setPosition(250 - Math.random() * 500, Math.random() * -250 - 200);
          let feedNode = cc.find('feed', chickNode);
          feedNode.active = element.IsHunger;
          // this.scene.addChild(chickNode);
          this.chickJs = chickNode.getComponent('Chick');
          this.chickJs.setId(data.List[i].ID);
          Config.chickID = data.List[i].ID;
          this.chickJs._status = data.List[i].Status;

          this.chickList.push(chickNode);
          // });
        }
      } else {
        !Config.firstLogin ? Msg.show('您的牧场暂无小鸡') : false;
      }
    });
  },
  setChickPositionX(i) {
    if (i > 4) {
      return (i - 4) * 100 - 350;
    } else {
      return (i + 1) * 100 - 350;
    }
  },
  setChickPositionY(i) {
    if (i > 4) {
      return -450;
    } else {
      return -300;
    }
  },
  //收取牧场鸡蛋
  collectRanchEgg() {
    clearTimeout(this.timers); //清理定时器
    Func.CollectRanchEgg().then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggMoreNode.active = false;
          }, this)
        );
        this.eggMoreNode.runAction(action);
        self.timers = setTimeout(function() {
          Msg.show(data.Message);
        }, 1000);
      } else {
        Msg.show(data.Message);
      }
    });
  },

  //点击清理事件
  showClearAlert: function() {
    var self = this;
    //调用接口
    Func.PostClean()
      .then(data => {
        if (data.Code === 1) {
          //清洁动画
          let str = "{name:'" + Config.openID + "',type:'updataChat'}";
          Config.newSocket.send(str);
          Msg.show(data.Message);
          self.animates();
          this.shitBoxNode.removeAllChildren();
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show('failed:' + reason);
      });
  },
  //点击喂食事件 集体喂食 接口需要重新设置
  showFeedAlert: function() {
    Func.PostOwnFeeds().then(data => {
      if (data.Code === 1) {
        //更新饲料数量
        this.updateFeedCount();
        // 更新小鸡头顶饥饿状态
        this.updateChickList();
        let str = "{name:'" + Config.openID + "',type:'updataChat'}";
        Config.newSocket.send(str);
        Msg.show('喂食成功');
      } else if (data.Code == -2) {
        Alert.show(data.Message, this.loadSceneShop, 'index/icon-feed', '剩余的饲料不足');
      } else if (data.Code == 2) {
        Msg.show(data.Message);
      }
    });
  },
  //更新小鸡饥饿显示状态
  updateChickList() {
    setTimeout(() => {
      Func.GetChickList(1).then(data => {
        if (data.Code === 1) {
          let list = data.List;
          for (let i = 0; i < list.length; i++) {
            let chickNode = cc.find(`Chick${i}`, this.node);
            let chickJs = chickNode.getComponent('Chick');
            let feedNode = cc.find('feed', chickNode);
            if (list[i].ID === chickJs.cId) {
              feedNode.active = list[i].IsHunger;
            }
          }
        } else {
        }
      });
    }, 500);
  },
  //将饲料放入饲料槽中
  addFeed() {
    if (!Config.firstLogin) {
      Func.AddFeed().then(data => {
        if (data.Code === 1) {
          Msg.show(data.Message);
        } else {
          Msg.show(data.Message);
        }
      });
    }
  },

  //显示牧场升级弹出框
  showRanchUpgrade() {
    this.houseStateNode = cc.find('bg/ranch-grade/houseState', this.node);
    Func.GetRanchUpGradeMoney().then(data => {
      if (data.Code === 1) {
        let length = data.List.length || 0;
        let button0 = cc.find('button0', this.houseStateNode);
        let button1 = cc.find('button1', this.houseStateNode);
        for (let i = 0; i < length; i++) {
          if (data.List[i].Type === 0) {
            button0.active = true;
            this.upgradeByPointInfo = data.List[i];
          } else {
            button1.active = true;
            this.upgradeByMoneyInfo = data.List[i];
          }
        }
      } else if (data.Code === 2) {
        this.upgradeByPointInfo.RanchGrade = 'S';
        this.upgradeByMoneyInfo.RanchGrade = 'S';
      } else {
        Msg.show(data.Message);
        return;
      }
      clearTimeout(this.timer3);
      this.houseStateNode.active = true;
      this.houseStateNode.opacity = 0;
      this.houseStateNode.runAction(cc.fadeIn(0.3));

      var action = cc.sequence(
        cc.fadeOut(0.3),
        cc.callFunc(() => {
          this.houseStateNode.active = false;
        }, this)
      );
      this.timer3 = setTimeout(() => {
        this.houseStateNode.runAction(action);
        // this.houseStateNode.active = false;
      }, 2000);
    });
  },
  //积分升级牧场
  upgradeByPoint() {
    if (this.upgradeByPointInfo.RanchGrade === 'S') {
      Msg.show('已经升到满级');
    } else {
      Alert.show(
        '是否使用' + this.upgradeByPointInfo.Money + '积分将牧场升级到' + this.upgradeByPointInfo.RanchGrade + '级',
        () => {
          this.upgradeHouse(this.upgradeByPointInfo.Type);
          // this.updateMoney();
        },
        null,
        '升级'
      );
    }
  },
  // 牧场币升级牧场
  upgradeByMoney() {
    if (this.upgradeByPointInfo.RanchGrade === 'S') {
      Msg.show('已经升到满级');
    } else {
      Alert.show(
        '是否使用' + this.upgradeByMoneyInfo.Money + '个牧场币将牧场升级到' + this.upgradeByMoneyInfo.RanchGrade + '级',
        () => {
          this.upgradeHouse(this.upgradeByMoneyInfo.Type);
          // this.updateMoney();
        },
        null,
        '升级'
      );
    }
  },
  // 升级牧场操作
  upgradeHouse(payType) {
    Func.UpgradeHouse(payType).then(data => {
      if (data.Code === 1) {
        switch (data.Model) {
          case 'B':
            this.ranchGradeNode.getComponent(cc.Label).string = '二级牧场';
            break;
          case 'A':
            this.ranchGradeNode.getComponent(cc.Label).string = '三级牧场';
            break;
        }
      }
    });
  },
  //老爷爷话术
  GetRanchPeopleShowMessage() {
    Func.GetRanchPeopleShowMessage().then(data => {
      if (data.Code === 1) {
        console.log(data);
        this.speakList = ['欢迎来到璞心农业虚拟农场！点我可查看提示哦！'];
        if (data.Model.ChickenGrow) {
          let spaak = '亲，你认养的贵妃鸡已经到达了自然生长周期，停止产蛋。目前它正在兑换商城中等待亲兑换哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.ChickenSatiation) {
          let spaak = '亲，快给贵妃鸡喂食吧！保证它们肚子饱饱，是首要任务哦！不要影响它们正常产蛋哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.EggBad) {
          let spaak = '亲，你有鸡蛋由于在产蛋棚中存放超过72小时，已经变质。亲，产蛋棚中的鸡蛋要及时收取哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.FeedTroughCount) {
          let spaak = '亲，饲料槽中饲料即将耗尽，请及时补充哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.LayEggShedSlot) {
          let spaak = '亲，你产蛋棚中的鸡蛋存放数量即将超限，请你及时收取哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.LayEggShedSteal) {
          let spaak = '亲，你的产蛋棚中鸡蛋被好友偷取了哦。亲，产蛋棚中的鸡蛋要及时收取哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.RanchSteal) {
          let spaak = '';
          this.speakList.push(spaak);
        }
        if (data.Model.CanCollectEgg) {
          let spaak = '亲，产蛋棚中还有鸡蛋没有收取哦！及时收蛋，防变质防被盗！';
          this.speakList.push(spaak);
        }
        if (data.Model.Weeds) {
          let spaak = '亲，你的土地中长出了杂草，请及时锄草，保证作物正常生长哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.Dry) {
          let spaak = '亲，你的土地出现了干涸，请及时浇水，保证作物正常生长哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.Disinsection) {
          let spaak = '亲，你的作物上生出了害虫，请及时除虫，保证作物正常生长哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.Reap) {
          let spaak = '亲，农场中还有作物没有收割哦！及时收割，以防好友来光顾哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.CanFeed) {
          let spaak = '亲，仓库中有成熟的玉米，可以用来制作饲料哦！';
          this.speakList.push(spaak);
        }
        if (data.Model.CanFertilizer) {
          let spaak = '亲，仓库中有清洁所得的粪便，可以用来制作农场肥料哦！';
          this.speakList.push(spaak);
        }
        console.log(this.speakList);
      } else {
        this.speakList = ['亲，您的牧场很健康哦，快去休息吧！~'];
      }
    });
  },
  //初始化产蛋时间
  initChickenLayEggTimeFirst() {
    Func.ChickenLayEggTimeFirst().then(res => {
      if (res.Code == 1) {
        let barTimeMask = cc.find('bg/house/barTime/progressBar/maskBar', this.node);
        let barTimeBar = cc.find('bg/house/barTime/progressBar', this.node).getComponent(cc.ProgressBar);
        let barTimetext = cc.find('bg/house/barTime/label', this.node).getComponent(cc.Label);
        let endDate = Date.parse(new Date(res.Time));
        let nowDate = Date.parse(new Date());
        let time = utils.fn.timeDiff(nowDate, endDate);
        console.log(time);
        barTimeBar.progress = 1 - (time.days * 24 + time.hours + time.mins / 60) / Number(res.TotalHours);
        barTimetext.string = `距下次产蛋需${time.days * 24 + time.hours}小时${time.mins}分`;
        barTimeMask.active = true;
      }
    });
  },

  //初始化产蛋棚图片 （未加入到init中，后台没有数据）
  initEggShed(rank) {
    if (Config.weather === -1) {
      this.setIcon('index/rain/house_3', this.houseNode.getComponent(cc.Sprite));
    } else if (Config.weather === 0) {
      this.setIcon('index/cloud/house_3', this.houseNode.getComponent(cc.Sprite));
    } else if (Config.weather === 1) {
      this.setIcon('index/sun/house_3', this.houseNode.getComponent(cc.Sprite));
    }
  },
  //更新 饲料tip的数量
  updateFeedCount(isAddByBox, count) {
    let self = this;
    //是否马上刷新是否存在数据时间差
    if (!isAddByBox) {
      Func.GetFeedCount().then(data => {
        if (data.Code === 1) {
          self.feedCountLabel.string = data.Model;
        } else {
          Msg.show(data.Message);
        }
      });
    } else {
      setTimeout(function() {
        self.feedCountLabel.string = count;
      }, 500);
    }
  },
  //更新天气box数据
  updateWeatherBox() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find('soiltem', this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find('div/date', this.wether).getComponent(cc.Label);

      let time = res.data.weatherdata[0].intime.split(' ');
      let date = time[0].split('-');
      wetherItem1.string = res.data.weatherdata[0].tem + '℃';
      wetherItem2.string = date[1] + '月' + date[2] + '日';
    });
  },
  //根据天气情况 判断牧场的背景

  updateWeather() {
    let self = this;
    let rainNode = cc.find('ParticleRain', this.node);
    let myDate = new Date();
    let wetherIcon = cc.find('div/icon', this.wether).getComponent(cc.Sprite);
    if (Config.weather === -1) {
      //下雨
      if (this.RanchRank == 1) {
        this.setIcon('jpg/rain-bg1', this.bgNode.getComponent(cc.Sprite));
      } else if (this.RanchRank == 2) {
        this.setIcon('jpg/rain-bg2', this.bgNode.getComponent(cc.Sprite));
      } else if (this.RanchRank == 3) {
        this.setIcon('jpg/rain-bg3', this.bgNode.getComponent(cc.Sprite));
      }
      //图标

      this.setIcon('weather/rain', wetherIcon);
      //云
      this.setIcon('index/rain/cloud01', this.cloud1Node.getComponent(cc.Sprite));
      this.setIcon('index/rain/cloud02', this.cloud2Node.getComponent(cc.Sprite));
      //食盆
      this.setIcon('index/rain/hatchBox', this.hatchBoxNode.getComponent(cc.Sprite));
      //风车
      this.setIcon('index/rain/windmill', this.windmillNode.getComponent(cc.Sprite));
      this.setIcon('index/rain/flabellum', this.flabellumNode.getComponent(cc.Sprite));
      rainNode.active = true;
    } else if (Config.weather === 0) {
      //阴天
      if (this.RanchRank == 1) {
        this.setIcon('jpg/cloud-bg1', this.bgNode.getComponent(cc.Sprite));
      } else if (this.RanchRank == 2) {
        this.setIcon('jpg/cloud-bg2', this.bgNode.getComponent(cc.Sprite));
      } else if (this.RanchRank == 3) {
        this.setIcon('jpg/cloud-bg3', this.bgNode.getComponent(cc.Sprite));
      }
      this.setIcon('weather/overcast', wetherIcon);
      //云
      this.setIcon('index/cloud/cloud01', this.cloud1Node.getComponent(cc.Sprite));
      this.setIcon('index/cloud/cloud02', this.cloud2Node.getComponent(cc.Sprite));
      //食盆
      this.setIcon('index/cloud/hatchBox', this.hatchBoxNode.getComponent(cc.Sprite));
      //风车
      this.setIcon('index/cloud/windmill', this.windmillNode.getComponent(cc.Sprite));
      this.setIcon('index/cloud/flabellum', this.flabellumNode.getComponent(cc.Sprite));
      rainNode.active = false;
    } else if (Config.weather === 1) {
      if (myDate.getHours() > 18) {
        this.moon.active = true;
        this.setIcon('jpg/night', this.bgNode.getComponent(cc.Sprite));

        this.setIcon('weather/rain', wetherIcon);
        //云
        this.setIcon('index/rain/cloud01', this.cloud1Node.getComponent(cc.Sprite));
        this.setIcon('index/rain/cloud02', this.cloud2Node.getComponent(cc.Sprite));
        //食盆
        this.setIcon('index/rain/hatchBox', this.hatchBoxNode.getComponent(cc.Sprite));
        //风车
        this.setIcon('index/rain/windmill', this.windmillNode.getComponent(cc.Sprite));
        this.setIcon('index/rain/flabellum', this.flabellumNode.getComponent(cc.Sprite));
        //星星
        for (let i = 0; i < 6; i++) {
          if (self.starsBox) {
            cc.loader.loadRes('Prefab/stars', cc.Prefab, (err, prefab) => {
              let box = cc.find('Canvas');
              let shitNode = cc.instantiate(prefab);
              shitNode.setPosition(Tool.random(20, 730), Tool.random(20, 330));
              setTimeout(function() {
                self.starsBox.addChild(shitNode);
              }, Math.random() * 3000);
            });
          }
        }
      } else {
        if (this.RanchRank == 1) {
          this.setIcon('jpg/sun-bg1', this.bgNode.getComponent(cc.Sprite));
        } else if (this.RanchRank == 2) {
          this.setIcon('jpg/sun-bg2', this.bgNode.getComponent(cc.Sprite));
        } else if (this.RanchRank == 3) {
          this.setIcon('jpg/sun-bg3', this.bgNode.getComponent(cc.Sprite));
        }

        this.setIcon('weather/sun', wetherIcon);
        //云
        this.setIcon('index/sun/cloud01', this.cloud1Node.getComponent(cc.Sprite));
        this.setIcon('index/sun/cloud02', this.cloud2Node.getComponent(cc.Sprite));
        //食盆
        this.setIcon('index/sun/hatchBox', this.hatchBoxNode.getComponent(cc.Sprite));
        //风车
        this.setIcon('index/sun/windmill', this.windmillNode.getComponent(cc.Sprite));
        this.setIcon('index/sun/flabellum', this.flabellumNode.getComponent(cc.Sprite));
        rainNode.active = false;
      }
    }
  },
  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene('weatherInfo');
    this.removePersist();
  },
  showUserCenter: function() {
    cc.director.loadScene('UserCenter/userCenter');
    this.removePersist();
  },
  btnHelpCenter() {
    cc.director.loadScene('Help');
    this.removePersist();
  },
  loadSceneRepertory() {
    cc.director.loadScene('repertory');
    this.removePersist();
  },
  loadSceneFarm() {
    cc.director.loadScene('Farm/farm');
  },

  onLoad: function() {
    let self = this;
    var openID = window.location.href.split('=')[1];
    window.Config.openID = openID || 'oEHZa0xT2_SpPtdFpzU5nr7v0HxA';
    Func.openID = window.Config.openID;
    Config.newSocket = new WebSocket('ws://service.linedin.cn:5530/');
    cc.director.setDisplayStats(false);
    Config.backArr = ['index'];
    this.func = {
      showMenu: this.showMenu,
      loadSceneShop: this.loadSceneShop,
      loadSceneRepertory: this.loadSceneRepertory,
      initEggShed: this.initEggShed,
      showFeedState: this.showFeedState,
      addFeed: this.addFeed,
      loadSceneFarm: this.loadSceneFarm,
      updateFeedCount: this.updateFeedCount
    };

    this.node.on('updataFeedCount', function(event) {
      let count = event.detail.data;
      self.updateFeedCount(1, count);
    });
    this.addPersist();
    this.preloadScene();
    this.updataMoney();
  },
  updataMoney() {
    let self = this;
    self.div_header = cc.find('div_header');
    self.div_header.emit('upDataMoney', {
      data: ''
    });
  },
  preloadScene() {
    cc.director.preloadScene('farm', function() {
      console.log('Next scene farm');
    });
    cc.director.preloadScene('userCenter', function() {
      console.log('Next scene userCenter');
    });
  },
  start: function() {
    this.init();
    // this.chickFunc = this._chick.chickFunc;
    Func.GetWholeData().then(data => {
      if (data.Code === 1) {
        // GuideSystem.guide();
        this.initData(data);
        // 新手指引
        if (Config.firstLogin) GuideSystem.guide();
        //仓库回调

        this.repertoryCallBack();
      } else {
        console.log('首页数据加载失败');
      }
    });
  },
  animates() {
    cc.loader.loadRes('Prefab/Modal/House', cc.Prefab, function(error, prefab) {
      if (error) {
        cc.error(error);
        return;
      }
      let box = cc.find('Canvas');
      // 实例
      var alert = cc.instantiate(prefab);
      alert.setPosition(390, 300);
      box.parent.addChild(alert);
    });
  },
  loadAnimates() {
    cc.loader.loadRes('Prefab/Modal/load', cc.Prefab, function(error, prefab) {
      if (error) {
        cc.error(error);
        return;
      }
      let box = cc.find('Canvas');
      // 实例
      var alert = cc.instantiate(prefab);
      box.parent.addChild(alert);
    });
  },
  //仓库回调函数（0表示孵化操作）
  repertoryCallBack() {
    if (this.operate != null) {
      switch (this.operate) {
        case 0:
          this.hatchEgg();
          break;
        case 1:
          this.addFeed();
          break;
      }
      this.operate = -1;
    }
  },
  removePersist() {
    Config.menuNode.active = false;
    Config.hearderNode.active = false;
  },
  addPersist() {
    if (Config.menuNode) {
      Config.menuNode.active = true;
      Config.hearderNode.active = true;
    }
  },
  setIcon(src, dom, getCom) {
    cc.loader.loadRes(src, cc.SpriteFrame, (err, spriteFrame) => {
      dom.spriteFrame = spriteFrame;
    });
  },
  farmSpeak() {
    let showNode = cc.find('farmer/farmer-text', this.node);
    let showNodeText = cc.find('farmer/farmer-text/text', this.node).getComponent(cc.Label);
    if (this.speakList.length == 1) {
      this.speakType = 0;
    }
    showNodeText.string = this.speakList[this.speakType];
    this.speakType++;
    if (this.speakType >= this.speakList.length) {
      this.speakType = 0;
    }

    // clearTimeout(timer);
    showNode.active = true;
    showNode.opacity = 0;
    showNode.runAction(cc.fadeIn(0.5));
    var action = cc.sequence(
      cc.fadeOut(0.5),
      cc.callFunc(() => {
        showNode.active = false;
      }, this)
    );

    // let timer = setTimeout(() => {
    //   showNode.runAction(action);
    // }, 5000);
  }

  //update(dt) {}
});
