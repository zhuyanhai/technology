// vline 业务协议类
(function()
{
    var vline = {
        // 协议名字: 对应服务端的协议文件名字
        'name' : 'vline',
        // 协议中消息类名字转换
        'enumList' : {
            'GROUP_SUBSCRIBE_REQ_PKG'    : 1,
            'GROUP_SUBSCRIBE_ACK_PKG'    : 2,
            'EVENT_NOTIFICATION_REQ_PKG' : 7,
            'EVENT_NOTIFICATION_ACK_PKG' : 8,
            'HEARTBEAT_REQ_PKG'          : 15,
            'HEARTBEAT_ACK_PKG'          : 16
        },
        // 协议中的辅助消息返回值的类
        messageDataClass : {
            'UNREAD_MESSAGE' : {
                'session_id' : {
                    'paramType' : 'required',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'group_id' : {
                    'paramType' : 'required',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'unread_message_num' : {
                    'paramType' : 'required',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'data' : {
                    'paramType' : 'required',
                    'valType'   : 'string',
                    'val'       : null
                }
            }
        },
        // 协议中的消息类列表
        messageClass : {
            'GROUP_SUBSCRIBE_REQ_PKG' : {//每次连接（正常连接、断开重连）成功后，都会主动向server发送hello
                'user_id' : {
                    'paramType' : 'required',
                    'valType'   : 'uint32',//new Uint32Array([1])
                    'val'       : null
                },
                'group_id' : {
                    'paramType' : 'required',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'version' : {
                    'paramType' : 'optional',
                    'valType'   : 'string',
                    'val'       : null,
                    'defaultVal': ''
                }
            },
            'GROUP_SUBSCRIBE_ACK_PKG' : {//接收向server发送hello
                'error_code' : {
                    'paramType' : 'required',
                    'valType'   : 'sint32',//new Int32Array([-1])
                    'val'       : null
                },
                'unread_message_num' : {
                    'paramType' : 'optional',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'server_time' : {
                    'paramType' : 'optional',
                    'valType'   : 'uint32',
                    'val'       : null
                },
                'unread_message' : {
                    'paramType' : 'repeated',
                    'valType'   : 'UNREAD_MESSAGE',
                    'val'       : null
                }
            }

//                        heartbeat : {//每次连接（正常连接、断开重连）成功后，每隔30秒检测一次，检测3次后无果就断开重连
//                            'REQ': null,
//                            'ACK': null,
//                            'REQ_NAME' : 'HEARTBEAT_REQ',
//                            'ACK_NAME' : 'HEARTBEAT_ACK'
//                        },
//                        messageBody : {//每次连接（正常连接、断开重连）成功后，消息发布 js=>server 与 接收 server=>js
//                            'REQ': null,
//                            'ACK': null,
//                            'REQ_NAME' : 'EVENT_NOTIFICATION_REQ',
//                            'ACK_NAME' : 'EVENT_NOTIFICATION_ACK'
//                        }
        }
    };
    
    window.wsProtoOfVline = vline;
})();
