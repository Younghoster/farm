// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
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
    },
    iconBtn01: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn02: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn03: {
      default: null,
      type: cc.SpriteFrame
    }
  },
  page: null,
  //绑定节点
  bindNode() {
    this.cancelButton = cc.find('btn-close', this.node);
    this.eggNumButton = cc.find('bg-rank/btn-eggNum', this.node);
    this.cheapButton = cc.find('bg-rank/btn-cheap', this.node);
    this.contentNode = cc.find('bg-rank/scrollView/view/content', this.node);
  },
  //绑定事件
  bindEvent() {
    //关闭按钮
    this.cancelButton.on('click', () => {
      Tool.closeModal(this.node);
    });
    //产蛋榜
    this.eggNumButton.on('click', () => {
      this.contentNode.removeAllChildren();
      this.eggNumButton.color = cc.color('#FFEF4D');
      this.cheapButton.color = cc.color('#FFDE00');
      this.GetEggRankList();
    });

    //下拉刷新
    this.content2ListNode.on('bounce-bottom', () => {
      this.GetEggRankList();
    });
  },

  //产蛋赋值
  assignData(data, itemNode) {
    let advisor = data.path;
    let name = data.RealName;
    let grade = data.Grade;
    let rank = data.Row;

    if (rank <= 3) {
      //Top3
      let item = cc.instantiate(this.itemTop3);
      let rankNode = cc.find('item-content/icon-no1', itemNode);
      switch (rank) {
        case 1:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn01;
          break;
        case 2:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn02;
          break;
        case 3:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn03;
          break;
      }
    } else {
      //大于3 的排名
      let item = cc.instantiate(this.itemFriend);
      let rankLabel = cc.find('item-content/rank/text', itemNode).getComponent(cc.Label);
      rankLabel.string = rank;
    }

    let advisorSprite = cc.find('item-content/advisor-box/adviosr-mask/advisor', itemNode).getComponent(cc.Sprite);
    let nameLabel = cc.find('item-content/advisor-box/name', itemNode).getComponent(cc.Label);
    let countLabel = cc.find('item-content/box/textbox/label', itemNode).getComponent(cc.Label);
  },

  GetEggRankList() {
    for (let i = 0; i < 10; i++) {
      let itemNode = cc.instantiate(this.item_Perfab);
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
