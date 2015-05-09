var $ = require('jquery');

var extension_id = chrome.i18n.getMessage('@@extension_id');

module.exports = function sidebarInjectOn(inject_into, body, dbl_clickable, sendMessage) {
    body = $(body);

    var obj = $('<div></div>')
        .appendTo($(inject_into))
        .addClass(extension_id + '-sidebar')
        .hide()
        .on('animationend MSAnimationEnd webkitAnimationEnd oAnimationEnd', function(e) {
            if (e.originalEvent.animationName !== 'slide-out-' + extension_id) {
                return;
            }
            obj.hide();
        })
        .on('sidebar.msg', function(e, request) {
            switch (request.msg) {
                case 'load':
                    obj
                        .show()
                        .removeClass(extension_id + '-sidebar-leave')
                        .addClass(extension_id + '-sidebar-enter');
                    sendMessage({ msg: 'loaded' });
                    break;
                case 'hide':
                    obj
                        .removeClass(extension_id + '-sidebar-enter')
                        .addClass(extension_id + '-sidebar-leave');
                    sendMessage({ msg: 'hidden' });
                    break;
            }
        });

    window.addEventListener('message', function(event) {
        if (!event || !event.data || event.data.msg !== extension_id + '-fullscreen') {
            return;
        }
        obj.toggleClass(extension_id + '-fullscreen', event.data.value || false);
    }, false);

    $('<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        .appendTo(obj)
        .prop('src', chrome.extension.getURL('sidebar.html'))
        .prop('frameborder', '0')
        .mouseenter(function() {
            body.css('overflow', 'hidden');
        })
        .mouseleave(function() {
            body.css('overflow', 'auto');
        });

    $('<div></div>')
        .appendTo(obj)
        .addClass(extension_id + '-sidebar-close-button')
        .click(function(e) {
            if (e.which !== 1) {
                return;
            }
            sendMessage({ msg: 'hide' });
        });

    $(dbl_clickable)
        .dblclick(function() {
            sendMessage({ msg: 'hide' });
        });

    return obj;
};
