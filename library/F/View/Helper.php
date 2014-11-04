<?php
/**
 * view 层助手
 * 
 * @category F
 * @package F_View
 * @subpackage F_View_Helper
 * @author allen <allenifox@163.com>
 * 
 * @method F_View_Helper_HeadLink headLink() 页面中使用 link 标签加载 css
 */
final class F_View_Helper
{
    /**
     * 单例实例
     * 
     * @var F_Application 
     */
    private static $_instance = null;
    
    private function __construct()
    {
        //empty
    }

    /**
     * 单例模式
     *
     * @return Fz_View_Helper
     */
    public static function getInstance()
    {
        if(is_null(self::$_instance)){
           self::$_instance = new Fz_View_Helper();
        }
        return self::$_instance;
    }

    /**
     * 魔术方法 - 调用 view 层 助手
     * 
     * @param string $name
     * @param array $arguments
     */
    public function __call($name, $arguments)
    {
        static $helpers = array();

        $class = 'F_View_Helper_' . ucfirst($name);
        if(!isset($helpers[$class])){
            $helpers[$class] = new $class();
        }

        if(!method_exists($helpers[$class], $name)){
            throw new Fz_Exception('view helper “'.$class.'” method “'.$name.'” not found');
        }

        return call_user_func_array(array($helpers[$class], $name), $arguments);
    }

}