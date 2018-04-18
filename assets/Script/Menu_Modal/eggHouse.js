var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,
  properties: {},
  holeNodeList: null,
  shedRank: null,
  ctor() {
    this.holeNodeList = [];
  },
  bindNode() {
    this.indexJs = cc.find('Canvas').getComponent('Index');
    this.closeButton = cc.find('btn-close', this.node);
    this.contentNode = cc.find('bg/content', this.node);
    for (let i = 0; i < 10; i++) {
      this.holeNodeList[i] = cc.find(`hole${i}`, this.contentNode);
    }
  },

  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
  },

  initData() {
    Func.getEggLayInfo().then(data => {
      if (data.Code === 1) {
        //产蛋棚等级
        this.shedRank = data.Model.model.ShedRank;
        let list = data.Model.DetailList;
        for (let i = 0; i < list.length; i++) {
          const element = list[i];
          let eggID = element.EggID;
          if (element.IsLock) {
            //没坑位
            cc.loader.loadRes('eggHouse/img1', cc.SpriteFrame, (err, spriteFrame) => {
              this.holeNodeList[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          } else if (element.IsFull) {
            //有蛋
            cc.loader.loadRes('eggHouse/img2', cc.SpriteFrame, (err, spriteFrame) => {
              this.holeNodeList[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          } else {
            //没蛋
            cc.loader.loadRes('eggHouse/img3', cc.SpriteFrame, (err, spriteFrame) => {
              this.holeNodeList[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
          }
          //绑定收取操作
          this.holeNodeList[i].on('click', () => {
            Func.CollectEgg(eggID).then(data => {
              if (data.Code === 1) {
                this.initData();
              } else {
                Msg.show(data.Message);
              }
            });
          });
        }
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //弹出Alert 询问是否要使用多少积分升级产蛋棚
  upgradeAlert(event, payType) {
    switch (payType) {
      //积分升级
      case '0':
        Func.GetLayUpGrade(this.shedRank + 1).then(data => {
          if (data.Code === 1) {
            Alert.show(
              `是否使用${data.Model.Point}积分将牧场升级到${data.Model.LayEggGrade}级`,
              () => {
                this.upgradeByPoint();
              },
              null,
              '升级'
            );
          } else {
            Msg.show(data.Message);
          }
        });
        break;
      case '1':
        Func.GetLayUpGrade(this.shedRank + 1).then(data => {
          if (data.Code === 1) {
            Alert.show(
              `是否使用${data.Model.Money}积分将牧场升级到${data.Model.LayEggGrade}级`,
              () => {
                this.upgradeByMoney();
              },
              null,
              '升级'
            );
          } else {
            Msg.show(data.Message);
          }
        });
        break;

      default:
        break;
    }
  },
  //积分升级
  upgradeByPoint() {
    Func.UpgradeEggsShed(0).then(data => {
      if (data.Code === 1) {
        //更新产蛋棚等级
        this.shedRank = data.Model;
        this.initData();
        this.updateEggshed();
      } else {
        Msg.show(data.Message);
      }
    });
  },
  upgradeByMoney() {
    Func.UpgradeEggsShed(1).then(data => {
      if (data.Code === 1) {
        this.shedRank = data.Model;
        this.initData();
        this.updateEggshed();
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //更新首页产蛋棚的等级
  updateEggshed() {
    this.indexJs.initEggShed.call(this.indexJs, this.shedRank);
  },

  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.initData();
  },

  start() {}

  // update (dt) {},
});
