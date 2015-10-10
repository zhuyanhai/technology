<?php
/**
 * 登陆控制器
 * 
 */
class LoginController extends AbstractController
{
    /**
     * 登陆页
     */
    public function indexAction()
    {
        $this->view->setLayout('layout_empty');
        
        $this->view->referUrl = Utils_Http::getReferer('/', '/\.com\/(login|register)/i');
        if ($this->_requestObj->isXmlHttpRequest() && $this->_requestObj->isPost()) {
            
        }
    }
    
}