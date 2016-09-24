/**
 * Created by Administrator on 2016/9/16.
 */

//cookie对象函数
var cookie = {
    /**
     *设置 Cookie 值的封装函数
     * @param name（必填）  名
     * @param value（必填）  值
     * @param expires（时间戳）  失效事件
     * @param path  作用路径
     * @param domain  作用域
     * @param secure  https 协议时生效
     */
    set: function (name, value, expires, path, domain, secure) {
        var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        var oDate = new Date(); //获取当前时间
        oDate.setTime(oDate.getTime() + expires * 24 * 3600 * 1000);
        if (expires)
            cookie += '; expires=' + oDate.toGMTString();
        if (path)
            cookie += '; path=' + path;
        if (domain)
            cookie += '; domain=' + domain;
        if (secure)
            cookie += '; secure=' + secure;
        document.cookie = cookie;
    },

    /**
     * 获取cookie方法
     * @param key  cookie名
     * @returns {*}
     */
    get: function (key) {
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            } else {
                tips = "";
            }
        }
        return tips;
    },

    /**
     * 删除cookie
     * @param name
     */
    remove: function (name) {
        document.cookie = name + "=;" + 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
};
//cookie对象函数结束

/**
 * 判断是否有这个cookie
 */
function setcookie() {
    var classN = document.getElementsByClassName("topnav-r");
    if (typeof(Storage) !== "undefined") {
        // Yes! localStorage and sessionStorage support!
        // Some code.....
        //Session Storage（页面关闭失效）  localStorage（永久）
        var setStorage = localStorage;
        // console.log(setStorage);
        if (setStorage.getItem('off') != "true") {
            document.getElementById("topnav").style.display = "block";
            for (var i = 0; i < classN.length; i++) {
                classN[i].onclick = function () {
                    setStorage.setItem('off', 'true');
                    setcookie();
                }
            }
        } else {
            document.getElementById("topnav").style.display = "";
        }
    }
    else {
        // console.log(cookie.get("off"));
        if (cookie.get("off") != "true") {
            document.getElementById("topnav").style.display = "block";
            for (var i = 0; i < classN.length; i++) {
                classN[i].onclick = function () {
                    cookie.set("off", true, 30);
                    setcookie();
                }
            }
        } else {
            document.getElementById("topnav").style.display = "";
        }

    }
}