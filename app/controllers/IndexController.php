<?php
/**
 * 全站首页
 * 
 */
class IndexController extends AbstractController
{
    /**
     * 首页
     */
    public function indexAction()
    {
        $this->view->name = 'HI';
        F_Log::factory()->error('debug model');
        exit;
    }
    
}