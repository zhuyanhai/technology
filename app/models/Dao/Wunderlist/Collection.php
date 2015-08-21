<?php
/**
 * 任务集合 - 数据表
 *
 * 定义任务的集合名称，例如：工作、utanjia等
 * 
 * @package Dao
 * @subpackage Dao_Wunderlist
 * @author allen <allen@yuorngcorp.com>
 */
class Dao_Wunderlist_Collection extends Dao_Abstract
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected static $_tableName = 'tbl_collection';
    
    /**
     * 数据库缩略名
     *
     * @var string
     */
	protected static $_dbShortName = 'wunderlist';
    
    /**
     * 数据表主键字段名
     * 
     * @var string
     */
    protected static $_primaryKey = 'id';
    
    /**
     * type 字段
     */
    protected static function _show_type($val)
    {
        if ($val === 'task') {
            return '任务';
        } else {
            return '分组';
        }
    }
}