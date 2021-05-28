async function init() {
  const rawRes = await fetch("/api/wx/signs");
  const data = await rawRes.json();

  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: "wx7ee301c37cacda68", // 必填，公众号的唯一标识
    nonceStr: "insmemo", // 必填，生成签名的随机串
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    signature: data.signature,
    jsApiList: ["updateAppMessageShareData"], // 必填，需要使用的JS接口列表
  });

  wx.ready(function () {
    wx.updateAppMessageShareData({
      title: "Memos", // 分享标题
      desc: "💡 I have an idea, write in here.", // 分享描述
      link: "https://insmemo.justsven.top/", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "https://insmemo.justsven.top/logo-fill.png", // 分享图标
      type: "link", // 分享类型,music、video或link，不填默认为link
      success: function () {
        // do nth
      },
    });
  });

  wx.error(function (res) {
    console.log(res);
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  init();
});
