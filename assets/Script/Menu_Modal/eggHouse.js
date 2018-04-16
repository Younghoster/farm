var Data = require("Data");
var Func = Data.func;
var Tool = require("Tool").Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  bindNode() {
    let self = this;
    this.closeButton = cc.find("btn-close", this.node);
    this.contentNode = cc.find("bg/content", this.node);
    this.holeNodeList = [];
    Func.getEggLayInfo().then(data => {
      if (data.Code === 1) {
        console.log(data.Model.ShedRankCount);
        for (let i = 0; i < 10; i++) {
          if (i < data.Model.EggCount) {
            this.holeNodeList[i] = cc.find(`hole${i}`, this.contentNode).getComponent(cc.Sprite);
            cc.loader.loadRes("eggHouse/img2", cc.SpriteFrame, function(err, spriteFrame) {
              self.holeNodeList[i].spriteFrame = spriteFrame;
            });
          } else if (i < data.Model.ShedRankCount) {
            this.holeNodeList[i] = cc.find(`hole${i}`, this.contentNode).getComponent(cc.Sprite);
            cc.loader.loadRes("eggHouse/img3", cc.SpriteFrame, function(err, spriteFrame) {
              self.holeNodeList[i].spriteFrame = spriteFrame;
            });
          } else {
            this.holeNodeList[i] = cc.find(`hole${i}`, this.contentNode).getComponent(cc.Sprite);
            cc.loader.loadRes("eggHouse/img1", cc.SpriteFrame, function(err, spriteFrame) {
              self.holeNodeList[i].spriteFrame = spriteFrame;
            });
          }
        }
      } else {
        Msg.show(data.Message);
      }
    });
  },

  bindEvent() {
    this.closeButton.on("click", () => {
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
