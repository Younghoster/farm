//Chick.js

// 节点不带_   私有变量_

var Data = require("Data");
var Func = Data.func;
var ToolJs = require("Tool");
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
  _chick: null,
  operate: null,
  _clearValue: null,
  clearLabel: null,
  clearBar: null,
  //菜单 半透明背景 Modal_more
  MenuModal: null,
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

  init: function() {
    // this._chick = this.Chick.getComponent("Chick");
    // this.clearLabel = cc.find('wave/mask/layout/value', this.node).getComponent(cc.Label);
    // this.wave1Node = cc.find('wave/mask/wave1', this.node);
    // this.wave2Node = cc.find('wave/mask/wave2', this.node);

    this.MenuModal = cc.find("/div_menu/Modal_more", this.node);
    this.handNode = cc.find("Hand", this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.arrowNode = this.node.getChildByName("icon-arrow");
    this.eggNode = cc.find("bg/house/shouquEgg", this.node);
    this.houseNode = cc.find("bg/house", this.node);

    this.eggMoreNode = cc.find("eggMore", this.node);
    this.eggCountLabel = cc.find("count", this.eggMoreNode).getComponent(cc.Label);
    //天气
    this.wether = this.node.getChildByName("div_wether");
    //饲料数量
    this.feedCountLabel = cc.find("div_action/feed/icon-tip/count", this.node).getComponent(cc.Label);
    // var chickState = new Chick();
    this.scene = cc.find("Canvas");
    this.updateWether();
    //新手指引step
    this.step = 0;

    this.shitBoxNode = cc.find("shit-box", this.node);

    this.chickList = [];
  },
  initData(data) {
    Config.firstLogin = data.UserModel.FirstLanding;
    // 清洁度设置
    this._clearValue = data.RanchModel.RanchCleanliness;
    this.clearProgressBar = cc.find("clearBar/clear_bar", this.node).getComponent(cc.ProgressBar);
    this.clearProgressBar.progress = this._clearValue / 150;
    let RanchMoney = data.UserModel.RanchMoney;
    let RanchRank = data.RanchModel.RanchRank;
    let eggsShedRank = data.EggsShed.ShedRank;
    //初始化饲料tip的数量
    this.feedCountLabel.string = data.UserModel.Allfeed == null ? 0 : data.UserModel.Allfeed;

    //初始化产蛋棚是否显示鸡蛋
    this.eggNode.active = data.EggsShed.EggCount > 0 ? true : false;
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
    // for (let i = 0; i < 5; i++) {
    //   cc.loader.loadRes('Prefab/Index/shit', cc.Prefab, (err, prefab) => {
    //     let shitNode = cc.instantiate(prefab);
    //     shitNode.setPosition(Tool.random(0, 400), Tool.random(0, 200));
    //     this.shitBoxNode.addChild(shitNode);
    //   });
    // }
    // 初始化跳动的箭头
    Func.GetFeedTroughFull().then(data => {
      if (data.Code === 1) {
        this.arrowNode.active = !data.Model;
      }
    });

    this.initChick();
    this.initHouse(eggsShedRank);
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

          cc.loader.loadRes("Prefab/Chick", cc.Prefab, (err, prefab) => {
            var chickNode = cc.instantiate(prefab);
            chickNode.setPosition(self.setChickPositionX(i), Math.random() * -350 - 100);
            var chickJs = chickNode.getComponent("Chick");
            this.scene.addChild(chickNode);
            chickJs.setId(data.List[i].ID);
            chickJs._status = data.List[i].Status;
            chickJs.initData();

            this.chickList.push(chickNode);
          });
        }
      } else {
        !Config.firstLogin ? Msg.show("您的牧场暂无小鸡") : false;
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
  //收取鸡蛋
  collectEgg() {
    Func.CollectEgg().then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggNode.active = false;
          }, this)
        );
        this.eggNode.runAction(action);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //收取贵妃鸡
  // collectChick() {
  //   Func.CollectChick(this._chick._Id).then(data => {
  //     if (data.Code == 1) {
  //       let action = cc.sequence(
  //         cc.fadeOut(0.3),
  //         cc.callFunc(() => {
  //           this.Chick.active = false;
  //         }, this)
  //       );
  //       this.Chick.runAction(action);
  //       Msg.show(data.Message);
  //     } else {
  //       Msg.show(data.Message);
  //     }
  //   });
  // },

  //点击清理事件
  showClearAlert: function() {
    var self = this;
    //调用接口
    Func.PostClean()
      .then(data => {
        if (data.Code === 1) {
          //清洁动画
          this.handNode.active = true;
          this.handAnim.play("hand_clear");

          this.handAnim.on("finished", () => {
            this.handNode.active = false;
            //清洁成功 牧场清洁度=100%
            this.clearLabel.string = 100 + "%";
            this.wave1Node.y = 100;
            this.wave2Node.y = 100;
          });
          // this.handAnim.on("finished", this.chickFunc.initData, this._chick);
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show("failed:" + reason);
      });
  },
  //点击喂食事件
  showFeedAlert: function() {
    var self = this;
    Func.PostOwnFeeds(this._chick._Id).then(data => {
      if (data.Code === 1) {
        this.updateFeedCount();
        // var anim = self._chick._chickAnim.play("chick_feed");
        // anim.repeatCount = 4;

        // this._chick._chickAnim.on("finished", this.chickFunc.initData, this._chick);
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, this.feedIcon, "剩余的饲料不足");
      } else if (data.Code === 333) {
        //饥饿度是满的
        Msg.show(data.Message);
      } else if (data.Code === 444) {
        //鸡死了
        Msg.show(data.Message);
      }
    });
    // .catch(reason => {
    //   Msg.show("failed:" + reason);
    // });
  },
  //将饲料放入饲料槽中
  addFeed() {
    Func.AddFeed().then(data => {
      if (data.Code === 1) {
        let array = data.Model.split(",");
        let value = array[0];
        let capacity = array[1];
        this.assignFeedState(value, capacity);
        this.updateFeedCount();
        //动画
        let handFeedNode = cc.find("hand_feed", this.node);
        handFeedNode.active = true;
        let hanfFeedAnim = handFeedNode.getComponent(cc.Animation);
        hanfFeedAnim.play("hand_feed");
        hanfFeedAnim.on("finished", () => {
          handFeedNode.active = false;
        });
        this.arrowNode.active = false;
      } else if (data.Code == "000") {
        Alert.show(data.Message, this.loadSceneShop, "icon-feed", "剩余的饲料不足");
      } else if (data.Code == "333") {
        Msg.show(data.Message);
      }
    });
  },
  //升级饲料槽
  UpFeedGrade() {
    Alert.show("确定要升级饲料槽吗?", this.upGrade, null, "升级饲料槽");
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
          this.feedStateNode.runAction(action);
        }, 3000);
      } else {
        Alert.show(data.Message);
      }
    });
  },
  //赋值 饲料槽
  assignFeedState(value, capacity) {
    this.feedStateNode = this.node.getChildByName("feedState");
    let feedProgressBar = cc.find("layout/Bar", this.feedStateNode).getComponent(cc.ProgressBar);
    let feedBar = feedProgressBar.node.getChildByName("bar");
    let feedLabel = cc.find("layout/value", this.feedStateNode).getComponent(cc.Label);

    feedLabel.string = value + "/ " + capacity;
    feedProgressBar.progress = value / capacity;
    Tool.setBarColor(feedBar, value / capacity);
  },
  //显示产蛋棚升级弹出框
  showHouseUpgrade() {
    this.houseStateNode = cc.find("bg/house/houseState", this.node);
    Func.GetRanchUpGradeMoney().then(data => {
      if (data.Code === 1) {
        let length = data.List.length || 0;
        let button0 = cc.find("button0", this.houseStateNode);
        let button1 = cc.find("button1", this.houseStateNode);
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
        this.upgradeByPointInfo.RanchGrade = "S";
        this.upgradeByMoneyInfo.RanchGrade = "S";
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
  //积分升级房屋
  upgradeByPoint() {
    if (this.upgradeByPointInfo.RanchGrade === "S") {
      Msg.show("已经升到满级");
    } else {
      Alert.show(
        "是否使用" + this.upgradeByPointInfo.Money + "积分将牧场升级到" + this.upgradeByPointInfo.RanchGrade + "级",
        () => {
          this.upgradeHouse(this.upgradeByPointInfo.Type);
          // this.updateMoney();
        },
        null,
        "升级"
      );
    }
  },
  // 牧场币升级房屋
  upgradeByMoney() {
    if (this.upgradeByPointInfo.RanchGrade === "S") {
      Msg.show("已经升到满级");
    } else {
      Alert.show(
        "是否使用" + this.upgradeByMoneyInfo.Money + "个牧场币将牧场升级到" + this.upgradeByMoneyInfo.RanchGrade + "级",
        () => {
          this.upgradeHouse(this.upgradeByMoneyInfo.Type);
          // this.updateMoney();
        },
        null,
        "升级"
      );
    }
  },
  // 升级房屋操作
  upgradeHouse(payType) {
    Func.UpgradeHouse(payType).then(data => {
      if (data.Code === 1) {
        switch (data.Model) {
          case "B":
            cc.loader.loadRes("house/house_2", cc.SpriteFrame, (err, spriteFrame) => {
              this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              Msg.show(data.Message);
            });
            break;
          case "A":
            cc.loader.loadRes("house/house_3", cc.SpriteFrame, (err, spriteFrame) => {
              this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              Msg.show(data.Message);
            });
            break;
        }
      }
    });
  },
  //初始化房屋图片 （未加入到init中，后台没有数据）
  initHouse(rank) {
    switch (rank) {
      case 1:
        cc.loader.loadRes("house/house_1", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 2:
        cc.loader.loadRes("house/house_2", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 3:
        cc.loader.loadRes("house/house_3", cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
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
  //更新天气情况
  updateWether() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find("soiltem", this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find("div/date", this.wether).getComponent(cc.Label);
      let wetherIcon = cc.find("div/icon", this.wether).getComponent(cc.Sprite);
      let bgNode = cc.find("bg", this.node);
      let rainNode = cc.find("ParticleRain", this.node);

      let time = res.data.weatherdata[0].intime.split(" ");
      let date = time[0].split("-");
      wetherItem1.string = res.data.weatherdata[0].soiltem + "℃";
      wetherItem2.string = date[1] + "月" + date[2] + "日";
      //根据天气情况 判断牧场的背景
      Func.GetCurrentWeather().then(res => {
        if (res.data.rain !== 0) {
          //下雨
          cc.loader.loadRes("weather/bg-rain", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/rain", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = true;
        } else if (res.data.light === 2 || res.data.light === 3) {
          //阴天
          cc.loader.loadRes("weather/bg-cloud", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/overcast", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        } else if (res.data.light === 1) {
          cc.loader.loadRes("weather/bg", cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes("weather/sun", cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        }
      });
    });
  },

  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene("weatherInfo");
    this.removePersist();
  },
  showUserCenter: function() {
    cc.director.loadScene("UserCenter/userCenter");
    this.removePersist();
  },

  loadSceneRepertory() {
    cc.director.loadScene("repertory");
    this.removePersist();
  },
  loadSceneFarm() {
    cc.director.loadScene("Farm/farm");
  },

  onLoad: function() {
    var openID = window.location.href.split("=")[1];
    window.Config.openID = openID || "484e16827b914a8eafcd3bd658fd9476";
    Func.openID = window.Config.openID;
    Config.newSocket = new WebSocket("ws://service.linedin.cn:5530/");

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
      loadSceneRepertory: this.loadSceneRepertory
    };
  },

  start: function() {
    this.init();
    // this.chickFunc = this._chick.chickFunc;
    Func.GetWholeData().then(data => {
      // console.log(data);
      if (data.Code === 1) {
        this.initData(data);
        // 新手指引
        // if (Config.firstLogin) GuideSystem.guide();
        //仓库回调

        this.repertoryCallBack();
      } else {
        console.log("首页数据加载失败");
      }
    });

    // var ws = new WebSocket('ws://localhost:3000/ws');
    // ws.onmessage = function (e) {

    //   console.log(e.data);
    // };
    // ws.onerror = function (err) {
    //   console.log('_error');
    //   console.log(err);
    // };
    // ws.onopen = function () {

    //   ws.send('连接已打开');
    // };
    // ws.onclose = function () {
    //   console.log('_close');
    // };

    // this.eggMoreNode.on("click", () => {

    //   ws.send('egg click');

    // })
  },
  //仓库回调函数（0表示孵化操作）
  repertoryCallBack() {
    if (this.operate != null) {
      switch (this.operate) {
        case 0:
          this.hatchEgg();
          break;
        case 1:
          this.putFeed();
          break;
      }
      this.operate = -1;
    }
  },
  removePersist() {
    cc.game.removePersistRootNode(Config.menuNode);
    cc.game.removePersistRootNode(Config.hearderNode);
  }
  //update(dt) {}
});
