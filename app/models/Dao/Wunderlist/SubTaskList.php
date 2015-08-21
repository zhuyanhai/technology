<?php
/**
 * 任务中的子任务 - 数据表
 *
 * 定义任务中子任务
 *
 * @author allen <allen@yuorngcorp.com>
 * @package Dao
 * @subpackage Dao_Wunderlist
 */
class Dao_Wunderlist_SubTaskListModel extends Dao_AbstractModel
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected  static $_name    = 'tbl_subtask_list';

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
    
    public function getMemo()
    {
        return $this->memo;
    }
}