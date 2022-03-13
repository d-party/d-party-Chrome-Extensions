makeFontFace();

$(".videoWrapper").wrap("<div class='playerWrapper'></div>");
$(".playerWrapper").append("<div class='sidebar'></div>");
$(".sidebar").append("<div class='sidebar_header'></div>");

/**
 * @description
 * headerに追加する項目を追加
 */
$(".sidebar_header").append(
  "<div><h2 class='sidebar_title'>d-party</h2></div>"
);

/**
 * @todo
 * 謎に拡張機能の空間から.show()や.fadeIn()を用いて再表示しようとするとエラーが発生するため
 * ひとまず専用class(carousel_wrapper)を使用
 */
$(".sidebar_header").append(
  "<div class='carousel_wrapper'><div class='carousel' data-flickity></div>"
);
// 項目を追加
$(".carousel").append(
  "<div class='carousel-cell' id='carousel_share'><h3>シェア</h3></div>"
);
$(".carousel").append(
  "<div class='carousel-cell' id='carousel_history'><h3>履歴</h3></div>"
);
$(".carousel").append(
  "<div class='carousel-cell' id='carousel_users'><h3>ルーム参加者</h3></div>"
);
$(".carousel").append(
  "<div class='carousel-cell' id='carousel_control'><h3>コントロール</h3></div>"
);
carousel = $(".carousel").flickity({
  draggable: false,
});

let FLKTY = carousel.data("flickity");
// access properties
console.log(FLKTY.selectedElement);

/**
 * @description
 * contentに追加する項目を追加
 */

$(".sidebar").append("<div class='sidebar_content'></div>");
$(".sidebar_content").append(
  "<h3 class='sidebar_create_title create_content'>パーティールームを作成</h3>"
);
$(".sidebar_content").append(
  "<p class='sidebar_create_text create_content'>パーティーを主催して</p>"
);
$(".sidebar_content").append(
  "<p class='sidebar_create_text create_content'>みんなで同時に鑑賞しよう！</p>"
);

// $(".sidebar_content").append(
//   "<div class='inputWithIcon inputIconBg user_input_textbox create_content'></div>"
// );
// $(".user_input_textbox").append("<input type='text' placeholder='Your name'>");
// $(".user_input_textbox").append(
//   "<i class='fa fa-user fa-lg fa-fw' aria-hidden='true'></i>"
// );

$(".sidebar_content").append(
  "<button class='sidebar_create create_content'type='button'>Create Room</button>"
);
// $(".sidebar_content").append(
//   "<div class='sidebar_is_host create_content'></div>"
// );
// $(".sidebar_is_host").append(
//   "<p class='sidebar_is_host_text create_content'>ホストのみが制御</p>"
// );
// $(".sidebar_is_host").append(
//   "<label class='switch create_content'><input type='checkbox'><span class='slider'></span></label>"
// );

$(".sidebar").append("<div class='sidebar_footer'></div>");
$(".sidebar_footer").append("<p class='footer_content''>powerd by U-Not</p>");

$(".create_content").hide(0);
$(".sidebar_header").hide(0);
$(".sidebar_footer").hide(0);
$(".sidebar_header").fadeIn(1000);
$(".sidebar_footer").fadeIn(1000);

function show_create() {
  /**
   * @description
   * ルーム作成のためのサイドバーの項目を表示
   */
  $(".create_content").fadeIn(1000);
}
function hide_create() {
  /**
   * @description
   * ルーム作成のためのサイドバーの項目を隠す(フェードアウト)
   */
  $(".create_content").fadeOut(1000);
}

function change_create() {
  /**
   * @description
   * ルーム作成のためのサイドバーの項目を隠し、ルームに参加後に必要な内容を表示する
   */
  $(".create_content").fadeOut(1000, show_join);
  window.setTimeout(function () {
    success_notification_history("ルームの作成に成功しました");
  }, 1000);
}

/**
 * @description
 * シェアに必要なコンテンツ追加
 */
$(".sidebar_content").append(
  "<h3 class='sidebar_create_title share_content'>パーティーリンクをシェア</h3>"
);
$(".sidebar_content").append(
  "<p class='sidebar_create_text share_content'>ルームに参加しました</p>"
);
$(".sidebar_content").append(
  "<p class='sidebar_create_text share_content'>友達をパーティーに招待しよう</p>"
);

$(".sidebar_content").append(
  "<div class='sidebar_share_button share_content'></div>"
);
$(".sidebar_share_button").append(
  "<button class='knopf positive even huge pill m-8 twitter_share share_button'><i class='fab fa-twitter'></i></button>"
);
$(".sidebar_share_button").append(
  "<button class='knopf positive even huge pill m-8 line_share share_button'><i class='fab fa-line'></i></button>"
);
$(".sidebar_share_button").append(
  "<button class='knopf positive even huge pill m-8 facebook_share share_button'><i class='fab fa-facebook'></i></button>"
);
$(".sidebar_share_button").append(
  "<button class='knopf positive even huge pill m-8 mail_share share_button'><i class='fas fa-envelope'></i></button>"
);

$(".sidebar_content").append(
  "<div class='sidebar_copy_link share_content'></div>"
);
$(".sidebar_copy_link").append("<p class='sidebar_link share_content'></p>");
$(".sidebar_copy_link").append(
  "<a class='material-icons sidebar_copy_icons share_content'>content_copy</span>"
);

/**
 * @description
 * ユーザーリストに必要な要素
 */
$(".sidebar_content").append(
  "<div class='sidebar_flex_start_wrapper users_content users_wrapper'></div>"
);

function add_users_item(user_id, user_name) {
  /**
   * @description
   * 各ユーザーをユーザーリストに追加する
   * 既存のユーザーだった場合名前を変更する
   * @info
   * 1文字目が数字のidを指定しないためにusers-を追加している
   */
  if (document.getElementById("users-" + user_id)) {
    user_p = document.querySelector("#users-" + user_id + " p");
    user_p.innerText = user_name;
  } else {
    $(".users_wrapper").append(
      "<div class='users_item users_content' id='users-" +
        user_id +
        "'><i class='fas fa-user'></i><p class='sidebar_users_text users_content'>" +
        user_name +
        "</p></div>"
    );
  }
}

function remove_users_item(user_id) {
  /**
   * @description
   * ユーザーリストから人を削除する
   */
  if (document.getElementById(user_id)) {
    document.getElementById(user_id).remove();
  }
}
$(".sidebar_content").append(
  "<div class='sidebar_flex_start_wrapper history_content history_wrapper'></div>"
);

function add_history_user(user_name) {
  /**
   * @description
   * ユーザーの追加を履歴に表示する
   */
  $(".history_wrapper").append(
    "<p class='history_user_text history_content'>『" +
      user_name +
      "』さんが入室</p>"
  );
  document.getElementsByClassName("sidebar_content")[0].scrollTop =
    document.getElementsByClassName("sidebar_content")[0].scrollHeight;
}
function leave_history_user(user_name) {
  /**
   * @description
   * ユーザーの離脱を履歴に追加する
   */
  $(".history_wrapper").append(
    "<p class='history_user_text history_content'>『" +
      user_name +
      "』さんが退室</p>"
  );
  document.getElementsByClassName("sidebar_content")[0].scrollTop =
    document.getElementsByClassName("sidebar_content")[0].scrollHeight;
}
function add_history(history_text) {
  /**
   * @description
   * 履歴を追加する
   */
  var now = new Date();
  time =
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);
  $(".history_wrapper").append(
    "<div class='history_text_wrapper history_content'><p class='history_text history_time'>[ " +
      time +
      " ]</p><p class='history_text_content history_text'>" +
      history_text +
      "</p></div>"
  );
  document.getElementsByClassName("sidebar_content")[0].scrollTop =
    document.getElementsByClassName("sidebar_content")[0].scrollHeight;
}

$(".sidebar_content").append(
  "<h3 class='sidebar_create_title control_content'>パーティールームから退室</h3>"
);
$(".sidebar_content").append(
  "<p class='sidebar_create_text control_content'>退室しサイドバーを閉じる</p>"
);
$(".sidebar_content").append(
  "<button class='sidebar_control control_content'type='button' id='sidebar_leave_button'>leave</button>"
);
// 画面のロード完了時にmain関数を呼び出す
window.addEventListener("load", main, false);

function main(e) {
  document.getElementsByClassName("sidebar_copy_link")[0].onclick =
    function () {
      navigator.clipboard.writeText(
        D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id
      );
      document.getElementsByClassName("sidebar_copy_icons")[0].innerHTML =
        "done";
      window.setTimeout(function () {
        document.getElementsByClassName("sidebar_copy_icons")[0].innerHTML =
          "content_copy";
      }, 1000);
      notifier.success("共有リンクをコピーしました");
    };

  document.getElementsByClassName("twitter_share")[0].onclick = function () {
    /**
     * @description
     * twitter向けのシェアリンクをクリックした場合の処理
     */
    text = "dアニメストアで『";
    text += document.getElementsByClassName("backInfoTxt1")[0].textContent;
    text += " - ";
    text += document.getElementsByClassName("backInfoTxt2")[0].textContent;
    text += " - ";
    text += document.getElementsByClassName("backInfoTxt3")[0].textContent;
    text +=
      "』を一緒に見ませんか？ 拡張機能『d-party』を使ってパーティーに参加してください";
    hashtags = "dアニメストア,dパーティー";
    encoded_text = encodeURIComponent(text);
    encoded_url = encodeURIComponent(
      D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id
    );
    encoded_hashtags = encodeURIComponent(hashtags);
    url =
      "https://twitter.com/intent/tweet?text=" +
      encoded_text +
      "&url=" +
      encoded_url +
      "&hashtags=" +
      encoded_hashtags;
    window.open(url, null, "width=700,height=300");
  };

  document.getElementsByClassName("line_share")[0].onclick = function () {
    /**
     * @description
     * Line向けのシェアリンクをクリックした場合の処理
     */
    url = "https://social-plugins.line.me/lineit/share?url=";
    encoded_param = encodeURIComponent(
      D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id
    );

    window.open(url + encoded_param, null);
  };

  document.getElementsByClassName("facebook_share")[0].onclick = function () {
    /**
     * @description
     * Facebook向けのシェアリンクをクリックした場合の処理
     */
    href = D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id;
    encoded_href = encodeURIComponent(href);
    url =
      "https://www.facebook.com/dialog/share?app_id=" +
      FACEBOOK_APP_ID +
      "&href=" +
      encoded_href;
    window.open(url, null, "width=700,height=400");
  };

  document.getElementsByClassName("mail_share")[0].onclick = function () {
    /**
     * @description
     * mail向けのシェアリンクをクリックした場合の処理
     */
    subject = "dアニメストアで一緒にアニメを観ませんか？";
    encoded_subject = encodeURIComponent(subject);

    text = "dアニメストアで『";
    text += document.getElementsByClassName("backInfoTxt1")[0].textContent;
    text += " - ";
    text += document.getElementsByClassName("backInfoTxt2")[0].textContent;
    text += " - ";
    text += document.getElementsByClassName("backInfoTxt3")[0].textContent;
    text +=
      "』を一緒に見ませんか？ 拡張機能『d-party』を使ってパーティーに参加してください\n\n";
    encoded_text = encodeURIComponent(text);
    encoded_param = encodeURIComponent(
      D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id + "\n"
    );

    window.open(
      "mailto:?" +
        "&subject=" +
        encoded_subject +
        "&body=" +
        encoded_text +
        encoded_param,
      null
    );
  };
}

$(".share_content").hide(0);
$(".control_content").hide(0);
$(".users_content").hide(0);
$(".history_content").hide(0);
function show_join() {
  /**
   * @description
   * ルーム参加後のためのサイドバーの項目を表示する
   */

  $(".share_content").fadeIn(1000);
  $(".carousel_wrapper").animate(
    { opacity: 100 },
    {
      duration: 1000,
      easing: "easeOutQuart",
    }
  );
}
function hide_join() {
  /**
   * @description
   * ルーム参加後のためのサイドバーの項目を隠す(フェードアウト)
   */
  $(".share_content").fadeOut(1000);
}

function change_join() {
  /**
   * @description
   * ルーム参加後のためのサイドバー項目を非表示にする
   */
  $(".share_content").fadeOut(1000, show_create);
}

function hide_sidebar() {
  /**
   * @description
   * サイドバー全体を隠す
   */
  $(".sidebar").hide(0);
}

function show_sidebar() {
  /**
   * @description
   * サイドバ全体を表示する
   */
  $(".sidebar").show(0);
}

MODE = "normal";

if (getParam("party") === "create") {
  show_create();
  document.getElementById("video").removeAttribute("autoplay");
  MODE = "create";
} else if (getParam("party") === "join") {
  show_join();
  document.getElementById("video").removeAttribute("autoplay");
  MODE = "join";
} else {
  hide_sidebar();
}

document.addEventListener("fullscreenchange", (event) => {
  /**
   * @description
   * フルスクリーンのon/offを検出し、
   * サイドバーの表示や通知場所の変更を行うeventListenerを追加する
   */
  if (document.fullscreenElement) {
    hide_sidebar();
    document
      .getElementById("awn-toast-container")
      .setAttribute("style", "right:24px;");
  } else {
    show_sidebar();
    document.getElementById("awn-toast-container").setAttribute("style", "");
  }
});
