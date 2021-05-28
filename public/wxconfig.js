async function init() {
  const rawRes = await fetch("/api/wx/signs");
  const data = await rawRes.json();

  wx.config({
    debug: false,
    appId: "wx7ee301c37cacda68",
    nonceStr: "Wm3WZYTPz0wzccnW",
    timestamp: data.timestamp,
    signature: data.signature,
    jsApiList: ["updateAppMessageShareData"],
  });

  wx.ready(function () {
    wx.updateAppMessageShareData({
      title: "Memos",
      desc: "💡 Have an idea? write in here!",
      link: "https://insmemo.justsven.top/",
      imgUrl: "https://insmemo.justsven.top/logo-fill.png",
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
