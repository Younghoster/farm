var Data = require("Data");
var Func = Data.func;
cc.Class({
  extends: cc.Component,

  properties: {},
  Id: null,
  bindNode() {
    this.backButton = cc.find("bg-f3/bg/backIndex", this.node);
    this.idLabel = cc.find("bg-f3/bg/info/id", this.node).getComponent(cc.Label);
    this.sexLabel = cc.find("bg-f3/bg/info/sex", this.node).getComponent(cc.Label);
    this.hungryLabel = cc.find("bg-f3/bg/info/hungry", this.node).getComponent(cc.Label);
    this.healthLabel = cc.find("bg-f3/bg/info/health", this.node).getComponent(cc.Label);
    this.collectButton = cc.find("bg-f3/bg/collect", this.node);
    this.growNode = cc.find("bg-f3/bg/grow/progressBar", this.node);
    this.growProgressBar = cc.find("bg-f3/bg/grow/progressBar", this.node).getComponent(cc.ProgressBar);
    this.growBar = cc.find("bg-f3/bg/grow/progressBar/bar", this.node);
    this.growLabel = cc.find("bg-f3/bg/grow/value", this.node).getComponent(cc.Label);

    this.growthButton = cc.find("bg-f3/btn-group/btn-growth", this.node);
    this.growthLabelNode = cc.find("bg-f3/btn-group/btn-growth/label", this.node);
    this.growthLineNode = cc.find("line", this.growthButton);
    this.recordButton = cc.find("bg-f3/btn-group/btn-record", this.node);
    this.recordLineNode = cc.find("line", this.recordButton);
    this.recordLabelNode = cc.find("bg-f3/btn-group/btn-record/label", this.node);
    // chickList滚动视图 内容节点
    this.contentNode = cc.find("chickList/view/content", this.node);
    //Tab切换的内容
    this.content1Node = cc.find("bg-f3/content1", this.node);
    this.content2Node = cc.find("bg-f3/content2", this.node);
  },
  initData() {
    this.growNode.cascadeOpacity = false;
    //初始化小鸡详情
    this.initChickData();
    //初始化小鸡列表
    this.initChickList();
  },
  //初始化小鸡详情
  initChickData() {
    Func.GetChickValueById(this.Id).then(data => {
      if (data.Code === 1) {
        this.assignChickData(data);
      }
    });
  },
  //初始化小鸡列表
  initChickList() {
    //  获取正常的小鸡及已收取的小鸡
    Func.GetChickList(3).then(data => {
      if (data.Code === 1) {
        for (let i = 0; i < data.List.length; i++) {
          cc.loader.loadRes("Prefab/chickDetail/item", cc.Prefab, (err, prefab) => {
            let itemNode = cc.instantiate(prefab);
            let idLbael = cc.find("id", itemNode).getComponent(cc.Label);

            idLbael.string = data.List[i].ID;
            this.contentNode.addChild(itemNode);

            itemNode.on("click", () => {
              this.Id = data.List[i].ID;
              this.initChickData();
            });
          });
        }
      }
    });
  },
  //小鸡数据赋值
  assignChickData(data) {
    this.idLabel.string = `编号：${this.Id}`;
    this.sexLabel.string = `性别：${data.Sex ? "小姐姐" : "小哥哥"}`;
    this.hungryLabel.string = `饥饿度：${data.StarvationValue}`;
    this.healthLabel.string = `健康值：${data.HealthValue}`;

    this.growProgressBar.progress = Math.round(data.Proportion) / 100;
    this.growLabel.string = `${Math.round(data.Proportion)}/100`;

    // 是否已被收取
    if (data.CallBack) {
      cc.loader.loadRes("chickDetail/collected", cc.SpriteFrame, (err, spriteFrame) => {
        this.collectButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.collectButton.getComponent(cc.Button).interactable = false;
      });
    } else {
      // 是否能被收取
      if (data.ReturnBack) {
        cc.loader.loadRes("chickDetail/collect", cc.SpriteFrame, (err, spriteFrame) => {
          this.collectButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
      } else {
        cc.loader.loadRes("chickDetail/noCollect", cc.SpriteFrame, (err, spriteFrame) => {
          this.collectButton.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          this.collectButton.getComponent(cc.Button).interactable = false;
        });
      }
    }
  },
  // 绑定事件
  bindEvent() {
    //返回index页面
    this.backButton.on("click", () => {
      cc.director.loadScene("index");
    });
    // 生长周期Tab
    this.growthButton.on("click", () => {
      this.growthLabelNode.color = cc.color("#FF4A4A");
      this.recordLabelNode.color = cc.color("#B2B2B2");
      this.growthLineNode.active = true;
      this.recordLineNode.active = false;
      this.content1Node.active = true;
      this.content2Node.active = false;
    });
    //转手记录Tab
    this.recordButton.on("click", () => {
      this.growthLabelNode.color = cc.color("#B2B2B2");
      this.recordLabelNode.color = cc.color("#FF4A4A");
      this.recordLineNode.active = true;
      this.growthLineNode.active = false;
      this.content1Node.active = false;
      this.content2Node.active = true;
    });
  },
  onLoad() {},

  start() {
    this.bindNode();
    this.bindEvent();
    this.initData();
  }

  // update (dt) {},
});
