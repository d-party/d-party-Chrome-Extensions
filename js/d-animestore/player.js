// actionを実行可能であるかを管理する。
// video_actionを受け取った場合、これをfalseにしないと無限ループに陥る
let available_action = true;

//ルームに入っている場合のフラグ
let in_room = false;

let user_list = [];

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
    },
  };
  notifier = new AWN(globalOptions);
  next_page_anoter_tab();
}

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
  $("#prevPopupIn").removeClass("hide");
  $("#prevPopupIn").addClass("show");
  document.getElementById("prevThumbButton").click();
}

function onPrevThumbnailButton(option) {
  /**
   * @description
   * 動画プレイヤー下部にあるコントローラー内の先頭に戻るボタンをマウスオーバーした時に出るサムネイルをクリックする関数
   * 動画の再生時間によって、マウスオーバーしても出てこない場合がある
   */
  $("#prevPopupIn").removeClass("hide");
  $("#prevPopupIn").addClass("show");
  document.getElementById("prevThumbButton").click();
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
  document.getElementById("nextThumbButton").click();
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
  }
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
  if (in_room) {
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
        onBackArea(option);
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
  }
}

function sender(socket, data) {
  try {
    if (in_room) {
      socket.send(JSON.stringify(data));
    }
  } catch (error) {
    disconnect_message = "サーバーとの通信が終了";
    notifier.alert(disconnect_message);
    add_history(disconnect_message);
    in_room = false;
  }
}

function sendCreateRoom(socket) {
  /**
   * @description
   * ルームの作成依頼をwebsocketで要求する
   */
  sender(socket, {
    action: "create",
    user_name: USER_NAME,
    part_id: getParam("partId"),
    request_id: new Date().getTime(),
  });
}

function sendJoinRoom(socket, room_id) {
  /**
   * @description
   * ルームの参加依頼をwebsocketで要求する
   * 成功している場合method : join がそのうち帰ってくる
   */
  sender(socket, {
    action: "join",
    user_name: USER_NAME,
    room_id: room_id,
    request_id: new Date().getTime(),
  });
}

async function sendVideoActionRoom(socket, action, option) {
  /**
   * @description
   * video_actionを送信する
   * 送信後はavailable_actionをtrueにする
   */
  sender(socket, {
    action: "video_operation",
    user_id: user_id,
    operation: action,
    option: option,
    request_id: new Date().getTime(),
  });
  available_action = true;
}

async function sendSyncRequest(socket) {
  /**
   * @description
   * ルームに対してsync要求をwebsocketで要求する
   * サーバーはホストのみにsync_requestを送信し、送信元にoptionを返す
   */
  sender(socket, {
    action: "sync_request",
    request_id: new Date().getTime(),
  });
  available_action = true;
}

async function sendSyncResponse(socket, user, option) {
  /**
   * @description
   * sync_requestの返信をwebsocketで送信する
   * 上の関数のsendSyncRequestで送信された要求を受け取ったホストがこの関数を呼び出す
   */
  sender(socket, {
    action: "sync_response",
    to_user: user,
    option: option,
    request_id: new Date().getTime(),
  });
  available_action = true;
}

function sendActionNotification(socket, action) {
  /**
   * @description
   * ルームに対してaction_notificationを送信する
   * 通知が必要な動作を行った場合に呼び出される
   */
  sender(socket, {
    action: "operation_notification",
    operation: action,
    user_name: USER_NAME,
    request_id: new Date().getTime(),
  });
}

function sendLeaveRoom(socket) {
  /**
   * @description
   * ルームの退室依頼をwebsocketで要求する
   */
  sender(socket, {
    action: "leave",
    user_name: USER_NAME,
    request_id: new Date().getTime(),
  });
  in_room = false;
  hide_sidebar();
  document
    .getElementById("awn-toast-container")
    .setAttribute("style", "right:24px;");
}

function sendUserList(socket) {
  /**
   * @description
   * ユーザーリストをwebsocketで要求する
   */
  sender(socket, {
    action: "user_list",
    request_id: new Date().getTime(),
  });
}

function sendReaction(socket, reaction_type) {
  /**
   * @description
   * ルームの作成依頼をwebsocketで要求する
   */
  sender(socket, {
    action: "reaction",
    reaction_type: reaction_type,
    request_id: new Date().getTime(),
  });
}

function getTitle() {
  /**
   * @description
   * ウェブページ向けにタイトルを取得
   */
  let info = "";
  info = document.getElementsByClassName("backInfoTxt1")[0].textContent;
  info += " - ";
  info += document.getElementsByClassName("backInfoTxt2")[0].textContent;
  info += " - ";
  info += document.getElementsByClassName("backInfoTxt3")[0].textContent;
  info += " | dアニメストア";
  return info;
}

function getActionOption() {
  /**
   * @description
   * プレイヤーの状態を取得し返す関数
   * 普段は取得したoptionをvideo_actionを送る際についでに送信する
   * とりあえず、この情報があればプレイヤーの状態を再現できるはず、、、理論上は、、、
   */
  let option = {
    time: document.getElementById("video").currentTime,
    src: document.getElementById("video").getAttribute("src"),
    paused: document.getElementById("video").paused,
    rate: document.getElementById("video").playbackRate,
    part_id: getParam("partId"),
  };
  return option;
}

function reaction_fav() {
  /**
   * ハートマークアイコンを画面に表示する
   */
  var vid = "video_icon_" + Math.random().toString(36).slice(-8);
  $(".videoWrapper").append(
    "<i class='fas fa-heart video_icon fav_video_icon' id='" + vid + "'></i>"
  );
  $("#" + vid).css("left", getRandomIntInclusive(5, 95) + "%");
  bottom_position = 150 + getRandomIntInclusive(-50, 50);
  $("#" + vid)
    .animate(
      { bottom: bottom_position + "px" },
      {
        duration: 500 + getRandomIntInclusive(-150, 150),
        easing: "easeOutQuart",
      }
    )
    .delay(500)
    .fadeOut(500 + getRandomIntInclusive(-150, 150), function () {
      $(this).remove();
    });
}

function reaction_middle_finger() {
  /**
   * 中指アイコンを画面に表示する
   */
  var vid = "video_icon_" + Math.random().toString(36).slice(-8);
  $(".videoWrapper").append(
    "<i class='fas fas fa-hand-middle-finger video_icon middle_finger_video_icon' id='" +
      vid +
      "'></i>"
  );
  $("#" + vid).css("left", getRandomIntInclusive(5, 95) + "%");
  bottom_position = 150 + getRandomIntInclusive(-50, 50);
  $("#" + vid)
    .animate(
      { bottom: bottom_position + "px" },
      {
        duration: 500 + getRandomIntInclusive(-150, 150),
        easing: "easeOutQuart",
      }
    )
    .delay(500)
    .fadeOut(500 + getRandomIntInclusive(-150, 150), function () {
      $(this).remove();
    });
}
function reaction_thumbs_up() {
  /**
   * サムアップアイコンを画面に表示する
   */
  var vid = "video_icon_" + Math.random().toString(36).slice(-8);
  $(".videoWrapper").append(
    "<i class='fas fas fa-thumbs-up video_icon thumbs_up_video_icon' id='" +
      vid +
      "'></i>"
  );
  $("#" + vid).css("left", getRandomIntInclusive(5, 95) + "%");
  bottom_position = 150 + getRandomIntInclusive(-50, 50);
  $("#" + vid)
    .animate(
      { bottom: bottom_position + "px" },
      {
        duration: 500 + getRandomIntInclusive(-150, 150),
        easing: "easeOutQuart",
      }
    )
    .delay(500)
    .fadeOut(500 + getRandomIntInclusive(-150, 150), function () {
      $(this).remove();
    });
}

function reaction_smile() {
  /**
   * @description
   * 笑顔アイコンを画面に表示する
   */
  var vid = "video_icon_" + Math.random().toString(36).slice(-8);
  $(".videoWrapper").append(
    "<i class='fas fa-smile-beam video_icon smile_video_icon' id='" +
      vid +
      "'></i>"
  );
  $("#" + vid).css("left", getRandomIntInclusive(5, 95) + "%");
  bottom_position = 150 + getRandomIntInclusive(-50, 50);
  $("#" + vid)
    .animate(
      { bottom: bottom_position + "px" },
      {
        duration: 500 + getRandomIntInclusive(-150, 150),
        easing: "easeOutQuart",
      }
    )
    .delay(500)
    .fadeOut(500 + getRandomIntInclusive(-150, 150), function () {
      $(this).remove();
    });
}
function reaction_cry() {
  /**
   * @description
   * 泣き顔アイコンを画面に表示する
   */
  var vid = "video_icon_" + Math.random().toString(36).slice(-8);
  $(".videoWrapper").append(
    "<i class='fas fa-sad-cry video_icon cry_video_icon' id='" + vid + "'></i>"
  );
  $("#" + vid).css("left", getRandomIntInclusive(5, 95) + "%");
  bottom_position = 150 + getRandomIntInclusive(-50, 50);
  $("#" + vid)
    .animate(
      { bottom: bottom_position + "px" },
      {
        duration: 500 + getRandomIntInclusive(-150, 150),
        easing: "easeOutQuart",
      }
    )
    .delay(500)
    .fadeOut(500 + getRandomIntInclusive(-150, 150), function () {
      $(this).remove();
    });
}
function update_user_list(user_list) {
  /**
   * @description
   * user_listを受け取りルーム参加者をアップデートする
   */
  old_user_ids = [];
  user_ids = [];
  document.querySelectorAll(".users_item").forEach((old_items) => {
    old_user_ids.push(old_items.getAttribute("id"));
  });
  user_list.forEach((user) => {
    add_users_item(user["user_id"], user["user_name"]);
    user_ids.push("users-" + user["user_id"]);
  });
  remove_ids = old_user_ids.filter((i) => user_ids.indexOf(i) == -1);
  remove_ids.forEach((remove_id) => {
    remove_users_item(remove_id);
  });
}

document.getElementById("video").addEventListener("loadeddata", function () {
  /**
   * @description
   * 動画のロードが終了した場合に、行うべき処理を記述する
   * ページのタイトルに動画の情報から取得したタイトルを挿入する
   */
  document.querySelector("title").textContent = getTitle();
});

document.getElementsByClassName("sidebar_create")[0].onclick =
  async function () {
    change_create();
    //作成ボタンを推された場合の処理
    var url = new URL(window.location.href);

    var params = url.searchParams;
    in_room = true;

    socket = new WebSocket(D_ANI_PARTY_WEBSOCKET_ENDPOINT);
    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      general_websocket_data_parser(data);
      window.setTimeout(function () {
        available_action = true;
      }, 100);
    };

    // WebSocketクローズ時の処理
    socket.onclose = (event) => {
      // ウェブページを閉じたとき以外のWebSocketクローズは想定外
      //cssの変更（notifier位置の修正）が読み込まれる野を待つために0.5秒待ってから表示
      notifier.alert("サーバーとの通信が終了");
    };
    add_contoroll_button();
    general_websocket(socket);

    window.setTimeout(function () {
      sendCreateRoom(socket);
    }, 500);
  };

document.getElementById("video").addEventListener(
  "loadeddata",
  function () {
    if (MODE !== "join") {
      return;
    }
    //参加した場合の処理
    var url = new URL(window.location.href);

    var params = url.searchParams;

    socket = new WebSocket(D_ANI_PARTY_WEBSOCKET_ENDPOINT);
    in_room = true;
    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      general_websocket_data_parser(data);
      window.setTimeout(function () {
        available_action = true;
      }, 200);
    };

    // WebSocketクローズ時の処理
    socket.onclose = (event) => {
      // ウェブページを閉じたとき以外のWebSocketクローズは想定外
      notifier.alert("サーバーとの通信が終了");
      in_room = false;
    };

    if (params.get("party") === "true") {
      document.querySelector("title").textContent += " 🎉";
    }
    add_contoroll_button();
    general_websocket(socket);
    room_id = getParam("room_id");
    window.setTimeout(function () {
      sendJoinRoom(socket, room_id);
      available_action = true;
      sendSyncRequest(socket);
    }, 200);
  },
  {
    once: true,
  }
);

function general_websocket_data_parser(data) {
  switch (data["action"]) {
    case "video_operation":
      available_action = false;
      onAction(data["operation"], data["option"]);
      break;
    case "create":
      user_id = data["user"]["user_id"];
      room_id = data["room_id"];
      document.getElementsByClassName("sidebar_link")[0].innerHTML =
        D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id;
      break;
    case "join":
      user_id = data["user"]["user_id"];
      room_id = data["room_id"];
      document.getElementsByClassName("sidebar_link")[0].innerHTML =
        D_PARTY_ANIMESTORE_REDIRECT_ENDPOINT + room_id;
      notifier.success("ルームに参加");
      break;
    case "server_message":
      switch (data["message_type"]) {
        case "host_change":
          info_notification_history("ルームのホスト権限を獲得");
          break;
      }
      break;
    case "user_add":
      notifier.info(
        "『" +
          data["user"]["user_name"] +
          "』さんが参加 <i class='fas fa-glass-cheers'></i>"
      );
      add_history_user(data["user"]["user_name"]);
      break;
    case "user_list":
      update_user_list(data["user_list"]);
      break;
    case "leave":
      notifier.info(
        "『" +
          data["user"]["user_name"] +
          "』さんが退室 <i class='fas fa-sign-out-alt'></i>"
      );
      leave_history_user(data["user"]["user_name"]);
      break;
    case "sync_request":
      sendSyncResponse(
        socket,
        (user = data["user"]),
        (option = getActionOption())
      );
      break;
    case "sync_response":
      available_action = false;
      onAction("sync", data["option"]);
      info_notification_history("再生状況をホストにシンク");
      break;
    case "operation_notification":
      switch (data["operation"]) {
        case "next":
          info_notification_history(
            "『" +
              data["user"]["user_name"] +
              "』さんから『<i class='fas fa-forward notification-icon'></i>』を受信"
          );
          break;
        case "play":
          info_notification_history(
            "『" +
              data["user"]["user_name"] +
              "』さんから『<i class='fas fa-play notification-icon'></i>』を受信"
          );
          break;
        case "stop":
          info_notification_history(
            "『" +
              data["user"]["user_name"] +
              "』さんから『<i class='fas fa-stop notification-icon'></i>』を受信"
          );
          break;
        case "skip":
          info_notification_history(
            "『" +
              data["user"]["user_name"] +
              "』さんから『<i class='fas fa-fast-forward notification-icon'></i>』を受信"
          );
          break;
        case "ratechange0.5":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 0.5』を受信"
          );
          break;
        case "ratechange0.75":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 0.75』を受信"
          );
          break;
        case "ratechange1":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 1』を受信"
          );
          break;
        case "ratechange1.25":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 1.25』を受信"
          );
          break;
        case "ratechange1.5":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 1.5』を受信"
          );
          break;
        case "ratechange2":
          info_notification_history(
            "『" + data["user"]["user_name"] + "』さんから『× 2』を受信"
          );
          break;
      }
      break;
    case "reaction":
      if (!HIDE_REACTION) {
        switch (data["reaction_type"]) {
          case "fav":
            reaction_fav();
            break;
          case "middle_finger":
            reaction_middle_finger();
            break;
          case "thumbs_up":
            reaction_thumbs_up();
            break;
          case "smile":
            reaction_smile();
            break;
          case "cry":
            reaction_cry();
            break;
        }
        break;
      }
  }
}

function general_websocket(socket) {
  /**
   * @description
   * 動画の操作を検知して、websocketを送信するためのeventListenerを追加する関数
   */
  vid_list = [];
  // 再生処理
  document.getElementById("video").addEventListener("playing", function () {
    document.getElementById("video").setAttribute("autoplay", "");
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "playing", option);
    }
    available_action = true;
  });
  // 停止処理
  document.getElementById("video").addEventListener("pause", function () {
    if (
      available_action &&
      in_room &&
      document.getElementById("video").duration !=
        document.getElementById("video").currentTime
    ) {
      option = getActionOption();
      sendVideoActionRoom(socket, "pause", option);
    }
    available_action = true;
  });
  // ロード処理
  document.getElementById("video").addEventListener("loadeddata", function () {
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "loaded", option);
    }
    available_action = true;
  });

  // seek処理
  document.getElementById("video").addEventListener("seeking", function () {
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "seek", option);
    }
    available_action = true;
  });
  // 再生速度変更
  document.getElementById("video").addEventListener("ratechange", function () {
    if (
      available_action &&
      document.getElementById("video").playbackRate != 0 &&
      in_room
    ) {
      option = getActionOption();
      sendVideoActionRoom(socket, "ratechange", option);
    }
    available_action = true;
  });

  //次の話のポップを推された場合の処理
  document.getElementById("nextThumbinner").onclick = function () {
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "next_thumbnail", option);
      available_action = true;
      sendActionNotification(socket, "next");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };

  //次の話ボタンを推された場合の処理
  document.getElementsByClassName("nextButton")[0].onclick = function () {
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "next", option);
      available_action = true;
      sendActionNotification(socket, "next");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };

  //前の話ボタンを推された場合の処理
  document.getElementsByClassName("prevButton")[0].onclick = function () {
    if (
      available_action &&
      in_room &&
      !$("#prevPopupInReTop").hasClass("show")
    ) {
      option = getActionOption();
      sendVideoActionRoom(socket, "prev", option);
      available_action = true;
    }
  };
  //前の話のポップを推された場合の処理
  document.getElementById("prevThumbinner").onclick = function () {
    if (available_action && in_room) {
      option = getActionOption();
      sendVideoActionRoom(socket, "prev_thumbnail", option);
      available_action = true;
    }
  };
  //syncボタンをを押された場合の処理
  document.getElementsByClassName("sync_button")[0].onclick = function () {
    if (available_action && in_room) {
      sendSyncRequest(socket);
      available_action = true;
    }
  };

  document.getElementById("sidebar_leave_button").onclick = function () {
    if (available_action && in_room) {
      sendLeaveRoom(socket);
      available_action = true;
    }
  };

  document.getElementsByClassName("backArea")[0].onclick = function () {
    if (in_room) {
      if (available_action) {
        if (!document.getElementById("video").paused) {
          sendActionNotification(socket, "play");
          if (!SELF_NOTIFICATION) {
            success_notification_history(
              "『<i class='fas fa-play notification-icon'></i>』をルームに送信"
            );
          }
        } else {
          sendActionNotification(socket, "stop");
          if (!SELF_NOTIFICATION) {
            success_notification_history(
              "『<i class='fas fa-stop notification-icon'></i>』をルームに送信"
            );
          }
        }
      }
    }
  };

  document.getElementsByClassName("seekArea")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("backButton")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-fast-backward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("skipButton")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("skip10Button")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-step-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("skip30Button")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("back10Button")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-step-backward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.getElementsByClassName("back30Button")[0].onclick = function () {
    if (in_room) {
      sendActionNotification(socket, "skip");
      if (!SELF_NOTIFICATION) {
        success_notification_history(
          "『<i class='fas fa-fast-backward notification-icon'></i>』をルームに送信"
        );
      }
    }
  };
  document.querySelectorAll("#speed span").forEach(function (speed) {
    speed.onclick = function () {
      if (in_room) {
        sendActionNotification(
          socket,
          "ratechange" + this.getAttribute("data-value")
        );
        if (!SELF_NOTIFICATION) {
          success_notification_history(
            "『× " + this.getAttribute("data-value") + "』をルームに送信"
          );
        }
      }
    };
  });

  document.getElementsByClassName("fav_button")[0].onclick = function () {
    if (in_room) {
      reaction_fav();
      sendReaction(socket, "fav");
    }
  };
  document.getElementsByClassName("middle_finger_button")[0].onclick =
    function () {
      if (in_room) {
        reaction_middle_finger();
        sendReaction(socket, "middle_finger");
      }
    };
  document.getElementsByClassName("thumbs_button")[0].onclick = function () {
    if (in_room) {
      reaction_thumbs_up();
      sendReaction(socket, "thumbs_up");
    }
  };
  document.getElementsByClassName("smile_button")[0].onclick = function () {
    if (in_room) {
      reaction_smile();
      sendReaction(socket, "smile");
    }
  };
  document.getElementsByClassName("cry_button")[0].onclick = function () {
    if (in_room) {
      reaction_cry();
      sendReaction(socket, "cry");
    }
  };
  function sidebar_content_change() {
    /**
     * @description
     * サイドバーのコンテンツを変更する
     */
    switch (FLKTY.selectedElement.id) {
      case "carousel_share":
        $(".history_content").fadeOut(250, function () {
          $(".share_content").fadeIn(250);
        });
        $(".history_content").hide(0);
        break;
      case "carousel_history":
        document.getElementsByClassName("sidebar_content")[0].scrollTop =
          document.getElementsByClassName("sidebar_content")[0].scrollHeight;
        $(".share_content").fadeOut(250, function () {
          $(".history_content").fadeIn(250);
        });
        $(".share_content").hide(0);
        $(".users_content").fadeOut(250);
        $(".users_content").hide(0);
        break;
      case "carousel_users":
        if (in_room) {
          sendUserList(socket);
        }
        $(".control_content").fadeOut(250, function () {
          $(".users_content").fadeIn(250);
        });
        $(".control_content").hide(0);
        $(".history_content").fadeOut(250);
        $(".history_content").hide(0);
        break;
      case "carousel_control":
        $(".users_content").fadeOut(250, function () {
          $(".control_content").fadeIn(250);
        });
        $(".users_content").hide(0);
        break;
    }
  }
  document.getElementsByClassName("flickity-button")[0].onclick = function () {
    if (in_room) {
      sidebar_content_change();
    }
  };
  document.getElementsByClassName("flickity-button")[1].onclick = function () {
    if (in_room) {
      sidebar_content_change();
    }
  };
  window.addEventListener("keydown", function (event) {
    const play_keys = ["Space", "Enter", "NumpadEnter", "KeyK"];
    const skip_keys = [
      "KeyJ",
      "KeyL",
      "ArrowRight",
      "ArrowLeft",
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Digit6",
      "Digit7",
      "Digit8",
      "Digit9",
      "Digit0",
      "Numpad1",
      "Numpad2",
      "Numpad3",
      "Numpad4",
      "Numpad5",
      "Numpad6",
      "Numpad7",
      "Numpad8",
      "Numpad9",
      "Numpad0",
    ];
    if (play_keys.includes(event.code)) {
      if (in_room) {
        if (available_action) {
          if (!document.getElementById("video").paused) {
            sendActionNotification(socket, "play");
            if (!SELF_NOTIFICATION) {
              success_notification_history(
                "『<i class='fas fa-play notification-icon'></i>』をルームに送信"
              );
            }
          } else {
            sendActionNotification(socket, "stop");
            if (!SELF_NOTIFICATION) {
              success_notification_history(
                "『<i class='fas fa-stop notification-icon'></i>』をルームに送信"
              );
            }
          }
        }
      }
    } else if (skip_keys.includes(event.code)) {
      if (in_room) {
        sendActionNotification(socket, "skip");
        if (!SELF_NOTIFICATION) {
          success_notification_history(
            "『<i class='fas fa-fast-forward notification-icon'></i>』をルームに送信"
          );
        }
      }
    }
  });
}
function success_notification_history(text) {
  notifier.success(text);
  add_history(text);
}
function info_notification_history(text) {
  notifier.info(text);
  add_history(text);
}

function next_page_anoter_tab() {
  /**
   * 自動で別タブで開くを有効化している場合に、次の動画のレコメンドを開くための関数の有効化
   */
  const options = {
    childList: true, //直接の子の変更を監視
    characterData: false, //文字の変化を監視
    characterDataOldValue: false, //属性の変化前を記録
    attributes: false, //属性の変化を監視
    subtree: true, //全ての子要素を監視
  };

  function callback(mutationsList, observer) {
    $("body").append(
      "<script type='text/javascript' class=recommend_remover>$('.recommend').off('click');</script>"
    );
    recommends_items = document.querySelectorAll(".recommend");
    for (var item of recommends_items) {
      item.onclick = function () {
        next_link = this.querySelector("input").getAttribute("value");
        window.location.href = next_link;
      };
    }
  }

  //ターゲット要素をDOMで取得
  const target = document.querySelector("#swiper-wrapper");
  if (AUTO_ANOTHER_TAB) {
    //インスタンス化
    const obs = new MutationObserver(callback);
    obs.observe(target, options);
  }
}

function add_contoroll_button() {
  /**
   * @description
   * 動画下部に存在してるコントロールバーにアイコンを追加する
   * 追加するアイコンはホストに同期するためのsyncボタンとリアクションボタンが複数である
   */
  // syncボタンの追加
  $(".space").before(
    "<div class='sync_button controll_button'><i class='fas fa-sync-alt buttonArea_icon'></i></div>"
  );
  // サムアップのリアクションボタンを追加
  $(".space").before(
    "<div class='thumbs_button controll_button'><i class='fas fa-thumbs-up buttonArea_icon reaction_icon'></i></div>"
  );
  // ハートマークのリアクションボタンを追加
  $(".space").before(
    "<div class='fav_button controll_button'><i class='fas fa-heart buttonArea_icon reaction_icon'></i></div>"
  );
  // 笑顔のリアクションボタンを追加
  $(".space").before(
    "<div class='smile_button controll_button'><i class='fas fa-smile-beam buttonArea_icon reaction_icon'></i></div>"
  );
  // 涙のリアクションボタンを追加
  $(".space").before(
    "<div class='cry_button controll_button'><i class='fas fa-sad-cry buttonArea_icon reaction_icon'></i></div>"
  );
  // 中指を立てるリアクションボタンを追加
  $(".space").before(
    "<div class='middle_finger_button controll_button'><i class='fas fa-hand-middle-finger buttonArea_icon reaction_icon'></i></div>"
  );
  if (HIDE_REACTION_ICON) {
    $(".reaction_icon").hide();
  } else {
    $(".reaction_icon").show();
  }
}
