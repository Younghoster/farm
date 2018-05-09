var farmGuid = {
  state: 0,
  prefabItem: null,
  clickBoxPos: null,
  modalSprite: null,
  circleNode: null,
  tool: null,
  tip: null,
  water: null,
  weed: null,
  disinsection: null,
  item: null,
  canvas: null,
  prefabBox: null,
  btnMoreNode: null,
  fertilizer: null,
  fertilizerList: null,
  plantok: null,
  arrow: null,
  pos: null,
  pos_5: null,
  pos_6: null,
  tipPos_: null,
  isTouch: false,
  offsetY: 0,
  textintro: null,
  // btn2: null, 跳过按钮
  getPrefab: function(i) {
    var self = this;
    cc.loader.loadRes('Prefab/guide', cc.Prefab, function(err, prefab) {
      if (err) {
        console.log(err);
        return;
      }
      self.prefabItem = cc.instantiate(prefab);
      self.clickBoxPos = cc.find('mask-guide', self.prefabItem);
      self.tip = cc.find('tip', self.prefabItem);
      self.item = cc.find('item', self.prefabItem);
      self.modalBlock = cc.find('mask-guide/modal', self.prefabItem);
      // self.btn2 = cc.find('btn2', self.prefabItem);
      self.tool = cc.find('tool', self.prefabItem);
      self.weed = cc.find('plant-weed', self.prefabItem);
      self.water = cc.find('plant-water', self.prefabItem);
      self.plantok = cc.find('plant-ok', self.prefabItem);
      self.fertilizer = cc.find('plant', self.prefabItem);
      self.textintro = cc.find('textintro', self.prefabItem);
      self.fertilizerList = cc.find('fertilizerList', self.prefabItem);
      self.disinsection = cc.find('plant-disinsection', self.prefabItem);
      self.arrow = cc.find('jt', self.prefabItem);
      self.modalSprite = cc.find('modal', self.clickBoxPos).getComponent(cc.Sprite);
      self.circleNode = cc.find('circle', self.clickBoxPos);

      self.canvas = cc.find('Canvas');
      self.prefabBox = self.canvas.parent;
      self.prefabBox.addChild(self.prefabItem);
      self.setConstDom();
      switch (i) {
        case 1: {
          self.step1();
          break;
        }
      }
    });
  },
  //设置固定的资源
  setConstDom: function() {
    var self = this;
    var tipBox = cc.find('bg/mapNew/item0', self.canvas);
    var tipPos = tipBox.getPosition();
    self.tipPos_ = tipBox.getNodeToWorldTransformAR(tipPos);
    cc.loader.loadRes('guide/black', cc.SpriteFrame, function(err, spriteFrame) {
      self.modalBlock.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });

    self.item.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.tip.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.water.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.disinsection.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.weed.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.fertilizer.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    self.plantok.setPosition(self.tipPos_.tx, self.tipPos_.ty);
    // self.btn2.setPosition(600, 1250);
    // self.btn2.active = true;
    self.tip.active = true;
    self.item.active = true;
    self.textintro.active = true;
  },
  //设置position
  setPosition_: function(src, x, y) {
    var self = this;
    self.btnMoreNode = cc.find(src, self.canvas);
    self.pos = self.btnMoreNode.getPosition();
    self.pos_5 = self.btnMoreNode.getNodeToWorldTransformAR(self.pos);
    self.pos_6 = self.prefabItem.convertToNodeSpace(cc.v2(self.pos_5.tx, self.pos_5.ty));
    if (x) {
      self.clickBoxPos.setPosition(x, y);
    } else {
      self.clickBoxPos.setPosition(self.pos_6);
      console.log(self.pos_6.x, self.pos_6.y);
      self.arrowJump(self.arrow, self.pos_6.x, self.pos_6.y + 150);
    }
    console.log(self.pos_6);
  },
  // 设置mask宽度和高度
  setMaskSize_: function(e) {
    var self = this;
    var height = self.btnMoreNode.height;
    var width = self.btnMoreNode.width;
    if (e) {
      var radius = 100;
    } else {
      var radius = height > width ? height : width;
    }

    self.clickBoxPos.height = radius + 15;
    self.clickBoxPos.width = radius + 15;
  },
  //播种
  step1: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_01');
    self.setTxtIntro('guide/farm-text01', self.textintro, self.pos_6.x + 180, self.pos_6.y + 120);
    self.setMaskSize_();
    cc.loader.loadRes('Farm/seed', cc.SpriteFrame, function(err, spriteFrame) {
      self.tip.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });

    self.arrow.active = true;
    self.offsetY = 110;
    self.moveAddListen();
    self.endAddListen(self.tool, self.tip, function() {
      self.step2();
    });
  },

  //浇水
  step2: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_02');
    self.setTxtIntro('guide/farm-text02', self.textintro, self.pos_6.x, self.pos_6.y + 80);
    self.setMaskSize_();
    self.water.active = true;
    cc.loader.loadRes('Farm/jiaoshui', cc.SpriteFrame, function(err, spriteFrame) {
      self.tool.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    self.offsetY = 160;
    self.moveAddListen();
    self.endAddListen(self.tool, self.water, function() {
      self.step3();
    });
  },
  //除草
  step3: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_03');
    self.setTxtIntro('guide/farm-text04', self.textintro, self.pos_6.x, self.pos_6.y + 80);
    self.setMaskSize_();
    self.weed.active = true;
    cc.loader.loadRes('Farm/chucao', cc.SpriteFrame, function(err, spriteFrame) {
      self.tool.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    self.offsetY = 200;
    self.moveAddListen();
    self.endAddListen(self.tool, self.weed, function() {
      self.step4();
    });
  },
  //除虫
  step4: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_04');
    self.setTxtIntro('guide/farm-text06', self.textintro, self.pos_6.x, self.pos_6.y + 80);
    self.setMaskSize_();
    self.disinsection.active = true;
    cc.loader.loadRes('Farm/chuchong', cc.SpriteFrame, function(err, spriteFrame) {
      self.tool.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    self.offsetY = 200;
    self.moveAddListen();
    self.endAddListen(self.tool, self.disinsection, function() {
      self.step5();
    });
  },
  //施肥选择肥料
  step5: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_05');
    self.setTxtIntro('guide/farm-text08', self.textintro, self.pos_6.x, self.pos_6.y + 80);
    self.setMaskSize_();
    self.fertilizer.active = true;
    self.clickBoxPos.on('touchstart', function() {
      self.fertilizerList.setPosition(self.pos_6.x, self.pos_6.y + 90);
      self.fertilizerList.active = true;
      self.step6();
    });
  },
  //施肥
  step6: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_05', self.pos_6.x - 60, self.pos_6.y + 150);
    self.setTxtIntro('guide/farm-text09', self.textintro, self.pos_6.x - 60, self.pos_6.y + 230);
    self.arrowJump(self.arrow, self.pos_6.x - 60, self.pos_6.y + 300);
    self.setMaskSize_(1);
    self.fertilizer.active = true;
    cc.loader.loadRes('Farm/zhongzi', cc.SpriteFrame, function(err, spriteFrame) {
      self.tool.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    self.offsetY = 140;
    self.moveAddListen(function() {
      self.fertilizerList.active = false;
    });
    self.endAddListen(self.tool, self.fertilizer, function() {
      self.step7();
    });
  },
  //收割
  step7: function() {
    var self = this;
    self.setPosition_('tool/layout/farm_icon_06');
    self.setTxtIntro('guide/farm-text11', self.textintro, self.pos_6.x, self.pos_6.y + 80);
    self.setMaskSize_();
    self.plantok.active = true;
    cc.loader.loadRes('Farm/liandao', cc.SpriteFrame, function(err, spriteFrame) {
      self.tool.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    self.offsetY = 250;
    self.moveAddListen();
    self.endAddListen(self.tool, self.plantok, function() {
      self.step8();
    });
  },
  step8: function() {
    var self = this;

    self.prefabItem.removeFromParent();
    self.alertMdal();
  },
  moveAddListen: function(callBack) {
    var self = this;
    self.clickBoxPos.on('touchmove', function(e) {
      if (!self.isTouch) {
        self.arrowJump(self.arrow, self.tipPos_.tx, self.tipPos_.ty + self.offsetY);
      }
      self.isTouch = true;
      self.clickBoxPos.setPosition(e.getLocation().x, e.getLocation().y);
      self.tool.active = true;
      self.tool.setPosition(e.getLocation().x, e.getLocation().y);
      if (callBack) {
        callBack();
      }
    });
  },
  endAddListen: function(removedom1, removedom2, callBack) {
    var self = this;
    self.clickBoxPos.on(
      'touchend',
      function(e) {
        if (self.isBoom(e.getLocation().x, e.getLocation().y)) {
          self.offListen();
          removedom1.active = false;
          removedom2.active = false;
          self.isTouch = false;
          if (callBack) {
            callBack();
          }
        }
      },
      this
    );
  },
  offListen: function() {
    var self = this;
    self.clickBoxPos.off('touchstart');
    self.clickBoxPos.off('touchmove');
    self.clickBoxPos.off('touchend');
  },
  //跳动箭头
  arrowJump: function(dom, x, y) {
    var self = this;
    dom.active = true;
    dom.setPosition(x, y);
    dom.stopAllActions();
    dom.runAction(cc.repeatForever(cc.jumpTo(1, x, y, 20, 1)));
  },
  isBoom: function(x, y) {
    var self = this;
    if (x > self.tipPos_.tx - 60 && x < self.tipPos_.tx + 60 && y > self.tipPos_.ty - 60 && y < self.tipPos_.ty + 60) {
      return true;
    } else {
      return false;
    }
  },
  setIcon: function(src, dom) {
    var self = this;
    cc.loader.loadRes(src, cc.SpriteFrame, function(err, spriteFrame) {
      dom.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
  },
  setTxtIntro: function(src, dom, x, y) {
    var self = this;
    cc.loader.loadRes(src, cc.SpriteFrame, function(err, spriteFrame) {
      dom.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
    dom.setPosition(x, y);
  },
  alertMdal: function() {
    var self = this;
    cc.loader.loadRes('Prefab/MsgNew', cc.Prefab, function(err, prefab) {
      if (err) {
        console.log(err);
        return;
      }
      var AlertTip = cc.instantiate(prefab);
      var parentNode = cc.find('Canvas');
      layout1 = cc.find('New Node/layout1', AlertTip);
      layout2 = cc.find('New Node/layout2', AlertTip);
      layout3 = cc.find('New Node/layout3', AlertTip);
      icon1 = cc.find('New Node/layout1/New Node/msg-ym', AlertTip);
      icon2 = cc.find('New Node/layout2/New Node/msg-ym', AlertTip);
      icon3 = cc.find('New Node/layout3/New Node/msg-ym', AlertTip);
      txt1 = cc.find('New Node/layout1/label', AlertTip);
      txt2 = cc.find('New Node/layout2/label', AlertTip);
      txt3 = cc.find('New Node/layout3/label', AlertTip);
      self.setIcon('Modal/Msg/msg-ym', icon1);
      self.setIcon('Modal/Repertory/icon-asset02', icon2);
      self.setIcon('Modal/Msg/msg-exp', icon3);
      layout1.active = true;
      layout2.active = true;
      layout3.active = true;
      parentNode.parent.addChild(AlertTip, 5);
      AlertTip.opacity = 0;
      AlertTip.runAction(cc.fadeIn(0.3));
      setTimeout(function() {
        AlertTip.runAction(
          cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(function() {
              AlertTip.destroy();
            }, this)
          )
        );
      }, 2000);
    });
  }
};
