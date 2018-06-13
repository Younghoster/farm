// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.initFeedState();
  },
  initFeedState() {
    Func.GetFeedData().then(data => {
      if (data.Code == 1) {
        let capacity = data.Model.FeedTroughCapacity;
        let value = data.Model.FeedCount;
        let lv = data.Model.FeedTroughGrade;
        let feedProgressBar = cc.find('bg/feedState/layout/Bar', this.node).getComponent(cc.ProgressBar);
        let feedBar = feedProgressBar.node.getChildByName('bar');
        let feedLabel = cc.find('bg/feedState/layout/value', this.node).getComponent(cc.Label);

        feedLabel.string = value + '/ ' + capacity;
        feedProgressBar.progress = value / capacity;
        Tool.setBarColor(feedBar, value / capacity);
        this.setLeverTip(lv);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  setLeverTip(lv) {
    let textLable1 = cc.find('bg/upbg4/message', this.node).getComponent(cc.Label);
    let textLable2 = cc.find('bg/upbg4/label', this.node).getComponent(cc.Label);
    switch (lv) {
      case 1: {
        textLable1.string = `lv.1升级为lv.2,花费198牧场币(无等级限制)`;
        textLable2.string = `或者20000积分同时用户等级达到lv.5`;
        break;
      }
      case 2: {
        textLable1.string = `lv.2升级为lv.3,花费198牧场币(无等级限制)`;
        textLable2.string = `或者50000积分同时用户等级达到lv.15`;
        break;
      }
      case 3: {
        textLable1.string = `您的饲料槽等级为lv.3，已经满级`;
        textLable2.string = `无需升级`;
        break;
      }
    }
  },
  //饲料槽升级 积分
  upgradeByPoint() {
    let self = this;
    Tool.closeModal(this.node);
    Func.UpFeedGrade(0).then(data => {
      if (data.Code === 1) {
        //更新产蛋棚等级
        self.div_header = cc.find('div_header');
        self.div_header.emit('upDataMoney', {
          data: ''
        });
        Msg.show('升级成功！');
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //饲料槽升级 牧场币
  upgradeByMoney() {
    let self = this;
    Tool.closeModal(this.node);
    Func.UpFeedGrade(1).then(data => {
      if (data.Code === 1) {
        //更新产蛋棚等级
        self.div_header = cc.find('div_header');
        self.div_header.emit('upDataMoney', {
          data: ''
        });
        Msg.show('升级成功！');
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //添加饲料
  addFeed() {
    let self = this;
    this.indexJs = cc.find('Canvas').getComponent('Index');
    Func.AddFeed().then(data => {
      if (data.Code === 1) {
        this.indexJs.func.updateFeedCount.call(this.indexJs);
        setTimeout(function() {
          self.initFeedState();
        }, 1000);
        let str = "{name:'" + Config.openID + "',type:'updataChat'}";
        Config.newSocket.send(str);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  closeFeedState() {
    Tool.closeModal(this.node);
  },
  start() {}

  // update (dt) {},
});
