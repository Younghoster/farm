var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {},
  friendOpenID: null,
  bindNode() {
    this.backButton = cc.find('bg/btn-back', this.node);
    this.clearLabel = cc.find('wave/mask/layout/value', this.node).getComponent(cc.Label);
    this.wave1Node = cc.find('wave/mask/wave1', this.node);
    this.wave2Node = cc.find('wave/mask/wave2', this.node);
    this.handNode = cc.find('Hand', this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.eggNode = cc.find('bg/house/shouquEgg', this.node);
    this.houseNode = cc.find('bg/house', this.node);
    // this.moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    //天气
    this.wether = this.node.getChildByName('div_wether');
    //饲料数量
    this.feedCountLabel = cc.find('div_action/feed/icon-tip/count', this.node).getComponent(cc.Label);
    this.scene = cc.find('Canvas');
    this.updateWether();
    this.chickList = [];
  },
  initData(data) {
    // 清洁度设置
    this._clearValue = data.RanchModel.RanchCleanliness;
    this.clearLabel.string = this._clearValue + '%';
    this.wave1Node.y = this._clearValue;
    this.wave2Node.y = this._clearValue;

    //经验值
    this.level = cc.find('div_header/Lv/level', this.node).getComponent(cc.Label);
    this.level.string = 'V' + data.UserModel.Grade;
    this.levelProgressBar = cc.find('div_header/Lv/lv_bar', this.node).getComponent(cc.ProgressBar);
    this.levelProgressBar.progress = data.UserModel.ExperienceValue / data.UserModel.GradeExperienceValue;

    //初始化鸡蛋
    this.eggNode.active = data.RanchModel.EggCount > 0 ? true : false;
    let upOrDown = true;
    this.schedule(() => {
      let action = upOrDown ? cc.moveBy(0.5, 0, 20) : cc.moveBy(0.5, 0, -20);
      this.eggNode.runAction(action);
      upOrDown = !upOrDown;
    }, 0.5);
    this.initChick();
  },
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

          cc.loader.loadRes('Prefab/Chick', cc.Prefab, (err, prefab) => {
            var chickNode = cc.instantiate(prefab);
            chickNode.setPosition(self.setChickPositionX(i), Math.random() * -300 - 100);
            var chickJs = chickNode.getComponent('Chick');
            this.scene.addChild(chickNode);
            chickJs.setId(data.List[i].ID);
            chickJs._status = data.List[i].Status;
            chickJs.initData();

            this.chickList.push(chickNode);
          });
        }
      } else {
        !Config.firstLogin ? Msg.show('您的牧场暂无小鸡') : false;
      }
    });
  },
  setChickPositionX(i) {
    if (i > 6) {
      return (i - 6) * 100 - 350;
    } else {
      return (i + 1) * 100 - 350;
    }
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
            //清洁成功 牧场清洁度=100%
            this.clearLabel.string = 100 + '%';
            this.wave1Node.y = 100;
            this.wave2Node.y = 100;
          });
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show('failed:' + reason);
      });
  },
  //点击喂食事件
  showFeedAlert: function() {
    var self = this;
    Func.PostOwnFeeds(this._chick._Id).then(data => {
      if (data.Code === 1) {
        this.updateFeedCount();
      } else if (data.Code == '000') {
        Alert.show(data.Message, this.loadSceneShop, this.feedIcon, '剩余的饲料不足');
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
  //初始化房屋图片 （未加入到init中，后台没有数据）
  initHouse(rank) {
    switch (rank) {
      case 'C':
        cc.loader.loadRes('house/house_1', cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 'B':
        cc.loader.loadRes('house/house_2', cc.SpriteFrame, (err, spriteFrame) => {
          this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        break;
      case 'A':
        cc.loader.loadRes('house/house_3', cc.SpriteFrame, (err, spriteFrame) => {
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
      let wetherItem1 = cc.find('soiltem', this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find('div/date', this.wether).getComponent(cc.Label);
      let wetherIcon = cc.find('div/icon', this.wether).getComponent(cc.Sprite);
      let bgNode = cc.find('bg', this.node);
      let rainNode = cc.find('ParticleRain', this.node);

      let time = res.data.weatherdata[0].intime.split(' ');
      let date = time[0].split('-');
      wetherItem1.string = res.data.weatherdata[0].soiltem + '℃';
      wetherItem2.string = date[1] + '月' + date[2] + '日';
      //根据天气情况 判断牧场的背景
      Func.GetCurrentWeather().then(res => {
        if (res.data.rain !== 0) {
          //下雨
          cc.loader.loadRes('weather/bg-rain', cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes('weather/rain', cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = true;
        } else if (res.data.light === 2 || res.data.light === 3) {
          //阴天
          cc.loader.loadRes('weather/bg-cloud', cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes('weather/overcast', cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        } else if (res.data.light === 1) {
          cc.loader.loadRes('weather/bg', cc.SpriteFrame, function(err, spriteFrame) {
            bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
          cc.loader.loadRes('weather/sun', cc.SpriteFrame, function(err, spriteFrame) {
            wetherIcon.spriteFrame = spriteFrame;
          });
          rainNode.active = false;
        }
      });
    });
  },
  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene('weatherInfo');
  },
  loadIndexScene() {
    cc.director.loadScene('index');
  },

  onLoad() {
    this.friendOpenID = 'fe37fb9bedcf48ea954964f4e9117c51';
  },

  start() {
    this.bindNode();
    Func.GetWholeData(this.friendOpenID).then(data => {
      if (data.Code === 1) {
        this.initData(data);
      } else {
        console.log('首页数据加载失败');
      }
    });
  }

  // update (dt) {},
});
