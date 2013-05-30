//开启加载中遮罩层
var openLodingMask = function() {
    var mask = $("#loadingmask");
    if (!mask.length) {
        mask = $("<div id='loadingmask' class='alpha'></div>");
        mask.css("height", "100%").css("width", "100%").css("z-index", "9999")
            .css("position", "fixed").css("position", "_position").css("top", "0px").css("left", "0px")
            .css("background", "#ccc").css("text-align", "center").css("filter", "alpha(Opacity=50)")
            .css("-moz-opacity", "0.5").css("opacity", "0.5");;
        var loadingImg = $("<img src='/static/img/ajax-loader.gif' />")
            .css("position", "relative").css("top", "48%");
        loadingImg.appendTo(mask);
        $("body").append(mask);
    }
    mask.show();
}

//关闭加载中遮罩层
var closeLoadingMask = function() {
    var mask = $("#loadingmask");
    if (mask.length) mask.hide();
}

var onComplete = closeLoadingMask; //操作完成时发生，需要使覆盖即可
var beforePost = openLodingMask; //表单提交前操作，需要时覆盖即可

//在调用前声明ajaxForm,如需要，可复写其中方法，属性
var _ajaxForm = null;

//Form类

function Form() {}
Form.prototype = {
    // 给外部overview用
    OnSuccess: null,
    // overview
    OnError: null,
    // overview
    OnComplete: function(data) {},
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
    $(document).on("submit", "form.ajax", function() {
        var action = this.action;
        if ($(this).valid()) {
            _ajaxForm = $.data(this, "ajaxForm") || _ajaxForm || new Form();
            $.ajax({
                url: this.action,
                type: this.method,
                data: $(this).serialize(),
                success: _ajaxForm.onSuccess.Apply(_ajaxForm),
                error: _ajaxForm.onError.Apply(_ajaxForm),
                complete: _ajaxForm.onComplete.Apply(_ajaxForm)
            });
            beforePost();
            _ajaxForm = null; //调用完清空_ajaxForm，确保_ajaxForm不会为下个调用误用
        }
        return false;
    });

    // ---------------GET Form------------------
    $(document).on('submit', 'form.get', function() {
        var data = $(this).serialize();
        var url = this.action;
        Redirect(url, data, true);
        return false;
    });
    bind_get_form();

});

var bind_get_form = function() {
    var url = decodeURIComponent(document.URL);
    if (url.indexOf("?") > 0) {
        //获取所有参数对值
        var queryString = url.substr(url.indexOf("?") + 1, url.length);
        //分组
        var queryStringArr = queryString.split("&");
        $(queryStringArr).each(function(i, param) {
            var paramInfo = param.split("=");
            var ele = $("form.get #{0}".format(paramInfo[0]));
            if (ele.length) {
                ele.val(paramInfo[1]).trigger("change");
            }
        });
    }
}

var AppendAjaxForm=function(element,ajaxform){
    if(element instanceof jQuery)
        element=element[0];
    $.data(element, "ajaxForm", ajaxform);
}