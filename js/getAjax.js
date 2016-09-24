/**
 * Created by Administrator on 2016/9/24.
 */

/**
 * 调用Ajax函数的设置
 * @param nameUrl  Ajax地址的后缀名
 * @param Function  回调函数名
 * @param pages  设置Ajax函数的第一个值
 * @param pagesObject  设置Ajax函数的第二个值
 * @param filterType  设置Ajax函数的第三个值
 */
function courseList(nameUrl, Function, pages, pagesObject, filterType) {
    var URL1 = "http://study.163.com/webDev/" + nameUrl;
    var options = {};
    if (pages && pagesObject && filterType) {
        options = {
            pageNo: pages, psize: pagesObject, type: filterType
        };
        var productD1 = getByClass("productD")[0];
        var uL = productD1.getElementsByTagName("ul");
        var styleColor = options.type == 10 ? 0 : 1;
        document.getElementsByClassName("_tab")[styleColor].style.backgroundColor = "#3a9f30";
        document.getElementsByClassName("_tab")[styleColor].style.color = "#FFF";
        document.getElementsByClassName("_tab")[Number(!styleColor)].style = "";
        uL[0].dataset.index = options.pageNo;//给当前页面设置索引值
        uL[0].dataset.type = options.type;
    } else if (pages && pagesObject && filterType === undefined) {
        options = {
            userName: pages, password: pagesObject
        };
    }
    getAjax(URL1, options, Function);
}

/**
 * [get description]  获取Ajax封装函数
 * @param {String} url 请求url地址 如var url="http://study.163.com/webDev/couresByCategory.htm";
 * @param {Object} options 请求参数为js字面量对象形式,如var options = {pageNo:1,psize:20,type:10};
 * @param {Function} callback 请求成功回调的函数必须传入一个参数表示接受xhr.responseText
 *
 */
function getAjax(url, options, callback) {
    //1.创建xhr对象
    var xhr = new XMLHttpRequest();
    //2. 在open方法之前监听redaystatechange
    xhr.onreadystatechange = function () {
        //2.1 判断readyState==4
        if (xhr.readyState == 4) {
            //2.2 判断状态码
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback(xhr.responseText);
            }
            else {
                console.log("ajax请求不成功,错误状态码为：" + xhr.status);
                // alert("1");
                // return false;
            }
        }
    };
    //如果传入的参数不为空
    if (!!options) {
        url = url + "?" + serialize(options);
        // console.log("请求参数经过序列化后的url地址：" + url);
    }
    //请求参数序列化的方法
    function serialize(data) {
        if (!data) {//再次对参数判断确保返回为字符串
            return "";
        }
        var arry = [];
        for (var name in data) {
            //如果name属性不是data原型对象上的属性或则name.value属性值为function则跳出循环。
            if ((!data.hasOwnProperty(name)) || typeof data[name] === "function") {
                continue;
            }
            //求出value值
            var value = data[name].toString();
            //对name 和进行编码
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            var item = name + "=" + value;
            arry.push(item);
        }
        return arry.join("&");
    }

    //3.open方法  url地址要加上option序列化
    xhr.open("GET", url, true);
    //xhr.setReuestHeader("Content-Type","application/x-www-form-urlencoded");头部信息表单编码 可以省略
    //xhr.setReuestHeader("MyHeader","MyValue");自定义头部信息 可以省略
    //4.send方法
    xhr.send(null);//get方法必须传入null
    //如果是post请求则为send(serialize(formdata));
}