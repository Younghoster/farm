var Data = require('Data');
var utils = require('utils');

cc.Class({
  extends: cc.Component,

  properties: {
    PropertyList_Prefab: {
      default: null,
      type: cc.Prefab
    },
    scrollview: cc.ScrollView,
    pageIndex: 1,
    pageSize: 16,
    hasMore: true
  },

  // LIFE-CYCLE CALLBACKS:
  btnBackEvent() {
    Config.backArr.pop();
    cc.director.loadScene(Config.backArr[Config.backArr.length - 1]);
  },
  onLoad() {
    Config.backArr.indexOf('tradelist') == -1 ? Config.backArr.push('tradelist') : false;
    console.log(Config.backArr);
    this.scrollview.node.on('scroll-to-bottom', this.updataByBottom, this);
    Data.func.GetUserData(1, 16).then(data => {
      this.setBuyPropertyList(data);
    });
  },

  start() {},
  setBuyPropertyList(data) {
    //PropType  0：积分  1：牧场币
    if (data.Model.BuyPropertyList == null) {
      let nodata = cc.find('scrollview/view/layout/sprite/label', this.node).getComponent(cc.Label);
      nodata.string = '没有更多内容';
      return (this.hasMore = false);
    } else if (data.Model.BuyPropertyList.length < 15) {
      let nodata = cc.find('scrollview/view/layout/sprite/label', this.node).getComponent(cc.Label);
      nodata.string = '没有更多内容';
    }
    if (data.Code == 1) {
      for (let i = 0; i < data.Model.BuyPropertyList.length; i++) {
        const PropertyList = cc.instantiate(this.PropertyList_Prefab);
        const PrefabParent = cc.find('scrollview/view/layout/list', this.node);
        let icon_1 = cc.find('flex-left/icon-asset01', PropertyList).getComponent(cc.Sprite);
        let icon_2 = cc.find('flex-left/icon-asset04', PropertyList).getComponent(cc.Sprite);
        let name_1 = cc.find('flex-left/name1', PropertyList).getComponent(cc.Label);
        let name_2 = cc.find('flex-left/name2', PropertyList).getComponent(cc.Label);
        let num_1 = cc.find('flex-left/num1', PropertyList).getComponent(cc.Label);
        let num_2 = cc.find('flex-left/num2', PropertyList).getComponent(cc.Label);
        let day = cc.find('flex-right/value', PropertyList).getComponent(cc.Label);
        let time = cc.find('flex-right/time', PropertyList).getComponent(cc.Label);
        let imgSrc, imgSrc_, counts;
        if (data.Model.BuyPropertyList[i].PrID != 0) {
          switch (data.Model.BuyPropertyList[i].ShowType) {
            case 0: {
              //商城购买
              data.Model.BuyPropertyList[i].PropType
                ? ((imgSrc = 'Modal/Repertory/icon-asset01'), (name_1.string = '牧场币'))
                : ((imgSrc = 'Modal/Repertory/icon-asset02'), (name_1.string = '积分'));

              switch (data.Model.BuyPropertyList[i].PrID) {
                //普通饲料
                case 1: {
                  imgSrc_ = 'Modal/Repertory/icon-1';
                  counts = 2;
                  break;
                }
                case 2: {
                  imgSrc_ = 'Modal/Repertory/icon-1';
                  counts = 1;
                  break;
                }
                //普通肥料
                case 13: {
                  imgSrc_ = 'Modal/Repertory/hf_xs';
                  counts = 1;
                  break;
                }
                case 15: {
                  imgSrc_ = 'Modal/Repertory/icon-1';
                  counts = 50;
                  break;
                }
                case 16: {
                  imgSrc_ = 'Modal/Repertory/icon-1';
                  counts = 100;
                  break;
                }
                case 17: {
                  imgSrc_ = 'Modal/Repertory/icon-1';
                  counts = 500;
                  break;
                }
                //普通肥料
                case 19: {
                  imgSrc_ = 'Modal/Repertory/hf_xs';
                  counts = 1;
                  break;
                }
                //超级肥料
                case 20: {
                  imgSrc_ = 'Modal/Repertory/hf_xs';
                  counts = 1;
                  break;
                }
                //玉米种子
                case 12: {
                  imgSrc_ = 'Modal/Repertory/ymzz_xs';
                  counts = 1;
                  break;
                }
                //改名卡
                case 21: {
                  imgSrc_ = 'Modal/Repertory/icon-name_xs';
                  counts = 1;
                  break;
                }
                //产蛋鸡
                case 18: {
                  imgSrc_ = 'Modal/Repertory/icon-asset04';
                  counts = 1;
                  break;
                }
                //自动清洁机
                case 22: {
                  imgSrc_ = 'Modal/Repertory/icon-bot-xs';
                  counts = 1;
                  break;
                }
                //玉米种子*12
                case 23: {
                  imgSrc_ = 'Modal/Repertory/ymzz_xs';
                  counts = 12;
                  break;
                }
                default: {
                  break;
                }
              }

              num_1.string = '-' + data.Model.BuyPropertyList[i].PropValue * data.Model.BuyPropertyList[i].BuyCount;
              num_2.string = '+' + data.Model.BuyPropertyList[i].BuyCount * counts;
              name_2.string = data.Model.BuyPropertyList[i].PropName;
              cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                icon_1.spriteFrame = spriteFrame;
              });
              cc.loader.loadRes(imgSrc_, cc.SpriteFrame, (err, spriteFrame) => {
                icon_2.spriteFrame = spriteFrame;
              });
              day.string = utils.fn.formatNumToDate(data.Model.BuyPropertyList[i].CreateTime);
              time.string = utils.fn.formatNumToDateTime(data.Model.BuyPropertyList[i].CreateTime);
              PrefabParent.addChild(PropertyList);
              break;
            }
            case 1: {
              //充值记录;
              imgSrc = 'Modal/Repertory/icon-asset01';
              name_1.string = '牧场币';
              cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                icon_1.spriteFrame = spriteFrame;
              });
              cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                icon_2.spriteFrame = spriteFrame;
              });
              let icon_2_dom = cc.find('flex-left/icon-asset04', PropertyList);
              icon_2_dom.active = false;
              num_1.string = '+' + data.Model.BuyPropertyList[i].RanchMoney;
              num_2.string = '';
              name_2.string = '成功充值' + data.Model.BuyPropertyList[i].RechargeMoney + '元';
              day.string = utils.fn.formatNumToDate(data.Model.BuyPropertyList[i].CreateTime);
              time.string = utils.fn.formatNumToDateTime(data.Model.BuyPropertyList[i].CreateTime);
              PrefabParent.addChild(PropertyList);
              break;
            }
            case 2: {
              //兑换鸡或鸡蛋
              if (data.Model.BuyPropertyList[i].TradingType == 1) {
                //兑换贵妃鸡
                imgSrc = 'Modal/Repertory/icon-asset04';
                cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                  icon_1.spriteFrame = spriteFrame;
                });
                cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                  icon_2.spriteFrame = spriteFrame;
                });
                name_1.string = '虚拟贵妃鸡';
                num_1.string = '-' + data.Model.BuyPropertyList[i].PCount * 1;
                name_2.string = '真实贵妃鸡';
                num_2.string = '+' + data.Model.BuyPropertyList[i].PCount;
              } else {
                //兑换鸡蛋
                imgSrc = 'Modal/Repertory/icon-asset05';
                cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                  icon_1.spriteFrame = spriteFrame;
                });
                cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                  icon_2.spriteFrame = spriteFrame;
                });
                name_1.string = '虚拟鸡蛋';
                num_1.string = '-' + data.Model.BuyPropertyList[i].PCount * 12;
                name_2.string = '真实鸡蛋';
                num_2.string = '+' + data.Model.BuyPropertyList[i].PCount;
                day.string = utils.fn.formatNumToDate(data.Model.BuyPropertyList[i].CreateTime);
                time.string = utils.fn.formatNumToDateTime(data.Model.BuyPropertyList[i].CreateTime);
                PrefabParent.addChild(PropertyList);
              }
              break;
            }
            case 3: {
              //兑换贵妃鸡
              if (data.Model.BuyPropertyList[i].PropType == 0) {
                imgSrc = 'Modal/Repertory/icon-asset02';
              } else {
                imgSrc = 'Modal/Repertory/icon-asset01';
              }

              imgSrc_ = 'Farm/extend_icon';
              cc.loader.loadRes(imgSrc, cc.SpriteFrame, (err, spriteFrame) => {
                icon_1.spriteFrame = spriteFrame;
              });
              cc.loader.loadRes(imgSrc_, cc.SpriteFrame, (err, spriteFrame) => {
                icon_2.spriteFrame = spriteFrame;
              });
              if (data.Model.BuyPropertyList[i].PropType == 0) {
                name_1.string = '积分';
              } else {
                name_1.string = '牧场币';
              }

              num_1.string = '-' + data.Model.BuyPropertyList[i].BuyValues * 1;
              name_2.string = data.Model.BuyPropertyList[i].PropName;
              num_2.string = '+1';
              PrefabParent.addChild(PropertyList);
              break;
            }
          }
        }
      }
    } else {
      console.log(data.Message);
    }
  },
  updataByBottom() {
    this.pageIndex++;
    if (this.hasMore) {
      Data.func.GetUserData(this.pageIndex, this.pageSize).then(data => {
        this.setBuyPropertyList(data);
      });
    }
  }

  // update (dt) {},
});
