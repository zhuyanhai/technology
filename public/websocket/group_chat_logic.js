// 班级聊天业务
(function()
{   
    //  websocket 对象
    var groupChatSocketObj = null;
    
    // 业务逻辑
    var BL = {
        //每次连接成功后 hello
        helloFun : function()
        {
            console.log('向server发送hello:');

            var sendData = {
                'nid'  : 'GROUP_SUBSCRIBE_REQ_PKG',
                'body' : {
                    'user_id' : 922,
                    'group_id': 1
                }
            };
            
            // 向服务端发送消息
            groupChatSocketObj.sendFun('GROUP_SUBSCRIBE_REQ_PKG', sendData);
            
            // 监听接收返回值
            groupChatSocketObj.on('GROUP_SUBSCRIBE_ACK_PKG', function()
            {
                
            });
        }
    };

    $(function()
    {
        $('#tipsId').html('建立连接中...').fadeIn(500);
        groupChatSocketObj = groupChatSocketFactory("ws://192.168.0.189:9002/", function()
        {
            $('#tipsId').html('连接成功').fadeOut(2000);
            
            // 向 server 发起首次通知,获取未读消息数
            BL.helloFun();
        }, function()
        {
            $('#tipsId').html('连接失败').fadeOut(2000);
        });


        //关闭socket
        $('#closeSocketId').on('click', function()
        {
            groupChatSocketObj.closeFun();
        });
    });
})();