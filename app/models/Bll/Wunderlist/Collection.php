<?php
/**
 * 任务管理 - 集合 - 操作逻辑
 *
 * @package Bll
 * @subpackage Bll_Wunderlist
 * @author allen <allen@yuorngcorp.com>
 */
class Bll_Wunderlist_Collection
{
    /**
     * 获取类实例
     *
     * @staticvar array $instance
     * @return \Bll_Wunderlist_Collection
     */
    public static function getInstance()
    {
        static $instance = null;
        if(null == $instance){
            $instance = new self();
        }
        return $instance;
    }

    /**
     * 处理集合的 添加 和  编辑
     * @param array $post
     * @return Dao_Wunderlist_CollectionModel
     */
    private function _save($post)
    {
        // 校验 + 过滤 表单提交内容
        if(isset($post['collectionId'])){//编辑
            $params = $this->validate->init(function($errorKey, $errorFlag){
                $errorMsg = '';
                switch($errorKey){
                    case 'id':
                        $errorMsg = '集合不存在';
                        break;
                }
                return $errorMsg;
            })->verify('id', $post['collectionId'], 'required:int:notZero')->receive();
            $collectionObj = $this->get($params['id']);
            if(empty($collectionObj) || $collectionObj->status == Dao_Wunderlist_CollectionModel::STATUS_INVALID){
                throw new Fz_Exception_Validation('集合不存在');
            }
            foreach($collectionObj as $k=>$v){
                if(!isset($post[$k])){
                    $post[$k] = $v;
                }
            }
        } else {
            $collectionObj = null;
        }

        // 校验 + 过滤 表单提交内容
        $post = $this->validate->init(function($errorKey, $errorFlag){
            $errorMsg = '';
            switch($errorKey){
                case 'name':
                    switch($errorFlag){
                        case 'required':
                            $errorMsg = '集合名称不能为空';
                            break;
                    }
                    break;
            }
            return $errorMsg;
        })->verify('name', $post['name'], 'required', 'removehtml')->receive();

        // 构造插入数据
        $insertData = array(
            'userid' => $this->luser->userid,
            'name'   => $post['name'],
        );

        try{
            if(null == $collectionObj){// 创建
                $collectionObj = Dao_Wunderlist_CollectionModel::createRow($insertData);
                $collectionObj->save();
            } else {// 编辑
                $collectionObj->setFromArray($insertData)->save();
            }
        } catch(Exception $e) {
            if($e->getCode() == 1062){//唯一键 或 主键 重复
                throw new Fz_Exception_Validation('该集合已经存在');
            } else {
                throw new Exception($e->getMessage(), $e->getCode());
            }
        }
        
        //wunderlist首页缓存 - 清除
        Fz_Utils_PageCache::remove('wunderlist_index_index');
        
        return $collectionObj;
    }

    /**
     * 添加一个集合
     *
     * @param array $post
     * @return Dao_Wunderlist_CollectionModel
     */
    public function create($post)
    {
        return $this->_save($post);
    }

    /**
     * 编辑一个集合
     *
     * @param array $post
     * @return Dao_Wunderlist_CollectionModel
     */
    public function edit($post)
    {
        return $this->_save($post);
    }

    /**
     * 删除集合
     *
     * @param int $collectionId 集合ID
     * @return Dao_Wunderlist_CollectionModel
     */
    public function del($collectionId)
    {
        $params = $this->validate->init(function($errorKey, $errorFlag){
            $errorMsg = '';
            switch($errorKey){
                case 'id':
                    $errorMsg = '集合不存在！';
                    break;
            }
            return $errorMsg;
        })->verify('id', $collectionId, 'required:int:notZero')->receive();

        $collectionObj = $this->get($params['id']);
        if(empty($collectionObj)){
            throw new Fz_Exception_Validation('集合不存在！');
        }

        if($collectionObj->status == Dao_Wunderlist_CollectionModel::STATUS_INVALID){
            return $collectionObj;
        }

        $collectionObj->status = Dao_Wunderlist_CollectionModel::STATUS_INVALID;
        $collectionObj->save();
        
        //wunderlist首页缓存 - 清除
        Fz_Utils_PageCache::remove('wunderlist_index_index');
        
        return $collectionObj;
    }

    /**
     * 获取单个集合信息
     *
     * @param mixed[string|int] $condition $field需要的值
     * @param string $field 数据表字段，默认是主键字段，本方法可使用主键或唯一键字段查找内容
     * @return mixed
     */
    public function get($condition, $field = 'id')
    {
        return Dao_Wunderlist_Collection::get($condition, $field);
	}

    /**
     * 获取某用户的集合列表
     *
     * @param int $userid 用户ID
     * @param int $page 分页页码，默认0=不分页
     * @param int $count 每页数量
     * @param boolean $isJsPage 是否是JS分页 默认false=不是
     * @return Dao_Wunderlist_CollectionModel
     */
    public function getList($userid, $page = 0 , $count = 50, $isJsPage = false)
    {
        Dao_Wunderlist_Collection::fetchAllFromSlave($whereCondition, $whereBind, $fields);
        return Dao_Wunderlist_CollectionModel::getSelector()
                ->where('userid=?', $userid)
                ->where('status=?', Dao_Wunderlist_CollectionModel::STATUS_VALID)
                ->order('id asc')
                ->fetchAll($page, $count, $isJsPage);
	}

}