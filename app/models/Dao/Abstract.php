<?php
/**
 * 抽象类 - 负责把常用的，可以公共提取出来的数据处理逻辑方法写在此类中
 *
 * 例如：获取用户 等的常用方法
 *
 * @author allen <allen@yuorngcorp.com>
 * @package Dao
 */
Abstract class Dao_Abstract
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected static $_tableName = '';
    
    /**
     * 数据库缩略名
     *
     * @var string
     */
	protected static $_dbShortName = '';
    
    /**
     * 数据表主键字段名
     * 
     * @var string
     */
    protected static $_primaryKey = '';
    
    /**
     * 
     */
    public static function createRow($rowData)
    {
        $pdo = static::_getManager();
        print_r($pdo);
    }
    
    /**
     * 获取数据表中单条记录信息
     * 
     * @param string $fieldValue 字段值
     * @param string $fieldKey 字段名，因为获取的单条记录，所以改字段一定是主键或唯一键字段
     * @return mixed <Dao_Abstract, NULL>
     */
    public static function get($fieldValue, $fieldKey = '')
    {
        if (!is_numeric($fieldValue) && empty($fieldValue)) {
            throw new F_Db_Exception('Dao_Abstract::get 方法中参数 $fieldValue 值不能为空');
        }
        
        if (empty($fieldKey)) {//未传值，主动使用主键
            $fieldKey = static::$_primaryKey;
        }
        
        $isUseCache = false;//是否使用cache
        $result = null;
        
        if (self::_checkIsUseCacheOfKv($fieldKey)) {//是否缓存做以下逻辑
            $isUseCache = true;
            //todo
        }
        
        if (empty($result)) {//缓存中没有，从数据库中获取
            
        }
    }
    
    
    /**
     * 检测是否使用缓存
     * 
     * @return boolean true 使用缓存 false 不使用缓存
     */
    private static function _checkIsUseCache()
    {
        if (!empty(static::$_memcache) && is_array(static::$_memcache)) {
            return true;
        }
        return false;
    }
    
    /**
     * 检测是否使用缓存 - kv
     * 
     * @return boolean true 使用缓存 false 不使用缓存
     */
    private static function _checkIsUseCacheOfKv($flag)
    {
        if (self::_checkIsUseCache()) {
            if (!isset(static::$_memcach[$flag])) {
                return false;
            }
            if(!isset(static::$_memcach[$flag]['key'])){
                throw new Zend_Cache_Exception(static::$_tableName.' - kv key not set');
            }
            if(!isset(static::$_memcach[$flag]['field'])){
                throw new Zend_Cache_Exception(static::$_tableName.' - kv field not set');
            }
            if(!isset(static::$_memcach[$flag]['server'])){
                throw new Zend_Cache_Exception(static::$_tableName.' - kv server not set');
            }
            return true;
        }
        return false;
    }
    
    /**
     * 获取数据库操作对象
     * 
     * @staticvar null $pdo
     * @return YR_Db_Pdo
     */
    public static function _getManager()
    {
        static $pdo = null;
        if (is_null($pdo)) {
            $pdo = F_Db_Pdo::getInstance(array(
                'dbShortName' => static::$_dbShortName,
            ));
        }
        return $pdo;
    }
    
}