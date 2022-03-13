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

let D_PARTY_API_ENDPINT = D_PARTY_BACKEND_PROTOCOL + D_PARTY_BACKEND_HOST + "api/v1/";
let D_PARTY_VERSION_CHECK_ENDPOINT = D_PARTY_API_ENDPINT + "chrome-extension/version-check";

let D_PARTY_ANIMESTORE_HOST = D_PARTY_BACKEND_HOST + "anime-store/";
let D_ANI_PARTY_WEBSOCKET_ENDPOINT = D_PARTY_WEBSOCKET_PROTOCOL + D_PARTY_ANIMESTORE_HOST + "party/";
let D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT = D_PARTY_BACKEND_PROTOCOL + D_PARTY_ANIMESTORE_HOST + "lobby/";

/**
 * @description
 * facebookのAPP ID
 * これが無いとシェアボタンが使えない
 */
let FACEBOOK_APP_ID = "256850306460920";