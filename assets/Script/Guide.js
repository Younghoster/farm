'use strict';

var GuideSystem = {
  step: 0,
  stepGround: 0,
  scene: null,
  menu: null,
  isSetName: false,
  isInit: false,
  guide: function guide() {
    if (!this.isInit) {
      this.stepGround = Config.guideStep || 0;
      this.setStepGround();
      this.isInit = true;
    }
    var _this = this;
    this.scene = cc.find('Canvas');
    this.menu = cc.find('div_menu');
    cc.loader.loadRes('Prefab/guide', cc.Prefab, function (err, prefab) {
      if (err) {
        console.log(err);
        return;
      }
      var oldGuideNode = cc.find('guide');
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      _this.menuJS = _this.menu.getComponent('Menu');
      _this.idnexJs = _this.scene.getComponent('Index');
      var guideNode = cc.instantiate(prefab);
      var guideMaskNode = cc.find('mask-guide', guideNode);
      var modalSprite = cc.find('modal', guideMaskNode).getComponent(cc.Sprite);
      var circleNode = cc.find('circle', guideMaskNode);
      switch (_this.step) {
        case 0:
          _this.guideStep0(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 1:
          _this.guideStep1(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 2:
          _this.guideStep2(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 3:
          _this.guideStep3(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 4:
          _this.guideStep4(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 5:
          _this.guideStep5(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 6:
          _this.guideStep6(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 7:
          _this.guideStep7(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 8:
          _this.guideStep8(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 9:
          _this.guideStep9(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 10:
          _this.guideStep10(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
        case 11:
          _this.guideStep11(guideNode, guideMaskNode, modalSprite, circleNode);
          break;
      }
      _this.step++;

      _this.scene.parent.addChild(guideNode, 99);
    });
  },

  guideStep0: function guideStep0(guideNode, guideMaskNode, modalSprite, circleNode) {
    cc.loader.loadRes('guide/pic', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    circleNode.active = false;
    guideNode.on('click', this.guide, this);
  },
  guideStep1: function guideStep1(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;

    //设置position
    var btnMoreNode = cc.find('div_menu/more');
    var pos = btnMoreNode.getPosition();
    //将节点坐标转换成世界坐标系（左下角为原点）
    // let pos_3 = this.btnMoreNode.convertToWorldSpace(pos);
    // let pos_4 = this.btnMoreNode.getNodeToWorldTransform(pos);
    var pos_5 = btnMoreNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = btnMoreNode.height;
    var width = btnMoreNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;

    cc.loader.loadRes('guide/pic-1', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.once('click', function () {
      self.menuJS.func.showMenu.call(self.menuJS).then(function () {
        self.guide();
      });
    });
  },
  guideStep2: function guideStep2(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var shopNode = cc.find('div_menu/Menu/MenuList/menuScroll/view/content/shop');

    //设置position
    var pos = shopNode.getPosition();
    var pos_5 = shopNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = shopNode.height;
    var width = shopNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-2', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.menuJS.func.closeMenu.call(self.menuJS);
      setTimeout(function () {
        self.menuJS.func.loadSceneShop.call(self.menuJS);
      }, 500);
    });
  },
  guideStep3: function guideStep3(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;

    var goodsNode = cc.find('bg/PageView/view/content/page_0/goodsList/产蛋鸡', self.scene);

    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6.x, pos_6.y + 45);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = 110;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-3-0', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      goodsNode.emit('maskClick');
      self.guide();
    }, this);
  },
  //确定购买
  guideStep4: function guideStep4(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;

    modalSprite.node.active = false;
    circleNode = cc.find('circle', guideMaskNode);
    circleNode.active = false;
    setTimeout(function () {
      var SellNode = cc.find('Sell', self.scene);
      var enterButton = cc.find('bg/btn-group/enterButton', SellNode);
      //设置position
      var pos = enterButton.getPosition();
      var pos_5 = enterButton.getNodeToWorldTransformAR(pos);
      var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      var height = enterButton.height;
      var width = enterButton.width;

      guideMaskNode.height = width;
      guideMaskNode.width = width;
      var ModalNode = cc.find('Modal', SellNode);
      var ModalSprite = ModalNode.getComponent(cc.Sprite);
      ModalNode.opacity = 255;
      ModalNode.color = cc.color('#ffffff');
      cc.loader.loadRes('guide/pic-3', cc.SpriteFrame, function (err, spriteFrame) {
        ModalSprite.spriteFrame = spriteFrame;
      });

      guideMaskNode.on('click', function () {
        //买一只鸡
        self.PostBuy(18, 1).then(function (data) {
          if (data.Code === 1) {
            self.alertMsgNew();
            // console.log(self.step);
            var oldGuideNode = cc.find('guide');
            oldGuideNode ? oldGuideNode.removeFromParent() : false;
            setTimeout(function () {
              cc.director.loadScene('index', this.guide);
            }, 2000);
          } else {
            Msg.show(data.Message);
          }
        });

      });
    }, 500);
  },
  //显示饲料弹窗
  guideStep5: function guideStep5(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('hatch-box', self.scene);

    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6.x, pos_6.y + 45);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = 110;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-4', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.idnexJs.func.showFeedState.call(self.idnexJs);
      self.guide();
    }, this);
  },
  //添加饲料
  guideStep6: function guideStep6(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('feedState/icon-addFeeds', self.scene);

    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-5', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.idnexJs.func.addFeed.call(self.idnexJs);
      self.alertMsgNew();
      console.log(self.step);
      var oldGuideNode = cc.find('guide');
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      setTimeout(function () {
        self.guide();
      }, 2000);
    }, this);
  },
  guideStep7: function guideStep7(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('bg/house/btn', self.scene);
    self.ModalJs = goodsNode.getComponent('Modal');
    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = 200;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-6', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.ModalJs.func.showModal.call(self.ModalJs);
      setTimeout(function () {
        self.guide();
      }, 500);
    }, this);
  },
  guideStep8: function guideStep8(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('eggHouse/bg/content/hole0');
    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-7', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      cc.find('eggHouse').removeFromParent();
      self.alertMsgNew();
      console.log(self.step);
      var oldGuideNode = cc.find('guide');
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      setTimeout(function () {
        self.guide();
      }, 2000);
    }, this);
  },
  guideStep9: function guideStep9(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('div_action/clear', self.scene);
    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-8', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.alertMsgNew();
      console.log(self.step);
      var oldGuideNode = cc.find('guide');
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      setTimeout(function () {
        self.guide();
      }, 2000);
    }, this);
  },
  guideStep10: function guideStep10(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('div_action/feed', self.scene);
    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = height > width ? height : width;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-9', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.alertMsgNew();
      console.log(self.step);
      var oldGuideNode = cc.find('guide');
      oldGuideNode ? oldGuideNode.removeFromParent() : false;
      setTimeout(function () {
        self.guide();
      }, 2000);
    }, this);
  },
  //跳到农场
  guideStep11: function guideStep11(guideNode, guideMaskNode, modalSprite, circleNode) {
    var self = this;
    var goodsNode = cc.find('btn-farm', self.scene);
    //设置position
    var pos = goodsNode.getPosition();
    var pos_5 = goodsNode.getNodeToWorldTransformAR(pos);
    var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
    guideMaskNode.setPosition(pos_6);

    // 设置mask宽度和高度
    var height = goodsNode.height;
    var width = goodsNode.width;
    var radius = 100;
    guideMaskNode.height = radius + 15;
    guideMaskNode.width = radius + 15;
    cc.loader.loadRes('guide/pic-10', cc.SpriteFrame, function (err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on('click', function () {
      self.idnexJs.func.loadSceneFarm.call(self.idnexJs);
    }, this);
  },
  PostBuy: function PostBuy(prId, count) {
    count = count || 1;
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log('购买成功');
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log('购买失败');
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open('POST', Config.apiUrl + '/T_Base_Property/PostBuy', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //缺少这句，后台无法获取参数
      xhr.send('openID=' + Config.openID + '&count=' + count + '&prId=' + prId);
    });
  },
  alertMsgNew: function alertMsgNew() {
    var self = this;
    cc.loader.loadRes('Prefab/MsgNew', cc.Prefab, function (err, prefab) {
      if (err) {
        console.log(err);
        return;
      }
      self.stepGround++;
      self.setStep(self.stepGround).then(function (data) {
        if (data.Code === 1) {
          var AlertTip = cc.instantiate(prefab);

          var parentNode = cc.find('Canvas');

          self.setAlertIcon(AlertTip, self.step);
          parentNode.parent.addChild(AlertTip, 5);
          AlertTip.opacity = 0;
          AlertTip.runAction(cc.fadeIn(0.3));
          setTimeout(function () {
            AlertTip.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
              AlertTip.destroy();
            }, this)));
          }, 2000);
          return true;
        } else {
          return false;
        }
      });
    });
  },
  setAlertIcon: function setAlertIcon(dom, type) {
    var self = this;
    if (type - 1) {
      var icon1, icon2, icon3, txt1, txt2, txt3, layout1, layout2, layout3;
      layout1 = cc.find('New Node/layout1', dom);
      layout2 = cc.find('New Node/layout2', dom);
      layout3 = cc.find('New Node/layout3', dom);
      icon1 = cc.find('New Node/layout1/New Node/msg-ym', dom);
      icon2 = cc.find('New Node/layout2/New Node/msg-ym', dom);
      icon3 = cc.find('New Node/layout3/New Node/msg-ym', dom);
      txt1 = cc.find('New Node/layout1/label', dom);
      txt2 = cc.find('New Node/layout2/label', dom);
      txt3 = cc.find('New Node/layout3/label', dom);
      switch (self.step - 1) {
        case 4:
          {
            self.setIcon('Modal/Repertory/icon-1', icon1);
            txt1.getComponent(cc.Label).string = '饲料*2';
            self.setIcon('Modal/Msg/msg-exp', icon2);
            txt2.getComponent(cc.Label).string = '经验值*150';
            layout1.active = true;
            layout2.active = true;
            break;
          }
        case 6:
          {
            self.setIcon('Modal/Repertory/icon-asset02', icon1);
            txt1.getComponent(cc.Label).string = '积分*100';
            self.setIcon('Modal/Msg/msg-exp', icon2);
            txt2.getComponent(cc.Label).string = '经验值*100';
            layout1.active = true;
            layout2.active = true;
            break;
          }
        case 8:
          {
            self.setIcon('Modal/Repertory/icon-1', icon1);
            txt1.getComponent(cc.Label).string = '饲料*2';
            self.setIcon('Modal/Msg/msg-exp', icon2);
            txt2.getComponent(cc.Label).string = '经验值*100';
            layout1.active = true;
            layout2.active = true;
            break;
          }
        case 9:
          {
            txt1.getComponent(cc.Label).string = '粪便*4';
            self.setIcon('Modal/Msg/msg-exp', icon2);
            txt2.getComponent(cc.Label).string = '经验值*100';
            layout1.active = true;
            layout2.active = true;
            break;
          }
        case 10:
          {
            self.setIcon('Modal/Msg/msg-exp', icon2);
            txt2.getComponent(cc.Label).string = '经验值*100';
            layout2.active = true;
            break;
          }
        default:
          {
            break;
          }
      }
    }
  },
  setIcon: function setIcon(src, dom) {
    var self = this;
    cc.loader.loadRes(src, cc.SpriteFrame, function (err, spriteFrame) {
      dom.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
  },
  UpdateUserLoginTime: function UpdateUserLoginTime() {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            response = JSON.parse(response);
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open('POST', Config.apiUrl + '/T_Base_User/UpdateUserLoginTime');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //缺少这句，后台无法获取参数
      xhr.send('OpenID=' + Config.openID);
    });
  },
  //设置step
  setStep: function setStep(step) {
    var isSkip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log(data.Message);
            reject(response);
          }
        }
      };
      xhr.open('POST', Config.apiUrl + '/T_Base_User/NoviceGuidance', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //缺少这句，后台无法获取参数
      xhr.send('openID=' + Config.openID + '&step=' + step + '&isSkip=' + isSkip);
    });
  },

  // 通过stepGround 设置step进行到了哪一步
  setStepGround: function setStepGround() {
    switch (this.stepGround) {
      case 0:
        this.step = 0;
        break;
      case 1:
        this.step = 5;
        break;
      case 2:
        this.step = 7;
        break;
      case 3:
        this.step = 9;
        break;
      case 4:
        this.step = 10;
        break;
      case 5:
        this.step = 11;
        break;
      default:
        this.step = 0;
        break;
    }
  }
};