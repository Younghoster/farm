var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  start() {
    let self = this;
    if (!Config.hearderNode) {
      Config.hearderNode = this.node;
      cc.game.addPersistRootNode(this.node);
    }

    this.moneyLabel = cc.find('gold/money', this.node).getComponent(cc.Label);
    this.init();
    func: {
      init: this.init;
    }
    //更新于土地拓建
    self.node.on('upDataMoney', function(event) {
      Func.GetUserGrade().then(data => {
        if (data.Code === 1) {
          self.setHeardData(data);
        } else {
          Msg.show(data.Message);
        }
      });
    });
  },
  setHeardData(data) {
    let RanchMoney = data.Model.RanchMoney;
    let RanchRank = data.Model.RanchRank;
    let moneyLabel = cc.find('gold/money', this.node).getComponent(cc.Label);
    moneyLabel.string = '￥' + RanchMoney;
    //经验值
    this.level = cc.find('Lv/level', this.node).getComponent(cc.Label);
    this.level.string = 'LV.' + data.Model.Grade;
    this.levelProgressBar = cc.find('Lv/lv_bar', this.node).getComponent(cc.ProgressBar);
    this.levelProgressBar.progress = data.Model.ExperienceValue / data.Model.GradeExperienceValue;
  },
  init() {
    Func.GetUserGrade().then(data => {
      if (data.Code === 1) {
        this.setHeardData(data);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  updateMoney() {
    this.moneyLabel.string = data.Model;
  },
  rechargeEvent: function() {
    cc.director.loadScene('recharge', this.onLoadFadeIn);
    this.removePersist();
  },
  gotoUserCenter: function() {
    cc.director.loadScene('userCenter', this.onLoadFadeIn);
    this.removePersist();
  },
  onLoadFadeIn() {
    let canvas = cc.find('Canvas');
    Tool.RunAction(canvas, 'fadeIn', 0.15);
  },
  removePersist() {
    Config.menuNode.active = false;
    Config.hearderNode.active = false;
  }
  // update (dt) {},
});
