module(...,package.seeall)

-- lua 打印 table
function printTab(tab)
    for i,v in pairs(tab) do
        if type(v) == "table" then
            print("table",i,"{")
            printTab(v)
            print("}")
        else
            print(i..' = '..v)
        end
    end
end
 
-- ngx 打印 table
function printTabOfNgx(tab)
    for i,v in pairs(tab) do
        if type(v) == "table" then
            ngx.say("table",i,"{<br/>")
            printTabOfNgx(v)
            ngx.say("}<br/>")
        else
            ngx.say(i..' = '..v..'<br/>')
        end
    end
end

-- ngx 打印 字符串
function echoOfNgx(msg)
    ngx.say(msg..'<br/>');
end

--字符串分割函数
--传入字符串和分隔符，返回分割后的table
function string.split(str, delimiter)
    if str==nil or str=='' or delimiter==nil then
        return nil
    end

    local result = {}
        for match in (str..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match)
    end
    return result
end

--覆盖写文件
function writeFileOfOverlay(filePath, msg)
    local file =io.open(filePath, 'w')
    file:write(msg)
    file:close()
end

--追加写文件
function writeFileOfAppend(filePath, msg)
    local file =io.open(filePath, 'a')
    file:write(msg ..'\n')
    file:close()
end