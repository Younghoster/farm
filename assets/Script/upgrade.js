// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {
    Item_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  upgradeByPointInfo: null,
  upgradeByMoneyInfo: null,
  grade: null,
  bindNode() {
    this.messageLabel = cc.find('bg/upbg4/message', this.node).getComponent(cc.Label);
    this.label = cc.find('bg/upbg4/label', this.node).getComponent(cc.Label);
    this.btn1 = cc.find('bg/upbg4/New Node/btn1', this.node);
    this.btn2 = cc.find('bg/upbg4/New Node/btn2', this.node);
    this.closeButton = cc.find('bg/btn-close', this.node);

    this.level = cc.find('bg/newLayout/upbg1/text', this.node);

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
        let needLevel = 5;
        if (parseInt(this.upgradeByPointInfo.RanchGrade) == 3) {
          needLevel = 15;
        }
        this.messageLabel.string = `牧场lv.${this.upgradeByPointInfo.RanchGrade - 1}升级为lv.${parseInt(
          this.upgradeByPointInfo.RanchGrade
        )},花费${this.upgradeByMoneyInfo.Money} 牧场币(无等级限制)`;
        this.label.string = `或者${this.upgradeByPointInfo.Money}积分同时用户等级达到lv.${needLevel}`;
      } else if (data.Code === 2) {
      } else {
        Msg.show(data.Message);
      }
    });
    //鸡
    this.level.getComponent(cc.Label).string = `牧场等级：Lv.${Config.UserData.RanchModel.RanchRank}`;
    this.chickText = cc.find('bg/upbg3_/New Label', this.node).getComponent(cc.Label);

    Func.RanchChickenCounts().then(data => {
      if (data.Code === 1 || data.Code === 5 || data.Code === 10) {
        let domBox = cc.find('bg/upbg3_/New Node', this.node);
        domBox.removeAllChildren();
        this.chickText.string = `已养贵妃鸡${data.Model}/${data.Code}（升级牧场可增加养殖上限）`;

        for (let i = 0; i < data.Code; i++) {
          let itemPrefab = cc.instantiate(this.Item_Prefab);
          if (i < data.Model) {
            cc.loader.loadRes('Modal/upgrade/chickss', cc.SpriteFrame, (err, spriteFrame) => {
              itemPrefab.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          } else {
            cc.loader.loadRes('Modal/upgrade/chick_', cc.SpriteFrame, (err, spriteFrame) => {
              itemPrefab.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          }
          domBox.addChild(itemPrefab);
        }
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
    Tool.closeModal(this.node);
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
        this.animates();
        self.div_header = cc.find('div_header');
        self.div_header.emit('upDataMoney', {
          data: ''
        });
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
  start() {}

  // update (dt) {},
});
