<?php
/**
 * config 工具类
 * 
 */
class Utils_Config
{
    private static $_lastConfig = array();
    
    /**
     * 获取其他配置
     * 
     * @param string $filename 配置文件的路径 /configs/db.cfg.php
	 * @param string $sectionName 
     * @return mixed
     */
    public static function get($filename, $sectionName = '')
    {
        $filename = APPLICATION_PATH . $filename;
        if (file_exists($filename)) {
            throw new F_Exception("Utils_Config::get 文件 {$filename} 找不到");
        }
        
        $configs = include $filename;
        
        self::set($name, $value, $expire, $mode, $domain, true);
    }
    
}