cc.Class({
  extends: cc.Component,

  properties: {},
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
    this.growLabel = cc.find("bg-f3/bg/grow/value", this.node);

    this.growthButton = cc.find("bg-f3/btn-group/btn-growth", this.node);
    this.growthLabelNode = cc.find("bg-f3/btn-group/btn-growth/label", this.node);
    this.growthLineNode = cc.find("line", this.growthButton);
    this.recordButton = cc.find("bg-f3/btn-group/btn-record", this.node);
    this.recordLineNode = cc.find("line", this.recordButton);
    this.recordLabelNode = cc.find("bg-f3/btn-group/btn-record/label", this.node);

    this.content1Node = cc.find("bg-f3/content1", this.node);
    this.content2Node = cc.find("bg-f3/content2", this.node);
  },
  initData() {
    this.growNode.cascadeOpacity = false;
  },
  bindEvent() {
    this.backButton.on("click", () => {
      cc.director.loadScene("index");
    });
    this.growthButton.on("click", () => {
      this.growthLabelNode.color = cc.color("#FF4A4A");
      this.recordLabelNode.color = cc.color("#B2B2B2");
      this.growthLineNode.active = true;
      this.recordLineNode.active = false;
      this.content1Node.active = true;
      this.content2Node.active = false;
    });
    this.recordButton.on("click", () => {
      this.growthLabelNode.color = cc.color("#B2B2B2");
      this.recordLabelNode.color = cc.color("#FF4A4A");
      this.recordLineNode.active = true;
      this.growthLineNode.active = false;
      this.content1Node.active = false;
      this.content2Node.active = true;
    });
  },
  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.initData();
  },

  start() {}

  // update (dt) {},
});
