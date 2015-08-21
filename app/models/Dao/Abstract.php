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
     * 数据表-行数据 格式化方法
     * 
     * @param array $data
     * @return array
     */
    public static function format($data)
    {
        if (!is_array($data)) {//注意，请传入正确的值
             return $data;
        }
        $isMulti = true;
        if (!isset($data[0]) && !is_array($data[0])) {
            $isMulti = false;
            $data = array(0 => $data);
        }
        $returnData = array();
        $calledClassName = get_called_class();
        foreach ($data as $k=>$v) {
            $returnData[$k] = array();
            foreach ($v as $field => $val) {
                $returnData[$k][$field] = $val; 
                
                $isMethod   = '_is_' . $field;
                $getMethod  = '_get_' . $field;
                $showMethod = '_show_' . $field;
                if (method_exists($calledClassName, $isMethod)) {
                    $returnData[$k]["{$field}_OF_Is"] = static::$isMethod($val);
                }
                if (method_exists($calledClassName, $getMethod)) {
                    $returnData[$k]["{$field}_OF_Get"] = static::$getMethod($val);
                }
                if (method_exists($calledClassName, $showMethod)) {
                    $returnData[$k]["{$field}_OF_Show"] = static::$showMethod($val);
                }
            }
        }
        return ($isMulti)?$returnData:$returnData[0];
    }

    /**
     * 插入行记录
     * 
     * @param array $rowData 插入行的内容
     * @return string 返回插入成功后的主键值
     */
    public static function insert($rowData)
    {
        $pdo = static::_getManager()->changeMaster();
        static::_insert($rowData);
        $rowData[static::$_primaryKey] = $pdo->insert($rowData, F_Db_PdoConnectPool::getDbName(static::$_dbShortName) . '.' . static::$_tableName);
        static::_postInsert($rowData);
        return $rowData[static::$_primaryKey];
    }
    
    /**
     * 更新行记录
     * 
     * @param array $rowData 更新行的内容
     * @param string $whereCondition 更新条件
     * @param array $whereBind 更新条件绑定数据
     * @return $rowCount 影响行数
     */
    public static function update($rowData, $whereCondition, $whereBind)
    {
        $pdo = static::_getManager()->changeMaster();
        static::_update($rowData, $whereBind);
        $rowCount = $pdo->update($rowData, $whereCondition, $whereBind, F_Db_PdoConnectPool::getDbName(static::$_dbShortName) . '.' . static::$_tableName);
        static::_postUpdate($rowData, $whereBind);
        return $rowCount;
    }
    
    /**
     * 删除行记录
     * 
     * @param string $whereCondition 更新条件
     * @param array $whereBind 更新条件绑定数据
     * @return $rowCount 影响行数
     */
    public static function delete($whereCondition, $whereBind)
    {
        //todo
    }
    
    /**
     * 查询【单行】记录 - 根据条件
     * 
     * @param string $whereCondition sql语句中的where条件字符串
     * @param array $whereBind where条件中需要绑定的变量值
     * @param string $fields 需要查询的字段字符串
     * @return mixed
     */
    public static function fetchRowFromSlave($whereCondition, $whereBind, $fields = '*')
    {
        $pdo = static::_getManager()->changeSlave();
        return self::_find($pdo, $whereCondition, $whereBind, $fields, 'fetchRow');
    }
    
    /**
     * 查询【单行】记录 - 根据条件
     * 
     * @param string $whereCondition sql语句中的where条件字符串
     * @param array $whereBind where条件中需要绑定的变量值
     * @param string $fields 需要查询的字段字符串
     * @return mixed
     */
    public static function fetchRowFromMaster($whereCondition, $whereBind, $fields = '*')
    {
        $pdo = static::_getManager()->changeMaster();
        return self::_find($pdo, $whereCondition, $whereBind, $fields, 'fetchRow');
    }
    
    /**
     * 查询【多行】记录 - 根据条件
     * 
     * @param string $whereCondition sql语句中的where条件字符串
     * @param array $whereBind where条件中需要绑定的变量值
     * @param string $fields 需要查询的字段字符串
     * @return mixed
     */
    public static function fetchAllFromSlave($whereCondition, $whereBind, $fields = '*')
    {
        $pdo = static::_getManager()->changeSlave();
        return self::_find($pdo, $whereCondition, $whereBind, $fields, 'fetchAll');
    }
    
    /**
     * 查询【多行】记录 - 根据条件
     * 
     * @param string $whereCondition sql语句中的where条件字符串
     * @param array $whereBind where条件中需要绑定的变量值
     * @param string $fields 需要查询的字段字符串
     * @return mixed
     */
    public static function fetchAllFromMaster($whereCondition, $whereBind, $fields = '*')
    {
        $pdo = static::_getManager()->changeMaster();
        return self::_find($pdo, $whereCondition, $whereBind, $fields, 'fetchAll');
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
            $pdo = static::_getManager()->changeMaster();
            $whereCondition = "{$fieldKey}=:{$fieldKey}";
            $whereBind = array($fieldKey => $fieldValue);
            $result = self::_find($pdo, $whereCondition, $whereBind, '*', 'fetchRow');
        }
        
        return $result;
    }
 
//---- 以下为私有方法
    
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
     * @return F_Db_Pdo
     */
    private static function _getManager()
    {
        static $pdo = null;
        if (is_null($pdo)) {
            $pdo = F_Db_Pdo::getInstance(array(
                'dbShortName' => static::$_dbShortName,
            ));
        }
        return $pdo;
    }
    
    /**
     * 查询(单行或多行)记录 - 根据条件
     * 
     * 私有方法
     * 服务于 fetchRowFromSlave、fetchRowFromMaster、 fetchAllFromSlave、fetchAllFromMaster 方法
     * 
     * @param F_Db_Pdo $pdo
     * @param string $whereCondition sql语句中的where条件字符串
     * @param array $whereBind where条件中需要绑定的变量值
     * @param string $fields 需要查询的字段字符串
     * @param string $fetchMethod 查询使用手段 fetchRow 或 fetchAll
     * @return mixed
     */
    private static function _find(&$pdo, $whereCondition, $whereBind, $fields, $fetchMethod)
    {
        $dbName    = F_Db_PdoConnectPool::getDbName(static::$_dbShortName);
        $tableName = static::$_tableName;
        $sql = "SELECT {$fields} FROM {$dbName}.{$tableName} WHERE {$whereCondition}";
        $pdo->prepare($sql);
        foreach ($whereBind as $wk => $wv) {
            $wkParam = ':'.$wk;
            if (!preg_match('%'.$wkParam.'%', $whereCondition)) {
                throw new PDOException('Pdo update where bindParam ['.$wkParam.'] not exist');
            }
            $pdo->bindParam($wkParam, $wv, PDO::PARAM_STR);
        }
        if ('fetchRow' === $fetchMethod) {
            return $pdo->fetchRow();
        } else {
            return $pdo->fetchAll();
        }
    }
    
//----- 以下是 hook 方法，可在子类中使用，使用时必须调用相关的父类方法，例如： parent::_insert($rowData);
    
    /**
     * insert 前
     * 
     * @param array $rowData 行记录
     */
    protected static function _insert(&$rowData)
    {
        //todo
    }
    
    /**
     * insert 后
     * 
     * @param array $rowData 行记录
     */
    protected static function _postInsert(&$rowData)
    {
        //todo
    }
    
    /**
     * update 前
     * 
     * @param array $rowData 行记录
     * @param array $whereBind where条件绑定数据
     */
    protected static function _update(&$rowData, $whereBind)
    {
        //todo
    }
    
    /**
     * update 后
     * 
     * @param array $rowData 行记录
     * @param array $whereBind where条件绑定数据
     */
    protected static function _postUpdate(&$rowData, $whereBind)
    {
        //todo
    }
    
    /**
     * delete 前
     * 
     * @param array $whereBind where条件绑定数据
     */
    protected static function _delete($whereBind)
    {
        //todo
    }
    
    /**
     * delete 后
     * 
     * @param array $whereBind where条件绑定数据
     */
    protected static function _postDelete($whereBind)
    {
        //todo
    }
    
}