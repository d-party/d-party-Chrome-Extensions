chrome.runtime.onInstalled.addListener(function (object) {
  /**
   * install時にページを開く
   */
  chrome.tabs.create({ url: "https://d-party.net/" }, function (tab) {});
});
