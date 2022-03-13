function makeFontFace() {
  /**
   * @description
   * Material Iconsを読み込むために必要なタグをheaderに追加する
   */
  let newStyle = document.createElement("link");
  newStyle.setAttribute("rel", "stylesheet");
  newStyle.setAttribute("type", "text/css");
  newStyle.setAttribute(
    "href",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
  );
  document.head.appendChild(newStyle);
}

makeFontFace();

// 画面のロード完了時にmain関数を呼び出す
window.addEventListener("load", main, false);

function main(e) {
  /**
   * 画面の呼び込み完了時に、各話にパーティーアイコン（別のタブで動画を開く）とクラッカーアイコン(パーティールームの作成のためのサイドバーを召喚)を追加する
   */

  item_list = document.querySelectorAll(".itemModule.list a");

  for (var item of item_list) {
    if (item.getAttribute("href").match(/cd_pc/)) {
      var get_partid = function (raw_href) {
        return raw_href.replace(/[^0-9]/g, "");
      };
      var partid = get_partid(item.getAttribute("href"));
      if (item.classList.contains("watched")) {
        item.parentNode.classList.add("watched_episode");
      }
      var play_icon = document.createElement("a");
      play_icon.textContent = "play_arrow";
      play_icon.setAttribute("class", "material-icons play-btn");
      play_icon.setAttribute("target", "_blank");
      play_icon.setAttribute("href", "sc_d_pc?partId=" + partid);
      item.parentNode.appendChild(play_icon);

      var popper_icon = document.createElement("a");
      popper_icon.textContent = "celebration";
      popper_icon.setAttribute("class", "material-icons popper-btn");
      popper_icon.setAttribute("target", "_blank");
      popper_icon.setAttribute(
        "href",
        "sc_d_pc?partId=" + partid + "&party=create"
      );
      item.parentNode.appendChild(popper_icon);
    }
  }

  const options = {
    childList: true, //直接の子の変更を監視
    characterData: false, //文字の変化を監視
    characterDataOldValue: false, //属性の変化前を記録
    attributes: false, //属性の変化を監視
    subtree: true, //全ての子要素を監視
  };
  //コールバック関数
  function callback(mutationsList, observer) {
    if (AUTO_ANOTHER_TAB) {
      directplay_items = document.querySelectorAll(".directPlayReady");
      for (var item of directplay_items) {
        item.setAttribute("target", "_blank");
        if (item.textContent !== "レンタルする") {
          item.setAttribute(
            "href",
            "sc_d_pc?partId=" + item.getAttribute("data-partid")
          );
        }
      }
      $(".directPlayReady, .ui-tooltip-content").on("mousemove", function () {
        console.log(this);
        $(".new_window_remover").remove();
        // $("body").append(
        //   "<script type='text/javascript' class=new_window_remover>$('.directPlayReady').off('click');</script>"
        // );
        $(this).attr({
          href: "sc_d_pc?partId=" + item.getAttribute("data-partid"),
        });
        this.parentNode.append(this);
      });

      $("#streamingQuality a").one("mousemove", function () {
        $(".new_window_remover").remove();
        // $("body").append(
        //   "<script type='text/javascript' class=new_window_remover>$('#streamingQuality a').off('click');</script>"
        // );
      });
      document.querySelectorAll("#streamingQuality a").forEach(function (item) {
        item.setAttribute("target", "_blank");
        if (item.textContent !== "レンタルする") {
          item.setAttribute("href", "sc_d_pc?partId=" + getParam("partId"));
        }
      });
    }
  }

  //ターゲット要素をDOMで取得
  const target = document.querySelector("body");

  //インスタンス化
  const obs = new MutationObserver(callback);
  //ターゲット要素の監視を開始
  //obs.observe(target, options);
  $("body").append(
    "<script type='text/javascript' class=new_window_remover>$('.directPlayReady').off('click');</script>"
  );
}
