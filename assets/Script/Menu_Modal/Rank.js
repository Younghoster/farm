// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Data = require("Data");
var Func = Data.func;
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {
    itemTop_Perfab: {
      default: null,
      type: cc.Prefab
    },
    item_Perfab: {
      default: null,
      type: cc.Prefab
    }
  },
  //绑定节点
  bindNode() {
    this.cancelButton = cc.find("btn-close", this.node);
    this.eggNumButton = cc.find("bg-rank/btn-eggNum", this.node);
    this.cheapButton = cc.find("bg-rank/btn-cheap", this.node);
    this.contentNode = cc.find("bg-rank/scrollView/view/content", this.node);
  },
  //绑定事件
  bindEvent() {
    //关闭按钮
    this.cancelButton.on("click", () => {
      Tool.closeModal(this.node);
    });
    this.eggNumButton.on("click", () => {
      this.eggNumButton.color = cc.color("#FFDE00");
      this.cheapButton.color = cc.color("#FFEF4D");
      this.GetEggRankList();
    });
    this.cheapButton.on("click", () => {
      this.eggNumButton.color = cc.color("#FFEF4D");
      this.cheapButton.color = cc.color("#FFDE00");
      this.GetCheapRankList();
    });
  },

  //
  assignData(data, node) {},

  GetEggRankList() {
    this.contentNode.removeAllChildren();
    for (let i = 0; i < 10; i++) {
      let itemNode = cc.instantiate(this.item_Perfab);
      this.assignData();
      this.contentNode.addChild(itemNode);
    }
  },
  GetCheapRankList() {
    this.contentNode.removeAllChildren();
    for (let i = 0; i < 10; i++) {
      let itemNode = cc.instantiate(this.item_Perfab);
      let imgNode = cc.find("item-content/img", itemNode);
      cc.loader.loadRes("Modal/Rank/coin", cc.SpriteFrame, (err, spriteFrame) => {
        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
      this.assignData();
      this.contentNode.addChild(itemNode);
    }
  },
  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.GetEggRankList();
  },
  start() {}

  // update (dt) {},
});
