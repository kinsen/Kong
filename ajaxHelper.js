var onSuccessDefault = function(data) {
    data = eval(data);
    var msg = "操作成功";
    if (!isNullOrEmpty(data.Message)) msg = data.Message;
    $.alert(msg);
}
var onErrorDefault = function(XMLHttpRequest, textStatus, errorThrown) {
    if (textStatus == "timeout") {
        $.alert("服务器繁忙，请稍候再试!");
    } else {
        $.alert(XMLHttpRequest.responseText);
    }
}
var onComplete = closeLoadingMask; //操作完成时发生，需要使覆盖即可
var beforePost = openLodingMask; //表单提交前操作，需要时覆盖即可

var GET = function(url, onSuccess, onError, onStart, onCompleted) {
    if (isNullOrEmpty(onSuccess)) onSuccess = onSuccessDefault;
    if (isNullOrEmpty(onError)) onError = onErrorDefault;
    if (isNullOrEmpty(onCompleted)) onCompleted = onComplete;
    url = addActionToUrl(url, "_ticket", new Date().getTime());
    $.ajax({
        url: url,
        type: "GET",
        dateType: "json",
        timeout: 10000,
        success: onSuccess,
        error: onError,
        complete: onCompleted
    });
    onStart && onStart();
}

var POST = function(url, parms, onSuccess, onError, onStart, onCompleted) {
    if (isNullOrEmpty(onSuccess)) onSuccess = onSuccessDefault;
    if (isNullOrEmpty(onError)) onError = onErrorDefault;
    if (isNullOrEmpty(onCompleted)) onCompleted = onComplete;

    var paramStr = "";
    var isFirst = true;
    for (p in parms) {
        if (isFirst) isFirst = false;
        else paramStr += "&";
        paramStr += "{0}={1}".format(p, parms[p]);
    }
    $.ajax({
        url: url,
        type: "POST",
        data: paramStr,
        dateType: "json",
        timeout: 10000,
        success: onSuccess,
        error: onError,
        complete: onCompleted
    });
    onStart && onStart();
}

var DELETE = function(url, onSuccess, onError, onCompleted, closeMask) {
    if (isNullOrEmpty(onSuccess)) onSuccess = onSuccessDefault;
    if (isNullOrEmpty(onError)) onError = onErrorDefault;
    if (isNullOrEmpty(onCompleted)) onCompleted = onComplete;

    $.ajax({
        url: url,
        type: "DELETE",
        dateType: "json",
        timeout: 10000,
        success: onSuccess,
        error: onError,
        complete: onCompleted
    });
    if (closeMask) {} else beforePost();
}

    function AjaxHelper() {}

AjaxHelper.prototype = {
    // 当Ajax调用开始前调用（一般是一个遮罩调用）
    OnStart: openLodingMask,
    // 给外部overview用
    OnSuccess: null,
    // overview
    OnError: null,
    // 当调用结束时调用，无论成功与否（一般是个遮罩关闭）
    OnComplete: closeLoadingMask,
    // private call
    onSuccess: function(data) {
        var fn = function(data) {
            data = eval(data);
            var msg = '操作' + data.result ? '成功' : '失败';
            if (!isNullOrEmpty(data.message)) msg = data.message;
            // $.rTimerAlert(msg, data.result ? "成功" : "失败");
            $.alert(msg);
        }
        cp = this.OnSuccess || fn;
        cp(data);
    },
    onError: function(data) {

        var fn = function(data) {
            $.alert(data.responseText.toString());
        };
        cp = this.OnError || fn;
        cp(data);
    },
    onComplete: function(data) {
        onComplete();
        this.OnComplete && this.OnComplete(data);
    }
}

$(function() {
    // Ajax GET
    $(document).on('click', ".ajax-get", function() {
        var $this = $(this);
        var url = $this.attr("url");
        var ajaxHelper = $.data(this, "ajaxHelper") || new AjaxHelper();
        GET(url,
        ajaxHelper.OnSuccess && ajaxHelper.OnSuccess.Apply($this),
        ajaxHelper.OnError && ajaxHelper.OnError.Apply($this),
        ajaxHelper.OnStart.Apply($this),
        ajaxHelper.OnComplete.Apply($this));
    });

    // Ajax POST
    $(document).on('click', ".ajax-post", function() {
        var $this = $(this);
        var params = $this.attr("params").split(",");
        var url = $this.attr("url");
        var options = {}
        for (param in params) {
            var key = params[param];
            var obj = $(key);
            options[obj.attr("name")] = obj.val();
        }
        var ajaxHelper = $.data(this, "ajaxHelper") || new AjaxHelper();
        POST(url, options,
        ajaxHelper.OnSuccess && ajaxHelper.OnSuccess.Apply($this),
        ajaxHelper.OnError && ajaxHelper.OnError.Apply($this),
        ajaxHelper.OnStart.Apply($this),
        ajaxHelper.OnComplete.Apply($this));
    });

    // Ajax Delete
    $(document).on('click', '.ajax-delete', function() {
        var $this = $(this);
        var url = $this.attr('url');
        var title = $this.attr('title') || "您确定要删除吗？";

        $.Confirm(title, "删除", function() {
            DELETE(url, function(data) {
                data = eval(data)
                if (data.result) {
                    $.alert("删除成功!", function() {
                        window.location.reload();
                    });
                } else $.alert(data.msg);

            });
        });
        return false;
    });
});

var AppendAjaxHelper = function(element, helper) {
    if (element instanceof jQuery) element = element[0];
    $.data(element, "ajaxHelper", helper);
}