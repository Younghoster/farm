var Data = require('Data');
var Func = Data.func;
var Tool = require('Tool').Tool;
var DateFormat = require('utils').fn;
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
    //鸡蛋
    Func.GetChickenAndEggCount().then(data => {
      if (data.Code === 1) {
        for (let i = 0; i < (data.Model.EggCount > 5 ? 6 : data.Model.EggCount); i++) {
          let dom = cc.find('bg/scrollview/view/content/upbg3/New Node/eggs_' + i, this.node);
          cc.loader.loadRes('Modal/upgrade/eggs', cc.SpriteFrame, (err, spriteFrame) => {
            dom.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
      } else {
        Msg.show(data.Message);
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
    let timeLabel = cc.find('info/time/value', itemNode).getComponent(cc.Label);
    let btn = cc.find('btn', itemNode);
    let btnLabel = cc.find('label', btn).getComponent(cc.Label);

    let createTime = data.CreateTime.match(/\d+/g)[0];
    let endTime = parseInt(createTime) + 48 * 60 * 60 * 1000;
    let nowDate = Date.parse(new Date());
    let time = DateFormat.timeDiff(nowDate, endTime);
    let cid = data.ID;

    idLabel.string = cid;
    eggCountLabel.Zstring = data.EggCount;
    if (time) {
      timeLabel.string = `${time.days * 24 + time.hours}小时${time.mins}分钟`;
    } else {
      timeLabel.string = '已超出兑换时间';
      btnLabel.string = '兑换过期';
      btn.color = cc.color('#999999');
      btn.getComponent(cc.Button).interactable = false;
    }

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
      Func.recoverChick(cid).then(data => {
        if (data.Code === 1) {
          itemNode.removeFromParent();
          if (this.contentNode.children.length <= 3) {
            this.page++;
            this.initData();
          }
          Msg.show('兑换成功,已存入仓库中');
        } else {
          Msg.show(data.Message);
        }
      });
    });

    this.contentNode.addChild(itemNode);
  },
  exChange() {
    // 放到Config.js做中转;
    Config.exchangeData.actualName = '鸡蛋';
    Config.exchangeData.actualCount = 1;
    Config.exchangeData.virtualName = '鸡蛋';
    Config.exchangeData.virtualCount = 1;
    Config.exchangeData.goodsType = 2;
    Config.backUrl = 'index';
    cc.director.loadScene('exchange');
    this.removePersist();
  },
  onLoad() {
    this.bindNode();
    this.initData();
    this.bindEvent();
  },
  removePersist() {
    Config.menuNode.active = false;
    Config.hearderNode.active = false;
  },
  start() {}
});
