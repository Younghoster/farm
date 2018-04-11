var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  bindNode() {
    this.closeButton = cc.find('btn-close', this.node);
    this.contentNode = cc.find('bg/content', this.node);
    this.holeNodeList = [];
    for (let i = 0; i < 10; i++) {
      this.holeNodeList[0] = cc.find(`hole${i}`, this.contentNode);
    }
  },
  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
  },
  initData() {},
  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.initData();
  },

  start() {}

  // update (dt) {},
});
