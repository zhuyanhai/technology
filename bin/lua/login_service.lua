local secretKey = '123456';

if ngx.var.cookie_uid == nil or ng.var.cookie_realname == nil or ngx.var.cookie_token == nil then
    ngx.req.set_header("Check-Login", "NULL");
    return
end

local ctoken = ngx.md5('uid:' .. ngx.var.cookie_uid .. '&realname:' .. ngx.var.cookie_realname .. '&secretKey:' .. secretKey)


if ctoken == ngx.var.cookie_token then
    ngx.req.set_header("Check-Login", 'YES');
else
    ngx.req.set_header("Check-Login", 'NO');
end

return
