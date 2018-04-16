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
  onLoad() {
    this.walkTimer = Math.random() * 3 + 3;
    this.walking();
    setTimeout(() => {
      this.schedule(this.walking, this.walkTimer);
    }, this.walkTimer);
  },
  //机器人
  walking() {
    let x, y, direction, speed;
    //上下左右限定范围
    //小鸡当前的位置
    x = this.node.x;
    y = this.node.y;
    speed = this.walkTimer * 10;
    //在0~5中随机生成一个整数(上、下、左、右、斜左、斜右)
    if (this.isBoom) {
      direction = this.BoomDirection;
    } else {
      direction = Math.floor(Math.random() * 4);
    }
    x - speed < -300 ? (direction = 3) : false;
    x + speed > 300 ? (direction = 2) : false;
    y - speed < -400 ? (direction = 0) : false;
    y + speed > -100 ? (direction = 1) : false;
    this.BoomDirection = direction;
    switch (direction) {
      //向上移动
      case 0:
        y += speed;
        break;
      //向下移动
      case 1:
        y -= speed;
        break;
      //向左移动
      case 2:
        x -= speed;
        break;
      //向右移动
      case 3:
        x += speed;
        break;
    }
    console.log(x);
    this.action = cc.moveTo(this.walkTimer, x, y);
    this.node.runAction(this.action);
    // console.log(`x = ${x} ,y = ${y}`);
  }
  // update (dt) {},
});
