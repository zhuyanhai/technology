<?php
/**
 * 任务分组 - 数据表
 *
 * 定义任务所属组名称，例如：工作、utanjia等
 *
 * @author allen <allen@yuorngcorp.com>
 * @package Dao
 * @subpackage Dao_Wunderlist
 */
class Dao_Wunderlist_TaskGroupModel extends Dao_AbstractModel
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected  static $_name    = 'tbl_task_group';

    /**
     * 库适配器 参考 application.ini -> fzmultidb.{resource}
     *
     * @var string
     */
	protected  static $_adapter = 'wunderlist';

}