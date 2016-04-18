module(...,package.seeall)

--[[
	enabled_log：			是否打开日志
	lua_log_level：			日志记录级别
	gm_path：				graphicsmagick安装目录
	img_background_color：	填充背景色
	enabled_default_img：	是否显示默认图片
	default_img_uri：		默认图片链接	
	default_uri_reg：		缩略图正则匹配模式，可自定义
		_[0-9]+x[0-9]						对应：001_100x100.jpg
		_[0-9]+x[0-9]+[.jpg|.png|.gif]+ 	对应：001.jpg_100x100.jpg
]]

enabled_log          = true
lua_log_level        = ngx.NOTICE
gm_path	             = '/usr/local/graphicsmagick-1.3.18/bin/gm'
img_background_color = 'white'
enabled_default_img  = true
default_img_uri 	 = '/default/notfound.jpg' 
default_uri_reg      = '_[0-9]+x[0-9]+' 
