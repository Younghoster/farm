//Chick.js

// 节点不带_   私有变量_

var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
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
  //Chick.js
  chickJs: null,
  operate: null,
  _clearValue: null,
  clearLabel: null,
  //菜单 半透明背景 Modal_more
  chickFunc: null,
  //清理和喂食动画的节点
  handNode: null,
  handAnim: null,
  _signState: null,
  //点击显示小鸡状态的timer
  timer: null,
  //点击显示饲料槽的timer
  timer2: null,
  //房屋升级状态的timer
  timer3: null,
  feedStateNode: null,
  wether: null,
  arrowNode: null,
  eggNode: null,
  chickList: null,
  //产蛋棚等级
  eggsShedRank: null,
  // 牧场等级
  RanchRank: null,

  init: function() {
    this.handNode = cc.find('Hand', this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.arrowNode = this.node.getChildByName('icon-arrow');
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

    //新手指引step
    this.step = 0;

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
    Func.GetFeedTroughFull().then(data => {
      if (data.Code === 1) {
        this.arrowNode.active = !data.Model;
      }
    });

    this.updateWeatherBox();
    this.updateWeather().then(() => {
      this.initChick();
      this.initEggShed(eggsShedRank);
      this.initRanchGrade(RanchRank);
    });
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

          chickNode.setPosition(self.setChickPositionX(i), self.setChickPositionY(i));
          let feedNode = cc.find('feed', chickNode);
          feedNode.active = element.IsHunger;
          // this.scene.addChild(chickNode);
          this.chickJs = chickNode.getComponent('Chick');
          this.chickJs.setId(data.List[i].ID);
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
    Func.CollectRanchEgg().then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggMoreNode.active = false;
          }, this)
        );
        this.eggMoreNode.runAction(action);
        Msg.show('收取成功');
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
          this.handNode.active = true;
          this.handAnim.play('hand_clear');

          this.handAnim.on('finished', () => {
            this.handNode.active = false;
            this.shitBoxNode.removeAllChildren();
          });
          // this.handAnim.on("finished", this.chickFunc.initData, this._chick);
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
  },
  //将饲料放入饲料槽中
  addFeed() {
    if (!Config.firstLogin) {
      Func.AddFeed().then(data => {
        if (data.Code === 1) {
          let array = data.Model.split(',');
          let value = array[0];
          let capacity = array[1];
          this.assignFeedState(value, capacity);
          this.updateFeedCount();
          //动画
          let handFeedNode = cc.find('hand_feed', this.node);
          handFeedNode.active = true;
          let hanfFeedAnim = handFeedNode.getComponent(cc.Animation);
          hanfFeedAnim.play('hand_feed');
          hanfFeedAnim.on('finished', () => {
            handFeedNode.active = false;
            this.arrowNode.active = false;
          });
        } else if (data.Code == '000') {
          Alert.show(data.Message, this.loadSceneShop, 'index/icon-feed', '剩余的饲料不足');
        } else if (data.Code == '333') {
          Msg.show(data.Message);
        }
      });
    }
  },
  //升级饲料槽
  UpFeedGrade() {
    Alert.show('确定要升级饲料槽吗?', this.upGrade, null, '升级饲料槽');
  },
  upGrade() {
    Func.UpFeedGrade().then(data => {
      if (data.Code === 1) {
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //显示饲料槽状态
  showFeedState() {
    // if (this._chick._stateNode != null) this._chick._stateNode.active = false;

    Func.GetFeedData().then(data => {
      if (data.Code == 1) {
        let flag = this.arrowNode.active;

        this.arrowNode.active = false;
        let capacity = data.Model.FeedTroughCapacity;
        let value = data.Model.FeedCount;
        this.assignFeedState(value, capacity);

        //显示节点（动画）
        clearTimeout(this.timer2);
        this.feedStateNode.active = true;
        this.feedStateNode.opacity = 0;
        this.feedStateNode.runAction(cc.fadeIn(0.5));
        var action = cc.sequence(
          cc.fadeOut(0.5),
          cc.callFunc(() => {
            this.feedStateNode.active = false;
            this.arrowNode.active = flag ? true : false;
          }, this)
        );
        this.timer2 = setTimeout(() => {
          if (!Config.firstLogin) this.feedStateNode.runAction(action);
        }, 3000);
      } else {
        Alert.show(data.Message);
      }
    });
  },
  //赋值 饲料槽
  assignFeedState(value, capacity) {
    this.feedStateNode = this.node.getChildByName('feedState');
    let feedProgressBar = cc.find('layout/Bar', this.feedStateNode).getComponent(cc.ProgressBar);
    let feedBar = feedProgressBar.node.getChildByName('bar');
    let feedLabel = cc.find('layout/value', this.feedStateNode).getComponent(cc.Label);

    feedLabel.string = value + '/ ' + capacity;
    feedProgressBar.progress = value / capacity;
    Tool.setBarColor(feedBar, value / capacity);
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

  // 初始化牧场等级
  initRanchGrade(rank) {
    switch (rank) {
      case 1:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 2:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 3:
        this.windmillNode.active = true;
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;

      default:
        break;
    }
  },

  //初始化产蛋棚图片 （未加入到init中，后台没有数据）
  initEggShed(rank) {
    switch (rank) {
      case 1:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 2:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 3:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
    }
  },
  //更新 饲料tip的数量
  updateFeedCount() {
    Func.GetFeedCount().then(data => {
      if (data.Code === 1) {
        this.feedCountLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //更新天气box数据
  updateWeatherBox() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find('soiltem', this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find('div/date', this.wether).getComponent(cc.Label);

      let time = res.data.weatherdata[0].intime.split(' ');
      let date = time[0].split('-');
      wetherItem1.string = res.data.weatherdata[0].soiltem + '℃';
      wetherItem2.string = date[1] + '月' + date[2] + '日';
    });
  },
  //根据天气情况 判断牧场的背景
  updateWeather() {
    let rainNode = cc.find('ParticleRain', this.node);
    let wetherIcon = cc.find('div/icon', this.wether).getComponent(cc.Sprite);
    return Func.GetCurrentWeather().then(res => {
      if (res.data.rain !== 0) {
        //下雨
        Config.weather = -1;

        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/rain-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/rain-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/rain-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        //图标
        cc.loader.loadRes('weather/rain', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/rain/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/rain/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/rain/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/rain/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/rain/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = true;
      } else if (res.data.light === 2 || res.data.light === 3) {
        //阴天
        Config.weather = 0;
        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/cloud-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/cloud-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/cloud-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        cc.loader.loadRes('weather/overcast', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/cloud/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/cloud/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/cloud/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/cloud/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/cloud/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      } else if (res.data.light === 1) {
        Config.weather = 1;
        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/sun-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/sun-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/sun-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        cc.loader.loadRes('weather/sun', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/sun/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/sun/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/sun/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/sun/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/sun/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      }
    });
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

  loadSceneRepertory() {
    cc.director.loadScene('repertory');
    this.removePersist();
  },
  loadSceneFarm() {
    cc.director.loadScene('Farm/farm');
  },

  onLoad: function() {
    var openID = window.location.href.split('=')[1];
    window.Config.openID = openID || 'f79ed645ad624cf5bbfecc2e67f23020';
    Func.openID = window.Config.openID;
    Config.newSocket = new WebSocket('ws://service.linedin.cn:5530/');
    cc.director.setDisplayStats(false);

    // let ws = new WebSocket("wss://127.0.0.1:5520");
    // ws.onopen = function(event) {
    //   console.log("Send Text WS was opened.");
    // };
    // ws.onmessage = function(event) {
    //   console.log("response text msg: " + event.data);
    // };
    // ws.onerror = function(event) {
    //   console.log("Send Text fired an error");
    // };
    // ws.onclose = function(event) {
    //   console.log("WebSocket instance closed.");
    // };

    this.func = {
      showMenu: this.showMenu,
      loadSceneShop: this.loadSceneShop,
      loadSceneRepertory: this.loadSceneRepertory,
      initEggShed: this.initEggShed,
      initRanchGrade: this.initRanchGrade,
      showFeedState: this.showFeedState,
      addFeed: this.addFeed,
      loadSceneFarm: this.loadSceneFarm
    };
    this.addPersist();
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
    Config.backIndexUrl = 'index';
    if (Config.menuNode) {
      Config.menuNode.active = true;
      Config.hearderNode.active = true;
    }
  },
  farmSpeak() {
    let showNode = cc.find('farmer/farmer-text', this.node);

    clearTimeout(timer);
    showNode.active = true;
    showNode.opacity = 0;
    showNode.runAction(cc.fadeIn(0.5));
    var action = cc.sequence(
      cc.fadeOut(0.5),
      cc.callFunc(() => {
        showNode.active = false;
      }, this)
    );
    let timer = setTimeout(() => {
      showNode.runAction(action);
    }, 5000);
  }
  //update(dt) {}
});
