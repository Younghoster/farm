var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
var DateFormat = require('utils').fn;
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
    this.animNode = cc.find('anim', this.node);
    this.eggNode = cc.find('egg', this.animNode);
    this.eggAnim = this.eggNode.getComponent(cc.Animation);
    this.breakButton = cc.find('btn', this.animNode);
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
          this.assignData(element, this.holeNodeList[i]);
        }
      } else {
        Msg.show(data.Message);
      }
    });
  },
  assignData(data, holeNode) {
    let eggID = data.EggID;

    let holeSprite = holeNode.getComponent(cc.Sprite);
    let barNode = cc.find('timerBar', holeNode);
    barNode.active = false;
    let barProgress = barNode.getComponent(cc.ProgressBar);

    if (data.IsLock) {
      //没坑位
      cc.loader.loadRes('eggHouse/img1', cc.SpriteFrame, (err, spriteFrame) => {
        holeSprite.spriteFrame = spriteFrame;
      });
    } else if (data.IsFull) {
      //有蛋
      switch (data.Type) {
        //普通鸡蛋
        case 1:
          cc.loader.loadRes('eggHouse/img2', cc.SpriteFrame, (err, spriteFrame) => {
            holeSprite.spriteFrame = spriteFrame;
          });
          barNode.active = true;
          let createTime = parseInt(data.EggCreateTime.match(/\d+/g)[0]);
          //3天 时间戳
          const timeout = 72 * 60 * 60 * 1000;
          //截止时间
          let endTime = createTime + timeout;
          let time = Date.parse(new Date());
          //距离72个小时限定 百分比
          let value = endTime - time / timeout;
          barProgress.progress = value;
          break;
        // 金蛋
        case 3:
          cc.loader.loadRes('eggHouse/img5', cc.SpriteFrame, (err, spriteFrame) => {
            holeSprite.spriteFrame = spriteFrame;
          });

          break;
        // 变质蛋
        case 4:
          cc.loader.loadRes('eggHouse/img4', cc.SpriteFrame, (err, spriteFrame) => {
            holeSprite.spriteFrame = spriteFrame;
          });
          break;

        default:
          break;
      }

      //绑定收取操作
      holeNode.on('click', () => {
        Func.CollectEgg(eggID).then(data => {
          if (data.Code === 1) {
            //收取成功后 把蛋去掉（页面上）
            cc.loader.loadRes('eggHouse/img3', cc.SpriteFrame, (err, spriteFrame) => {
              holeSprite.spriteFrame = spriteFrame;
            });
            let timerBar = cc.find('timerBar', holeNode);
            timerBar.active = false;
            switch (data.Model) {
              case -1:
                //金蛋
                this.animNode.active = true;
                this.animNode.runAction(cc.fadeIn(0.3));
                this.breakButton.active = true;
                cc.loader.loadRes('eggHouse/egg0', cc.SpriteFrame, (err, spriteFrame) => {
                  this.eggNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
                this.breakButton.on('click', () => {
                  this.breakButton.active = false;
                  this.eggAnim.play('eggBroken');
                  this.eggNode.on('click', () => {
                    let action = cc.sequence(
                      cc.fadeOut(0.3),
                      cc.callFunc(() => {
                        this.animNode.active = false;
                      })
                    );
                    this.animNode.runAction(action);
                  });
                });
                break;
              case 0:
                //变质的鸡蛋
                Msg.show(data.Message);
                break;
              case 1:
                //正常鸡蛋
                Msg.show('收取成功');
                break;

              default:
                break;
            }
          } else {
            Msg.show(data.Message);
          }
        });
      });
    } else {
      //没蛋
      cc.loader.loadRes('eggHouse/img3', cc.SpriteFrame, (err, spriteFrame) => {
        holeSprite.spriteFrame = spriteFrame;
      });
    }
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
  //牧场币升级
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
