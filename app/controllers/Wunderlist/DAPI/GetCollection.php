<?php
/**
 * 桌面应用 - api
 * 
 * 获取任务集合
 */
class DAPI_Wunderlist_GetCollection extends F_Dapi_Abstract
{
    /**
     * 获取任务集合
     */
    public function getCollection()
    {
        $list = Dao_Wunderlist_Collection::fetchAllFromSlave('status=:status', array('status' => 0));
        $list = Dao_Wunderlist_Collection::format($list);
        $this->response($list);
    }
}
