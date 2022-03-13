VERSION_CHECK = false;

/**
 *
 * getManifest
 * @description manifest.jsonから値を取得します。
 *
 */
const getManifestData = data => {
    let manifestData = chrome.runtime.getManifest();
    return manifestData[data];
};

request = new XMLHttpRequest();
request.open('GET', D_PARTY_VERSION_CHECK_ENDPOINT + "?extension-version=" + getManifestData('version'), true);
request.responseType = 'json';
request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        data = this.response;
        VERSION_CHECK = data["is_possible"];
    } else {
        VERSION_CHECK = false;
    }
    document.getElementsByClassName("chrome_extension_field")[0].innerText = VERSION_CHECK;
};

request.send();