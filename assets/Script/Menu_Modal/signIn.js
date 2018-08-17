var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  // 关闭模态框
  closeModal() {
    // var self = this;

    // var action = cc.fadeOut(0.3);
    // this.node.runAction(action);
    // setTimeout(() => {
    //   this.node.active = false;
    // }, 400);
    Tool.closeModal(this.node);

    // scrollView.removeFromParent();
    // this.node.removeChild(Modal);
  },

  signIn() {
    this.canlendarJs.todayNode.getChildByName('item_do').active = true;
    this.canlendarJs.todayNode.getChildByName('item_undo').active = false;
    Func.PostSign().then(data => {
      if (data.Code === 1) {
        var signButton = cc.find('bg/btn-sign', this.node);
        cc.loader.loadRes('index/btn-hasSign', cc.SpriteFrame, function(err, spriteFrame) {
          signButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //更新头部数据
        Tool.updateHeader();
        alert(data.Message);
      }
    });
  },

  onLoad() {
    this.calendarNode = cc.find('bg/calendar', this.node);
    this.canlendarJs = this.calendarNode.getComponent('Calendar');
  },

  start() {
    Func.GetSignList().then(data => {
      if (data.Code === 1) {
        // 数据的年份 月份
        let year = data.List[0].signtime.match(/\d+/g)[0];
        let month = data.List[0].signtime.match(/\d+/g)[1] - 1; //为什么要减一

        this.canlendarJs.func.initCalendar.call(this.canlendarJs, data.List, year, month);
        //已签到 按钮变灰
        if (this.canlendarJs.todayNode.getChildByName('item_do').active) {
          var signButton = cc.find('bg/btn-sign', this.node);
          cc.loader.loadRes('index/btn-hasSign', cc.SpriteFrame, function(err, spriteFrame) {
            signButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            signButton.getComponent(cc.Button).interactable = false;
          });
        }
      } else {
        Msg.show(data.Message);
      }
    });
  }
});
