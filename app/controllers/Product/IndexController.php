<?php
/**
 * 产品区 - 首页
 * 
 */
class Product_IndexController extends AbstractController
{
    /**
     * 首页
     */
    public function indexAction()
    {
        $rowData = array(
            'type' => 'pc',
            'name' => '测试一下',
            'version' => '100',
        );
        $sopProductDao = Dao_Sop_Product::createRow($rowData);
    }
    
}