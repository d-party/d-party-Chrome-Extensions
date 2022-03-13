

// actionを実行可能であるかを管理する。
// video_actionを受け取った場合、これをfalseにしないと無限ループに陥る
available_action = true;
in_room = false;



// 画面のload完了時に実行する関数
window.addEventListener("load", main, false);
function main(e) {
    // modeがルームに参加or作成であった場合、autoplayにならないように変更
    if (MODE === "join" || MODE === "create") {
        // ルームに入ったタイミングで勝手に再生されないようにvideoタグからautoplayを削除
        document.getElementById("video").removeAttribute("autoplay");
    }
    //awesome-notificationの設定
    globalOptions = {
        position: "top-right",
        maxNotifications: 4,
        animationDuration: 200,
        durations: {
            global: 3000,
        }
    };
    notifier = new AWN(globalOptions);
};

function PlayingVideo(option) {
    /**
     * @description
     * 動画の再生を行う処理
     * もしも、すでに動画が再生状態であれば何もせず終了する
     * ユーザーに動作を分かりやすく視認してもらうために、backAreaのクリックを実行
     */
    if (document.getElementById("video").paused) {
        onBackArea(option);
    }
}

// 動画の停止処理
function PauseVideo(option) {
    /**
     * @description
     * 動画の停止を行う処理
     * もしも、すでに動画が停止状態であれば何もせず終了する
     * ユーザーに動作を分かりやすく視認してもらうために、backAreaのクリックを実行
     */
    if (!document.getElementById("video").paused) {
        onBackArea(option);
    }
}

function onPlayButton(option) {
    /**
     * @description
     * 動画プレイヤー下部にあるコントローラー内の再生/停止ボタンをクリックする関数
     */
    document.getElementsByClassName("playButton")[0].click();
}

function onPrevButton(option) {
    /**
     * @description
     * 動画プレイヤー下部にあるコントローラー内の先頭に戻るボタンをクリックする関数
     * 動画の再生時間によって、動画の先頭に戻る場合と前の動画に戻る場合がある
     */
    document.getElementsByClassName("prevButton")[0].click();
}

function onPrevThumbnailButton(option) {
    /**
     * @description
     * 動画プレイヤー下部にあるコントローラー内の先頭に戻るボタンをマウスオーバーした時に出るサムネイルをクリックする関数
     * 動画の再生時間によって、マウスオーバーしても出てこない場合がある
     */
    document.getElementById("prevThumbButton").click()
}

function onNextButton(option) {
    /**
     * @description
     * 動画プレイヤー下部にあるコントローラー内の次の話ボタンをクリックする関数
     */
    document.getElementsByClassName("nextButton")[0].click();
}

function onNextThumbnailButton(option) {
    /**
     * @description
     * 動画プレイヤー下部にあるコントローラー内の次の話ボタンをマウスオーバーした時に出るサムネイルをクリックする関数
     * 動画の再生時間によって、マウスオーバーしても出てこない場合がある
     */
    document.getElementById("nextThumbButton").click()
}

function onBackArea(option) {
    /**
     * @description
     * 動画全体をクリックする
     * 一般的には再生/停止を切り替える
     */
    document.getElementsByClassName("backArea")[0].click();
}


function onSeek(option) {
    /**
     * @description
     * videoタグのcurrentTimeに時間を設定する
     */
    available_action = false;
    document.getElementById("video").currentTime = option["time"];
}

function onChangeRate(option) {
    /**
     * @description
     * videoタグのplaybackRateを合わせる
     * ただし、playbackRateが同一であった場合は、処理は行わない
     */
    if (document.getElementById("video").playbackRate != option["rate"]) {
        document.getElementById("video").playbackRate = option["rate"];
    };
    document.getElementById("video").paused = option["paused"];
}

function onSync(option) {
    /**
     * @description
     * ホストの状態に合わせる関数
     * optionを受け取って全てのステータスを合わせる
     */
    onSeek(option);
    available_action = false;
    onChangeRate(option);
    available_action = false;
    if (option["paused"] === "False") {
        PlayingVideo(option);
    } else {
        PauseVideo(option);
    }
}


function onAction(action, option) {
    /**
     * @description
     * video_actionを受け取り、適切な関数を呼び出す
     */
    switch (action) {
        case "playing":
            PlayingVideo(option);
            break;
        case "pause":
            PauseVideo(option);
            break;
        case "prev":
            onPrevButton(option);
        case "prev_thumbnail":
            onPrevThumbnailButton(option);
            break;
        case "next":
            onNextButton(option);
            break;
        case "next_thumbnail":
            onNextThumbnailButton(option);
            break;
        case "back_area":
            onBackArea(option)
        case "seek":
            onSeek(option);
            break;
        case "ratechange":
            onChangeRate(option);
            break;
        case "sync":
            onSync(option);
            break;
    }
};

function sendCreateRoom(socket) {
    /**
     * @description
     * ルームの作成依頼をwebsocketで要求する
     */
    socket.send(JSON.stringify({
        "method": "create",
        "user_name": "user",
        "part_id": getParam("partId")
    }));
}

function sendJoinRoom(socket, room_id) {
    /**
     * @description
     * ルームの参加依頼をwebsocketで要求する
     * 成功している場合method : join がそのうち帰ってくる
     */
    socket.send(JSON.stringify({
        "method": "join",
        "user_name": "user",
        "room_id": room_id,
    }));
}

async function sendVideoActionRoom(socket, action, option) {
    /**
     * @description
     * video_actionを送信する
     * 送信後はavailable_actionをtrueにする
     */
    await socket.send(JSON.stringify({
        "method": "video_action",
        "user_id": user_id,
        "action": action,
        "option": option
    }));
    available_action = true;
}

async function sendSyncRequest(socket) {
    /**
     * @description
     * ルームに対してsync要求をwebsocketで要求する
     * サーバーはホストのみにsync_requestを送信し、送信元にoptionを返す
     */
    await socket.send(JSON.stringify({
        "method": "sync_request",
    }));
    available_action = true;
}

async function sendSyncResponse(socket, user, option) {
    /**
     * @description
     * sync_requestの返信をwebsocketで送信する
     * 上の関数のsendSyncRequestで送信された要求を受け取ったホストがこの関数を呼び出す
     */
    await socket.send(JSON.stringify({
        "method": "sync_response",
        "to_user": user,
        "option": option
    }));
    available_action = true;
}

function sendActionNotification(socket, action) {
    /**
     * @description
     * ルームに対してaction_notificationを送信する
     * 通知が必要な動作を行った場合に呼び出される
     */
    socket.send(JSON.stringify({
        "method": "action_notification",
        "action": action,
        "user_name": "user",
    }));
}

function getTitle() {
    /**
     * @description
     * ウェブページ向けにタイトルを取得
     */
    let info = "";
    info = document.getElementsByClassName("backInfoTxt1")[0].textContent;
    info += " - "
    info += document.getElementsByClassName("backInfoTxt2")[0].textContent;
    info += " - "
    info += document.getElementsByClassName("backInfoTxt3")[0].textContent;
    info += " | dアニメストア"
    return info
}

function getActionOption() {
    /**
     * @description
     * プレイヤーの状態を取得し返す関数
     * 普段は取得したoptionをvideo_actionを送る際についでに送信する
     * とりあえず、この情報があればプレイヤーの状態を再現できるはず、、、理論上は、、、
     */
    let option = {
        "time": document.getElementById("video").currentTime,
        "src": document.getElementById("video").getAttribute("src"),
        "paused": document.getElementById("video").paused,
        "rate": document.getElementById("video").playbackRate,
        "part_id": getParam("partId")
    };
    return option;
}

document.getElementById("video").addEventListener('loadeddata', function () {
    /**
     * @description
     * 動画のロードが終了した場合に、行うべき処理を記述する
     * ページのタイトルに動画の情報から取得したタイトルを挿入する
     */
    document.querySelector('title').textContent = getTitle();
}
);



document.getElementsByClassName("sidebar_create")[0].onclick = async function () {
    change_create();
    //作成ボタンを推された場合の処理
    var url = new URL(window.location.href);

    var params = url.searchParams;

    socket = new WebSocket(D_ANI_PARTY_WEBSOCKET_ENDPOINT);
    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        console.log(data)
        switch (data["method"]) {
            case "create":
                user_id = data["user"]["user_id"];
                room_id = data["room_id"];
                document.getElementsByClassName("sidebar_link")[0].innerHTML = D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id
                break;
            case "user_add":
                notifier.info("『" + data["user"]["user_name"] + "』さんが参加 <i class='fas fa-glass-cheers'></i>");
                break;
            case "video_action":
                available_action = false;
                onAction(data["action"], data["option"]);
                break;
            case "leave":
                getActionOption()
                notifier.info("『" + data["user"]["user_name"] + "』さんが退室 <i class='fas fa-sign-out-alt'></i>");
            case "sync_request":
                sendSyncResponse(socket, user = data["user"], option = getActionOption());
                break;
            case "sync_response":
                available_action = false;
                onAction("sync", data["option"]);
                break;
            case "action_notification":
                switch (data["action"]) {
                    case "next":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-forward notification-icon'></i>』を受信");
                        break;
                    case "play":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-play notification-icon'></i>』を受信");
                        break;
                    case "stop":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-stop notification-icon'></i>』を受信");
                        break;
                    case "skip":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-fast-forward notification-icon'></i>』を受信");
                        break;
                }
                break;
        }
        window.setTimeout(function () {
            available_action = true;
        }, 500);
    };

    // WebSocketクローズ時の処理
    socket.onclose = (event) => {
        // ウェブページを閉じたとき以外のWebSocketクローズは想定外
        notifier.alert('サーバーとの通信が終了しました');
    };
    add_contoroll_button();
    general_websocket(socket);

    window.setTimeout(function () {
        sendCreateRoom(socket)
    }, 500);
};


document.getElementById("video").addEventListener('loadeddata', function () {
    if (MODE !== "join") {
        return
    };
    //参加ボタンを推された場合の処理
    var url = new URL(window.location.href);

    var params = url.searchParams;

    socket = new WebSocket(D_ANI_PARTY_WEBSOCKET_ENDPOINT);
    socket.onmessage = (event) => {

        let data = JSON.parse(event.data);
        console.log(data)
        switch (data["method"]) {
            case "video_action":
                available_action = false;
                onAction(data["action"], data["option"]);
                break;
            case "create":
                break;
            case "join":
                user_id = data["user"]["user_id"];
                room_id = data["room_id"];
                document.getElementsByClassName("sidebar_link")[0].innerHTML = D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id;
                notifier.success("ルームに参加");
                break;
            case "user_add":
                notifier.info("『" + data["user"]["user_name"] + "』さんが参加 <i class='fas fa-glass-cheers'></i>");
                break;
            case "leave":
                notifier.info("『" + data["user"]["user_name"] + "』さんが退室 <i class='fas fa-sign-out-alt'></i>");
                break;
            case "sync_request":
                sendSyncResponse(socket, user = data["user"], option = getActionOption());
                break;
            case "sync_response":
                available_action = false;
                onAction("sync", data["option"]);
                notifier.info('再生状況をホストにシンク');
                break;
            case "action_notification":
                switch (data["action"]) {
                    case "next":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-forward notification-icon'></i>』を受信");
                        break;
                    case "play":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-play notification-icon'></i>』を受信");
                        break;
                    case "stop":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-stop notification-icon'></i>』を受信");
                        break;
                    case "skip":
                        notifier.info("『" + data["user"]["user_name"] + "』さんから『<i class='fas fa-fast-forward notification-icon'></i>』を受信");
                        break;
                }
                break;
        }
        window.setTimeout(function () {
            available_action = true;
        }, 500);
    };

    // WebSocketクローズ時の処理
    socket.onclose = (event) => {
        // ウェブページを閉じたとき以外のWebSocketクローズは想定外
        notifier.alert('サーバーとの通信が終了');
    };

    if (params.get('party') === "true") {
        document.querySelector('title').textContent += ' 🎉'
    }
    add_contoroll_button();
    general_websocket(socket);
    room_id = getParam("room_id");
    window.setTimeout(function () {
        sendJoinRoom(socket, room_id);
        available_action = true;
        sendSyncRequest(socket);
    }, 500);
}
    , {
        once: true
    });

function general_websocket(socket) {
    /**
     * @description
     * 動画の操作を検知して、websocketを送信するためのeventListenerを追加する関数
     */
    // 再生処理
    document.getElementById("video").addEventListener('playing', function () {
        document.getElementById("video").setAttribute("autoplay", "");
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "playing", option);
        };
        available_action = true;
    }
    );
    // 停止処理
    document.getElementById("video").addEventListener('pause', function () {
        console.log(available_action)
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "pause", option);
        };
        available_action = true;
    }
    );
    // ロード処理
    document.getElementById("video").addEventListener('loadeddata', function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "loaded", option);
        };
        available_action = true;
    }
    );

    // seek処理
    document.getElementById("video").addEventListener('seeking', function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "seek", option);
        };
        available_action = true;
    }
    );
    // 再生速度変更
    document.getElementById("video").addEventListener('ratechange', function () {
        if (available_action && document.getElementById("video").playbackRate != 0) {
            option = getActionOption();
            sendVideoActionRoom(socket, "ratechange", option);
        };
        available_action = true;
    }
    );

    //次の話のポップを推された場合の処理
    document.getElementById("nextThumbinner").onclick = function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "next_thumbnail", option);
            available_action = true;
            sendActionNotification(socket, "next");
            notifier.success("『<i class='fas fa-forward notification-icon'></i>』をルームに送信");
        }
    };

    //次の話ボタンを推された場合の処理
    document.getElementsByClassName("nextButton")[0].onclick = function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "next", option);
            available_action = true;
            sendActionNotification(socket, "next");
            notifier.success("『<i class='fas fa-forward notification-icon'></i>』をルームに送信");
        }
    };

    //前の話ボタンを推された場合の処理
    document.getElementsByClassName("prevButton")[0].onclick = function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "prev", option);
            available_action = true;
        }
    };
    //前の話のポップを推された場合の処理
    document.getElementById("prevThumbinner").onclick = function () {
        if (available_action) {
            option = getActionOption();
            sendVideoActionRoom(socket, "prev_thumbnail", option);
            available_action = true;
        }
    };

    document.getElementsByClassName("sync_button")[0].onclick = function () {
        if (available_action) {
            sendSyncRequest(socket);
            available_action = true;
        }
    };
    document.getElementsByClassName("backArea")[0].onclick = function () {
        if (available_action) {
            if (!document.getElementById("video").paused) {
                sendActionNotification(socket, "play");
                notifier.success("『<i class='fas fa-play notification-icon'></i>』をルームに送信");
            } else {
                sendActionNotification(socket, "stop");
                notifier.success("『<i class='fas fa-stop notification-icon'></i>』をルームに送信");
            }
        }
    };

    document.getElementsByClassName("seekArea")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("backButton")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-fast-backward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("skipButton")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("skip10Button")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-step-forward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("skip30Button")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("back10Button")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-step-backward notification-icon'></i>』をルームに送信");
    };
    document.getElementsByClassName("back30Button")[0].onclick = function () {
        sendActionNotification(socket, "skip");
        notifier.success("『<i class='fas fa-fast-backward notification-icon'></i>』をルームに送信");
    };
};

function add_contoroll_button() {
    /**
     * @description
     * 動画下部に存在してるコントロールバーにアイコンを追加する
     * 追加するアイコンはホストに同期するためのsyncボタンとリアクションボタンが複数である
     */
    // syncボタンの追加
    $(".space").before("<div class='sync_button controll_button'><i class='fas fa-sync-alt buttonArea_icon'></i></div>");
    // サムアップのリアクションボタンを追加
    $(".space").before("<div class='thumbs_button controll_button'><i class='far fa-thumbs-up buttonArea_icon'></i></div>");
    // ハートマークのリアクションボタンを追加
    $(".space").before("<div class='fav_button controll_button'><i class='fas fa-heart buttonArea_icon'></i></div>");
    // 笑顔のリアクションボタンを追加
    $(".space").before("<div class='smile_button controll_button'><i class='fas fa-smile-beam buttonArea_icon'></i></div>");
    // 涙のリアクションボタンを追加
    $(".space").before("<div class='cry_button controll_button'><i class='fas fa-sad-cry buttonArea_icon'></i></div>");
    // 中指を立てるリアクションボタンを追加
    $(".space").before("<div class='midle_finger_button controll_button'><i class='fas fa-hand-middle-finger buttonArea_icon'></i></div>");
}
