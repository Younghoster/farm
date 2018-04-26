var func = {
  //获取所有数据（index页面）"dedbc83d62104d6da8d4a3c0188dc419",
  openID: "f79ed645ad624cf5bbfecc2e67f23020",
  GetWholeData(openID = this.openID) {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("GET", Config.apiUrl + "/T_Base_User/GetWholeData?openID=" + openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_User/POSTWholeData", true);
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      // xhr.send("openID=o9AgowGKcD5MAuYIhedEX&pageSize=9");
    });
  },
  //URL:
  //用户饲料槽饲料数是否满的
  GetFeedTroughFull() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_User/GetFeedTroughFull?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获取流转记录
  GetChickenTransaction(cId, page = 1) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", `${Config.apiUrl}/T_Base_Chicken/GetChickenTransaction?cId=${cId}&page=${page}`, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获取产蛋周期
  GetChickenEggRecord(cId, searchTime = "") {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", `${Config.apiUrl}/T_Base_Chicken/GetChickenEggRecord?cId=${cId}&searchTime=${searchTime}`, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //产蛋排行榜 /T_Base_User/GetEggRankings
  GetEggRankings(page) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", `${Config.apiUrl}/T_Base_User/GetEggRankings?page=${page}`, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },

  //获取用户信息（header)
  GetUserGrade() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_User/GetUserGrade?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获取好友列表
  GetFriendsList(page) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("成功获取数据");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        Config.apiUrl + "/T_Base_User/GetFriendsList?openID=" + this.openID + "&orderby=Grade desc" + "&page=" + page,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
      // POST方法
      // xhr.open("POST", "http://www.jingongbao.com:4633/T_Base_User/POSTWholeData", true);
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      // xhr.send("openID=o9AgowGKcD5MAuYIhedEX&pageSize=9");
    });
  },
  //获取非好友列表
  GetUserList(search, page) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "GET",
        Config.apiUrl + "/T_Base_User/GetUserListByPage?openID=" + this.openID + "&search=" + search + "&page=" + page,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //添加好友接口
  AddFriend(openIds) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };

      xhr.open("POST", Config.apiUrl + "/T_Base_FriendsNotice/PostRequestFriends", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("openId=" + this.openID + "&openIds=" + openIds);
    });
  },
  //同意添加好友
  ConfirmFriends(messageId, result) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };

      xhr.open("POST", Config.apiUrl + "/T_Base_FriendsNotice/PostConfirmFriends", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("openId=" + this.openID + "&messageId=" + messageId + "&result=" + result);
    });
  },
  //通过Id获取小鸡当前的健康值及饥饿度
  GetChickValueById(Id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("POST", Config.apiUrl + "/T_Base_Chicken/GetModelValue", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cid=" + Id);
    });
  },
  //获得当月签到的记录数组
  GetSignList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // Get方法
      xhr.open("GET", Config.apiUrl + "/T_Base_SignFlow/GetList?openId=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得商城的商品
  GetGoodList(index, size) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取商城数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Property/GetListByPage?page=" + index + "&size=" + size, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得积分商城的商品
  GetPointGoodList(index, size) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取商城数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Property/GetPointListByPage?page=" + index + "&size=" + size, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得交易市场的商品
  GetSellList(type, index, size) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取商城数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        Config.apiUrl +
          "/T_Base_PlayerTrading/GetTradetLisByPage?type=" +
          type +
          "&page=" +
          index +
          "&pageSize=" +
          size,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //上架列表
  GetShelvesList(index, size) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取商城数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        Config.apiUrl +
          "/T_Base_PlayerTrading/GetListByPage?openId=" +
          this.openID +
          "&type=" +
          0 +
          "&page=" +
          index +
          "&pageSize=" +
          size,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //上架
  OnShelf(type, unitprice, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open(
        "GET",
        Config.apiUrl +
          "/T_Base_PlayerTrading/OnShelf?openId=" +
          this.openID +
          "&type=" +
          type +
          "&unitprice=" +
          unitprice +
          "&count=" +
          count,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //下架
  OffShelf(playerid) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("POST", Config.apiUrl + "/T_Base_PlayerTrading/OffShelf", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("openId=" + this.openID + "&playerid=" + playerid);
    });
  },
  //获取仓库系统道具
  GetSystemListByPage() {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取仓库数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Warehouse/GetSystemListByPage?openId=" + this.openID + "&page=1", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },

  //获得仓库流通物品
  GetRepertoryList() {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取仓库数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Warehouse/GetListByPage?openId=" + this.openID + "&page=1", true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //签到接口
  PostSign() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("签到成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_SignFlow/PostSign", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  // 获取产蛋棚坑位的信息
  getEggLayInfo() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法
      xhr.open("GET", Config.apiUrl + "/T_Base_LayEggsShed/GetPageList?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  // 升级产蛋棚
  UpgradeEggsShed(payType) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_LayEggsShed/LayEggsShedUpGrade", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&payType=" + payType);
    });
  },
  //获取升级产蛋棚需要多少钱
  GetLayUpGrade(grade) {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_LayEggsShed/GetLayUpGrade?grade=" + grade, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得牧场 升级需要多少钱
  GeteggsShedUpGradeMoney() {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Ranch/GetRanchUpGradeMoney?openId=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //升级牧场
  UpgradeHouse(payType) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_Ranch/PostRanchRankUpgrade", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&payType=" + payType);
    });
  },
  //获得牧场升级需要多少钱
  GetRanchUpGradeMoney() {
    // Loading.show();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取数据失败");
            reject(response);
          }
        }
      };
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Ranch/GetRanchUpGradeMoney?openId=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //牧场清理 type=1 自己清理
  PostClean() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Ranch_Clean/PostRanchCleanManual", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //小鸡治疗
  PostTreat(Id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Chicken_Treatment/POSTOneTreatment", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("id=" + Id + "&openId=" + this.openID);
    });
  },
  //小鸡喂食
  PostOwnFeeds() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("喂食成功");
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("喂食失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Chicken_Feed/POSTOwnFeeds", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openId=" + this.openID);
    });
  },
  //购买商品接口
  PostBuy(prId, count = 1) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.send("openID=" + this.openID + "&count=" + count + "&prId=" + prId);
    });
  },
  //购买商品接口
  PostBuyP2P(playerid, buyCount) {
    buyCount = buyCount || 1;
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_Base_PlayerTrading/UserToUserBuy?openID=" +
          this.openID +
          "&playerid=" +
          playerid +
          "&buyCount=" +
          buyCount,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //孵化小鸡
  HatchEgg() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取仓库数据失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", Config.apiUrl + "/T_Chicken_Egg/EggHatch", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //收取产蛋棚鸡蛋
  CollectEgg(eggID) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取鸡蛋失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", Config.apiUrl + "/T_Base_LayEggsShed/CollectingEggs", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send(`openID=${this.openID}&EggId=${eggID}`);
    });
  },
  //收取牧场鸡蛋
  CollectRanchEgg() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取鸡蛋失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", Config.apiUrl + "/T_Base_Ranch/PostCollectRankEgg", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send(`openID=${this.openID}`);
    });
  },
  //收取贵妃鸡
  CollectChick(Id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取鸡蛋失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", Config.apiUrl + "/T_Base_User/CollectChicken", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cId=" + Id);
    });
  },
  //填充饲料槽接口
  AddFeed() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_Ranch/AddFeed", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //获得饲料槽信息
  GetFeedData() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open("GET", Config.apiUrl + "/T_Base_Ranch/GetModel?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //获得该用户的鸡的列表
  GetChickList(status = 2) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法
      xhr.open("POST", Config.apiUrl + "/T_Base_Chicken/GetModelList", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&Status=" + status);
    });
  },

  //通过Id找到鸡对象（状态及相应的值）
  GetChickById(Id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;

            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("签到失败");
            reject(response);
          }
        }
      };
      // POST方法1
      xhr.open("POST", Config.apiUrl + "/T_Base_Chicken/ChickenAndRanch", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("cid=" + Id);
    });
  },
  // 获取兑换列表
  GetRecoverData(page) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // GET方法
      xhr.open(
        "GET",
        `${Config.apiUrl}/T_Base_Chicken/GetChickenOwnerShipListByPage?openID=${this.openID}&page=${page}&pagesize=4`,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //回收小鸡  获得小鸡的所有权
  recoverChick(cid) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            resolve(response);
          } else {
            var response = xhr.responseText;
            console.log("获取鸡蛋失败");
            reject(response);
          }
        }
      };
      xhr.open("POST", Config.apiUrl + "/T_Base_Chicken/BuyChickenOwnership", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send(`openID=${this.openID}&cid=${cid}`);
    });
  },
  //获取用户中心数据
  GetUserData(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_Base_User/PersonalCore?openId=" +
          this.openID +
          "&page=" +
          pageIndex +
          "&pagesize=" +
          pageSize,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //获得饲料总数
  GetFeedCount() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open("POST", Config.apiUrl + "/T_Base_User/FeedCount", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //修改姓名
  SaveEditName(updatename) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
        Config.apiUrl + "/T_Base_User/UpdateName?openId=" + this.openID + "&updatename=" + updatename,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //消息列表
  UserMessage(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open(
        "GET",
        Config.apiUrl +
          "/T_User_Message/GetListByPage?openId=" +
          this.openID +
          "&page=" +
          pageIndex +
          "&pageSize=" +
          pageSize,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //获取天气信息
  GetWetherData(index, size) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            response = JSON.parse(response.Data);

            resolve(response);
          } else {
            var response = xhr.responseText;
            reject(response);
          }
        }
      };
      // Get方法1
      xhr.open("GET", Config.apiUrl + "/Curl/Weather?page=" + index + "&pagesize=" + size, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //获取当前天气
  GetCurrentWeather() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
          if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            response = JSON.parse(response.Data);

            resolve(response);
          } else {
            var response = xhr.responseText;
            reject(response);
          }
        }
      };
      // Get方法1
      xhr.open("GET", Config.apiUrl + "/Curl/CurrentWeather", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //上架
  OnShelf(type, unitprice, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open("POST", Config.apiUrl + "/T_Base_PlayerTrading/OnShelf", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID + "&type=" + type + "&unitprice=" + unitprice + "&count=" + count);
    });
  },
  //贵妃鸡兑换
  ExchangeChicken(username, address, phone, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open("POST", Config.apiUrl + "/T_Base_Exchange/ChickenExchange", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send(
        "openID=" +
          this.openID +
          "&username=" +
          username +
          "&address=" +
          address +
          "&phone=" +
          phone +
          "&count=" +
          count
      );
    });
  },
  //鸡蛋兑换
  ExchangeEgg(username, address, phone, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open("POST", window.Config.apiUrl + "/T_Base_Exchange/EggExchange", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send(
        "openID=" +
          this.openID +
          "&username=" +
          username +
          "&address=" +
          address +
          "&phone=" +
          phone +
          "&count=" +
          count
      );
    });
  },
  //获取地址列表
  getAddressList() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "GET",
        Config.apiUrl + "/T_User_Addresses/GetListByPage?openId=" + this.openID + "&page=" + 1 + "&pageSize=" + 16,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //获取兑换数量
  GetExchangeCount(type, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "GET",
        Config.apiUrl + "/T_Base_Exchange/GetExchangeCount?openID=" + this.openID + "&type=" + type + "&count=" + count,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //升级饲料槽
  UpFeedGrade(username, address, phone, count) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      // POST方法

      xhr.open("POST", window.Config.apiUrl + "/T_Base_User/UpFeedTroughGrade", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send("openID=" + this.openID);
    });
  },
  //添加地址列表
  addAddress(username, telNumber, addressPostalCode, addressDetailInfo) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_User_Addresses/Add?OpenID=" +
          this.openID +
          "&username=" +
          username +
          "&telNumber=" +
          telNumber +
          "&addressPostalCode=" +
          addressPostalCode +
          "&addressDetailInfo=" +
          addressDetailInfo +
          "&proviceFirstStageName=温州市" +
          "&addressCitySecondStageName=鹿城区" +
          "&addressCountiesThirdStageName=龙湾区",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //更新地址列表
  updateAddress(id, username, telNumber, addressPostalCode, addressDetailInfo) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_User_Addresses/Update?ID=" +
          id +
          "&OpenID=" +
          this.openID +
          "&username=" +
          username +
          "&telNumber=" +
          telNumber +
          "&addressPostalCode=" +
          addressPostalCode +
          "&proviceFirstStageName=温州市" +
          "&addressCitySecondStageName=鹿城区" +
          "&addressCountiesThirdStageName=龙湾区" +
          "&addressDetailInfo=" +
          addressDetailInfo +
          "&nationalCode=中国" +
          "&IsDefault=" +
          0,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //默认设置地址列表
  setDefaultAddress(id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("POST", Config.apiUrl + "/T_User_Addresses/SetIsDefault?ID=" + id, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //删除地址
  delDefaultAddress(id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("POST", Config.apiUrl + "/T_User_Addresses/Delete?ID=" + id, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //获取用户牧场币
  GetUserMoney() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("GET", Config.apiUrl + "/T_Base_User/GetUserMoney?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //好友消息列表
  GetFriendListByPage(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "GET",
        Config.apiUrl +
          "/T_Base_FriendsNotice/GetRequestListByPage?openID=" +
          this.openID +
          "&page=" +
          pageIndex +
          "&pageSize=" +
          pageSize,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //未读好友消息数量
  GetRecordCount(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "GET",
        Config.apiUrl + "/T_Base_FriendsNotice/GetRecordCount?openID=" + this.openID + "&type=" + 0,
        true
      );
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //好友消息列表
  PostConfirmFriends(id, result) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_Base_FriendsNotice/PostConfirmFriends?openID=" +
          this.openID +
          "&Id=" +
          id +
          "&result=" +
          result,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //缺少这句，后台无法获取参数
      xhr.send();
    });
  },
  //农场数据
  getFarmModalData() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("Get", Config.apiUrl + "/T_Farm_Land/GetList?openID=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  },
  //添加农作物
  addCrops(landId, propertyId) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_Farm_Land/SowSeeds?openId=" +
          this.openID +
          "&landId=" +
          landId +
          "&propertyId=" +
          propertyId,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
  },
  //解锁土地
  unLockLand(spendType, landId) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl +
          "/T_Farm_Land/UnlockLand?openId=" +
          this.openID +
          "&spendType=" +
          spendType +
          "&landId=" +
          landId,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
  },
  //植物施肥
  CropsSertilize(cropsId, type) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open(
        "POST",
        Config.apiUrl + "/T_Farm_Crops/CropsSertilize?openId=" + this.openID + "&cropsId=" + cropsId + "&type=" + type,
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
  },
  //获取用户解锁下一块土地的牧场币，积分，用户等级
  GetNextUnlockLand() {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
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
      xhr.open("GET", Config.apiUrl + "/T_Farm_Land/GetNextUnlockLand?openId=" + this.openID, true);
      xhr.setRequestHeader("Content-Type", "json");
      xhr.send();
    });
  }
};

module.exports = {
  func: func
};
