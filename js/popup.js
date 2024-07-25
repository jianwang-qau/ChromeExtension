$(function () {
    $("#btnCopy").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            url = tabs[0].url
            if (url.startsWith('http://') || url.startsWith('https://')) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "copy" }, function (response) {
                    var win = chrome.extension.getBackgroundPage();
                    win.data = response;
                    console.log(response);
                });
            }
        });
    });
    $("#btnPaste").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            url = tabs[0].url
            if (url.startsWith('http://') || url.startsWith('https://')) {
                var win = chrome.extension.getBackgroundPage();
                if (win.data) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "paste", data: win.data }, function (response) {
                        //console.log(response);
                    });
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "nodata" }, function (response) {
                        //console.log(response);
                    });
                }
            }
        });
    });
});
