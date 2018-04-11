var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
cc.Class({
  extends: cc.Component,

  properties: {
    item_prefab: {
      default: null,
      type: cc.Prefab
    }
  },

  bindNode() {
    this.closeButton = cc.find('btn-close', this.node);
    this.contentNode = cc.find('bg/scrollview/view/content', this.node);
  },
  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
  },
  initData() {
    for (let i = 0; i < 5; i++) {
      let itemNode = cc.instantiate(this.item_prefab);
      this.contentNode.addChild(itemNode);
    }
  },
  onLoad() {
    this.bindNode();
    this.initData();
    this.bindEvent();
  },

  start() {}
});
