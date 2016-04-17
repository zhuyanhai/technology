local p = string.find(ngx.var.uri, 'favicon.ico')

if p ~= nil then
    return
end


-- 加载实用工具
local utility = require('realtime_printscreen/utility')


--utility.echoOfNgx(ngx.var.uri)


-- 加载配置文件
local baseConfig  = require 'realtime_printscreen/config_base'

-- 请求的URI
local uri = ngx.var.uri

-- 分割URI
local uriTable = utility.string.split(uri, '/');

--[[
utility.echoOfNgx(type(uriTable));
utility.printTabOfNgx(uriTable);
utility.echoOfNgx(uriTable[2]);
]]

-- 加载指定模块配置 app_renyuxian
local moduleConfig = require('realtime_printscreen/config_' .. uriTable[2])

utility.printTabOfNgx(moduleConfig.cfg);
