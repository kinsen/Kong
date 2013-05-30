jQuery.extend(jQuery, {
    //弹出提示框
    rAlert: function(text, title) {
        var id = "revealModal_" + new Date().getTime();
        var html = buildRevealHtml(id, title || "提示信息", text, true);
        appendReveal(html);
        var ok_btn = $('<a class="btn btn-info ok" data-dismiss="modal" aria-hidden="true">OK</a>');
        $("#" + id + " .modal-footer").append(ok_btn);
        $("#" + id).on('hidden', disposeReveal).modal();
    },
    //弹出确认提示
    rConfirm: function(text, title, fn1, fn2) {
        var revealId = "revealModal_" + new Date().getTime();
        var html = buildRevealHtml(revealId, title || "提示信息", text, true);
        appendReveal(html);
        var ok_btn = $('<a class="btn btn-primary ok" data-dismiss="modal">OK</a>');
        var cancel_btn = $('<a class="btn cancel" data-dismiss="modal" aria-hidden="true">Cancel</a>');
        $("#" + revealId + " .modal-footer").append(ok_btn).append(cancel_btn);
        $("#" + revealId + " .ok").click(combineCloseReveal(revealId, fn1));
        $("#" + revealId + " .cancel").click(combineCloseReveal(revealId, fn2));
        $("#" + revealId).on('hidden', disposeReveal).modal();
    },
    //弹出提示,一定间隔之后自动关闭
    rTimerAlert: function(text, title, fn, timerMax) {
        timerMax = timerMax || 3;
        var revealId = "revealModal_" + new Date().getTime();
        var html = buildRevealHtml(revealId, title || "提示信息", text, true);
        appendReveal(html);
        var ok_btn = $('<a class="btn btn-primary ok" data-dismiss="modal">OK' + timerMax + ')</a>');
        $("#" + revealId + " .modal-footer").append(ok_btn);
        var dlg = function() {
            $('#' + revealId).modal('hide')
        };

        timerMax--;
        var timer = window.setInterval(function() {
            ok_btn.text("OK(" + timerMax + ")");
            if (timerMax-- <= 0) {
                combineCloseReveal(revealId)();
                window.clearInterval(timer);
            }
        }, 1000);

        $("#" + revealId + " .ok").click(combineCloseReveal(revealId));
        $("#" + revealId).on('hidden', function() {
            disposeReveal();
            window.clearInterval(timer);
            fn && fn();
        }).modal();
    },
    //弹出iframe窗口
    rLoad: function(url, title) {
        var revealId = "revealModal_" + new Date().getTime();
        var html = "<div id='" + revealId + "' class='reveal-modal'>" + "<h2>" + title + "</h2>" + '<iframe src="' + url + '" frameBorder="0" style="border: 0; " scrolling="auto" width="100%" height="100%"></iframe>' + "<a class='close-reveal-modal'>&#215;</a></div>";
        appendReveal(html);
        $("#" + revealId).reveal({
            closed: disposeReveal
        });
    },
    rAjaxLoad: function(loadingPath, title, fn) {
        var revealId = "revealModal_" + new Date().getTime();
        var html = "<div id='" + revealId + "' class='reveal-modal'>" + "<h2>" + title + "</h2>" + "<div class='columns eight centered loading'><img src='" + loadingPath + "' />" + Resource.Loading + "</div>" + "<a class='close-reveal-modal'>&#215;</a></div>";
        appendReveal(html);
        $("#" + revealId).reveal({
            closed: disposeReveal
        });
        fn();
    },
    rShow: function(obj, title, fn) {
        var revealId = "revealModal_" + new Date().getTime();
        var html = buildRevealHtml(revealId, title || "提示信息", "");
        appendReveal(html);
        $("#" + revealId + " .modal-body").append(obj);
        $("#" + revealId).on('hidden', disposeReveal).modal();
        fn && fn();
    },
    rFormLoad: function(form_options, obj, title, fn1, fn2) {
        var revealId = "revealModal_" + new Date().getTime();
        var form = $('<form/>', form_options).append(obj);
        var html = buildRevealHtml(revealId, title || "提示信息", "", true);
        appendReveal(html);

        var reveal_body = $("#" + revealId + " .modal-body");
        var reveal_footer = $("#" + revealId + " .modal-footer");
        reveal_body.appendTo(form);
        reveal_footer.appendTo(form);
        $("#" + revealId).append(form);

        var ok_btn = $('<a class="btn btn-primary ok">提交</a>');
        var cancel_btn = $('<a class="btn cancel" data-dismiss="modal" aria-hidden="true">取消</a>');
        $("#" + revealId + " .modal-footer").append(ok_btn).append(cancel_btn);
        $("#" + revealId + " .ok").click(combineCloseReveal(revealId, fn1));
        $("#" + revealId + " .cancel").click(combineCloseReveal(revealId, fn2));
        $("#" + revealId).on('hidden', disposeReveal).modal();
    },
    rMessage: function(title, text, time) {
        $.gritter.add({
            title: title,
            text: text,
            time: time || 1000
        });
    }
});

function combineCloseReveal(revealId, fn) {
    return function(e) {
        var dlg = $('#' + revealId).modal('hide')
        fn && fn.call(dlg,e);
    }
}

var buildRevealHtml = function(revealId, title, text, has_footer, extendClass) {
    var head_html = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '<h3>' + title + '</h3></div>';
    var footer_html = has_footer ? '<div class="modal-footer"></div>' : "";
    var body_html = '<div class="modal-body"><p>' + text + '</p></div>';
    var html = '<div id="' + revealId + '" class="modal hide fade ' + extendClass + '" role="role" aria-labelledby="myModalLabel" aria-hidden="true">' + head_html + body_html + footer_html + '</div>';
    return html;
}
var appendReveal = function(html) {
    return $(html).appendTo($("body"));
}
var disposeReveal = function() {
    $(this).remove();
}