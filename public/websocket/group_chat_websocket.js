// 班级聊天类
(function()
{
    var globalSocketObj = window.WebSocket || window.MozWebSocket;
    
    var isSupportWebSocket = false;
    if (globalSocketObj){
        isSupportWebSocket = true;
        console.log("这个浏览器支持 WebSocket!");
    } else {
        console.log("这个浏览器不支持 WebSocket.");
    }

    if (false === isSupportWebSocket) {
        return false;
    }

    var globalSocketObj = window.WebSocket || window.MozWebSocket;
    
    // 检测值的数据类型
    var checkValType = function(type, val)
    {
        var tmpVal = null;
        switch (type) {
            case 'uint32':
                tmpVal = new Uint32Array([val]);
                return tmpVal[0];
                break;
            case 'sint32':
                tmpVal = new Int32Array([val]);
                return tmpVal[0];
                break;
            case 'string':
                return val+'';
                break;
        }
        return val;
    };

    var buildMessageData = function(obj, data)
    {
        for (var k in obj) {
            switch (obj[k].paramType) {
                case 'required':
                    if (data[k] === undefined) {
                        throw "key not found";
                    }
                    data[k] = checkValType(obj[k].valType, data[k]);
                    break;
                case 'optional':
                    if (data[k] === undefined) {
                        if (obj[k].defaultVal === undefined) {
                            throw "key not found and default val undefined";
                        }
                        data[k] = checkValType(obj[k].valType, obj[k].defaultVal);
                    } else {
                        data[k] = checkValType(obj[k].valType, data[k]);
                    }

                    break;
                case 'repeated':

                    break;
            }
        }
        return data;
    };
    
    // 包装要发送的数据
    var pack = function(self, nid, sendData)
    {
        if (self.protocolObj.messageClass[nid] === undefined) {
            throw "nid["+nid+"] not found";
        }
        sendData['body'] = buildMessageData(self.protocolObj.messageClass[nid], sendData['body']);
        console.log(sendData);
        return JSON.stringify(sendData);
    };

    // 解包接收到的数据
    var unpack = function(data)
    {
        console.log(data);
        
        return data;
    };

    /**
     * 自定义的 班级聊天 socket类
     * 
     * @param string url 连接websocket地址 例如: ws://192.168.0.189:9002
     * @param object openCallback 连接成功后的回调通知方法
     * @param object closeCallback 断开连接后的回调通知方法
     * @returns {group_chat_websocket_L2.groupChatSocket}
     */
    function groupChatSocket(url, openCallback, closeCallback)
    {
        // 连接的字符串 例如: ws://192.168.1.193:9002/
        this.url = url;
        // 是否连接上
        this.isConnect = 0;
        // socket 对象
        this.socketObj = null;
        // protocol 指定协议对象
        this.protocolObj = wsProtoOfVline;
        // 连接成功后的回调通知方法
        this.openCallback = openCallback;
        // 断开连接后的回调通知方法
        this.closeCallback = closeCallback;
        // 监听的事件列表
        this.onList = {};

        var self = this;

        // 关闭连接的方法
        this.closeFun = function()
        {
            console.log('开始关闭连接 socket:');
            this.socketObj.close();
        };

        /**
         * 发送消息给服务队
         * 
         * @param string reqNid 发送消息对应的enumList的key
         * @param object refMsg 需要发送的消息 json
         * @returns void
         */
        this.sendFun = function(reqNid, reqMsg)
        {
            if (this.isConnect === 1) {
                var sendMsg = pack(this, reqNid, reqMsg);
                this.socketObj.send(sendMsg);
            } else {
                console.log('已关闭了 socket');
            }
        };
        
        this.on = function(eventName, callback)
        {
            if (this.onList[eventName] === undefined) {
                this.onList[eventName] = callback;
            }
        };
        
        // 开始初始化 websocket
        var init = function()
        {
            console.log('开始连接 socket:'+self.url);

            self.socketObj = new globalSocketObj(self.url);
            //this.socketObj.binaryType = "blob";
            //self.socketObj.binaryType = "arraybuffer";

            self.socketObj.onopen = function(e)
            {
                console.log('已连接上 socket:', e);
                self.isConnect = 1;
                openCallback.apply(self,[e]);
            };

            self.socketObj.onerror = function(e)
            {
                console.log('连接错误 ', e);
            };

            self.socketObj.onmessage = function(e)
            {
                console.log('接收到socket的推送信息: ', e.data);
                var formatData = unpack(e.data);
                
            };

            self.socketObj.onclose = function(e)
            {
                console.log('已关闭了 socket:', e);
                self.isConnect = 0;
                closeCallback.apply(self,[e]);
            };
        };
        
        init();
    }
    
    // 班级聊天类对象生产工厂
    window.groupChatSocketFactory = function(url, openCallback, closeCallback)
    {
        return new groupChatSocket(url, openCallback, closeCallback);
    };

})();