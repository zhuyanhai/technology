<?php
/**
 * 任务列表 - 数据表
 *
 * 定义具体任务，某个名称下的任务列表
 *
 * @author allen <allen@yuorngcorp.com>
 * @package Dao
 * @subpackage Dao_Wunderlist
 */
class Dao_Wunderlist_TaskListModel extends Dao_AbstractModel
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected  static $_name    = 'tbl_task_list';

    /**
     * 库适配器 参考 application.ini -> fzmultidb.{resource}
     *
     * @var string
     */
	protected  static $_adapter = 'wunderlist';

    /**
     * 判断任务是否完成
     *
     * @return boolean
     */
    public function isFinished()
    {
        if($this->status_finish == Dao_AbstractModel::FINISHED){
            return true;
        }
        return false;
    }
}