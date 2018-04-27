// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
  extends: cc.Component,

  properties: {},

  bindNode() {
    this.closeButton = cc.find('btn-close', this.node);
    this.textLabel = cc.find('bg/layout/text', this.node).getComponent(cc.Label);
    this.makingNode = cc.find('bg/layout/content/makings/img', this.node);
    this.makingLabel = cc.find('bg/layout/content/makings/value', this.node).getComponent(cc.Label);
    this.productNode = cc.find('bg/layout/content/product/img', this.node);
    this.productLabel = cc.find('bg/layout/content/product/value', this.node).getComponent(cc.Label);
    this.compoundButton = cc.find('bg/layout/compound', this.node);
    this.addButton = cc.find('bg/layout/content/product/choose/add', this.node);
    this.minusButton = cc.find('bg/layout/content/product/choose/minus', this.node);
    this.productValueLabel = cc.find('bg/layout/content/product/choose/value', this.node).getComponent(cc.Label);
    this.errorLabel = cc.find('bg/layout/error', this.node).getComponent(cc.Label);
  },
  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
  },
  initData() {},
  onLoad() {
    this.bindNode();
    this.initData();
    this.bindEvent();
  },

  start() {}

  // update (dt) {},
});
