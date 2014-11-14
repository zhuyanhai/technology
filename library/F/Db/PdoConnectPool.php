<?php
/**
 * PDO 连接池封装类
 */
final class F_Db_PdoConnectPool
{
    /**
     * 数据库连接需要用到的配置
     * 
     * @var array 
     */
    public static $dbDsn = array();
    
    /**
     * 创建PDO链接对象
     */
    public static function get($connectConfig)
    {
        static $dbHandelPool = array();

        if (!isset($connectConfig['host']) || !isset($connectConfig['port']) || !isset($connectConfig['username']) || !isset($connectConfig['password']) || !isset($connectConfig['charset'])) {
            throw new F_Db_Exception('Connection failed: params error');
        }
        $dsn = 'mysql:host='.$connectConfig['host'].';port='.$connectConfig['port'];
        if (!isset($dbHandelPool[$dsn])) {
            try {
                $dbHandelPool[$dsn] = new PDO($dsn, $connectConfig['username'], $connectConfig['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \''.$connectConfig['charset'].'\''));
            } catch (PDOException $e) {
                throw new F_Db_Exception('Connection failed: '.$e->getMessage());
            }
        }
        return $dbHandelPool[$dsn];
    }
    
    /**
     * 第一次访问数据库时，初始bulid数据库连接需要的配置
     */
    public static function bulidDbConfig()
    {   
        if (empty(self::$dbDsn)) {//配置初始加载
            $env = 'production';
            if(defined('APPLICATION_ENV')){
                $env = APPLICATION_ENV;
            }
            $dbConfigs = F_Application::getInstance()->getConfigs();
            $defaultParams = array();
            if(isset($dbConfigs['default'])){
                $defaultParams = $dbConfigs['default'];
                unset($dbConfigs['default']);
            }
            foreach ($dbConfigs as $id => $dbCfg) {
                self::$dbDsn[$id]['dbName'] = $dbCfg['dbname'];
                if (isset($dbCfg['params'])) {
                    $params = array_merge($defaultParams['params'], $dbCfg['params']);
                } else {
                    $params = $defaultParams['params'];
                }
                if (isset($params['slave'])) {
                    $slave = $params['slave'];
                    unset($params['slave']);
                    self::$dbDsn[$id]['slave'] = array_merge($params, $slave);
                    unset($slave);
                } else {
                    self::$dbDsn[$id]['slave'] = array($params);
                }
                self::$dbDsn[$id]['master'] = $params;
                unset($params);
            } 
            unset($dbConfigs, $defaultParams);
        }
    }
    
    /**
     * 获取数据库全名
     */
    public static function getDbName($dbShortName)
    {
        if (empty(self::$dbDsn)) {
            self::bulidDbConfig();
        }
        if (!isset(self::$dbDsn[$dbShortName])) {
            throw new F_Db_Exception(__METHOD__.' $dbShortName 不存在');
        }
        return self::$dbDsn[$dbShortName]['dbName'];
    }
}