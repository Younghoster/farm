window.Config = {
  shopP2P: 1, //交易市场场景切换参数
  apiUrl: "http://www.jingongbao.com:4634",
  backUrl: "userCenter",
  openID: null,
  hearderNode: null,
  menuNode: null,
  //兑换物品的数据
  newSocket: null,
  exchangeData: {
    actualName: null,
    virtualName: null,
    actualCount: null,
    virtualCount: null,
    goodsType: null
  },

  addressId: 0, //地址ID，
  propertyId: 0, //播种时种子的ID
  fertilizerId: 0, //肥料的ID
  firstLogin: false,
  messageCount: 0,
  addressId: 0, //地址ID
  weather: 1 //天气情况（-1代表下雨，0代表阴天，1代表晴天）
};
