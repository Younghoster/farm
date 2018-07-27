var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
var DateFormat = require('utils').fn;
cc.Class({
  extends: cc.Component,
  properties: {},
  holeNodeList: null,
  shedRank: null,
  //判断是首页进入 还是好友页面进入
  isFriend: null,
  ctor() {
    this.holeNodeList = [];
  },
  bindNode() {
    this.hasEggCount = 0;
    this.indexJs = cc.find('Canvas').getComponent('Index');
    this.closeButton = cc.find('btn-close', this.node);
    this.label = cc.find('bg/label', this.node);
    this.label2 = cc.find('bg/label2', this.node);
    this.label3 = cc.find('bg/label3', this.node);
    this.contentNode = cc.find('bg/content', this.node);
    for (let i = 0; i < 10; i++) {
      this.holeNodeList[i] = cc.find(`hole${i}`, this.contentNode);
    }
    this.animNode = cc.find('anim', this.node);
    this.eggNode = cc.find('egg', this.animNode);
    this.eggAnim = this.eggNode.getComponent(cc.Animation);
    this.breakButton = cc.find('btn', this.animNode);
    this.sceneNode = cc.find('Canvas');
    this.modalNode = cc.find('modal', this.animNode);
    this.CollectEggCount = 0;
    this.CollectEggCountBad = 0;
  },

  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
  },

  initData() {
    var self = this;
    this.isFriend = this.sceneNode._components[1].name === 'Canvas<FriendIndex>' ? true : false;
    var openID;
    if (this.isFriend) {
      openID = this.sceneNode.getComponent('FriendIndex').friendOpenID;
    }
    Func.getEggLayInfo(openID).then(data => {
      if (data.Code === 1) {
        //产蛋棚等级
        this.shedRank = data.Model.model.ShedRank;
        let list = data.Model.DetailList;
        let LabStr = self.label.getComponent(cc.Label);
        let LabStr2 = self.label2.getComponent(cc.Label);
        let LabStr3 = self.label3.getComponent(cc.Label);
        switch (this.shedRank) {
          case 1: {
            LabStr.string = '您的产蛋棚等级为1级';
            LabStr2.string = '升级下一级所需';
            LabStr3.string = '198牧场币（无等级限制）';
            break;
          }
          case 2: {
            LabStr.string = '您的产蛋棚等级为2级';
            LabStr2.string = '升级下一级所需';
            LabStr3.string = '498牧场币（无等级限制）';
            break;
          }
          case 3: {
            LabStr.string = '您的产蛋棚已经满级！';
            LabStr2.string = '无需升级';
            LabStr3.string = '';
            break;
          }
        }
        for (let i = 0; i < list.length; i++) {
          const element = list[i];

          this.assignData(element, this.holeNodeList[i], i);
        }
      } else {
        Msg.show(data.Message);
      }
    });
  },
  assignData(data, holeNode, i) {
    let self = this;
    let eggID = data.EggID;
    let holeButton = holeNode.getComponent(cc.Button);
    holeButton.interactable = !this.isFriend;
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
      this.hasEggCount++;
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
        clearTimeout(this.timers); //清理定时器
        Func.CollectEgg(eggID).then(data => {
          if (data.Code === 1) {
            //收取成功后 把蛋去掉（页面上）
            this.hasEggCount--;
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

                // cc.loader.loadRes('eggHouse/egg0', cc.SpriteFrame, (err, spriteFrame) => {
                //   this.eggNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                // });
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
                  this.modalNode.on('click', () => {
                    let action = cc.sequence(
                      cc.fadeOut(0.3),
                      cc.callFunc(() => {
                        this.animNode.active = false;
                        this.modalNode.off('click');
                      })
                    );
                    this.animNode.runAction(action);
                  });
                });
                break;
              case 0:
                //变质的鸡蛋

                this.CollectEggCountBad++;
                self.timers = setTimeout(function() {
                  Msg.show('收取成功，正常鸡蛋+' + self.CollectEggCount + '，变质鸡蛋+' + self.CollectEggCountBad);
                  self.CollectEggCount = 0;
                  self.CollectEggCountBad = 0;
                }, 1000);
                break;
              case 1:
                //正常鸡蛋
                this.CollectEggCount++;
                self.timers = setTimeout(function() {
                  Msg.show('收取成功，正常鸡蛋+' + self.CollectEggCount + '，变质鸡蛋+' + self.CollectEggCountBad);
                  self.CollectEggCount = 0;
                  self.CollectEggCountBad = 0;
                }, 1000);

                break;

              default:
                break;
            }
            let str = "{name:'" + Config.openID + "',type:'updataChat'}";
            Config.newSocket.send(str);
            if (this.hasEggCount == 0) {
              let str2 = "{name:'" + Config.openID + "',type:'updateEggCount'}";
              Config.newSocket.send(str2);
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
      if (Config.firstLogin) {
        if (i == 0 || i == 1) {
          cc.loader.loadRes('eggHouse/img2', cc.SpriteFrame, (err, spriteFrame) => {
            holeSprite.spriteFrame = spriteFrame;
          });
        }
      }
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
    let self = this;
    Tool.closeModal(this.node);
    Func.UpgradeEggsShed(0).then(data => {
      if (data.Code === 1) {
        //更新产蛋棚等级
        this.shedRank = data.Model;
        this.animates();
        this.initData();
        this.updateEggshed();
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
  //牧场币升级
  upgradeByMoney() {
    let self = this;
    Tool.closeModal(this.node);
    Func.UpgradeEggsShed(1).then(data => {
      if (data.Code === 1) {
        this.shedRank = data.Model;
        this.animates();
        this.initData();
        this.updateEggshed();
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
  //更新首页产蛋棚的等级
  updateEggshed() {
    this.indexJs.initEggShed.call(this.indexJs, this.shedRank);
  },

  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.initData();
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
      box.parent.addChild(alert);
    });
  },
  start() {}

  // update (dt) {},
});
