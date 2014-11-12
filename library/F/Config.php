<?php
/**
 * 框架应用程序获取配置类
 * 
 * @category F
 * @package F_Config
 * @author allen <allenifox@163.com>
 */
final class F_Config
{
    
    public static function get($filename, $sectionName = '')
    {
        //初始化全局配置
        $this->_configs = include APPLICATION_PATH . '/configs/application.cfg.php';
    }
}