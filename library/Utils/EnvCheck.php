<?php
/**
 * 环境监测
 *
 * 可通过PHP配置判断环境【线上|线下】
 *
 * @category Utils
 * @package Utils_EnvCheck
 * @author allen <allenifox@163.com>
 */
final class Utils_EnvCheck
{
    /**
     * 是否是线上环境
     *
     * @return boolean true 是 false 不是
     */
    public static function isProduction()
    {
        if(APPLICATION_ENV == 'production'){
            return true;
        }
        return false;
    }

    /**
     * 是否是开发环境
     *
     * @return boolean true 是 false 不是
     */
    public static function isDevelopment()
    {
        if(APPLICATION_ENV == 'development'){
            return true;
        }
        return false;
    }
    
}