var Data = require("Data");
var Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {},

  start() {
    Config.hearderNode = this.node;
    cc.game.addPersistRootNode(this.node);
    this.moneyLabel = cc.find("gold/money", this.node).getComponent(cc.Label);
    this.init();
  },
  setHeardData(data) {
    let RanchMoney = data.UserModel.RanchMoney;
    let RanchRank = data.RanchModel.RanchRank;
    let moneyLabel = cc.find("gold/money", this.node).getComponent(cc.Label);
    moneyLabel.string = "￥" + RanchMoney;
    //经验值
    this.level = cc.find("Lv/level", this.node).getComponent(cc.Label);
    this.level.string = "V" + data.UserModel.Grade;
    this.levelProgressBar = cc.find("Lv/lv_bar", this.node).getComponent(cc.ProgressBar);
    this.levelProgressBar.progress = data.UserModel.ExperienceValue / data.UserModel.GradeExperienceValue;
  },
  init() {
    Func.GetWholeData().then(data => {
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
    cc.director.loadScene("recharge");
    this.removePersist();
  },
  gotoUserCenter: function() {
    cc.director.loadScene("userCenter");
    this.removePersist();
  },
  removePersist() {
    cc.game.removePersistRootNode(Config.menuNode);
    cc.game.removePersistRootNode(Config.hearderNode);
  }
  // update (dt) {},
});
