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
      this.assignData(list[i], itemNode);
    }
  },
  //赋值
  assignData(data, itemNode) {
    let idLabel = cc.find('info/id/value', itemNode).getComponent(cc.Label);
    let eggCountLabel = cc.find('count/id/value', itemNode).getComponent(cc.Label);
    let msgLabel = cc.find('msg/id/value', itemNode).getComponent(cc.Label);
    let btn = cc.find('btn', itemNode);

    idLabel.string = data.ID;
    eggCountLabel.string = data.Count;
    msgLabel.string = `${data.Money}个牧场币`;

    //绑定兑换事件
    btn.on('click', () => {
      //接口未完成
      Func.recoverChick().then(data => {
        if (data.Code === 1) {
          this.initData();
          Msg.show('兑换成功');
        } else {
          Msg.show(data.Message);
        }
      });
    });

    this.contentNode.addChild(itemNode);
  },
  onLoad() {
    this.bindNode();
    this.initData();
    this.bindEvent();
  },

  start() {}
});
