-- 秘钥校验
require 'md5';
local publickey = '`2dn8#%|2012--+{kec}p"sc$% .';
local sublen = string.sub(ngx.var.uptime,-1,-1)+string.sub(ngx.var.uptime,-2,-2)+1;
local fi,fj = string.find(ngx.var.request_filepath, "([0-9a-zA-Z_]+%.[a-z]+)");
local filename = string.sub(ngx.var.request_filepath, fi, fj);
local key = md5.sumhexa(filename..'?'..ngx.var.uptime);
key = md5.sumhexa(publickey..key);
key = string.sub(key,sublen,sublen+9);
if ngx.var.secretkey ~= key then
    ngx.log(ngx.ERR, '秘钥校验:' .. ngx.var.secretkey ..'='.. key .. '=' .. md5.sumhexa(publickey..key));
    ngx.exit(ngx.HTTP_FORBIDDEN);
end

-- 文件检测
local file,err = io.open(ngx.var.request_filepath);
if file == nil then
    ngx.log(ngx.ERR, '文件检测');
    ngx.exit(ngx.HTTP_FORBIDDEN);
end
file:close();

-- 构造命令
local command = "/usr/local/graphicsmagick/bin/gm convert " .. ngx.var.request_filepath .. " -thumbnail '" .. ngx.var.width .. "x" .. ngx.var.height .. "^' -gravity center -extent ".. ngx.var.width .. "x" .. ngx.var.height .." +profile \"*\" " .. ngx.var.request_filepath .. "_".. ngx.var.secretkey .. '_' .. ngx.var.uptime .. '_' .. ngx.var.width .. "x" .. ngx.var.height .. "." .. ngx.var.ext;

-- 执行截图命令
os.execute(command);

-- 返回uri
ngx.exec(ngx.var.request_uri);
