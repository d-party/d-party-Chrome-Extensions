chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
    }
);

function makeFontFace() {
    /**
     * @description
     * Material Iconsを読み込むために必要なタグをheaderに追加する
     */
    let newStyle = document.createElement('link');
    newStyle.setAttribute("rel", "stylesheet");
    newStyle.setAttribute("type", "text/css");
    newStyle.setAttribute("href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    document.head.appendChild(newStyle);
};

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
                return raw_href.replace(/[^0-9]/g, '');
            }
            var partid = get_partid(item.getAttribute("href"));

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
            popper_icon.setAttribute("href", "sc_d_pc?partId=" + partid + "&party=create");
            item.parentNode.appendChild(popper_icon);
        }
    }

};