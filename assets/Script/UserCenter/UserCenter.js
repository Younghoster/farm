var Data = require('Data');
var utils = require('utils');

cc.Class({
  extends: cc.Component,

  properties: {
    PropertyList_Prefab: {
      default: null,
      type: cc.Prefab
    }
  },
  btnBackEvent() {
    cc.director.loadScene(Config.backIndexUrl);
  },
  btnGoTradeEvent() {
    cc.director.loadScene('tradelist');
  },
  btnGocoupon() {
    Config.backUrl = 'userCenter';
    cc.director.loadScene('CouPonList');
  },
  btnHelpCenter() {
    Config.backUrl = 'userCenter';
    cc.director.loadScene('Help');
  },
  btnGoAddressList() {
    Config.backUrl = 'userCenter';
    cc.director.loadScene('AddressList');
  },
  btnGotorep() {
    Config.backUrl = 'userCenter';
    cc.director.loadScene('repertory');
  },
  outLogin() {
    window.location = 'http://jingongbao.com:4634';
  },
  onLoad() {
    let self = this;

    Data.func.GetUserData(1, 4).then(data => {
      this.setData(data);
      this.setBuyPropertyList(data);
    });
    this.EditName();
    this.Contact();
    this.getAddress();
  },
  setHeadImg(dom) {
    if (Config.headImg !== '') {
      cc.loader.load({ url: Config.headImg, type: 'png' }, function(err, texture) {
        var frame = new cc.SpriteFrame(texture);
        dom.getComponent(cc.Sprite).spriteFrame = frame;
      });
    }
  },
  //获取用户参数
  setData(data) {
    // console.log(data);
    if (data.Code == 1) {
      let userName = cc.find('scrollview/view/layout/info/nameEdit/label', this.node);
      let Grade = cc.find('scrollview/view/layout/info/level/label', this.node);
      let HeadImg = cc.find('scrollview/view/layout/info/advisor/advisor', this.node);
      let GradeEXP = cc.find('scrollview/view/layout/info/level/label2', this.node);
      let ExperienceValue = cc.find('scrollview/view/layout/info/level/progressBar', this.node);
      let RanchMoney = cc.find('scrollview/view/layout/myAssets1/box/flex-right/value', this.node);
      let PointValue = cc.find('scrollview/view/layout/myAssets1/box2/flex-right/value', this.node);

      Grade.getComponent(cc.Label).string = 'LV.' + data.Model.Grade;
      GradeEXP.getComponent(cc.Label).string = data.Model.ExperienceValue + '/' + data.Model.GradeExperienceValue;
      userName.getComponent(cc.Label).string = data.Model.RealName;
      ExperienceValue.getComponent(cc.ProgressBar).progress =
        data.Model.ExperienceValue / data.Model.GradeExperienceValue;
      RanchMoney.getComponent(cc.Label).string = data.Model.RanchMoney;
      PointValue.getComponent(cc.Label).string = data.Model.Point;
      this.setHeadImg(HeadImg);
    } else {
      // console.log(data.Message);
    }
  },

  setBuyPropertyList(data) {
    //PropType  0：积分  1：牧场币
    this.emptyNode = cc.find('scrollview/view/layout/myAssets2/empty', this.node);
    this.emptyNode.active = false;
    if (data.Code == 1) {
      if (data.Model.BuyPropertyList) {
        for (let i = 0; i < data.Model.BuyPropertyList.length; i++) {
          const PropertyList = cc.instantiate(this.PropertyList_Prefab);
          const PrefabParent = cc.find('scrollview/view/layout/myAssets2/layout', this.node);
          let icon_1 = cc.find('flex-left/icon-asset01', PropertyList).getComponent(cc.Sprite);
          let icon_2 = cc.find('flex-left/icon-asset04', PropertyList).getComponent(cc.Sprite);
          let name_1 = cc.find('flex-left/name1', PropertyList).getComponent(cc.Label);
          let name_2 = cc.find('flex-left/name2', PropertyList).getComponent(cc.Label);
          let num_1 = cc.find('flex-left/num1', PropertyList).getComponent(cc.Label);
          let num_2 = cc.find('flex-left/num2', PropertyList).getComponent(cc.Label);
          let day = cc.find('flex-right/value', PropertyList).getComponent(cc.Label);
          let time = cc.find('flex-right/time', PropertyList).getComponent(cc.Label);
          let imgSrc, imgSrc_;
          data.Model.BuyPropertyList[i].PropType
            ? ((imgSrc = 'Modal/Repertory/icon-asset01'), (name_1.string = '牧场币'))
            : ((imgSrc = 'Modal/Repertory/icon-asset02'), (name_1.string = '积分'));

          switch (data.Model.BuyPropertyList[i].PropertyTypeID) {
            //普通饲料
            case 4: {
              imgSrc_ = 'Modal/Repertory/icon-1';
              break;
            }
            //普通肥料
            case 7: {
              imgSrc_ = 'Modal/Repertory/hf_xs';
              break;
            }
            //超级肥料
            case 9: {
              imgSrc_ = 'Modal/Repertory/hf_xs';
              break;
            }
            //玉米种子
            case 6: {
              imgSrc_ = 'Modal/Repertory/ymzz_xs';
              break;
            }
            //改名卡
            case 14: {
              imgSrc_ = 'Modal/Repertory/icon-name_xs';
              break;
            }
            //产蛋鸡
            case 13: {
              imgSrc_ = 'Modal/Repertory/icon-asset04';
              break;
            }
            //自动清洁机
            case 12: {
              imgSrc_ = 'Modal/Repertory/icon-bot-xs';
              break;
            }
            default: {
              break;
            }
          }

          cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
            icon_1.spriteFrame = spriteFrame;
          });
          cc.loader.loadRes(imgSrc_, cc.SpriteFrame, (err, spriteFrame) => {
            icon_2.spriteFrame = spriteFrame;
          });
          num_1.string = '-' + data.Model.BuyPropertyList[i].PropValue * data.Model.BuyPropertyList[i].ButCount;
          num_2.string = '+' + data.Model.BuyPropertyList[i].Count * data.Model.BuyPropertyList[i].ButCount;
          name_2.string = data.Model.BuyPropertyList[i].PropName;
          day.string = utils.fn.formatNumToDate(data.Model.BuyPropertyList[i].BuyTime);
          time.string = utils.fn.formatNumToDateTime(data.Model.BuyPropertyList[i].BuyTime);
          PrefabParent.addChild(PropertyList);
        }
      } else {
        this.emptyNode.active = true;
      }
    } else {
      this.emptyNode.active = true;
    }
  },
  start() {},
  goRecharge() {
    Config.backUrl = 'userCenter';
    cc.director.loadScene('recharge');
  },
  //模态框修改昵称
  EditName() {
    const fillterButton = cc.find('scrollview/view/layout/info/nameEdit', this.node);
    fillterButton.on('click', event => {
      Alert.show('0', null, null, null, null, null, 'Prefab/Modal/Usercenter/NameEdit', function() {
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
          Alert._alert.parent = cc.find('Canvas');
          // 展现 alert
          self.startFadeIn();
          //自定义事件
          var saveButton = cc.find('alertBackground/enterButton', alert);
          //保存
          saveButton.on('click', () => {
            let name = cc.find('alertBackground/input/editbox', alert);
            let title = cc.find('alertBackground/intro/detailLabel', alert).getComponent(cc.Label);
            let intro = cc.find('alertBackground/intro/tel', alert);
            Data.func.SaveEditName(name.getComponent(cc.EditBox).string).then(data => {
              if (data.Code == 1 || data.Code == 0) {
                intro.getComponent(cc.Label).string = '修改成功！';
              } else if (data.Code == '333') {
                intro.getComponent(cc.Label).string = '您修改的昵称已经存在！';
              } else if (data.Code == '000') {
                intro.getComponent(cc.Label).string = '您的牧场币不足200！无法修改！';
              }
              title.string = '温馨提示';
              intro.getComponent(cc.Label).fontSize = 28;
              intro.getComponent(cc.Label).lineHeight = 80;
              saveButton.active = false;
              name.active = false;
            });
          });
          //取消
          self.newButtonEvent(alert, 'close');
        });
      });
    });
  },
  getAddress() {
    Data.func.getAddressList().then(data => {
      if (data.Code == 1) {
        let addressValue = cc
          .find('scrollview/view/layout/myAssets3/box/flex-right/value', this.node)
          .getComponent(cc.Label);
        for (let i = 0; i < data.List.length; i++) {
          if (data.List[i].IsDefault) {
            addressValue.string = data.List[i].addressDetailInfo;
          }
        }
      }
    });
  },
  Contact() {
    const fillterButton = cc.find('scrollview/view/layout/info/tel', this.node);
    fillterButton.on('click', event => {
      Alert.show('0', null, null, null, null, null, 'Prefab/Modal/AlertTemp', function() {
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
          Alert._alert.parent = cc.find('Canvas');
          // 展现 alert
          self.startFadeIn();
          self.newButtonEvent(alert, 'close');
        });
      });
    });
  },
  Help() {
    Alert.show('0', null, null, null, null, null, 'Prefab/Modal/levelIntro', function() {
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
        Alert._alert.parent = cc.find('Canvas');
        // 展现 alert
        self.startFadeIn();
        self.newButtonEvent(alert, 'close');
      });
    });
  },
  update(dt) {}
});
