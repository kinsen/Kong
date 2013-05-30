/*-------------GOBALS---------------*/
/**
 * 改变jQuery AJAX回调函数this指针指向(使用案例见ajaxForm)
 * @param {Object} thisObj 要替换当前this指针的对象
 * @return {Function} function(data){}
 */
Function.prototype.Apply = function(thisObj) {
    var _method = this;
    return function(data) {
        return _method.apply(thisObj, [data]);
    };
}

/*-------------TABLES---------------*/
/*
 **作用：根据传入的JSON生成Table
 **参数：
 **json:json对象
 **options:table的属性
 */
var CreateTableFromJSON = function(json, options) {
    var table = $("<table/>", options);
    var keys = new Array();
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        var tr = $("<tr></tr>").appendTo(table);
        for (var key in obj) {
            if ($.inArray(key, keys) < 0) {
                keys.push(key);
            }
            var td = $("<td></td>").text(obj[key]);
            tr.append(td);
        }
    }
    var thead = $("<thead></thead>");
    var thead_tr = $("<tr></tr>").appendTo(thead);
    for (var i in keys) {
        $("<th></th>").text(keys[i]).appendTo(thead_tr);
    }
    table.append(thead);
    return table;
}
/*
 **作用：创建新Table
 **参数：
 **options:构建Table的内容，JSON字符串，格式如下
 **{
 **    Attributes:{id:"table1",name:"table1"},
 **    Styles:{width:"100px",height:"100px"},
 **    Header:
 **    {
 **        Rows:
 **        [
 **            {
 **                Columns:
 **                [
 **                    {Content:"",Attributes:{},Styles:{}},
 **                    {Content:"",Attributes:{},Styles:{}}
 **                ],
 **                Attributes:{},
 **                Styles:{}
 **            }
 **        ],
 **        Attributes:{},
 **        Styles:{}
 **    },
 **    Body:
 **    {
 **        Rows:
 **        [
 **            {
 **                Columns:
 **                [
 **                    {Content:"",Attributes:{},Styles:{}},
 **                    {Content:"",Attributes:{},Styles:{}}
 **                ],
 **                Attributes:{},
 **                Styles:{}
 **            }
 **        ],
 **        Attributes:{},
 **        Styles:{}
 **    },
 **    Footer:
 **    {
 **        Rows:
 **        [
 **            {
 **                Columns:
 **                [
 **                    {Content:"",Attributes:{},Styles:{}},
 **                    {Content:"",Attributes:{},Styles:{}}
 **                ],
 **                Attributes:{},
 **                Styles:{}
 **            }
 **        ],
 **        Attributes:{},
 **        Styles:{}
 **    }
 **}
 **container:父容器(可为空)
 **说明：若container不为空，则创建Table后追加到container中
 */
var BuildTable = function(options, container) {
    var table = $("<table></table>");
    appendAttributeAndStyle(table, options);
    if (options.Header) {
        var thead = $("<thead></thead>").appendTo(table);
        appendAttributeAndStyle(thead, options.Header);
        for (var i in options.Header.Rows)
        AppendRow(options.Header.Rows[i], thead, "th");
    }
    if (options.Body) {
        var tbody = $("<tbody></tbody>").appendTo(table);;
        appendAttributeAndStyle(tbody, options.Body);
        for (var i in options.Body.Rows)
        AppendRow(options.Body.Rows[i], tbody);
    }
    if (options.Footer) {
        var tfoot = $("<tfoot></tfoot>").appendTo(table);
        appendAttributeAndStyle(tfoot, options.Footer);
        for (var i in options.Footer.Rows)
        AppendRow(options.Footer.Rows[i], tfoot);
    }
    if (container) table.appendTo(container);
    return table;
}
/*
 **作用：表格追加行
 **参数说明：
 **options:用来构建行的JSON字符串，格式如下
 **{
 **    Columns:
 **    [
 **          {Content:"",Attributes:{},Styles:{}},
 **          {Content:"",Attributes:{},Styles:{}}
 **    ],
 **    Attributes:{},
 **    Styles:{}
 **}
 **container:父容器(可为空)
 **说明：若container不为空，则创建Row后追加到container中
 **columnsTag:列标签，默认为td，创建theader的时候可传入th
 */
var AppendRow = function(options, container, columnsTag) {
    var tr = $("<tr></tr>");
    appendAttributeAndStyle(tr, options);
    var tag = columnsTag || "td";
    if (options.Columns) {
        for (var i in options.Columns) {
            AppendColumn(options.Columns[i], tr, tag);
        }
    }
    if (container) tr.appendTo(container);
    return tr;
}

/*
 **作用:表格行追加列
 **参数说明:
 **options:列对象JSON字符串，格式参照BuildTable或AppendRow
 **{Content:"",Attributes:{},Styles:{}}
 **container:父容器(可为空)
 **说明：若container不为空，则创建Row后追加到container中
 **columnTag:列标签，默认为td，创建theader的时候可传入th
 */
var AppendColumn = function(options, container, columnTag) {
    var tag = columnTag || "td";
    var tagHtml = "<" + tag + "></" + tag + ">";
    var column = $(tagHtml).html(options.Content);
    appendAttributeAndStyle(column, options);
    if (container) column.appendTo(container);
    return column;
}

/*
 **作用:更改表格行内容
 **参数说明:
 **options：更改行内容JSON字符串
 **{
 **     {
 **        Columns: [{ Content: "Extend1", Index: 1 ,Attributes:{},Styles:{}}],
 **        Attributes:{},
 **        Styles:{}
 **     }
 **}
 **row：要更改的行
 **wipe：是否擦除原有属性，true则完全擦除旧有属性样式，false则在原有属性上扩展修改，默认false
 */
var UpdateRow = function(options, row, wipe) {
    updateAttributeAndStyle(row, options, wipe);
    if (options.Columns) {
        for (var i in options.Columns) {
            UpdateColumns(options.Columns[i], row, wipe);
        }
    }
}

/*
 **作用：更改表格列内容
 **参数说明：
 **options：更改的列JSON字符串
 **{ Content: "Extend1", Index: 1 ,Attributes:{},Styles:{}}
 **row:更改列所在的行
 **wipe：是否擦除原有属性，true则完全擦除旧有属性样式，false则在原有属性上扩展修改，默认false
 */
var UpdateColumns = function(options, row, wipe) {
    var column = $(row.children()[options.Index]);
    if (column.length) {
        updateAttributeAndStyle(column, options, wipe);
        column.html(options.Content);
    }
}

//为对象附加属性和样式；options：{Attributes:{},Styles:{}}
var appendAttributeAndStyle = function(obj, options) {
    if (options.Attributes) {
        for (var key in options.Attributes) {
            obj.attr(key, options.Attributes[key]);
        }
    }
    if (options.Styles) {
        for (var key in options.Styles) {
            obj.css(key, options.Styles[key]);
        }
    }
}
//更新对象属性和样式；options:{Attributes:{},Styles:{}}
//wipe:是否擦除原有属性，true则完全擦除旧有属性样式，false则在原有属性上扩展修改，默认false
var updateAttributeAndStyle = function(obj, options, wipe) {
    if (wipe) {
        var attrs = obj[0].attributes;
        for (var i = 0; i < attrs.length; i++) {
            obj.removeAttr(attrs[i].nodeName);
        }
    }
    appendAttributeAndStyle(obj, options);
}

/*----------------------Timer------------------*/
var Timer = function(seconds, onStart, onEnd, onInterval) {
    seconds--;
    onStart && onStart(seconds);
    var timer = window.setInterval(function() {
        onInterval && onInterval(seconds)
        if (seconds-- <= 0) {
            onEnd && onEnd();
            window.clearInterval(timer);
        }
    }, 1000);
}


/*--------------------------URL--------------------------------*/
/*---------
 **URL重定向
 **---------
 **url:重定向URL
 **params:要传递的querystring
 **clear:是否清空参数
 */
var Redirect = function(url, params, clear) {
    if (!isNullOrEmpty(params)) {
        var paramArr = params.split('&');
        var isFirst = true;
        $(paramArr).each(function(i, param) {
            if (isFirst) isFirst = false;
            else {
                if (clear) clear = false;
            }
            var paramInfo = param.split('=');
            url = addActionToUrl(url, paramInfo[0], paramInfo[1], clear);
        });
    }
    window.location.href = url;
}
/*刷新本页*/
var Reload = function() {
    location.reload();
}
//增加回发参数
var addAction = function(action /*参数名*/ , value /*参数值*/ , clear /*是否清空参数*/ ) {
    //获取当前页Url
    var formUrl = $("form")[0].action;
    formUrl = addActionToUrl(formUrl, action, value, clear);
    $("form")[0].action = formUrl;
}
//获取QueryString
var getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//在指定Url中获取QueryString
var getQueryStringFromUrl = function(url, name) {
    var index = url.indexOf('?');
    if (index < 0) return null;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(index + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var addActionToUrl = function(formUrl, action /*参数名*/ , value /*参数值*/ , clear /*是否清空参数*/ ) {
    //如果Url中含有参数
    if (formUrl.indexOf("?") >= 0) {
        //清空参数
        if (clear) formUrl = formUrl.substr(0, formUrl.indexOf("?") + 1);
        //Url中含有要添加的参数对
        if (formUrl.indexOf(action) > 0) {
            //获取所有参数对值
            var queryString = formUrl.substr(formUrl.indexOf("?") + 1, formUrl.length);
            //分组
            var queryStringArr = queryString.split("&");
            //不包含参数的Url
            formUrl = formUrl.substr(0, formUrl.indexOf("?") + 1);
            var isFirst = true;
            //遍历参数对
            for (var i = 0; i < queryStringArr.length; i++) {
                //如果参数对不等于要添加的Action.则添加到Url中
                if (queryStringArr[i].indexOf(action) < 0) {
                    if (isFirst) isFirst = false;
                    else formUrl += "&";
                    formUrl += queryStringArr[i];
                }
            }
        }
        //避免只有一个参数,并且参数相同时出现的?&情况
        if (formUrl.indexOf("?") + 1 != formUrl.length) formUrl += "&";
    } else {
        formUrl += "?";
    }

    formUrl += action + "=" + value;
    return formUrl;
}

/*-------------------------STRINGS---------------------------------*/
//string.format
//用法："{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};
//startsWith
String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
};
//endsWith
String.prototype.endsWith = function(str) {
    return this.slice(-str.length) == str;
};
//字符串是否空
var isNullOrEmpty = function(str) {
    return str == null || str == "" || str == undefined;
}

/*-------------------------JSON------------------------------------*/
/*
 **获取JSON对象的长度
 */
var GetJSONLength = function(obj) {
    var length = 0;
    for (var item in obj)
    length++;
    return length;
}

/*-----------------------JS FILES----------------------------------*/
/*
 **获取引用文件的参数
 **fileName:文件名，例如:jquery.js
 */
var GetReferenceFileArguments = function(fileName) {
    //获取到所有<script>对象
    var scripts = document.getElementsByTagName("script");
    var arguments = new Array();
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        //取得你想要的js文件名
        if (src.indexOf(fileName) !== -1) {
            //获取js文件名后面的所有参数
            src = src.substring(src.lastIndexOf(fileName + "?") + (fileName.length + 1));
            var array = src.split("&");
            //将参数一个一个遍历出来
            for (var j = 0; j < array.length; j++) {
                var finalObj = array[j].split("=");
                arguments[finalObj[0]] = finalObj[1];
            }
        }
    }
    return arguments;
}

/*--------------------------------身份证----------------------------------------*/
/*
根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
    地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
    出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
    顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
    校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

出生日期计算方法。
    15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
    2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i            
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                公式(1)中： 
                i----表示号码字符从由至左包括校验码在内的位置序号； 
                ai----表示第i位置上的号码字符值； 
                Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

*/
//身份证号合法性验证 
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证

/*
 * 验证身份证
 * 返回:{
 *     pass:boolean:验证是否通过
 *     error:str:验证不通过的原因
 *     gender:int：性别(1:男 0:女)
 * }
 */
var IDCodeValid = function(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;
    var gender = code.substr(16, 1) % 2 ? 1 : 0;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    return {
        pass: pass,
        error: tip,
        gender: gender
    };
}