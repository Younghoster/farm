var Data = require('Data');
var Func = Data.func;
var ToolJs = require('Tool');
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {},

  bindNode() {
    this.backButton = cc.find('bg/btn-back', this.node);

    this.nameLabel = cc.find('bg/name', this.node).getComponent(cc.Label);
    this.handNode = cc.find('Hand', this.node);
    this.handAnim = this.handNode.getComponent(cc.Animation);
    this.eggNode = cc.find('bg/house/shouquEgg', this.node);
    this.houseNode = cc.find('bg/house', this.node);
    // this.moneyLabel = cc.find("div_header/gold/money", this.node).getComponent(cc.Label);
    //天气
    this.wether = this.node.getChildByName('div_wether');
    //饲料数量
    // this.feedCountLabel = cc.find('div_action/feed/icon-tip/count', this.node).getComponent(cc.Label);
    this.scene = cc.find('Canvas');
    this.hatchBoxNode = cc.find('hatch-box', this.node);
    this.ranchRankNode = cc.find('ranch-rank', this.node);
    this.bgNode = cc.find('bg', this.node);
    this.cloud1Node = cc.find('cloud01', this.bgNode);
    this.cloud2Node = cc.find('cloud02', this.bgNode);
    this.chickList = [];
    this.shitBoxNode = cc.find('shit-box', this.node);
    this.botNode = cc.find('bot', this.node);
    this.eggMoreNode = cc.find('eggMore', this.node);
    this.eggCountLabel = cc.find('count', this.eggMoreNode).getComponent(cc.Label);
    //风车
    this.windmillNode = cc.find('windmill', this.bgNode);
    this.flabellumNode = cc.find('flabellum', this.windmillNode);
  },
  initData(data) {
    document.title = `${data.UserModel.RealName}的牧场`;
    let friendImg = cc.find('div_header/advisor/advisor', this.node);
    let Lv = cc.find('div_header/level-icon/New Label', this.node).getComponent(cc.Label);
    this.setHeadImg(friendImg, data.UserModel.Headimgurl);
    Lv.string = data.UserModel.Grade;
    //产蛋棚等级
    let eggsShedRank = data.EggsShed.ShedRank;
    let RanchRank = data.RanchModel.RanchRank;
    this.eggsShedRank = eggsShedRank;
    this.RanchRank = RanchRank;

    // 初始化 粪便
    for (let i = 0; i < data.RanchModel.FaecesCount; i++) {
      cc.loader.loadRes('Prefab/Index/shit', cc.Prefab, (err, prefab) => {
        let shitNode = cc.instantiate(prefab);
        shitNode.setPosition(Tool.random(0, 400), Tool.random(0, 200));
        this.shitBoxNode.addChild(shitNode);
      });
    }

    //初始化机器人
    this.botNode.active = data.RanchModel.IsHasCleaningMachine;

    //初始化牧场是否显示鸡蛋
    this.eggMoreNode.active = data.RanchModel.EggCount > 0 ? true : false;
    this.eggCountLabel.string = `x${data.RanchModel.EggCount}`;

    //初始化产蛋棚是否显示鸡蛋
    this.eggNode.active = data.EggsShed.EggCount > 0 ? true : false;

    let upOrDown = true;
    this.schedule(() => {
      let action = upOrDown ? cc.moveBy(0.5, 0, 20) : cc.moveBy(0.5, 0, -20);
      this.eggNode.runAction(action);
      upOrDown = !upOrDown;
    }, 0.5);
    this.updateWeatherBox();
    this.updateWeather().then(() => {
      this.initChick();
      this.initEggShed(eggsShedRank);
      this.initRanchGrade(RanchRank);
    });
  },
  setHeadImg(dom, friendImg) {
    if (friendImg !== '') {
      cc.loader.load({ url: friendImg, type: 'png' }, function(err, texture) {
        var frame = new cc.SpriteFrame(texture);
        dom.getComponent(cc.Sprite).spriteFrame = frame;
      });
    }
  },
  //只运行一次
  initChick() {
    let self = this;
    //获取正常的鸡
    Func.GetChickList(1, Config.friendOpenId).then(data => {
      if (data.Code == 1) {
        //初始化鸡是否显示
        let length = data.List.length;

        //调用setId接口 给鸡传Id 默认最后那只鸡
        for (let i = 0; i < length; i++) {
          let element = data.List[i];

          // cc.loader.loadRes('Prefab/Chick', cc.Prefab, (err, prefab) => {
          var chickNode = cc.find(`Chick${i}`, this.node);
          chickNode.active = true;

          chickNode.setPosition(self.setChickPositionX(i), self.setChickPositionY(i));
          let feedNode = cc.find('feed', chickNode);
          feedNode.active = element.IsHunger;
          // this.scene.addChild(chickNode);
          this.chickJs = chickNode.getComponent('Chick');
          this.chickJs.setId(data.List[i].ID);
          this.chickJs._status = data.List[i].Status;

          this.chickList.push(chickNode);
          // });
        }
      }
    });
  },
  setChickPositionX(i) {
    if (i > 6) {
      return (i - 6) * 100 - 350;
    } else {
      return (i + 1) * 100 - 350;
    }
  },
  setChickPositionY(i) {
    if (i > 4) {
      return -450;
    } else {
      return -300;
    }
  },
  //点击清理事件
  showClearAlert: function() {
    var self = this;
    //调用接口
    Func.PostFriendsClean(Config.friendOpenId)
      .then(data => {
        if (data.Code === 1) {
          //清洁动画
          this.handNode.active = true;
          this.handAnim.play('hand_clear');

          this.handAnim.on('finished', () => {
            this.handNode.active = false;
            //清洁成功 牧场清洁度=100%

            this.clearProgressBar.progress = 1;
            this.clearLabel.string = '100%';
            this.shitBoxNode.removeAllChildren();
          });
          // this.handAnim.on("finished", this.chickFunc.initData, this._chick);
        } else {
          //牧场不脏 弹出提示框
          Msg.show(data.Message);
        }
      })
      .catch(reason => {
        Msg.show('failed:' + reason);
      });
  },
  // 偷取鸡蛋
  stealEgg() {
    Func.PostSteaEgg(Config.friendOpenId).then(data => {
      if (data.Code == 1) {
        let action = cc.sequence(
          cc.fadeOut(0.3),
          cc.callFunc(() => {
            this.eggMoreNode.active = false;
          }, this)
        );
        this.eggMoreNode.runAction(action);
        Msg.show('收取成功');
      } else {
        Msg.show(data.Message);
      }
    });
  },
  // //初始化房屋图片 （未加入到init中，后台没有数据）
  // initHouse(rank) {
  //   switch (rank) {
  //     case 'C':
  //       cc.loader.loadRes('house/house_1', cc.SpriteFrame, (err, spriteFrame) => {
  //         this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
  //       });
  //       break;
  //     case 'B':
  //       cc.loader.loadRes('house/house_2', cc.SpriteFrame, (err, spriteFrame) => {
  //         this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
  //       });
  //       break;
  //     case 'A':
  //       cc.loader.loadRes('house/house_3', cc.SpriteFrame, (err, spriteFrame) => {
  //         this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
  //       });
  //       break;
  //   }
  // },
  //更新 饲料tip的数量
  updateFeedCount() {
    Func.GetFeedCount().then(data => {
      if (data.Code === 1) {
        this.feedCountLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  //更新天气box数据
  updateWeatherBox() {
    Func.GetWetherData(1, 1).then(res => {
      let wetherItem1 = cc.find('soiltem', this.wether).getComponent(cc.Label);
      let wetherItem2 = cc.find('div/date', this.wether).getComponent(cc.Label);

      let time = res.data.weatherdata[0].intime.split(' ');
      let date = time[0].split('-');
      wetherItem1.string = res.data.weatherdata[0].soiltem + '℃';
      wetherItem2.string = date[1] + '月' + date[2] + '日';
    });
  },
  //根据天气情况 判断牧场的背景
  updateWeather() {
    let rainNode = cc.find('ParticleRain', this.node);
    let wetherIcon = cc.find('div/icon', this.wether).getComponent(cc.Sprite);
    return Func.GetCurrentWeather().then(res => {
      if (res.data.rain !== 0) {
        //下雨
        Config.weather = -1;

        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/rain-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/rain-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/rain-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        //图标
        cc.loader.loadRes('weather/rain', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/rain/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/rain/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/rain/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/rain/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/rain/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = true;
      } else if (res.data.light === 2 || res.data.light === 3) {
        //阴天
        Config.weather = 0;
        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/cloud-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/cloud-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/cloud-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        cc.loader.loadRes('weather/overcast', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/cloud/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/cloud/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/cloud/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/cloud/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/cloud/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      } else if (res.data.light === 1) {
        Config.weather = 1;
        if (this.RanchRank == 1) {
          cc.loader.loadRes('jpg/sun-bg1', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 2) {
          cc.loader.loadRes('jpg/sun-bg2', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (this.RanchRank == 3) {
          cc.loader.loadRes('jpg/sun-bg3', cc.SpriteFrame, (err, spriteFrame) => {
            this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        cc.loader.loadRes('weather/sun', cc.SpriteFrame, (err, spriteFrame) => {
          wetherIcon.spriteFrame = spriteFrame;
        });
        //云
        cc.loader.loadRes('index/sun/cloud01', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud1Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/sun/cloud02', cc.SpriteFrame, (err, spriteFrame) => {
          this.cloud2Node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //食盆
        cc.loader.loadRes('index/sun/hatchBox', cc.SpriteFrame, (err, spriteFrame) => {
          this.hatchBoxNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        //风车
        cc.loader.loadRes('index/sun/windmill', cc.SpriteFrame, (err, spriteFrame) => {
          this.windmillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        cc.loader.loadRes('index/sun/flabellum', cc.SpriteFrame, (err, spriteFrame) => {
          this.flabellumNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        rainNode.active = false;
      }
    });
  },
  //初始化产蛋棚图片 （未加入到init中，后台没有数据）
  initEggShed(rank) {
    switch (rank) {
      case 1:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_1', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 2:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_2', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 3:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/house_3', cc.SpriteFrame, (err, spriteFrame) => {
            this.houseNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
    }
  },
  // 初始化牧场等级
  initRanchGrade(rank) {
    switch (rank) {
      case 1:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip1', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 2:
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip2', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;
      case 3:
        this.windmillNode.active = true;
        if (Config.weather === -1) {
          cc.loader.loadRes('index/rain/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 0) {
          cc.loader.loadRes('index/cloud/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        } else if (Config.weather === 1) {
          cc.loader.loadRes('index/sun/tip3', cc.SpriteFrame, (err, spriteFrame) => {
            this.ranchRankNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          });
        }
        break;

      default:
        break;
    }
  },

  //跳转天气数据列表
  gotoWetherPage() {
    cc.director.loadScene('weatherInfo');
  },
  loadIndexScene() {
    cc.director.loadScene(Config.backIndexUrl);
  },
  gotoFriendFarm() {
    let self = this;
    cc.director.loadScene('FriendFarm');
  },
  onLoad() {},

  start() {
    this.bindNode();
    Func.GetWholeData(Config.friendOpenId).then(data => {
      if (data.Code === 1) {
        this.initData(data);
      } else {
        console.log('首页数据加载失败');
      }
    });
  }

  // update (dt) {},
});
