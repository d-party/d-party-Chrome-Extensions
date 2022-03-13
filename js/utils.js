/**
 * Get the URL parameter value
 * https://www-creators.com/archives/4463
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
  /**
   * @description
   * URLのパラメータを取得する関数
   */
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function makeFontFace() {
  let newStyle = document.createElement("link");
  newStyle.setAttribute("rel", "stylesheet");
  newStyle.setAttribute("type", "text/css");
  newStyle.setAttribute(
    "href",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
  );
  document.head.appendChild(newStyle);
}

function getRandomIntInclusive(min, max) {
  /**
   * @description
   * min~maxまでの乱数を取得する
   */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
