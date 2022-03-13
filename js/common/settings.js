/**
 * @description
 * d-partyのバックエンドに関する情報
 * localhostで実験する場合は
 * d-party.net->localhost
 * https -> http
 * wss -> ws
 * に変更すればよいはず
 */

let D_PARTY_BACKEND_HOST = "d-party.net/";

let D_PARTY_BACKEND_PROTOCOL = "https://";
let D_PARTY_WEBSOCKET_PROTOCOL = "wss://";

/**
 * localhostにて検証したい場合
let D_PARTY_BACKEND_HOST = localhost/";

let D_PARTY_BACKEND_PROTOCOL = "http://";
let D_PARTY_WEBSOCKET_PROTOCOL = "ws://";
 */

let D_PARTY_API_ENDPINT =
  D_PARTY_BACKEND_PROTOCOL + D_PARTY_BACKEND_HOST + "api/v1/";
let D_PARTY_VERSION_CHECK_ENDPOINT =
  D_PARTY_API_ENDPINT + "chrome-extension/version-check";

let D_PARTY_ANIMESTORE_HOST = D_PARTY_BACKEND_HOST + "anime-store/";
let D_ANI_PARTY_WEBSOCKET_ENDPOINT =
  D_PARTY_WEBSOCKET_PROTOCOL + D_PARTY_ANIMESTORE_HOST + "party/";
let D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT =
  D_PARTY_BACKEND_PROTOCOL + D_PARTY_ANIMESTORE_HOST + "lobby/";

/**
 * @description
 * facebookのAPP ID
 * これが無いとシェアボタンが使えない
 */
let FACEBOOK_APP_ID = "256850306460920";

/**
 * @description
 * バッジからの設定を読み込む
 */
let AUTO_ANOTHER_TAB = true;
chrome.storage.sync.get(["auto_another_tab"], function (result) {
  if (result.auto_another_tab) {
    AUTO_ANOTHER_TAB = true;
  } else if (result.auto_another_tab === false) {
    AUTO_ANOTHER_TAB = false;
  }
});

let HIDE_REACTION = false;
chrome.storage.sync.get(["hide_reaction"], function (result) {
  if (result.hide_reaction) {
    HIDE_REACTION = true;
  }
});

let HIDE_REACTION_ICON = false;
chrome.storage.sync.get(["hide_reaction_icon"], function (result) {
  if (result.hide_reaction_icon) {
    HIDE_REACTION_ICON = true;
  }
});
let SELF_NOTIFICATION = false;
chrome.storage.sync.get(["self_notification"], function (result) {
  if (result.self_notification) {
    SELF_NOTIFICATION = true;
  }
});
let USER_NAME = "AnonymousUser";
chrome.storage.sync.get(["user_name"], function (result) {
  if (result.user_name) {
    USER_NAME = result.user_name;
  } else {
    USER_NAME = "AnonymousUser";
  }
});

chrome.storage.sync.onChanged.addListener(function (changes, namespace) {
  chrome.storage.sync.get(["hide_reaction"], function (result) {
    if (result.hide_reaction) {
      HIDE_REACTION = true;
    } else {
      HIDE_REACTION = false;
    }
  });

  chrome.storage.sync.get(["hide_reaction_icon"], function (result) {
    if (result.hide_reaction_icon) {
      HIDE_REACTION_ICON = true;
      $(".reaction_icon").hide();
    } else {
      HIDE_REACTION_ICON = false;
      $(".reaction_icon").show();
    }
  });
  chrome.storage.sync.get(["self_notification"], function (result) {
    if (result.self_notification) {
      SELF_NOTIFICATION = true;
    } else {
      SELF_NOTIFICATION = false;
    }
  });
});
