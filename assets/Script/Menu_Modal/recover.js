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
  page: null,
  ctor() {
    this.page = 1;
  },
  bindNode() {
    this.closeButton = cc.find('btn-close', this.node);
    this.scrollview = cc.find('bg/scrollview', this.node);
    this.contentNode = cc.find('bg/scrollview/view/content', this.node);
  },
  bindEvent() {
    this.closeButton.on('click', () => {
      Tool.closeModal(this.node);
    });
    //下拉加载新的数据
    this.scrollview.on('bounce-bottom', () => {
      this.page++;
      this.initData();
    });
  },
  initData() {
    Func.GetRecoverData(this.page).then(data => {
      if (data.Code === 1) {
        let list = data.List;
        for (let i = 0; i < list.length; i++) {
          let itemNode = cc.instantiate(this.item_prefab);
          this.assignData(list[i], itemNode);
        }
      }
    });
  },
  //赋值
  assignData(data, itemNode) {
    let idLabel = cc.find('info/id/value', itemNode).getComponent(cc.Label);
    let eggCountLabel = cc.find('info/count/value', itemNode).getComponent(cc.Label);
    let msgLabel = cc.find('info/msg/value', itemNode).getComponent(cc.Label);
    let msgKeyNode = cc.find('info/msg/key', itemNode);
    let msgKeyLabel = msgKeyNode.getComponent(cc.Label);
    let btn = cc.find('btn', itemNode);
    let btnLabel = cc.find('label', btn).getComponent(cc.Label);

    idLabel.string = data.ID;
    eggCountLabel.string = data.EggCount;
    if (data.Money > 0) {
      msgLabel.string = `${data.Money}个牧场币`;
    } else {
      msgKeyNode.color = cc.color('#74DA72');
      msgKeyLabel.string = '可免费兑换小鸡';
      msgLabel.string = '';
      btnLabel.string = '兑换';
      btn.color = cc.color('#ff4c4c');
    }

    //绑定兑换事件
    btn.on('click', () => {
      //接口未完成
      // Func.recoverChick().then(data => {
      //   if (data.Code === 1) {
      //     this.initData();
      //     Msg.show('兑换成功');
      //   } else {
      //     Msg.show(data.Message);
      //   }
      // });
      Msg.show('接口还在开发中');
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
