<?php
/**
 * 检测请求的工具类
 * 
 * - 检测请求是否来至PC端
 * - 检测请求是否来至移动端
 * - 检测请求是否来至平板
 */
class Utils_CheckRequest
{
    /**
     * 请求是否来至PC
     * 
     * return boolean true是 false否
     */
    public static function isFromPc()
    {
        $tMobileDetectObj = T_MobileDetect::getInstance();
        return (!$tMobileDetectObj->isMobile() && !$tMobileDetectObj->isTablet())? true:false;
    }
    
    /**
     * 请求是否来至移动端
     * 
     * return boolean true是 false否
     */
    public static function isFromMobile()
    {
        return (T_MobileDetect::getInstance())? true:false;
    }
    
    /**
     * 请求是否来至平板电脑
     * 
     * return boolean true是 false否
     */
    public static function isFromTablet()
    {
        return (T_MobileDetect::getInstance()->isTablet())? true:false;
    }
}