$(function() {

    $("form.ajax-file").submit(function() {
        var _ajaxFile = $.data(this, "ajaxFile") || new AjaxFile();
        var action = this.action;
        if ($.support.changeBubbles == false)
            action = addActionToUrl(action, "isie", "true")
        $.ajax(action, {
            fileInput: $(":file", this),
            iframe: true,
            processData: false
        }).success(function(data) {
            _ajaxFile.OnSuccess(data);
        }).complete(function(data) {
            console.log(data);
        });
        return false;
    });

});

function AjaxFile() {}
AjaxFile.prototype = {
    OnSuccess: function(data) {},
    OnError: function(err) {}
}