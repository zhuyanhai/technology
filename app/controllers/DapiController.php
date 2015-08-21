<?php
/**
 * 桌面应用 - api 入口
 */
class DapiController extends AbstractController 
{
    /**
     * 没有 requestMethod 的就会定位到indexAction
     */
    public function indexAction()
    {
        $this->response();
    }
    
    /**
     * 桌面应用 - api 入口
     */
    public function runAction() 
    {
        F_Dapi::run($this);
    }

}
