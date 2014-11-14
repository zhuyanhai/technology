<?php
/**
 * PDO 封装类
 */
final class F_Db_Pdo
{
    /**
     * 数据库连接配置
     * 
     * @var array 
     */
    private $_dsnConfigs = array();
    
    /**
     * 当前要用到的数据库连接配置
     * 
     * @var array 
     */
    private $_dsn = array();
    
    /**
     * 当前数据库的链接句柄
     * 
     * @var PDO
     */
    private $_dbHandel = null;
    
    /**
     * 当前数据库的stmt句柄
     * 
     * @var PDOStatement
     */
    private $_stmtHandel = null;
    
    /**
     * 获取PDO实例
     * 
     * @staticvar array $instances
     * @param array $options
     * @return \YR_Db_Pdo
     */
    public static function getInstance($options)
    {
        static $instances = array();

        if (!isset($options['dbShortName'])) {
            throw new F_Db_Exception('数据表中 $options 配置错误');
        }
        
        if (empty(F_Db_PdoConnectPool::$dbDsn)) {//配置初始加载
            F_Db_PdoConnectPool::bulidDbConfig();
        }
        print_r(F_Db_PdoConnectPool::$dbDsn[$options['dbShortName']]);exit;
        if (isset(F_Db_PdoConnectPool::$dbDsn[$options['dbShortName']])) {//每个库使用到的dsn
            $dsn = 'mysql:host='.F_Db_PdoConnectPool::$dbDsn[$options['dbShortName']]['host'].';port='.F_Db_PdoConnectPool::$dbDsn[$options['dbShortName']]['port'];
        } else {
            throw new F_Db_Exception(__METHOD__ . ' adapter 不存在');
        }
        
        if (!isset($instances[$dsn])) {
            $instances[$dsn] = new F_Db_Pdo(F_Db_PdoConnectPool::$dbDsn[$options['dbShortName']]);
        }
        
        return $instances[$dsn];
    }
    
    /**
     * 构造函数
     * 
     * @param array $options
     * @throws Zend_Db_Adapter_Exception
     */
    public function __construct($dsnConfigs)
    {
        $this->_dsnConfigs = $dsnConfigs;
    }
    
    /**
     * 析构函数
     */
    public function __destruct()
    {
        $this->_dbHandel   = null;
        $this->_stmtHandel = null;
    }
    
    /**
     * 主动关闭数据库连接
     * 
     * @return \YR_Db_Mysqli
     */
    public function close()
    {
        $this->_dbHandel   = null;
        $this->_stmtHandel = null;
        return $this;
    }
    
    /**
     * 主动切换使用的【主】数据库连接
     * 
     * @return \YR_Db_Mysqli
     */
    public function changeMaster()
    {
        $this->_dsn = $this->_dsnConfigs['master'];
        $this->_dbHandel   = null;
        $this->_stmtHandel = null;
        return $this;
    }
    
    /**
     * 主动切换使用的【从】数据库连接
     * 
     * @return \YR_Db_Mysqli
     */
    public function changeSlave()
    {
        $this->_dsn = $this->_dsnConfigs['slave'][0];
        $this->_dbHandel   = null;
        $this->_stmtHandel = null;
        return $this;
    }
    
   /**
	* prepare 预处理sql
    * 
	* @param string $sql
	**/
    public function prepare($sql)
    {
    	$this->_connect();
        try {
            $this->_stmtHandel = $this->_dbHandel->prepare($sql);
            if (!$this->_stmtHandel) {
                throw new PDOException('Pdo prepare error');
            }
        } catch (PDOException $e) {
            throw new PDOException('Pdo prepare error: '.$e->getMessage());
        }
    	return $this; 
    }
    
    /**
     * 绑定参数
     * 
     * @param string $parameter
     * @param mixed $variable
     * @return \YR_Db_Pdo
     */
    public function bindParam($parameter , $variable = null)
    {
        $this->_stmtHandel->bindParam($parameter, $variable);
        return $this;
    }
    
    /**
     * 获取单行记录
     * 
     * @return mixed
     * @throws Zend_Db_Exception
     */
    public function fetchRow()
    {
        if (!$this->_stmtHandel->execute()) {
            $error = $this->_stmtHandel->errorInfo();
            throw new F_Db_Exception('execute failed : '.$error[1].' '.$error[2]);
        }
        return $this->_stmtHandel->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * 获取多行记录
     * 
     * @return array
     * @throws Zend_Db_Exception
     */
    public function fetchAll()
    {
        if (!$this->_stmtHandel->execute()) {
            $error = $this->_stmtHandel->errorInfo();
            print_r($error); 
            throw new F_Db_Exception('execute failed : '.$error[1].' '.$error[2]);
        }
        return $this->_stmtHandel->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * 连接数据库
     */
    private function _connect()
    {
        if (is_null($this->_dbHandel)) {
            if (empty($this->_dsn)) {//默认连接从库
                $this->changeSlave();
            }
            $this->_dbHandel = F_Db_PdoConnectPool::get($this->_dsn);
        }
    }
}