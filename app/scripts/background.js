'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var _cran_browser_univ = chrome.contextMenus.create({
    "title": "See R manual",
    "id": "_cran_browser_univ",
    "onclick": reportclick,
    "contexts": ["link"]
});

function reportclick(info, tab) {
    chrome.tabs.sendMessage(tab.id, info, function(response) {
	console.log(response);
    });
}
