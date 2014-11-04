<?php
/**
 * url 处理，会更具路由反解析需要使用的url
 *
 * @author allen <allen@yuorngcorp.com>
 * @package F_View
 */
final class F_View_Helper_Url
{
    /**
     * 重组 url
     * 
     * @param string $domain http://technology.utan.com
     * @param string $mca /module/controller/action/
     * @param string $params URL 参数
     * @return string
     */
    public function url($domain, $mca, $params = '')
    {
        //路由 todo
        return $domain . $mca . $params;
    }
}