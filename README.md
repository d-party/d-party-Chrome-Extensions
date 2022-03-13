# d-party Chrome Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/d-Party/d-Party-Chrome-Extensions/blob/main/LICENSE)

d-partyのChrome Extensionを開発するリポジトリ

## 開発

本拡張機能のの動作検証には、バックエンドの動作が必須となります。
[d-Party-Backend](https://github.com/d-Party/d-Party-Backend)をcloneして起動させてください。

また、デフォルトの設定ではlocalhostではなく、wss://d-party.netに接続しに行く設定を行っています。

### 設定

`js/common/settings.js`に必要な設定を集約しています。
例えば、バックエンドのURLの変更を行いたい場合は、グローバル変数として定義されている、`D_PARTY_BACKEND_HOST`、`D_PARTY_BACKEND_PROTOCOL`、`D_PARTY_WEBSOCKET_PROTOCOL`、の変数を変更する必要があります。

## 使用ライブラリ

本拡張機能には以下のサードパーティー製ライブラリが用いられています。

- [jQuery-3.6.0](https://jquery.com/)
  - <https://code.jquery.com/jquery-3.6.0.min.js>
- [jQuery Easing Plugin](https://gsgd.co.uk/sandbox/jquery/easing/)
- [Font Awesome](https://fontawesome.com/)
- [Awesome Notifications](https://f3oall.github.io/awesome-notifications/)
- [Knopf.css](https://knopf.dev/)
  - <https://unpkg.com/knopf.css/knopf.min.css>
- [Flickity · Touch, responsive, flickable carousels](https://flickity.metafizzy.co/)
  - <https://unpkg.com/flickity@2.3.0/dist/flickity.pkgd.min.js>
  - <https://unpkg.com/flickity@2.3.0/dist/flickity.css>
