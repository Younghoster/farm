var ToolJs = require('Tool');
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  // onLoad () {},

  start() {},
  slideToggle(e) {
    let self = this;
    let toggleDom = cc.find('scrollview/view/layout/itemcontent' + e.currentTarget._name.substr(8, 1), this.node);
    let toggleTit = cc.find('scrollview/view/layout/helplist' + e.currentTarget._name.substr(8, 1), this.node);
    let toggleIcon = cc.find('New Node/arrow_down', toggleTit);
    if (toggleDom.active) {
      toggleIcon.rotation = 0;
      toggleDom.active = false;
      toggleDom.runAction(cc.fadeOut(0.3));
    } else {
      toggleIcon.rotation = 180;
      toggleDom.runAction(cc.fadeIn(0.3));
      toggleDom.active = true;
    }
  },
  back() {
    cc.director.loadScene(Config.backUrl);
  }
  // update (dt) {},
});
