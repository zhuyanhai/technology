<?php
/**
 * 本项目中所有 controller 必须继承的 controller 基类
 * 
 * 本类中带有逻辑处理
 * - 检测登录 
 */
abstract class AbstractController extends F_Controller_ActionAbstract
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function preDispatch()
    {
        parent::preDispatch();
    }
    
    public function postDispatch()
    {
        parent::postDispatch();
        
        $this->view->setLayout('layout_default');
    }
}
