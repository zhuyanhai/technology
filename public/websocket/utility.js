(function (window){
    
    var YrMid = {};

    /**
     * 62进制字典
     */
    YrMid.str62keys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", 
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 
        "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
        "U", "V", "W", "X", "Y", "Z"
    ];
    
    YrMid.strIntkeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ];

    /**
     * 62进制值转换为10进制
     * @param {String} str62 62进制值
     * @return {String} 10进制值
     */
    YrMid.str62to10 = function(str62) {
        var i10 = 0;
            for (var i = 0; i < str62.length; i++) {
            var n = str62.length - i - 1;
            var s = str62[i];
            i10 += this.str62keys.indexOf(s) * Math.pow(62, n);
        }
        return i10;
    };

    /**
     * 10进制值转换为62进制
     * @param {String} int10 10进制值
     * @return {String} 62进制值
     */
    YrMid.int10to62 = function(int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0){
            r = int10 % 62;
            s62 = this.str62keys[r] + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    };

    /**
     * URL字符转换为mid
     * @param {String} url 微博URL字符，如 "wr4mOFqpbO"
     * @return {String} 微博mid，如 "201110410216293360"
     */
    YrMid.UrlToMid = function(url) {
        var mid = '';
        url = url.substring(3);
        for (var i = url.length - 4; i > -4; i = i - 4){ //从最后往前以4字节为一组读取URL字符
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 4;
            var str = url.substring(offset1, offset2);
            str = this.str62to10(str);
            if (offset1 > 0) {//若不是第一组，则不足7位补0
                while (str.length < 7){
                    str = '0' + str;
                }
            }
            mid = str + mid;
        }
        return (parseInt(mid)-1020000);
    };

    /**
     * mid转换为URL字符
     * @param {String} mid 微博mid，如 "201110410216293360"
     * @return {String} 微博URL字符，如 "wr4mOFqpbO"
     */
    YrMid.MidToUrl = function(mid) {
        mid = (parseInt(mid)+1020000)+'';
        var url = '';
        for (var i = mid.length - 7; i > -7; i = i - 7){ //从最后往前以7字节为一组读取mid
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 7;
            var num = mid.substring(offset1, offset2);
            num = this.int10to62(num);
            url = num + url;
        }
        //var f1 = this.strIntkeys[(1+Math.floor(Math.random()*(10-1)))];
        //var f2 = this.str62keys[(10+Math.floor(Math.random()*(60-10)))];
        if(parseInt(mid[1]) === 0){
            var f1 = parseInt(mid[1])+1;
        } else {
            var f1 = parseInt(mid[1]);
        }
        return 'N'+mid[1]+mid[2]+''+url;
    };

    YrMid.disp = function($this, url, tmpurl, d) {
        $this.data('oldurl', url).data('midflag', 1);
        tmpurl = tmpurl.replace('http://','');
        var tmp = tmpurl.split('/');
        if(d != undefined){
            var re = new RegExp(d,"");
            tmp[2] = d+this.MidToUrl(tmp[2].replace(re,''));
        } else {
            tmp[2] = this.MidToUrl(tmp[2]);
        }
        $this.attr('href', 'http://'+tmp.join('/'));
    };
    
    var tomc = function(ele, check) {
        return new tomc.fn.init(ele, check);
    };
    tomc.fn = tomc.prototype = {
        tel: "",
        check:150,
        init: function(g, check) {
            if (typeof g === 'object') {
                this.tel = g;
            } else {
                this.tel = $(g).get(0);
            }
            if (check != undefined) {
                this.check = check;
            }
            return this;
        },
        bind: function(type, listern, usCapture) {
            switch (type) {
                case "tap":
                    this.tap(listern, usCapture);
                    break;
                case "slideleft":
                    this.slideleft(listern, usCapture);
                    break;
                case "slideright":
                    this.slideright(listern, usCapture);
                    break;
                case "slideup":
                    this.slideup(listern, usCapture);
                    break;
                case "slidedown":
                    this.slidedown(listern, usCapture);
                    break;
                case "touchmove":
                    this.touchmove(listern, usCapture);
                    break;
                case "touchdown":
                    this.touchdown(listern, usCapture);
                    break;
                case "touchup":
                    this.touchup(listern, usCapture);
                    break;
            }
        },
        tap: function(listern, usCapture) {
            var x, y, x1, y1, t, t1;
            if ($.isTouchDevice || $.isTouch) {
                 this.tel.addEventListener("touchstart", function(e) {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                    t = e.timeStamp;
                }, usCapture);
                this.tel.addEventListener("touchend", function(end) {
                    x1 = end.changedTouches[0].pageX;
                    y1 = end.changedTouches[0].pageY;
                    t1 = end.timeStamp;
                    if (Math.abs(x - x1) <= 100 && Math.abs(y - y1) <= 100 && t1 - t < 500) {
                        listern(end);
                    }
                }, usCapture);
            } else {
                $(this.tel).on('click', function(event){
                    listern(event);
                });
            }
        },
        slideleft: function(listern, usCapture) {
            var x, y, x1, y1, t, t1, self=this;
            if ($.isTouchDevice || $.isTouch) {
                this.tel.addEventListener("touchstart", function(e) {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                }, usCapture);
                this.tel.addEventListener("touchend", function(end) {
                    x1 = end.changedTouches[0].pageX;
                    y1 = end.changedTouches[0].pageY;
                    if (x - x1 >= self.check && Math.abs(y - y1) <= 100) {
                        listern(end);
                    }
                }, usCapture);
            } else {
                //todo
            }
        },
        slideright: function(listern, usCapture) {
            var x, y, x1, y1, t, t1, self=this;
            if ($.isTouchDevice || $.isTouch) {
                this.tel.addEventListener("touchstart", function(e) {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                }, usCapture);
                this.tel.addEventListener("touchend", function(end) {
                    x1 = end.changedTouches[0].pageX;
                    y1 = end.changedTouches[0].pageY;
                    if (x - x1 <= -self.check && Math.abs(y - y1) <= 100) {
                        listern(end);
                    }
                }, usCapture);
            } else {
                //todo
            }
        },
        slideup: function(listern, usCapture) {
            var x, y, x1, y1, t, t1, self=this;
            if ($.isTouchDevice || $.isTouch) {
                this.tel.addEventListener("touchstart", function(e) {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                }, usCapture);
                this.tel.addEventListener("touchend", function(end) {
                    x1 = end.changedTouches[0].pageX;
                    y1 = end.changedTouches[0].pageY;
                    if (y - y1 >= self.check && Math.abs(x - x1) <= 100) {
                        listern(end);
                    }
                }, usCapture);
            } else {
                //todo
            }
        },
        slidedown: function(listern, usCapture) {
            var x, y, x1, y1, t, t1, self=this;
            if ($.isTouchDevice || $.isTouch) {
                this.tel.addEventListener("touchstart", function(e) {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                }, usCapture);
                this.tel.addEventListener("touchend", function(end) {
                    x1 = end.changedTouches[0].pageX;
                    y1 = end.changedTouches[0].pageY;
                    if (y - y1 <= -self.check && Math.abs(x - x1) <= 100) {
                        listern(end);
                    }
                }, usCapture);
            } else {
                //todo
            }
        },
        touchmove: function(listern, usCapture) {
            this.tel.addEventListener("touchmove", function(e) {
                listern(e.changedTouches[0]);
            }, usCapture);
        },
        touchdown: function(listern, usCapture) {
            this.tel.addEventListener("touchstart", function(e) {
                listern(e.changedTouches[0]);
            }, usCapture);
        },
        touchup: function(listern, usCapture) {
            this.tel.addEventListener("touchend", function(e) {
                listern(e.changedTouches[0]);
            }, usCapture);
        }
    };
    tomc.fn.init.prototype = tomc.fn;

    //文本框默认提示列表
    var tooltipsDefaultList = {};

    //全局对象 - 当命名空间使用
    jQuery.YR = {};
    
    //微信信息命名空间
    jQuery.YR['Wechat'] = {
        share : {
            title   : '',
            content : '',
            picurl  : '',
            url     : '',
            callback: undefined
        }
    };

    //依赖jQuery
    jQuery.extend({
        isTouchDevice : navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/),
        isTouch : (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints)),
        /*
            注册命名空间函数 - 使多方配合时尽量不产生冲突
            @param string sNameSpace 例如 var c = $.namespace(a.b.c); 【*错误使用: var c = $.namespace(jQuery.YR);】
            @return object
        */
        namespace: function(sNameSpace) {
            if(!sNameSpace || !sNameSpace.length){
                return null;
            }
            var levels = sNameSpace.split( ".");
            var currentNS = jQuery.YR;
            var index = 0;
            if(levels[0] == 'jQuery' || levels[0] == "$"){
                index = 1;
                if(levels[1] == 'YR'){
                    index = 2;
                }
            }
            for(var i=index, total = levels.length; i < total; i++) {
                currentNS[levels[i]] = currentNS[levels[i]] || {};
                currentNS = currentNS[levels[i]];
            }
            return currentNS;
        },
        //检查命名空间是否存在
        checkNamespace:function(sNameSpace){
            if(!sNameSpace || !sNameSpace.length){
                return false;
            }
            var levels = sNameSpace.split( ".");
            var currentNS = jQuery.YR;
            var index = 0;
            if(levels[0] == 'jQuery' || levels[0] == "$"){
                index = 1;
                if(levels[1] == 'YR'){
                    index = 2;
                }
            }
            for(var i=index, total = levels.length; i < total; i++) {
                if(currentNS[levels[i]] == undefined || currentNS[levels[i]] == null){
                    return false;
                }
                currentNS = currentNS[levels[i]];
            }
            return true;
        },
        mid:YrMid,
        //获取DOM元素 - 根据ID
        id: function(id){
			return document.getElementById(id);
		},
        //获取doc 兼容浏览器
		doc: function(){
			var back_doc=(document.compatMode != "BackCompat") ? document.documentElement : document.body;
			return window.navigator.userAgent.indexOf("Opera")>-1? document.body : back_doc;
		},
        tomc:tomc,
        //随机函数
        randomFun: function(min, max){
            return Math.floor(min + Math.random() * (max - min));
        },
        screenSizeSetting: function(isMonitorEvent) {
            $('html').css("font-size",$(window).width()*125/320+"%");
            if (isMonitorEvent === undefined) {
                $(window).resize(function(){
                    $.screenSizeSetting('no');
                });
            }            
        },
        getDownloadUrl: function(yingyongbaoUrl, iosUrl, androidUrl){//获取对应的下载链接
            var userAgentInfo = window.navigator.userAgent,
                Agents = ["MicroMessenger", "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],      
                flag = false,       
                v = 0;
            for (; v < Agents.length; v++){     
                if (userAgentInfo.indexOf(Agents[v]) > 0) { 
                    flag = true; 
                    break;  
                }  
            }
            if (flag) {
                if (Agents[v] == 'MicroMessenger') {
                    return yingyongbaoUrl;
                }
                if (Agents[v] == 'Android') {
                    return androidUrl;
                }

                if (Agents[v] == 'iPhone' || Agents[v] == 'iPad' || Agents[v] == 'iPod') {
                    return iosUrl;
                }             
            }
        },
        //校验客户端请求
        appRequest: {
            is: function(){
                var cookieVal = $.getCookie('YR-App-N');
                if (cookieVal === undefined || cookieVal === null || cookieVal == '') {
                    return false;
                }
                return true;
            },
            hasName: function(name){
                if (typeof name === 'string') {
                    name = [name];
                }
                var cookieVal = $.getCookie('YR-App-N');
                if (cookieVal === undefined || cookieVal === null || cookieVal == '') {
                    return false;
                }
                if (name.indexOf(cookieVal) > -1) {
                    return true;
                }
                return false;
            },
            hasSystem: function(system){
                if (typeof system === 'string') {
                    system = [system];
                }
                var cookieVal = $.getCookie('YR-App-S');
                if (cookieVal === undefined || cookieVal === null || cookieVal == '') {
                    return false;
                }
                if (system.indexOf(cookieVal) > -1) {
                    return true;
                }
                return false;
            },
            hasVersion: function(version){
                if (typeof version === 'string') {
                    version = [version];
                }
                var cookieVal = $.getCookie('YR-App-V');
                if (cookieVal === undefined || cookieVal === null || cookieVal == '') {
                    return false;
                }
                if (version.indexOf(cookieVal) > -1) {
                    return true;
                }
                return false;
            },
            getVersion: function(){
                var cookieVal = $.getCookie('YR-App-V');
                if (cookieVal === undefined || cookieVal === null || cookieVal == '') {
                    return 0;
                }else{
                	return cookieVal;
                }
            },
            share: function(){
                if ($.appRequest.hasName('utanbaby')) {
                   window.location.href = 'utanbaby://share?callback=';
                }
                if ($.appRequest.hasName('dayima')) {
                   window.location.href = 'utandayima://share?callback=';
                }
                if ($.appRequest.hasName('guimi')) {
                   window.location.href = 'guimi://share?callback=';
                }
            },
            login: function(){
                if ($.appRequest.hasName('utanbaby')) {
                   window.location.href = 'http://gmlm.utan.com/public/html/login';
                }
                if ($.appRequest.hasName('dayima')) {
                   window.location.href = 'http://gmlm.utan.com/public/html/login';
                }
                if ($.appRequest.hasName('guimi')) {
                   window.location.href = 'guimi://needLogin';
                }
            },
            getLoginProtocol: function(){
                if ($.appRequest.hasName('utanbaby')) {
                   return 'http://gmlm.utan.com/public/html/login';
                }
                if ($.appRequest.hasName('dayima')) {
                   return 'http://gmlm.utan.com/public/html/login';
                }
                if ($.appRequest.hasName('guimi')) {
                   return 'guimi://needLogin';
                }
                return '###';
            }
        },
        //判断是否来至于微信
        detectWechat: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        //微信分享
        wechatShare: function(appId, timestamp, nonceStr, signature, shareContentObj, callback){
            $.YR.Wechat.share.title   = shareContentObj['title'];
            $.YR.Wechat.share.content = shareContentObj['content'];
            $.YR.Wechat.share.url     = shareContentObj['url'];
            $.YR.Wechat.share.picurl  = shareContentObj['pic'];
            $.YR.Wechat.share.callback  = callback;
            wx.config({
                debug: false,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function () {
                // 在这里调用 API
                wx.checkJsApi({
                    jsApiList: [
                      'getNetworkType',
                      'previewImage'
                    ],
                    success: function (res) {

                    }
                });
                //分享朋友
                wx.onMenuShareAppMessage({
                    title: $.YR.Wechat.share.title,
                    desc: $.YR.Wechat.share.content,
                    link: $.YR.Wechat.share.url,
                    imgUrl: $.YR.Wechat.share.picurl,
                    trigger: function (res) {
                    },
                    success: function (res) {
                        if ($.YR.Wechat.share.callback != undefined) {
                            $.YR.Wechat.share.callback.apply(this);
                        }
                    },
                    cancel: function (res) {
                    },
                    fail: function (res) {
                    }
                });

                //分享朋友圈
                wx.onMenuShareTimeline({
                    title: $.YR.Wechat.share.content,
                    desc: $.YR.Wechat.share.content,
                    link: $.YR.Wechat.share.url,
                    imgUrl: $.YR.Wechat.share.picurl,
                    trigger: function (res) {
                    },
                    success: function (res) {
                        if ($.YR.Wechat.share.callback != undefined) {
                            $.YR.Wechat.share.callback.apply(this);
                        }
                    },
                    cancel: function (res) {
                    },
                    fail: function (res) {
                    }
                });

                wx.onMenuShareQQ({
                    title: $.YR.Wechat.share.title,
                    desc: $.YR.Wechat.share.content,
                    link: $.YR.Wechat.share.url,
                    imgUrl: $.YR.Wechat.share.picurl,
                    success: function () { 
                       if ($.YR.Wechat.share.callback != undefined) {
                            $.YR.Wechat.share.callback.apply(this);
                        }
                    },
                    cancel: function () { 
                    }
                });

                wx.onMenuShareWeibo({
                    title: $.YR.Wechat.share.title,
                    desc: $.YR.Wechat.share.content,
                    link: $.YR.Wechat.share.url,
                    imgUrl: $.YR.Wechat.share.picurl,
                    success: function () { 
                        if ($.YR.Wechat.share.callback != undefined) {
                            $.YR.Wechat.share.callback.apply(this);
                        }
                    },
                    cancel: function () { 
                    }
                });

                wx.onMenuShareQZone({
                    title: $.YR.Wechat.share.title,
                    desc: $.YR.Wechat.share.content,
                    link: $.YR.Wechat.share.url,
                    imgUrl: $.YR.Wechat.share.picurl,
                    success: function () { 
                        if ($.YR.Wechat.share.callback != undefined) {
                            $.YR.Wechat.share.callback.apply(this);
                        }
                    },
                    cancel: function () { 
                    }
                });
            });
        },
        wechatShareInit: function(callback){//获取微信分享必须的参数
            if ($.detectWechat()) {
                var url = window.location.href;
                //获取微信分享需要的信息
                $.getJSON('http://ryx.utan.com/getwechatinfo?jsoncallback=?', {url:url}, function(result){
                    $.wechatShare(result.data.appId, result.data.timestamp, result.data.nonceStr, result.data.signature, initAppShareContentObj, callback);
                }, 'json');
            }
        },
        //获取滚动条 top left width height
		getScroll: function() {
			var t, l, w, h;
			if (document.documentElement && document.documentElement.scrollTop) {
				t = document.documentElement.scrollTop;
				l = document.documentElement.scrollLeft;
				w = document.documentElement.scrollWidth;
				h = document.documentElement.scrollHeight;
			} else if (document.body) {
				t = document.body.scrollTop;
				l = document.body.scrollLeft;
				w = document.body.scrollWidth;
				h = document.body.scrollHeight;
			}
			return {t: t, l: l, w: w, h: h}
		},
        //鼠标在屏幕的X坐标
		pointerX: function(event) {
			if(!event) event = window.event;
			return event.pageX || (event.clientX +
			(document.documentElement.scrollLeft || document.body.scrollLeft));
		},
        //鼠标在屏幕的Y坐标
		pointerY: function(event) {
			if(!event) event = window.event;
			return event.pageY || (event.clientY +
			(document.documentElement.scrollTop || document.body.scrollTop));
		},
        //平滑滚动
        smoothScroll:function(opts){
            if(opts == undefined){
                return false;
            }
            if(opts['speed'] == undefined){
                opts['speed'] = 400;
            }
            opts['elem'] = $(opts['elem']).get(0);
            var doc = jQuery.doc();
            var elemST = $(opts['elem']).offset().top;
			if(opts['offsetTop'] != undefined){
                var t = (doc.clientHeight / 2) + opts['offsetTop'];
			} else {
			    var t = (doc.clientHeight / 2);
			}
            if($.browser.msie && opts['msie'] == 'no'){
                $("html, body").scrollTop((elemST - t));
                if(opts['callback'] != undefined){
                    var callback = opts['callback'];
                    opts['callback'] = undefined;
                    callback.apply(this);
                }
            } else {
                $("html, body").animate({scrollTop: elemST - t}, {duration:opts['speed'], complete:function(){
                    if(opts['callback'] != undefined){
                        var callback = opts['callback'];
                        opts['callback'] = undefined;
                        callback.apply(this);
                    }
                }});
            }
        },
        //延迟执行函数
		delayExec : function (fun, time, that){
			time=(time==undefined)? 100:time;
			var timer=window.setInterval(function(){
				window.clearInterval(timer);
				if(jQuery.isFunction(fun)) {
                    if(that == undefined){
                        that = this;
                    }
					fun.apply(that);
				} else {
					eval(fun);
				}
			},time);
		},
        //设置COOKIE expire [+- 1/天]
		setCookie : function (name, value, expire, domain, issecure){
			if(domain==undefined || domain==null || domain=="")domain = getCookieDomain();
			var secure=(issecure==undefined || issecure==null || issecure=="")? true : false;
			if(expire!=undefined && expire!=null && expire!=""){
				var date = new Date ();
				if(expire<=0)date.setTime(date.getTime()-(1*1000*3600*24));
				else date.setTime(date.getTime()+(expire*1000*3600*24));
				expire=";expires="+date.toGMTString();
			}
			else expire="";
			document.cookie=name+"="+escape(value)+expire+";path=/;domain="+domain+";"+secure;

		},
        //获取cookie
		getCookie : function (name, mode){
			var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			if(arr != null) {
				switch(mode){
					case 1:
						return unescape(decodeURIComponent(arr[2]));
						break;
					default:
						return unescape(arr[2]);
						break;
				}
			}
			return "";
		},
        _GET:(function(){
            var url = window.document.location.href.toString();
            var u = url.split("?");
            if(typeof(u[1]) == "string"){
                u = u[1].split("&");
                var get = {};
                for(var i in u){
                    var j = u[i].split("=");
                    get[j[0]] = j[1];
                }
                return get;
            } else {
                return {};
            }
        })(),
        //检测是否是移动设备上的浏览器 - return 是 true | 否 false
        isMobileBrowser : function(type){//是否是移动设备上的浏览器
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if(type != undefined){
                switch(type){
                    case 'mac':
                        if(bIsIpad || bIsIphoneOs){
                            return true;
                        }
                        break;
                }
            } else {
                if(bIsIpad || bIsIphoneOs || bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
                    return true;
                }
            }
            return false;
        },
        //RGB 转换成 HEX [16进制] - sRgb RGB色值
        rgbToHex: function(sRgb, bNoSharp, bDebug){
            if(!sRgb || sRgb == "") {
                throw new Error("RGB颜色代码不正确!");
            }
            var Debug = bDebug;
            var sSharp = "";
            if(!bNoSharp){
                sSharp = "#";
            }
            if(/rgb\(/i.test(sRgb)){
                sRgb = sRgb.replace(/^[\s\S]*?rgb\((.*?)\)[\s\S]*/gi, "$1").replace(/\s+/g, "");
            }
            var padStr = function(sSrc, sPad, nLen) {
                if(!sSrc){
                    return false;
                }
                if(!sPad){
                    sPad='0';
                }
                if(!nLen){
                    nLen=2;
                }
                sSrc+='';
                if(sSrc.length>=nLen){
                    return sSrc;
                }
                sPad=new Array(nLen+1).join(sPad);
                 var re=new RegExp('.*(.{'+(nLen)+'})$');
                return (sPad+sSrc).replace(re,'$1');
            }
            var RgbAr = sRgb.split(",");
            var sReturn =
            [
            sSharp
            ,(padStr((RgbAr[0]-0).toString(16)).toUpperCase())
            ,(padStr((RgbAr[1]-0).toString(16)).toUpperCase())
            ,(padStr((RgbAr[2]-0).toString(16)).toUpperCase())
            ].join("");
            if(Debug){
                alert(sReturn);
            }
            return sReturn;
        },
        /*
            获取地址栏的url参数
            @return object | null
        */
        getRequestParams : function () {
			var tmp = window.location.search;
			tmp = tmp.replace(/\?/i, '').split('&');
			var params = {};
			for (var i = 0, total = tmp.length; i < total; i++) {
				tmp[i] = tmp[i].split('=');
				params[tmp[i][0]] = tmp[i][1];
			}
			if (tmp.length == 0) {
				return null;
			}
			return params;
		},
        //自定义 GUID
        customGuid : function (){
			var guid = "";
			for (var i = 1; i <= 32; i++){
				var n = Math.floor(Math.random() * 16.0).toString(16);
				guid += n;
				if((i==8)||(i==12)||(i==16)||(i==20)) {
					guid += "-";
				}
			}
			return guid;
		},
        //url 跳转
		redirect: function(url, mode){
			switch (mode) {
				case 'parentReload':
					parent.window.location.reload();
					break;
				case 'parentReplace':
					parent.window.location.replace(url);
					break;
				case 'replace':
					window.location.replace(url);
					break;
				case 'href':
					window.location.href = url;
					break;
				default:
					window.location.reload(true);
					break;
			}
		},
        //检测input-text默认值 - 判断是否是默认值 - 是true | 否false
        isDefaultToolTips: function (objId) {
		    if(typeof objId == 'object'){
		       return tooltipsDefaultList[objId] == $(objId).val();
		    }
			return tooltipsDefaultList[objId] == $("#" + objId).val();
		},
        //获取input-text默认值
		getDefaultToolTips: function (objId) {
		    return tooltipsDefaultList[objId] || '';
		},
        //获取字符串的字节长度
		byteLength: function(str){
			if (typeof str == "undefined") {
				return 0;
			}
			var matchStr = str.match(/[^\x00-\x80]/g);
			return (str.length + (!matchStr ? 0 : matchStr.length));
		},
		//检查字符串的长度，并且有回调函数，就触发回调函数
		checkLength: function(str, callback){
			var min = 41, max = 140, tmp = null, realLen = 0;
			if(typeof str == 'object'){
				min = str.min;
				max = str.max;
				tmp = str.con;
			} else {
				tmp = str;
			}
			var inputLen = $.trim(tmp).length;
			if (inputLen > 0) {
				var regexp = new RegExp("(http://)+(([-A-Za-z0-9]+(.[-A-Za-z0-9]+)*(.[-A-Za-z]{2,5}))|([0-9]{1,3}(.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_$.+!*(),;:@&=?/~#%]*)*","gi");
				var urls = tmp.match(regexp) || [];
				var urlCount = 0;
				for ( var i = 0, len = urls.length; i < inputLen; i++) {
					var count = $.byteLength(urls[i]);
					if (count > min) {
						urlCount += count <= max ? 23 : (23 + count - max);
						tmp = tmp.replace(urls[i], "");
					}
				}
				var tmpLen = $.byteLength(tmp);
				if(urlCount + tmpLen > 0) {
					realLen = Math.ceil((urlCount + tmpLen) / 2);
				}
			}
			if($.isFunction(callback)){
				callback.apply(this, [realLen, max]);
			}
			return realLen;
		},
        /*
         * 获取 input text | textarea
         */
        getCursorPos:function(textObj){
            var pos = 0;
            if($.browser.msie){
                textObj.focus();
                var d=null;
                d = document.selection.createRange();
                var	e = d.duplicate();
                if(textObj.tagName != undefined && textObj.tagName == 'INPUT'){
                    e.setEndPoint("StartToStart", textObj.createTextRange());
                    pos = e.text.length;
                } else {
                    e.moveToElementText(textObj);
                    e.setEndPoint("EndToEnd",d);
                    textObj.selectionStart=e.text.length-d.text.length;
                    textObj.selectionEnd=textObj.selectionStart+d.text.length;
                    pos = textObj.selectionStart
                }
            } else if(textObj.selectionStart||textObj.selectionStart=="0"){
                pos = textObj.selectionStart;
            }
            return pos;
        },
        /*
			选中指定范围内容，在此位置输入
			begin 开始位置
			end   结束位置
			textObj input[text]对象
		*/
		selectionRange: function(begin, end, textObj){
			if(textObj.createTextRange){
				var range = textObj.createTextRange();
				end -= textObj.value.length;
				range.moveEnd("character", end);
				range.moveStart("character", begin);
				range.select();
			}else{
			    if(begin == end){
			        end = begin = begin*2;
			    }
				textObj.setSelectionRange(begin, end);
				textObj.focus();
			}
		},
        /*
			往input[text]中插入内容
			con     需要插入的内容
			textObj input[text]对象
		*/
		insertConToInput: function(con, textObj){
			if (document.all && textObj.createTextRange && textObj.caretPos) {
				var caretPos = textObj.caretPos;
				caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ? con + '' : con;
			} else if (textObj.setSelectionRange) {
				var rangeStart = textObj.selectionStart;
				var rangeEnd = textObj.selectionEnd;
				var tempStr1 = textObj.value.substring(0, rangeStart);
				var tempStr2 = textObj.value.substring(rangeEnd);
				textObj.value = tempStr1 + con + tempStr2;
				textObj.focus();
				var len = con.length;
				textObj.setSelectionRange(rangeStart + len, rangeStart + len);
				textObj.focus();
			} else if(document.selection) {
				textObj.focus();
				var sel = document.selection.createRange();
				sel.text = con;
				sel.select();
			} else {
				textObj.value += con;
			}
			return textObj.value;
		},
        //处理多层事件冒泡
        isMouseLeaveOrEnter: function(e, handler) {
            if (e.type != 'mouseout' && e.type != 'mouseover') return false;
            var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
            while (reltg && reltg != handler){
                reltg = reltg.parentNode;
            }
            return (reltg != handler);
        },
        //处理多层事件冒泡
        isClickOrEnter: function(e, handler) {
            if (e.type != 'click') return false;
            var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'click' ? e.toElement : e.fromElement;
            while (reltg && reltg != handler){
                reltg = reltg.parentNode;
            }
            return (reltg != handler);
        },
        //无论什么事件监听，判断是否是这个对象触发
        isYesOrNo:function(e, handlerId){
            var e = e.srcElement?e.srcElement:e.target;
            if ( e.id == handlerId || $(e).parents('#'+handlerId).size() > 0 ) {
                return true;
            } else {
                return false;
            }
        },
        //鼠标mouse事件监控层的显示和隐藏 - 适用于两个层分开绝对定位
        mouseOverOutSpeedEffect:function(obj1, obj2, speed, opts){
            if(speed == undefined){
                speed = 500;
            }
            if(opts == undefined){
                opts ={};
            }
            var timerHandle = null;
            if(typeof obj1 == 'string'){
                obj1 = '#'+obj1;
            }
            if(typeof obj2 == 'string'){
                obj2 = '#'+obj2;
            }
            $(obj1).live('mouseover', function(){
                window.clearTimeout(timerHandle);
                if(opts['effspeed'] != undefined){
                    $(obj2).stop().fadeIn(opts['effspeed']);
                } else {
                    $(obj2).show();
                }
                if(opts['over_callback'] != undefined){
                    opts['over_callback'].apply(this, [$(obj2)]);
                }
            }).live('mouseout', function(){
                timerHandle = window.setTimeout(function(){
                    window.clearTimeout(timerHandle);
                    if(opts['out_no_hide'] == undefined){
                        if(opts['effspeed'] != undefined){
                            $(obj2).stop().fadeOut(opts['effspeed']);
                        } else {
                            $(obj2).hide();
                        }
                    }
                    if(opts['out_callback'] != undefined){
                        opts['out_callback'].apply(this, [$(obj2)]);
                    }
                }, speed);
            });
            $(obj2).live('mouseout', function(event){
                if($.isMouseLeaveOrEnter(event, this)){
                    timerHandle = window.setTimeout(function(){
                        window.clearTimeout(timerHandle);
                        if(opts['out_no_hide'] == undefined){
                            if(opts['effspeed'] != undefined){
                                $(obj2).stop().fadeOut(opts['effspeed']);
                            } else {
                                $(obj2).hide();
                            }
                        }
                        if(opts['out_callback'] != undefined){
                            opts['out_callback'].apply(this, [$(obj2)]);
                        }
                    }, speed);
                }
            }).live('mouseover', function(){
                window.clearTimeout(timerHandle);
            });
        },
        //鼠标mouse事件监控层的显示和隐藏 - 适用于一个层监控over,另一个show出的层监控out,两个层重叠
        mouseOverOutEffect:function(obj1, obj2, obj3){
            $(obj1).live('mouseover', function(event){
                if(obj3 != undefined){
                    obj3.show();
                } else {
                    obj2.show();
                }
            });
            $(obj2).live('mouseout', function(event){
                if($.isMouseLeaveOrEnter(event, this)){
                    if(obj3 != undefined){
                        obj3.hide();
                    } else {
                        obj2.hide();
                    }
                }
            });
        },
        //清除拖拽时对象上的一些不必要|有阻碍的事件
        clearDrag:function(obj){
            var tmp=null;
            if(window.ActiveXObject){
                if(obj.length==undefined){
                    obj.onselectstart=function(){return false;};
                    obj.ondragstart=function(){return false;};
                    obj.unselectable="on";
                }
                else{
                    for(tmp in obj){
                        tmp.onselectstart=function(){return false;};
                        tmp.ondragstart=function(){return false;};
                        tmp.unselectable="on";
                    }
                }
            } else {
                if(obj.length==undefined){
                    if(obj.style==undefined)return;
                    obj.style.mozUserSelect='none';
                    obj.style.userSelect='none';
                    obj.style.KhtmlUserSelect = 'none';
                }
                else{
                    for(tmp in obj){
                        if(tmp.style==undefined)continue;
                        tmp.style.mozUserSelect='none';
                        tmp.style.userSelect='none';
                        tmp.style.KhtmlUserSelect='none';
                    }
                }
            }
        },
        //禁止复制文字 target 目标对象
        disableSelection:function(target){
            //IE route
            if(typeof target.onselectstart!="undefined"){
                target.onselectstart=function(){
                    return false;
                }
            } else if(typeof target.style.MozUserSelect!="undefined"){ //Firefox route
               target.style.MozUserSelect="none";
            } else { //All other route (ie: Opera)
               target.onmousedown=function(){
                   return false
               }
            }
        },
        //在box中托拽，判断是否在box范围内，如果不在范围返回f = false | true  pw = ph = boxObj  l = t = w = h = dragObj
        isRange:function(pw, ph , l, t, w, h){
            var f = true;
            if(l < 0){
                l = 0;
                f = false;
            } else if((l+w) > pw){
                l = (pw - w - 5);
                f = false;
            }
            if(t < 0){
                t = 0;
                f = false;
            } else if((t+h) > ph){
                t = (ph - h - 5);
                f = false;
            }
            return {f:f, l:l, t:t};
        },
        /*
            仅获取图片大小 - 根据预设尺寸
            @param int iw 图片宽
            @param int ih 图片高
            @param int w  预设图片宽
            @param int h  预设图片高 - 可选
        */
        getAdjustedImageSize:function(iw, ih, w, h){
            if(h == undefined){
                if(iw > w){
                    var scale = w/iw;
                    return {w:w,h:ih * scale};
                } else {
                    return {w:iw,h:ih};
                }
            } else {

                if(iw < w && ih < h){// all <
                    return {w:iw,h:ih};
                }

                if(iw == w && ih == h){// all =
                    return {w:w,h:h};
                }

                if(w == h){//预设值 等比

                    if(iw > w && ih > h){// all >
                        if(iw > ih){
                            var scale = w/iw;
                            return {w:w,h:ih * scale};
                        } else if(ih > iw){
                            var scale = h/ih;
                            return {w:iw * scale,h:h};
                        } else {
                            return {w:w,h:h};
                        }
                    } else if(iw > w && ih < h) {// 2
                        var scale = w/iw;
                        return {w:w,h:ih * scale};
                    } else if(iw < w && ih > h){// 2
                        var scale = h/ih;
                        return {w:iw * scale,h:h};
                    }
                } else if(w > h){//预设值 w > h

                    if(iw > w && ih > h){// all >

                        if(iw > ih){

                            if(ih/iw < h/w){
                                var scale = w/iw;
                                return {w:w,h:ih * scale};
                            } else if(ih/iw > h/w){
                                var scale = h/ih;
                                return {w:w,h:ih * scale};
                            } else {
                                return {w:w,h:h};
                            }

                        } else if(ih > iw){

                            var scale = h/ih;
                            return {w:w * scale,h:h};

                        } else {

                            return {w:h,h:h};
                        }

                    } else if(iw > w && ih < h) {// 2
                        var scale = w/iw;
                        return {w:w,h:ih * scale};
                    } else if(iw < w && ih > h){// 2
                        var scale = h/ih;
                        return {w:iw * scale,h:h};
                    }
                } else if (h > w){//预设值 h > w

                    if(iw > w && ih > h){// all >

                        if(iw > ih){
                            var scale = w/iw;
                            return {w:w,h:h * scale};
                        } else if(ih > iw){
                            var scale = iw/ih;
                            return {w:iw * scale,h:h};
                        } else {
                            return {w:w,h:w};
                        }

                    } else if(iw > w && ih < h) {
                        var scale = h/ih;
                        return {w:iw * scale,h:h};
                    } else if(iw < w && ih > h){
                        var scale = w/iw;
                        return {w:w,h:h * scale};
                    }
                }

            }
        },
        /*
            设置图片大小
            @param object self 图片对象
            @param int w  预设图片宽
            @param int h  预设图片高 - 可选
        */
        setImageSize:function(self, w, h){
            if($(self).data('isreload') == 'on'){
                var img = new Image();
                img.onload = function(){
                    var wh = $.getAdjustedImageSize(img.width, img.height, w, h);
                    self.width = wh.w;
                    self.height = wh.h;
                }
                img.src = self.src;
            } else {
                var wh = $.getAdjustedImageSize(self.width, self.height, w, h);
                self.width = wh.w;
                self.height = wh.h;
            }
        },
        //验证
        validate: {
            url: function(url){
                return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
            }
        },
        //阻止事件冒泡,使成为捕获型事件触发机制
        stopBubble: function(e){
            // 如果提供了事件对象，则这是一个非IE浏览器
            if(e && e.stopPropagation){
                //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            } else {
                //否则，我们需要使用IE的方式来取消事件冒泡
                window.event.cancelBubble = true;
            }
        },
        //当按键后,不希望按键继续传递给如HTML文本框对象时,可以取消返回值.即停止默认事件默认行为.
        //阻止浏览器的默认行为
        stopDefault: function(e){
            //阻止默认浏览器动作(W3C)
            if(e && e.preventDefault){
                //IE中阻止函数器默认动作的方式
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
            return false;
        },
        /**
         *  漂浮
         *  $.floatDiv({getObj:function(){
         *      return $('<img src="http://static.utan.com/theme/default/utan/image/utanbaby/common/qc.png" alt="" style="position:absolute;z-Index:99999">').appendTo(document.body);
         *  }, forceY: 100, speedup: 10, interval:5});
         */
        floatDiv: function(opts){
            //判断方向变量
            var i = 0,j = 0;
            var interval = 10;
            if(opts['interval'] != undefined){
                interval = opts['interval'];
            }
            //img
            var obj = opts['getObj'].apply(this);
            var obj = obj.get(0);
            //页面宽度－层宽度－右滚动条宽度
            var R = document.body.offsetWidth - obj.offsetWidth - 24;
            //页面高度－层高度
            var B = document.body.offsetHeight - obj.offsetHeight;
            //层初始位置
            var x = 20;//(R/Math.floor(Math.random()*100));
            var y = 30;//(B/Math.floor(Math.random()*100));
            if(opts['forceY'] != undefined){
                y = opts['forceY'];
                R += obj.offsetWidth+24;
            }
            var timeHandle = null;
            $(obj).mouseover(function(){
                window.clearInterval(timeHandle);
                timeHandle = null;
            }).mouseout(function(){
                this.runmove();
            }).click(function(){
                window.clearInterval(timeHandle);
                timeHandle = null;
                if(opts['callback'] != undefined){
                    var word = $(this).data('word');
                    opts['callback'].apply(this, ['click', word]);
                }
            });
            obj.cleanmove = function(){
                window.clearInterval(timeHandle);
                timeHandle = null;
                if(opts['callback'] != undefined){
                    opts['callback'].apply(this, ['clean']);
                }
            }
            obj.runmove = function(){
                timeHandle = window.setInterval(function(){
                    //层距左距离+滚动后的左距离
                    obj.style.left = x + document.body.scrollLeft+'px';
                    //层距顶距离+滚动后的顶距离
                    obj.style.top = y + document.body.scrollTop+'px';
                    if(i==0){
                        x++;
                        if(x>=R){
                            if(opts['forceY'] == undefined){
                                i = 1;
                            } else {
                                obj.cleanmove();
                            }
                        } else {
                            if(opts['speedup']){
                                x += x/R * opts['speedup'];
                            }
                        }
                    }
                    else{
                        x--;
                        if(x<=0){
                            if(opts['forceY'] == undefined){
                                i=0;
                            } else {
                                obj.cleanmove();
                            }
                        }
                    }
                    if(opts['forceY'] == undefined){
                        if(j==0){
                            y++;
                            if(y>=B)j=1;
                        }
                        else{
                            y--;
                            if(y<=0)j=0;
                        }
                    }
                }, interval);
            };
            obj.runmove();
        },
        //iframe 自适应高度 宽度，仅使用在iframe页面中
        iframeAutoSize:function(iframeId, opt){
            if(opt == undefined || opt == null){
                opt = {};
            }
            if(opt.w == 1){
                var maxWidth = Math.max(
                    document.documentElement["clientWidth"],
                    document.body["scrollWidth"], document.documentElement["scrollWidth"],
                    document.body["offsetWidth"], document.documentElement["offsetWidth"]
                );
            }
            var maxHeight = Math.max(
                document.documentElement["clientHeight"],
                document.body["scrollHeight"], document.documentElement["scrollHeight"],
                document.body["offsetHeight"], document.documentElement["offsetHeight"]
            );
            var pt = parent;
            switch(opt.pt){
                case 'top':
                    pt = top;
                    break;
            }
            var iframeObj = pt.document.getElementById(iframeId);
            if(iframeObj == null){
                return false;
            }
            if(opt.w == 1){
                iframeObj.style.width = maxWidth +'px';
            }
            iframeObj.style.height = maxHeight +'px';
        }
    });
    
    jQuery.browser={};(function(){jQuery.browser.msie=false; jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){ jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();    

    //依赖jQuery
    jQuery.fn.extend({
        //绑定 select change 事件
        changeEvent:function(callback){
            $(this).bind($.browser.msie? 'propertychange': 'change', callback);
        },
        //给绑定的文本 input type=text 对象赋值初始化的提示语句，并在表单提交时判断是提示语句，就赋予空值，避免提交
        initFieldTxt:function() {
            this.each(function(){
                var $this = $(this);
                //hand off to jQuery.param for proper encoding
                var txt = $this.data('initfieldtxt');
                var isNoEmpty = parseInt($this.data('initfieldnoemptytxt'));
                if($.trim($this.val()).length == 0){
                    $this.val(txt);
                }
                $this.focus(function(){
                    if($this.val() == txt) {
                        $this.val('');
                    }
                }).blur(function(){
                    if($this.val() == '') {
                        $this.val(txt);
                    }
                });
                $this.trigger('blur');
                $this.parents('form').bind('submit', {o:$this, t:txt, isNoEmpty:isNoEmpty}, function(event){
                    (event.data.o.val() == event.data.t) ? (isNoEmpty != 1)? event.data.o.val('') : "" : "" ;
                });
            });
            return this;
        },
        checkFieldTxt:function() {
            var $this = $(this);
            //hand off to jQuery.param for proper encoding
            var txt = $this.data('initfieldtxt');
            if($.trim($this.val()) == txt){
                return '';
            }
            return $this.val();
        },
        //延迟执行函数 - 可以把当前对象this传入到fun中
        delayExec : function (fun, time){
            $.delayExec(fun, time, this);
		},
        //ajax 提交中，改变按钮的状态成loging
        btnLoadingStatus:function(isStart, tips, speed){
            var $this = $(this);
            if(isStart == 'on'){
                if(speed == undefined){
                    speed = 500;
                }
                var i = 0;
                var timer = window.setInterval(function(){
                    switch(i){
                        case 0:
                            $this.val(tips+'   ');
                            i++;
                            break;
                        case 1:
                            $this.val(tips+'.  ');
                            i++;
                            break;
                        case 2:
                            $this.val(tips+'.. ');
                            i++;
                            break;
                        case 3:
                            $this.val(tips+'...');
                            i = 0;
                            break;
                    }
                }, speed);
                $this.data('timer', timer);
            } else {
                var timer = $this.data('timer');
                window.clearInterval(timer);
                timer = null;
                $this.val(tips);
            }
        },
        // 复制链接按钮 $('#copyLinkId').clipboard({inviteLinkId:'inviteLinkId', boxContainerId:'d_clip_container', btnContainerId:'d_clip_button'})
        // btnContainerId 所对应的元素必须 position:relative
        clipboard:function(opts){
            var inviteLinkVal = $.trim($('#'+opts['inviteLinkId']).val());
            var inviteLinkCon = $('#'+opts['inviteLinkId']).data('con');
            if(inviteLinkCon != '' && inviteLinkCon != undefined){
                inviteLinkVal = inviteLinkCon + inviteLinkVal;
            }
            var boxContainer  = opts['boxContainerId'];
            var btnContainer  = opts['btnContainerId'];
            $(this).live('click',function (){
                window.clipboardData.setData('text', inviteLinkVal);
                $.popFun(function () {
                    return "复制成功，利用快捷方式Ctrl+V键粘贴到QQ或微博里。";
                });
            });
            var clip = new ZeroClipboard.Client();
            ZeroClipboard.setMoviePath(staticDomain['LOCAL_SWF']+'ZeroClipboard10.swf');
            clip.setHandCursor(true);
            clip.addEventListener('mouseOver', function (client) {
                clip.setText(inviteLinkVal);
            });
            clip.addEventListener('complete', function (client, text) {
                $.popFun(function () {
                    return "复制成功，利用快捷方式Ctrl+V键粘贴到QQ或微博里。";
                });
            });
            clip.glue(btnContainer, boxContainer);
            //clip.glue('cpBtn');
        },
        //加载图片自动缩放
        LoadImage: function(scaling,width,height,loadpic){
            if(loadpic==null)loadpic="load3.gif";
            return this.each(function(){
                var t=$(this);
                var src=$(this).attr("src");
                var img=new Image();
                img.src=src;
                //自动缩放图片
                var autoScaling=function(){
                    if(scaling){

                        if(img.width>0 && img.height>0){
                            if(img.width/img.height>=width/height){
                                if(img.width>width){
                                    t.width(width);
                                    t.height((img.height*width)/img.width);
                                }else{
                                    t.width(img.width);
                                    t.height(img.height);
                                }
                            }
                            else{
                                if(img.height>height){
                                    t.height(height);
                                    t.width((img.width*height)/img.height);
                                }else{
                                    t.width(img.width);
                                    t.height(img.height);
                                }
                            }
                        }
                    }
                }
                if(img.complete){
                    autoScaling();
                    return;
                }
                $(this).attr("src","");
                var loading=$("<img alt=\"加载中...\" title=\"图片加载中...\" src=\""+loadpic+"\" />");
                t.hide();
                t.after(loading);
                $(img).load(function(){
                    autoScaling();
                    loading.remove();
                    t.attr("src",this.src);
                    t.show();
                });
            });
        },
        /*
         * ticker_effect = 默认是 正反打字
         * ticker_speed  = 打字速度 毫秒
         * ticker_stopspeed = 停留速度 毫秒 [必须是单数]
         * ticker_recoveryspeed = 恢复时间 秒
         * ticker_con    = 打字内容
         * ticker_status = 打字状态 on 可以打字 off 关闭打字
         */
        textTicker : function(conAry){
            var opts  = {};
            var $this = $(this);
            $this.data('ticker_endless_stop', 'off');
            if(conAry == undefined){
                var con = $this.data('ticker_con');
                if(con == undefined || con == null || con == ''){
                    con = $this.data('tips');
                }
                if(con == undefined || con == null || con == ''){
                    con = $this.val();
                }
                conAry = [con];
            }
            opts.x = [0,0];
            opts.p = [0,0]
            opts.l = conAry[0].length;
            opts.timeHandle = [null, null];
            opts.way = 'p';//p | n
            opts.effect = $this.data('ticker_effect');
            var speed  = $this.data('ticker_speed');
            if(speed == undefined){
                speed = 30;
            }
            opts.speed = [speed, speed];
            var recovery_speed  = $this.data('ticker_recoveryspeed');
            if(recovery_speed == undefined){
                recovery_speed = 5;
            }
            opts.recovery_speed = [recovery_speed, recovery_speed];
            var stop_speed  = $this.data('ticker_stopspeed');
            if(stop_speed == undefined){
                stop_speed = 500;
            }
            opts.stop_speed = [stop_speed, stop_speed];
            var tickerInit = function(){
                for(var k in opts){
                    if(typeof opts[k] == 'object'){
                        opts[k][0] = opts[k][1];
                    }
                }
            }
            var postfix = '_';
            var tickerStopEffectFun = function(){
                if(opts.recovery_speed[0] == 0 && $this.data('ticker_endless_stop') == 'off'){
                    opts.recovery_speed[0] = opts.recovery_speed[1];
                    tickerFun();
                    return;
                }
                postfix = (postfix == '＿')? '　':'＿';
                $this.val(conAry[opts.x[0]].substring(0, opts.p[0]) + postfix);
                window.clearInterval(opts.timeHandle);
                opts.timeHandle = window.setInterval(function(){
                    tickerStopEffectFun();
                    if($this.data('ticker_endless_stop') == 'off')opts.recovery_speed[0]-=(opts.stop_speed[0]/1000);
                }, opts.stop_speed[0]);
            }
            var tickerFun = function(){
                switch(opts.effect){
                    default:
                        if(opts.way == 'p'){
                            $this.val(conAry[opts.x[0]].substring(0, opts.p[0]) + "_");
                            if(opts.p[0] == opts.l){
                                opts.way = 'n';
                                tickerStopEffectFun();
                                return;
                            } else {
                                opts.p[0]++;
                            }
                        } else {
                            if(opts.p[0] == 0){
                                opts.way = 'p';
                                if(++opts.x[0] == conAry.length) opts.x[0] = 0;
                                opts.l = conAry[opts.x[0]].length;
                            } else {
                                opts.p[0]--;
                            }
                            $this.val(conAry[opts.x[0]].substring(0, opts.p[0]) + "_");
                        }
                        window.clearInterval(opts.timeHandle);
                        opts.timeHandle = window.setInterval(function(){
                            tickerFun();
                        }, opts.speed[0]);
                        break;
                }
            }
            $this.focus(function(){
                window.clearInterval(opts.timeHandle);
                opts.timeHandle = null;
                if($(this).data('ticker_status') == 'on'){
                    this.value = '';
                }
                this.focus();
            });
            $this.blur(function(){
                if($.trim(this.value).length <= 0){
                    this.value = $(this).data('tips');
                }
                $(this).data('ticker_status', 'off');
            });
            $this.mouseover(function(){
                $this.data('ticker_endless_stop', 'on');
            });
            $this.mouseout(function(){
                $this.data('ticker_endless_stop', 'off');
            });
            tickerFun();
        },
        //监控时时输入[input-text]时，[停顿]间隔多少毫秒后执行callback
        inputEnterRealtime:function(callback, opts){
            if(typeof opts != 'object'){
                opts = {};
            }
            var args = [];
            if(opts['args'] != undefined){
                args = opts['args'];
            }
            var self = this;
            if(opts['speed'] == undefined){
                $(this).unbind('keypress keyup input').bind('keypress keyup input', function(){
                    callback.apply(self[0], args);
                });
            } else {
                var realtimer = null;
                $(this).unbind('keypress keyup input').bind('keypress keyup input', function(){
                    window.clearInterval(realtimer);
                    realtimer = null;
                    realtimer = window.setInterval(function(){
                        window.clearInterval(realtimer);
                        realtimer = null;
                        callback.apply(self[0], args);
                    }, parseInt(opts['speed']));
                });
            }
        },
        //[input-text]默认值 - 设置
        tooltips: function(){
			return this.each(function() {
				var $this = $(this),id = $this.attr("id"),defaultText = null;
				defaultText = $this.attr('rel');
				if(defaultText == undefined){
				    defaultText = $this.val();
				} else {
				    if($.trim($this.val()).length <= 0){
				        $this.val(defaultText);
				    }
				}
				tooltipsDefaultList[id] = defaultText;
				$this.focus(function () {
					if ($this.val() == defaultText) {
						$this.val('');
					}
				});
				$this.blur(function () {
					if ($.trim($this.val()) == '') {
						$this.val(defaultText);
					}
				});

			});
		},
        //获取[input-text]默认值
		getTooltipsText: function(){
		    id = $(this).attr("id");
		    return tooltipsDefaultList[id];
		}
    });
    
    $(function(){//全站A链接href替换
        $(document.body).delegate('a','mouseover', function(){
            var $this = $(this),url = this.href,tmpurl = url.split('/');
            if(tmpurl[tmpurl.length-1] == ''){
                tmpurl.splice(tmpurl.length-1, 1);
            }
            tmpurl = tmpurl.join('/');
            //user
            if(/\/i\/[0-9]+\/?(.*)*$/.test(tmpurl)){// /i/922 i/922/share/45
                $.mid.disp($this, url, tmpurl);
            }
            //skill
            else if(/\/skill\/[0-9]+\/?(.*)*/.test(tmpurl)){// /skill/922
                $.mid.disp($this, url, tmpurl);
            } else if(/\/tshow\/[0-9]+$/.test(tmpurl)){// /tshow/922
                $.mid.disp($this, url, tmpurl);
            } else if(/\/product\/[0-9]+$/.test(tmpurl)){// /tshow/922
                $.mid.disp($this, url, tmpurl);
            }
            //qa
            else if(/\/qa\/q[0-9]+$/.test(tmpurl)){// /skill/922
                $.mid.disp($this, url, tmpurl, 'q');
            } 
            //other
            else {
                var re1 = /userid\/([0-9]+)/i, re2 = /skill\/detail\/id\/([0-9]+)/i, re3 = /qa\/q\/qid\/([0-9]+)/i, re4 = /tshow\/([0-9]+)/i;
                var rs1 = 'userid/', rs2 = 'skill/detail/id/', rs3 = 'qa/q/qid/', rs4 = 'tshow/';
                if(re1.test(url)){
                    var matchs = url.match(re1);
                    this.href = url.replace(re1, rs1 + $.mid.MidToUrl(matchs[1]));
                } else if(re2.test(url)) {
                    var matchs = url.match(re2);
                    this.href = url.replace(re2, rs2 + $.mid.MidToUrl(matchs[1]));
                } else if(re3.test(url)) {
                    var matchs = url.match(re3);
                    this.href = url.replace(re3, rs3 + $.mid.MidToUrl(matchs[1]));
                } else if(re4.test(url)) {
                    var matchs = url.match(re4);
                    this.href = url.replace(re4, rs4 + $.mid.MidToUrl(matchs[1]));
                }
            }
        });
    });

})(window);

//全角转换成半角 , = 65292 ：=65306 '=8216 “=8220 ？=65311 。=12290 ；65307
function CtoH(str, isFilter){
	var result="";
	var filter = {65292:1, 65306:1, 8216:1, 8220:1, 65311:1, 12290:1, 65307:1};
	for (var i = 0; i < str.length; i++){
		if(isFilter != false && filter[str.charCodeAt(i)] == 1){
			result+= String.fromCharCode(str.charCodeAt(i));
		} else {
			if (str.charCodeAt(i)==12288){
				result+= String.fromCharCode(str.charCodeAt(i)-12256);
				continue;
			}
			if (str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375) result+= String.fromCharCode(str.charCodeAt(i)-65248);
			else result+= String.fromCharCode(str.charCodeAt(i));
		}
	}
	return result;
}

//按钮点击统计事件
function menuClick(pageType, refer, isJump, self, logType) {
	try{
		if(refer != undefined && refer != null){
			refer = '?trackParams=' + refer;
		} else {
			refer = '';
		}
		var curl = buildAnalyticsUrl('/a/index',{
			'CurUrlParam':'?trackParams=' + pageType,
			'Referrer':encodeURIComponent(window.location.href + refer)
		});
		if(logType == undefined){
			logType = 'normal';
		}
		$.getScript(curl + '/log_type/'+logType, function(){
			if(isJump === true || isJump === '_self'){
				if(typeof self === 'object'){
					window.location.href = self.href;
				} else {
					window.location.href = self;
				}
			}
		});
		if(isJump === true || isJump === '_self'){
			return false;
		}
		return true;
	} catch (e) {
		return false;
	}
}

function menuClickHits(logType, pageType, refer, isJump, self){
	return menuClick(pageType, refer, isJump, self, logType);
}

function menuClickAd(pageType, refer, isJump, self){
	return menuClick(pageType, refer, isJump, self, 'ad');
}