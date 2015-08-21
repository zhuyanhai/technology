<?php
/**
 * http 工具类
 * 
 * @package Utils
 */
final class Utils_Http
{
    /**
     * 获得客户端系统信息:操作系统、浏览器等
     *
     * @return string
     */
    public static function getClientSys()
    {
       return @$_SERVER['HTTP_USER_AGENT'];
    }

    /**
     * 获得客户端访问IP地址
     *
     * @return string
     */
    public static function getClientIp()
    {
	    if (getenv('HTTP_CLIENT_IP')) {
            $ip = getenv('HTTP_CLIENT_IP');
        } else if (getenv('HTTP_X_FORWARDED_FOR')) {
            $ip = getenv('HTTP_X_FORWARDED_FOR');
        } else if (getenv('REMOTE_ADDR')) {
            $ip = getenv('REMOTE_ADDR');
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
    
    /**
     * 输出页面编码，在没有layout的情况下
     *
     * @param string $encoding 编码值
     */
    public static function outHeaderEncoding($encoding = 'utf-8')
    {
        header('Content-type:text/html; charset='.$encoding);
    }
}