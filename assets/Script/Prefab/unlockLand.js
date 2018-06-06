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
    Func.GetNextUnlockLand().then(data => {
      if (data.Code === 1) {
        this.messageLabel.string = `拓建当前土地您需要花费`;
        this.unlockMoney = data.Model.unlockMoney;
        this.label.string = data.Model.unlockMoney + '牧场币，或者' + data.Model.unlockPoint + '积分';
      } else {
        Msg.show(data.Message);
      }
    });
  },
  bindEvent() {
    let lantId;
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
    let dataList = JSON.parse(cc.sys.localStorage.getItem('FarmData')); //缓存机制
    for (let i = 0; i < dataList.List.length; i++) {
      if (dataList.List[i].IsLock) {
        lantId = dataList.List[i].ID;
        break;
      }
    }

    //牧场币升级
    this.btn1.on('click', () => {
      this.upgradeHouse(1, lantId);
    });
    //积分升级
    this.btn2.on('click', () => {
      this.upgradeHouse(0, lantId);
    });
  },
  // 升级牧场操作 0:积分升级 1:牧场升级
  upgradeHouse(payType, landId) {
    let self = this;
    Func.unLockLand(payType, landId).then(data => {
      if (data.Code === 1) {
        Tool.closeModal(this.node);
        setTimeout(function() {
          Data.func.getFarmModalData().then(data2 => {
            // FarmJs.fn.setLocalStorageData.call(FarmJs, data2);
            console.log(data2.Model);
            self.animates();
            self.FarmJs = cc.find('Canvas');
            self.div_header = cc.find('div_header');
            self.FarmJs.emit('unLockLand', {
              data: data2.Model
            });
            self.div_header.emit('upDataMoney', {
              data: ''
            });
          });
        }, 500);
        Msg.show(data.Message);
      } else {
        Msg.show(data.Message);
      }
    });
  },
  onLoad() {
    this.bindNode();
    this.bindData();
    this.bindEvent();
    console.log(this.node);
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
