"use strict";

var GuideSystem = {
  step: 0,
  scene: null,
  isSetName: false,
  guide: function guide() {
    var _this = this;
    this.scene = cc.find("Canvas");
    this.setName().then(function() {
      cc.loader.loadRes("Prefab/guide", cc.Prefab, function(err, prefab) {
        if (err) {
          console.log(err);
          return;
        }
        var oldGuideNode = cc.find("guide", _this.scene);
        oldGuideNode ? oldGuideNode.removeFromParent() : false;
        var guideNode = cc.instantiate(prefab);
        var guideMaskNode = cc.find("mask-guide", guideNode);
        var modalSprite = cc.find("modal", guideMaskNode).getComponent(cc.Sprite);
        var circleNode = cc.find("circle", guideMaskNode);
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
        }
        _this.step++;
        _this.scene.addChild(guideNode, 99);
      });
    });
  },
  //设置昵称
  setName: function setName() {
    var _this9 = this;

    var that = this;

    return new Promise(function(resolve, reject) {
      if (!_this9.isSetName) {
        Alert.show("0", null, null, null, null, null, "Prefab/Modal/Usercenter/NameEdit", function() {
          var self = this;
          cc.loader.loadRes(Alert._newPrefabUrl, cc.Prefab, function(error, prefab) {
            if (error) {
              cc.error(error);
              return;
            }
            // 实例
            var alert = cc.instantiate(prefab);
            // Alert 持有
            Alert._alert = alert;
            //动画加载
            self.ready();
            // 父视图
            Alert._alert.parent = cc.find("Canvas");
            // 展现 alert
            self.startFadeIn();
            //自定义事件
            var saveButton = cc.find("alertBackground/enterButton", alert);
            var introLabel = cc.find("alertBackground/intro/tel", alert).getComponent(cc.Label);
            introLabel.string = "请输入您的昵称";
            //保存
            saveButton.on("click", function() {
              var name = cc.find("alertBackground/input/editbox", alert);
              var title = cc.find("alertBackground/intro/detailLabel", alert).getComponent(cc.Label);
              var intro = cc.find("alertBackground/intro/tel", alert);
              intro.getComponent(cc.Label).string = "请输入您的昵称";
              that.SaveEditName(name.getComponent(cc.EditBox).string).then(function(data) {
                if (data.Code == 1 || data.Code == 0) {
                  alert.removeFromParent();
                  Msg.show("修改成功");
                  that.isSetName = true;
                  setTimeout(function() {
                    resolve(true);
                  }, 2000);
                } else if (data.Code == "333") {
                  intro.getComponent(cc.Label).string = "您修改的昵称已经存在！";
                } else if (data.Code == "000") {
                  intro.getComponent(cc.Label).string = "您的牧场币不足200！无法修改！";
                }

                intro.getComponent(cc.Label).fontSize = 28;
                intro.getComponent(cc.Label).lineHeight = 80;
              });
            });
            //取消
            self.newButtonEvent(alert, "close");
          });
        });
      } else {
        resolve(true);
      }
    });
  },

  guideStep0: function guideStep0(guideNode, guideMaskNode, modalSprite, circleNode) {
    cc.loader.loadRes("guide/pic", cc.SpriteFrame, function(err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    circleNode.active = false;

    guideNode.on("click", this.guide, this);
  },
  guideStep1: function guideStep1(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this2 = this;

    this.sceneJS = this.scene.getComponent("Index");
    //设置position
    var btnMoreNode = cc.find("div_menu/more", this.scene);
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

    cc.loader.loadRes("guide/pic-1", cc.SpriteFrame, function(err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.once(
      "click",
      function() {
        _this2.sceneJS.func.showMenu.call(_this2.sceneJS).then(function() {
          _this2.guide();
        });
      },
      this
    );
  },
  guideStep2: function guideStep2(guideNode, guideMaskNode, modalSprite, circleNode) {
    var shopNode = cc.find("div_menu/Menu/MenuList/menuScroll/view/content/shop", this.scene);

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
    cc.loader.loadRes("guide/pic-2", cc.SpriteFrame, function(err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on("click", this.sceneJS.func.loadSceneShop, this);
  },
  guideStep3: function guideStep3(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this3 = this;

    var goodsNode = cc.find("bg/PageView/view/content/page_0/goodsList/goods", this.scene);

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
    cc.loader.loadRes("guide/pic-3-0", cc.SpriteFrame, function(err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });
    //绑定事件
    guideMaskNode.on(
      "click",
      function() {
        goodsNode.emit("maskClick");
        _this3.guide();
      },
      this
    );
  },

  //确定购买
  guideStep4: function guideStep4(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this4 = this;

    modalSprite.node.active = false;
    circleNode = cc.find("circle", guideMaskNode);
    circleNode.active = false;
    setTimeout(function() {
      var SellNode = cc.find("Sell", _this4.scene);
      var enterButton = cc.find("bg/btn-group/enterButton", SellNode);
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
      var ModalNode = cc.find("Modal", SellNode);
      var ModalSprite = ModalNode.getComponent(cc.Sprite);
      ModalNode.opacity = 255;
      ModalNode.color = cc.color("#ffffff");
      cc.loader.loadRes("guide/pic-3", cc.SpriteFrame, function(err, spriteFrame) {
        ModalSprite.spriteFrame = spriteFrame;
      });

      guideMaskNode.on("click", function() {
        //买一个蛋
        _this4.PostBuy(8, 1).then(function(data) {
          if (data.Code === 1) {
            Msg.show("购买成功");
            setTimeout(function() {
              cc.director.loadScene("index", this.guide);
            }, 1000);
          } else {
            Msg.show(data.Message);
          }
        });
      });
    }, 500);
  },

  //点击仓库
  guideStep5: function guideStep5(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this5 = this;

    this.sceneJS = this.scene.getComponent("Index");
    this.sceneJS.func.showMenu.call(this.sceneJS).then(function() {
      var repertoryNode = cc.find("div_menu/Menu/MenuList/menuScroll/view/content/repertory", _this5.scene);

      //设置position
      var pos = repertoryNode.getPosition();
      var pos_5 = repertoryNode.getNodeToWorldTransformAR(pos);
      var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      var height = repertoryNode.height;
      var width = repertoryNode.width;
      var radius = height > width ? height : width;
      guideMaskNode.height = radius + 15;
      guideMaskNode.width = radius + 15;
      cc.loader.loadRes("guide/pic-4", cc.SpriteFrame, function(err, spriteFrame) {
        modalSprite.spriteFrame = spriteFrame;
      });
      //绑定事件
      guideMaskNode.on("click", _this5.sceneJS.func.loadSceneRepertory, _this5);
    });
  },

  //点击小鸡
  guideStep6: function guideStep6(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this6 = this;

    setTimeout(function() {
      _this6.sceneJS = _this6.scene.getComponent("Repertory");
      var itemNode = cc.find("bg/bg-f3/PageView/view/content/page_1/goodsList/item", _this6.scene);
      //设置position
      var pos = itemNode.getPosition();
      var pos_5 = itemNode.getNodeToWorldTransformAR(pos);
      var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);
      // 设置mask宽度和高度
      var height = itemNode.height;
      var width = itemNode.width;
      var radius = height > width ? height : width;
      guideMaskNode.height = radius + 15;
      guideMaskNode.width = radius + 15;
      cc.loader.loadRes("guide/pic-5", cc.SpriteFrame, function(err, spriteFrame) {
        modalSprite.spriteFrame = spriteFrame;
      });
      //绑定事件
      guideMaskNode.on(
        "click",
        function() {
          itemNode.emit("maskClick");
          _this6.guide();
        },
        _this6
      );
    }, 500);
  },

  //孵化小鸡
  guideStep7: function guideStep7(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this7 = this;

    modalSprite.node.active = false;
    var guideMask = guideMaskNode.getComponent(cc.Mask);
    guideMask.type = 0;
    circleNode = cc.find("circle", guideMaskNode);
    circleNode.active = false;
    setTimeout(function() {
      var enterButton = cc.find("modal/div/btn-group/btn-red", _this7.scene);

      //设置position
      var pos = enterButton.getPosition();
      var pos_5 = enterButton.getNodeToWorldTransformAR(pos);
      var pos_6 = guideNode.convertToNodeSpace(cc.v2(pos_5.tx, pos_5.ty));
      guideMaskNode.setPosition(pos_6);

      // 设置mask宽度和高度
      var height = enterButton.height;
      var width = enterButton.width;

      guideMaskNode.height = height;
      guideMaskNode.width = width;

      var ModalNode = cc.find("modal/bg", _this7.scene);
      var ModalSprite = ModalNode.getComponent(cc.Sprite);
      ModalNode.opacity = 255;
      ModalNode.color = cc.color("#ffffff");

      cc.loader.loadRes("guide/pic-6", cc.SpriteFrame, function(err, spriteFrame) {
        ModalSprite.spriteFrame = spriteFrame;
      });

      guideMaskNode.on("click", function() {
        enterButton.emit("maskClick");
      });
    }, 500);
  },

  //朕已阅
  guideStep8: function guideStep8(guideNode, guideMaskNode, modalSprite, circleNode) {
    var _this8 = this;
    var guideMask = guideMaskNode.getComponent(cc.Mask);
    guideMask.type = 0;
    var button = cc.find("btn", guideNode);
    button.active = true;
    // circleNode = cc.find("circle", guideMaskNode);
    // circleNode.active = false;

    cc.loader.loadRes("guide/pic-7", cc.SpriteFrame, function(err, spriteFrame) {
      modalSprite.spriteFrame = spriteFrame;
    });

    button.on("click", function() {
      Config.firstLogin = false;
      guideNode.removeFromParent();
      Msg.show("恭喜你，完成了新手指引！");
      _this8.UpdateUserLoginTime();
    });
  },
  PostBuy: function PostBuy(prId, count) {
    count = count || 1;
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("购买成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("购买失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_Property/PostBuy", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + Config.openID + "&count=" + count + "&prId=" + prId);
    });
  },
  UpdateUserLoginTime: function UpdateUserLoginTime() {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
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
      xhr.open("POST", Config.apiUrl + "/T_Base_User/UpdateUserLoginTime");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("OpenID=" + Config.openID);
    });
  },
  //修改姓名
  SaveEditName: function SaveEditName(updatename) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            reject(response);
          }
        }
      };
      // POST方法1
      xhr.open(
        "POST",
        Config.apiUrl + "/T_Base_User/UpdateName?openId=" + Config.openID + "&updatename=" + updatename,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  }
};

// var GuideSystem = (function() {
//   var _step = 0;
//   var guide = function(){
//     cc.loader.loadRes("Prefab/guide", cc.Prefab, (err, prefab) => {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         let oldGuideNode = cc.find("guide", this.node);
//         oldGuideNode ? oldGuideNode.removeFromParent() : false;
//         let guideNode = cc.instantiate(prefab);
//         let guideMaskNode = cc.find("mask-guide", guideNode);
//         let modalSprite = cc.find("modal", guideMaskNode).getComponent(cc.Sprite);
//         let circleNode = cc.find("circle", guideMaskNode);
//         switch (this.step) {
//           case 0:
//             this.guideStep0(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//           case 1:
//             this.guideStep1(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//           case 2:
//             this.guideStep2(guideNode, guideMaskNode, modalSprite, circleNode);
//             break;
//         }
//         this.step++;
//         this.node.addChild(guideNode, 99);
//       });
//   }
// })();
