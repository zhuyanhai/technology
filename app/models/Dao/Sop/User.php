<?php
/**
 * tbl_user 数据表类
 * 
 * 用户信息 － 基本信息
 * 
 * @package Dao
 * @subpackage Dao_Sop
 * @author allen <allenifox@163.com>
 */
class Dao_Sop_User extends Dao_Abstract
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected static $_tableName = 'tbl_user';
    
    /**
     * 数据库缩略名
     *
     * @var string
     */
	protected static $_dbShortName = 'sop';
    
    /**
     * 数据表主键字段名
     * 
     * @var string
     */
    protected static $_primaryKey = 'userid';
    
    /**
     * 将数据表中的数据放入缓存，为网站加速，缓存方式有多种，请参考如下：
     * 
     * kv：key-value 形式缓存整个数据表中单行数据
     * count：缓存数据表的各种统计，例如分页记录，或是某条件记录行数
     *     pageTotal 根据条件统计分页总数
     *
     * - server  参考 memcache.cfg.php
     * - key     格式说明：db_{表名}_{版本号【便于以后手动改代码刷新缓存，新增字段后上线来不及写脚本刷新时使用，非不得已不要用，影响效率】}_{主键或指定类似主键的唯一字段}
     * - expires 过期时间，参考 memcache.cfg.php -> lifetime 时间为秒，null 是永不过期
     * - field   缓存key中要拼装的字段名
     * - keyEncrypt 缓存key的加密方式，不指定就不加密
     * - savefield  memcache 中存储需要明确知道的字段，无或空代表整行数据
     *
     * @var array
     */
    protected static $_memcache = array(
        'kv' => array(
            'userid' => array(
                'server'  => 'user',
                'key'     => 'db_tbl_user_1_%d',
                'field'   => 'userid',
                'expires' => null,
            ),
        ),
        'count' => array(
            'pageTotal' => 'all',
        ),
    );

}