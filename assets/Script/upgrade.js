// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {},
  upgradeByPointInfo: null,
  upgradeByMoneyInfo: null,
  grade: null,
  bindNode() {
    this.messageLabel = cc.find('bg/message', this.node).getComponent(cc.Label);
    this.label = cc.find('bg/label', this.node).getComponent(cc.Label);
    this.btn1 = cc.find('bg/btn1', this.node);
    this.btn2 = cc.find('bg/btn2', this.node);
    this.closeButton = cc.find('bg/btn-close', this.node);
    this.indexJs = cc.find('Canvas').getComponent('Index');
  },

  bindData() {
    Func.GetRanchUpGradeMoney().then(data => {
      if (data.Code === 1) {
        let length = data.List.length || 0;
        for (let i = 0; i < length; i++) {
          if (data.List[i].Type === 0) {
            this.upgradeByPointInfo = data.List[i];
          } else {
            this.upgradeByMoneyInfo = data.List[i];
          }
        }
        this.messageLabel.string = `将牧场lv.${this.upgradeByPointInfo.RanchGrade - 1}升级为lv.${parseInt(
          this.upgradeByPointInfo.RanchGrade
        )},`;
        this.label.string = `需要花费 ${this.upgradeByPointInfo.Money} 积分或花费 ${
          this.upgradeByMoneyInfo.Money
        } 牧场币`;
      } else if (data.Code === 2) {
      } else {
        Msg.show(data.Message);
      }
    });
  },
  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
    //牧场币升级
    this.btn1.on('click', () => {
      this.upgradeHouse(1);
    });
    //积分升级
    this.btn2.on('click', () => {
      this.upgradeHouse(0);
    });
  },
  // 升级牧场操作 0:积分升级 1:牧场升级
  upgradeHouse(payType) {
    Func.UpgradeHouse(payType).then(data => {
      if (data.Code === 1) {
        switch (data.Model) {
          case '2':
            this.grade = 2;
            break;
          case '3':
            this.grade = 3;
            break;
        }
        Msg.show('升级成功');
        this.indexJs.initRanchGrade.call(this.indexJs, this.grade);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  onLoad() {
    this.bindNode();
    this.bindData();
    this.bindEvent();
  },

  start() {}

  // update (dt) {},
});
