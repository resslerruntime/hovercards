/* global $ */
/* exported minimal */
'use strict';

function minimal() {
    chrome.runtime.onMessage.addListener(function(message, sender, callback) {
        /*jshint unused:false */
        if (message.cmd === 'load_html') {
            $.ajax({
                url: chrome.extension.getURL(message.fileName),
                dataType: 'html',
                success: callback
            });
        }
    });
}
