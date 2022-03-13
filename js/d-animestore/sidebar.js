makeFontFace();

$(".videoWrapper").wrap("<div class='playerWrapper'></div>");
$(".playerWrapper").append("<div class='sidebar'></div>");
$(".sidebar").append("<div class='sidebar_header'></div>");
$(".sidebar_header").append("<h2 class='sidebar_title'>d-party</h2>");

$(".sidebar").append("<div class='sidebar_content'></div>");
$(".sidebar_content").append("<h3 class='sidebar_create_title create_content'>パーティールームを作成</h3>");
$(".sidebar_content").append("<p class='sidebar_create_text create_content'>パーティーを主催して</p>");
$(".sidebar_content").append("<p class='sidebar_create_text create_content'>みんなで同時に鑑賞しよう！</p>");
$(".sidebar_content").append("<button class='sidebar_create create_content'type='button'>Create Room</button>");
$(".sidebar_content").append("<div class='sidebar_is_host create_content'></div>")
$(".sidebar_is_host").append("<p class='sidebar_is_host_text create_content'>ホストのみが制御</p>");
$(".sidebar_is_host").append("<label class='switch create_content'><input type='checkbox'><span class='slider'></span></label>");

$(".sidebar").append("<div class='sidebar_footer'></div>");
$(".sidebar_footer").append("<p class='footer_content''>powerd by U-Not</p>");

$('.create_content').hide(0);
$('.sidebar_header').hide(0);
$('.sidebar_footer').hide(0);
$('.sidebar_header').fadeIn(1000);
$('.sidebar_footer').fadeIn(1000);

function show_create() {
    /**
     * @description
     * ルーム作成のためのサイドバーの項目を表示
     */
    $('.create_content').fadeIn(1000);
};
function hide_create() {
    /**
     * @description
     * ルーム作成のためのサイドバーの項目を隠す(フェードアウト)
     */
    $('.create_content').fadeOut(1000);
};

function change_create() {
    /**
     * @description
     * ルーム作成のためのサイドバーの項目を隠し、ルームに参加後に必要な内容を表示する
     */
    $('.create_content').fadeOut(1000, show_join);
    window.setTimeout(function () {
        notifier.success('ルームの作成に成功しました');
    }, 1000);
}
$(".sidebar_content").append("<h3 class='sidebar_create_title join_content'>パーティーリンクをシェア</h3>");
$(".sidebar_content").append("<p class='sidebar_create_text join_content'>ルームに参加しました</p>");
$(".sidebar_content").append("<p class='sidebar_create_text join_content'>友達をパーティーに招待しよう</p>");


$(".sidebar_content").append("<div class='sidebar_share_button join_content'></div>");
$(".sidebar_share_button").append("<button class='knopf positive even huge pill m-8 twitter_share share_button'><i class='fab fa-twitter'></i></button>");
$(".sidebar_share_button").append("<button class='knopf positive even huge pill m-8 line_share share_button'><i class='fab fa-line'></i></button>");
$(".sidebar_share_button").append("<button class='knopf positive even huge pill m-8 facebook_share share_button'><i class='fab fa-facebook'></i></button>");
$(".sidebar_share_button").append("<button class='knopf positive even huge pill m-8 mail_share share_button'><i class='fas fa-envelope'></i></button>");

$(".sidebar_content").append("<div class='sidebar_copy_link join_content'></div>");
$(".sidebar_copy_link").append("<p class='sidebar_link join_content'></p>");
$(".sidebar_copy_link").append("<a class='material-icons sidebar_copy_icons join_content'>content_copy</span>");

// 画面のロード完了時にmain関数を呼び出す
window.addEventListener("load", main, false);

function main(e) {
    document.getElementsByClassName("sidebar_copy_link")[0].onclick = function () {
        navigator.clipboard.writeText(D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id);
        document.getElementsByClassName("sidebar_copy_icons")[0].innerHTML = "done";
        window.setTimeout(function () {
            document.getElementsByClassName("sidebar_copy_icons")[0].innerHTML = "content_copy";
        }, 1000);
        notifier.success('共有リンクをコピーしました');
    };

    document.getElementsByClassName("twitter_share")[0].onclick = function () {
        /**
         * @description
         * twitter向けのシェアリンクをクリックした場合の処理
         */
        text = "dアニメストアで『"
        text += document.getElementsByClassName("backInfoTxt1")[0].textContent;
        text += " - ";
        text += document.getElementsByClassName("backInfoTxt2")[0].textContent;
        text += " - ";
        text += document.getElementsByClassName("backInfoTxt3")[0].textContent;
        text += "』を一緒に見ませんか？ 拡張機能『d-party』を使ってパーティーに参加してください";
        hashtags = "dアニメストア,dパーティー"
        encoded_text = encodeURIComponent(text);
        encoded_url = encodeURIComponent(D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id)
        encoded_hashtags = encodeURIComponent(hashtags);
        url = 'https://twitter.com/intent/tweet?text=' + encoded_text + "&url=" + encoded_url + "&hashtags=" + encoded_hashtags;
        window.open(url, null, 'width=700,height=300');
    }

    document.getElementsByClassName("line_share")[0].onclick = function () {
        /**
         * @description
         * Line向けのシェアリンクをクリックした場合の処理
         */
        url = "https://social-plugins.line.me/lineit/share?url="
        encoded_param = encodeURIComponent(D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id)

        window.open(url + encoded_param, null);
    }

    document.getElementsByClassName("facebook_share")[0].onclick = function () {
        /**
         * @description
         * Facebook向けのシェアリンクをクリックした場合の処理
         */
        href = D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id;
        encoded_href = encodeURIComponent(href);
        url = "https://www.facebook.com/dialog/share?app_id=" + FACEBOOK_APP_ID + "&href=" + encoded_href;
        window.open(url, null, 'width=700,height=400');
    }

    document.getElementsByClassName("mail_share")[0].onclick = function () {
        /**
         * @description
         * mail向けのシェアリンクをクリックした場合の処理
         */
        subject = "dアニメストアで一緒にアニメを観ませんか？";
        encoded_subject = encodeURIComponent(subject);

        text = "dアニメストアで『"
        text += document.getElementsByClassName("backInfoTxt1")[0].textContent;
        text += " - ";
        text += document.getElementsByClassName("backInfoTxt2")[0].textContent;
        text += " - ";
        text += document.getElementsByClassName("backInfoTxt3")[0].textContent;
        text += "』を一緒に見ませんか？ 拡張機能『d-party』を使ってパーティーに参加してください\n\n";
        encoded_text = encodeURIComponent(text);
        encoded_param = encodeURIComponent(D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id + "\n");

        window.open("mailto:?" + "&subject=" + encoded_subject + "&body=" + encoded_text + encoded_param, null);
    }
}

$(".sidebar_content").append("<button class='sidebar_leave join_content'type='button'>leave</button>");
$('.join_content').hide(0);

function show_join() {
    /**
     * @description
     * ルーム参加後のためのサイドバーの項目を表示する
     */
    $('.join_content').fadeIn(1000);
};
function hide_join() {
    /**
     * @description
     * ルーム参加後のためのサイドバーの項目を隠す(フェードアウト)
     */
    $('.join_content').fadeOut(1000);
};

function change_join() {
    $('.join_content').fadeOut(1000, show_create);
}

function hide_sidebar() {
    /**
     * @description
     * サイドバー全体を隠す
     */
    $('.sidebar').hide(0);
}

function show_sidebar() {
    /**
     * @description
     * サイドバ全体を表示する
     */
    $('.sidebar').show(0);
}

MODE = "normal"

if (getParam("party") === "create") {
    show_create();
    document.getElementById("video").removeAttribute("autoplay");
    MODE = "create"

} else if (getParam("party") === "join") {
    show_join();
    document.getElementById("video").removeAttribute("autoplay");
    MODE = "join"
} else {
    hide_sidebar();
}

document.addEventListener('fullscreenchange', (event) => {
    /**
     * @description
     * フルスクリーンのon/offを検出し、
     * サイドバーの表示や通知場所の変更を行うeventListenerを追加する
     */
    if (document.fullscreenElement) {
        document.getElementById("awn-toast-container").setAttribute("style", "right:24px;");
        hide_sidebar();
    } else {
        document.getElementById("awn-toast-container").setAttribute("style", "");
        show_sidebar();
    }
});