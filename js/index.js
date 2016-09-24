/**
 * Created by Administrator on 2016/9/19.
 */
var rankNum = 0;//rank

window.onload = function () {
    //关闭顶部通知栏
    setcookie();

    //开启轮播图
    carousel();

    getPagingclick();


    //调用函数设置分页器，初始化onclick事件
    callFun("10");
    courseList("hotcouresByCategory.htm", getRanking);
    bianli();

    //产品设计onclick事件
    document.getElementsByClassName("_tab")[0].onclick = function () {
        callFun(this.dataset.id);
    };
    //编程语言onclick事件
    document.getElementsByClassName("_tab")[1].onclick = function () {
        callFun(this.dataset.id);
    };
    getId("paging").getElementsByClassName("paging0")[0].onclick = paGing;
    getId("paging").getElementsByClassName("paging0")[1].onclick = paGing;

    //H5视频播放
    getByClass("tr-top")[0].getElementsByTagName("img")[1].onclick = function () {
        setStyle("video", "block")
    };
    getId("video").getElementsByClassName("Stopvideo")[0].onclick = function () {
        setStyle("video", "")
    };
    getId("video").getElementsByTagName("video")[0].onclick = function () {
        this.paused ? this.play() : this.pause();
    };

    //判断是否有登录cookie
    getId("gz-button").onclick = JudgeCookie;
};


/**
 *判断是否有登录cookie
 * @constructor
 */
function JudgeCookie() {
    var cookieFun = cookie.get("loginSuc");
    if (cookieFun) {
        // console.log("loginSuc:" + cookieFun);
        var String = cookieFun.split("-");
        if (String[0] && String[1]) {
            courseList("login.htm", loginFun, String[0], String[1]);
        } else {
            cookie.remove("loginSuc");
            JudgeCookie();
        }
    } else {
        console.log("loginSuc:" + cookieFun);
        //登录界面
        setStyle("login", "block")

        getId("login").getElementsByClassName("Stoplogin")[0].onclick = function () {
            setStyle("login", "")
        };

        getId("login").getElementsByClassName("loginBtn")[0].onclick = function () {
            var userName = md5(getId("userName").value);
            var password = md5(getId("password").value);
            var uName = userName + "-" + password;
            setCookie("loginSuc", uName, 30);
            courseList("login.htm", loginFun, userName, password);
        }
    }


}

/**
 * 设置样式（login,video)
 * @param id  需要DOM获取的元素
 * @param value  需要设置的样式
 */
function setStyle(id, value) {
    getId("sab").style.display = value;
    if (id == "login") {
        getId(id).style.display = value;
    } else if (id == "video") {
        getId("id").style.display = value;
        var getVide = getId(id).getElementsByTagName("video")[0];
        value ? getVide.play() : getVide.pause();
    }
}


/**
 * 调用设置cookie函数
 * @param key  cookie名
 * @param value  cookie值
 * @param days  是否有数值  true：使用document.cookie设置cookie  false：使用Storage
 * @param Storage  essionStorage（页面关闭失效）  localStorage（永久）
 */
function setCookie(key, value, days, Storage) {
    var setStorage;
    if (Storage && Storage === localStorage) {
        setStorage = localStorage;
    } else {
        setStorage = sessionStorage;
    }
    if (typeof (days) === "number") {
        // alert("1");
        if (cookie.get(key) != value) {
            cookie.set(key, value, days);//对象函数设置cookie
        }
    } else {
        //Session Storage（页面关闭失效）  localStorage（永久）
        if (setStorage.getItem(key) != value) {
            setStorage.setItem(key, value);
        }
    }
}


//设置关注cookie回调函数
function followSuc(d) {
    var foll = JSON.parse(d);
    // console.log("followSuc:" + foll);
    if (foll == 1) {
        setCookie("followSuc", foll);
        getId("gz-button").onclick = "";
        getId("gz-button").style.backgroundColor = "#6A6466";
        getId("gz-button").value = "已关注";
        getId("gz-button").style.color = "#fff";
    } else {
        cookie.remove("loginSuc");
        cookie.remove("followSuc");
    }

}

//设置关注登录回调函数
function loginFun(c) {
    var rankingTxt = JSON.parse(c);
    if (rankingTxt == 1) {
        alert("登录成功");
        courseList("attention.htm", followSuc);
        setStyle("login", "");
    } else if (rankingTxt == 0) {
        getId("loginHint").innerHTML = "你的用户名或密码错误";
        cookie.remove("loginSuc");
        cookie.remove("followSuc");
    }
}


/**
 * Ajax获取课程内容
 * @param a
 */
function date(a) {
    var dateTxt = JSON.parse(a);
    var List = dateTxt.list;
    var productD = getByClass("productD")[0];
    var ul = productD.getElementsByTagName("ul");
    document.getElementById("paging").dataset.pading = dateTxt.totalPage;
    ul[0].innerHTML = document.getElementById("disPlay").innerHTML;

    var addqw = "";
    // console.log(addqw);
    for (var i = 0; i < List.length; i++) {
        addqw = ul[0].innerHTML + addqw;
    }
    ul[0].innerHTML = addqw;
    // console.log(ul[0].innerHTML);
    //获取图片地址
    setList("imgphoto", "src", "middlePhotoUrl");
    //获取name值
    setList("name", "innerHTML", "name");
    //获取在学人数learnerCount
    setList("learnerCount-n", "innerHTML", "learnerCount");
    //获取机构发布者provider
    setList("provider-n", "innerHTML", "provider");
    //获取课程价钱price
    setList("price", "innerHTML", "price");
    //获取课程分类categoryName
    setList("categoryName-n", "innerHTML", "categoryName");
    //获取课程介绍description
    setList("description", "innerHTML", "description");

    /**
     *
     * @param classname  类名
     * @param dizhi  类名对象地址
     * @param serverDZ  服务器对应地址
     */
    function setList(classname, dizhi, serverDZ) {
        var productD2 = getByClass("productD")[0];
        var Li = productD2.getElementsByTagName("li");
        // console.log(Li);
        for (var m = 0; m < List.length; m++) {
            var classN = Li[m].getElementsByClassName(classname);
            for (var l = 0; l < classN.length; l++) {
                var num = List[m][serverDZ];
                if (serverDZ === "price") {
                    if (num === 0) {
                        num = "免费";
                    } else {
                        num = "￥" + num;
                    }
                }
                if (serverDZ === "categoryName") {
                    if (num === null) {
                        num = "无";
                    }
                }
                classN[l][dizhi] = num;
            }
        }
    }
}


/**
 * Ajax获取最热排行内容
 * @param b
 */
function getRanking(b) {
    var rankingTxt = JSON.parse(b);
    // console.log(rankingTxt)

    getId("hottesTranking").getElementsByClassName("tyb-ranking")[0].style.top = "0";
    getId("hottesTranking").getElementsByClassName("tyb-ranking")[1].style.top = "0";


    function timeSet() {
        setTimeout(function () {
//                clearInterval(stopTime);
            var stopTime = setInterval(function () {
                var top = getId("hottesTranking").getElementsByClassName("tyb-ranking")[0].style.top;
                getId("hottesTranking").getElementsByClassName("tyb-ranking")[0].style.top = (parseInt(top) - 1) + "px";
                getId("hottesTranking").getElementsByClassName("tyb-ranking")[1].style.top = (parseInt(top) - 1) + "px";
//                    console.log(parseInt(top) + "=" + parseInt(top) % -70);
                if (parseInt(top) < -1) {
                    if (parseInt(top) % -70 === 0) {
                        clearInterval(stopTime);
                        if (parseInt(top) < -680) {
                            if (rankNum == 1) {
                                rankNum = 0;
                            } else if (rankNum == 0) {
                                rankNum = 1;
                            }
                            courseList("hotcouresByCategory.htm", getRanking);
                        } else {
                            timeSet();
                        }
                    }
                }
            }, 10)
        }, 3000);
    }

    function setRankingUrl(tagName, classDZ, serverDZ, n) {
        for (var i = 0; i < 10; i++) {
            getId("hottesTranking").getElementsByTagName("ul")[n].getElementsByTagName(tagName)[i][classDZ] = rankingTxt[i][serverDZ];
            getId("hottesTranking").getElementsByTagName("ul")[Number(!n)].getElementsByTagName(tagName)[i][classDZ] = rankingTxt[i + 10][serverDZ];
        }
    }

    setRankingUrl("img", "src", "smallPhotoUrl", rankNum);
    setRankingUrl("h5", "innerHTML", "name", rankNum);
    setRankingUrl("p", "innerHTML", "learnerCount", rankNum);
    timeSet();
}

/**
 * 最热排行节点创建遍历
 */
function bianli() {
    getId("hottesTranking").getElementsByTagName("ul")[0].innerHTML = "";
    getId("hottesTranking").getElementsByTagName("ul")[1].innerHTML = "";
    var a = "<li> <img> <h5></h5> <p></p> </li>", word = "";
    for (var i = 0; i < 10; i++) {
        word = word + a;
    }
    getId("hottesTranking").getElementsByTagName("ul")[0].innerHTML = word;
    getId("hottesTranking").getElementsByTagName("ul")[1].innerHTML = word;
}


// 分页器JS代码开始
/**
 * 初始化分页器事件
 * @param e
 */
function callFun(e) {
    //初始化onclick事件
    courseList("couresByCategory.htm", date, "1", "20", e);
    //分页器的重新遍历
    fuzhi(1);
    //设置分页器背景颜色
    setBcolor(1);
}

/**
 * 给每个分页设置onclick事件
 */
function getPagingclick() {
    var pLength = varValue.pagingLenght();
    for (var i = 0; i < pLength; i++) {
        getId("paging").getElementsByTagName("li")[i].onclick = function () {
            var r = this.dataset.pagingIndex;
            var getType = varValue.Type();
            setBcolor(r);
            courseList("couresByCategory.htm", date, r, "20", getType);
        }
    }
}


/**
 *对分页器当前进行判断
 */
function paGing() {
    var pagingNum = this.dataset.pagingNum;
    var getPags = varValue.Pags();
    var pading = varValue.getPading();
    var getType = varValue.Type();
    var Ber = parseInt(getPags) + parseInt(pagingNum);
    if (Ber >= 1 && Ber <= pading) {
        courseList("couresByCategory.htm", date, Ber, "20", getType);
        var f = parseInt(varValue.pagingInnerhtml(0));
        var l = parseInt(varValue.pagingInnerhtml(7));
        if (Ber > l || pading - Ber == 7) {
            fuzhi(Ber);//遍历分页器
        } else if (Ber < f || Ber == 8) {
            fuzhi(Ber - 7);//遍历分页器
        }
        setBcolor(Ber);//设置分页器背景色
    }

}


/**
 * 设置分页器背景色
 * @param n  当前页面值
 */
function setBcolor(n) {
    var first = parseInt(varValue.pagingInnerhtml(0));
    for (var i = 0; i < varValue.pagingLenght(); i++) {
        getId("paging").getElementsByTagName("li")[i].style.backgroundColor = "";
        getId("paging").getElementsByTagName("li")[i].style.color = "";
    }
    getId("paging").getElementsByTagName("li")[n - first].style.backgroundColor = "#9DD8B1";
    getId("paging").getElementsByTagName("li")[n - first].style.color = "#FFF";
}


/**
 * 遍历分页器
 * @param n  当前页面值
 */
function fuzhi(n) {
    getId("paging").getElementsByClassName("paging1")[0].innerHTML = "";
    var a = "<li data-paging-index='";
    var b = "'>";
    var c = "</li>", word = "";
    for (var i = n; i < parseInt(n) + 8; i++) {
        var addqw = a + i + b + i + c;
        word = word + addqw;
    }
    getId("paging").getElementsByClassName("paging1")[0].innerHTML = word;

    //重新遍历分页器后在重新遍历下分页器onclock事件
    getPagingclick();
}


/**
 * 获取DOM
 * @type {{Pags: varValue.Pags, getPading: varValue.getPading, Type: varValue.Type, pagingLenght: varValue.pagingLenght, pagingInnerhtml: varValue.pagingInnerhtml}}
 */
var varValue = {
    Pags: function () {
        return getByClass("productD")[0].getElementsByTagName("ul")[0].dataset.index;
    },
    getPading: function () {
        return getId("paging").dataset.pading;
    },
    Type: function () {
        return getByClass("productD")[0].getElementsByTagName("ul")[0].dataset.type;
    },
    pagingLenght: function () {
        return getId("paging").getElementsByTagName("li").length;
    },
    pagingInnerhtml: function (e) {
        return getId("paging").getElementsByTagName("li")[e].innerHTML;
    }
};
//分页器JS代码开始结束


//轮播图代码
function carousel() {
    //通过DOM获取元素
    var imgweap = getId("imgwrap");//获取ID为imgwrap的元素
    //测试
    // console.log(imgweap);
    var imgs = imgweap.firstElementChild;//获取ID为imgwrap的下的第一个子元素
    //测试
    // console.log(imgs);
    var buttons = document.getElementsByClassName("buttons")[0].getElementsByTagName("li");//获取小圆点的元素
    //测试
    // console.log(buttons[0]);


    var interval = 2000;//定义切换时长
    var photoWidth = 1652;//定义图片宽度
    var photoNum = 3;//定义图片数量
    //测试
    // console.log(photoWidth * (photoNum - 1));
    var Left;
    var timer;
    var animated = false;

    var jindutiao = function () {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].className = "";
        }
        var s = parseInt(imgweap.style.left) / -photoWidth || 0;
        //测试
        // console.log(parseInt(s));
        buttons[parseInt(s)].className = "one";
    };


    function animate(offset) {
        Left = parseInt(imgweap.style.left);
        if (Left > -photoWidth * (photoNum - 1)) {
            imgweap.style.left = Left + offset + "px";
            // console.log(imgweap.style.left);
        } else {
            imgweap.style.left = 0;
        }
        jindutiao();
    }

    var play = function () {
        timer = setTimeout(function () {
            animate(-photoWidth);
            play();
        }, interval);
    };

    var stop = function () {
        clearTimeout(timer);
    };


    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            var buttons2 = parseInt(this.dataset.index);
            // console.log(buttons2);
            if (buttons2 === 0) {
                imgweap.style.left = 0;
            }
            else {
                imgweap.style.left = buttons2 * -photoWidth + "px";
            }
            jindutiao();
        }
    }


    imgweap.onmouseover = stop;
    imgweap.onmouseout = play;

    play();//运行轮播图
}
//轮播图代码结束


//常用元素DOM获取
/**
 * 获取ID元素
 * @param id
 * @returns {Element}
 */
var getId = function (id) {
    return document.getElementById(id);
};

/**
 * 获取className
 * @param classname
 * @param parent
 * @returns {Array}
 */
function getByClass(classname, parent) {
    var oParent = parent ? document.getElementById(parent) : document,//通过获取ID判断是否有其父元素
        eles = [],
        elements = oParent.getElementsByTagName("*");

    for (var i = 0, l = elements.length; i < l; i++) {
        if (elements[i].className == classname) {
            eles.push(elements[i]);
        }
    }
    return eles;
}

