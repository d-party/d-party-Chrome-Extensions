window.addEventListener("load", main, false);
function main(e) {
  /**
   * @description
   * storageを参照し、以前の設定値を反映する
   * もしもkey-valueがundefined(初回オープン)の場合は初期値としてfalseを入れる
   */

  chrome.storage.sync.get(["auto_another_tab"], function (result) {
    if (typeof result.auto_another_tab === "undefined") {
      chrome.storage.sync.set({ auto_another_tab: true });
      document.getElementById("auto_another_tab_checkbox").checked = true;
    } else {
      document.getElementById("auto_another_tab_checkbox").checked =
        result.auto_another_tab;
    }
  });
  $("#auto_another_tab_checkbox").change(function () {
    chrome.storage.sync.set({
      auto_another_tab: document.getElementById("auto_another_tab_checkbox")
        .checked,
    });
  });

  chrome.storage.sync.get(["auto_user_name_decision"], function (result) {
    if (typeof result.auto_user_name_decision === "undefined") {
      chrome.storage.sync.set({ auto_user_name_decision: false });
      document.getElementById(
        "auto_user_name_decision_checkbox"
      ).checked = false;
    } else {
      document.getElementById("auto_user_name_decision_checkbox").checked =
        result.auto_user_name_decision;
    }
  });
  $("#auto_user_name_decision_checkbox").change(function () {
    chrome.storage.sync.set({
      auto_user_name_decision: document.getElementById(
        "auto_user_name_decision_checkbox"
      ).checked,
    });
  });

  chrome.storage.sync.get(["hide_reaction"], function (result) {
    if (typeof result.hide_reaction === "undefined") {
      chrome.storage.sync.set({ hide_reaction: false });
      document.getElementById("hide_reaction_checkbox").checked = false;
    } else {
      document.getElementById("hide_reaction_checkbox").checked =
        result.hide_reaction;
    }
  });
  $("#hide_reaction_checkbox").change(function () {
    chrome.storage.sync.set({
      hide_reaction: document.getElementById("hide_reaction_checkbox").checked,
    });
  });

  chrome.storage.sync.get(["hide_reaction_icon"], function (result) {
    if (typeof result.hide_reaction_icon === "undefined") {
      chrome.storage.sync.set({ hide_reaction_icon: false });
      document.getElementById("hide_reaction_icon_checkbox").checked = false;
    } else {
      document.getElementById("hide_reaction_icon_checkbox").checked =
        result.hide_reaction_icon;
    }
  });
  $("#hide_reaction_icon_checkbox").change(function () {
    chrome.storage.sync.set({
      hide_reaction_icon: document.getElementById("hide_reaction_icon_checkbox")
        .checked,
    });
  });
  chrome.storage.sync.get(["self_notification"], function (result) {
    if (typeof result.self_notification === "undefined") {
      chrome.storage.sync.set({ self_notification: false });
      document.getElementById("self_notification_checkbox").checked = false;
    } else {
      document.getElementById("self_notification_checkbox").checked =
        result.self_notification;
    }
  });
  $("#self_notification_checkbox").change(function () {
    chrome.storage.sync.set({
      self_notification: document.getElementById("self_notification_checkbox")
        .checked,
    });
  });

  chrome.storage.sync.get(["user_name"], function (result) {
    if (typeof result.user_name === "undefined") {
      chrome.storage.sync.set({ user_name: "AnonymousUser" });
      document.getElementById("user_name_textbox").value = "AnonymousUser";
    } else {
      document.getElementById("user_name_textbox").value = result.user_name;
    }
  });
  function user_name_submit() {
    chrome.storage.sync.set({
      user_name: document.getElementById("user_name_textbox").value,
    });
    return false;
  }
  document
    .getElementById("user_input_form")
    .addEventListener("submit", user_name_submit);
}
