var Tool = {
  setBarColor: function(bar, value) {
    var Node = bar;
    if (value < 0.6) {
      Node.color = cc.color("#FF4A4A");
    } else if (value < 0.8) {
      Node.color = cc.color("#FFB70B");
    } else {
      Node.color = cc.color("#74DA72");
    }
  },
  setLabelColor: function(label, value) {
    var node = label.node;
    if (value < 0.6) {
      Node.color = cc.color("#FF4A4A");
    } else if (value < 0.8) {
      Node.color = cc.color("#FFB70B");
    } else {
      Node.color = cc.color("#74DA72");
    }
  },
  closeModal: function(node) {
    var action = cc.sequence(cc.fadeOut(0.3), cc.callFunc(node.removeFromParent, node));
    node.runAction(action);
  },
  once: function(fn) {
    var result;
    return function() {
      if (fn) {
        result = fn.apply(this, arguments);
        fn = null;
      }
      return result;
    };
  },
  //跳动的动画(节点、时间)
  animateUpOrDown(node, time, y) {
    let upOrDown = true;
    setInterval(() => {
      let action = upOrDown ? cc.moveBy(time, 0, y) : cc.moveBy(time, 0, -y);
      node.runAction(action);
      upOrDown = !upOrDown;
    }, time * 1000);
  }
};

module.exports = {
  Tool: Tool
};
