<?php
/**
 * 用户 - 操作逻辑
 *
 * @package Bll
 * @subpackage Bll
 * @author allen <allen@yuorngcorp.com>
 */
class Bll_User
{
    /**
     * 用户登陆cookie名字
     */
    const LOGIN_COOKIE_NAME = 'ftoken';

    /**
     * 获取类实例
     *
     * @staticvar Bll_User $instance
     * @return \Bll_User
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
     * 检查用户登陆信息
     * 
     * @return array|null
     */
    public function checkLogin()
    {
        //登陆cookie内容
        $userLoginCookie   = Utils_Cookie::get(self::LOGIN_COOKIE_NAME);
        if (empty($userLoginCookie)) {
           return null; 
        }
        
        //cookie 中记录的信息
        $loginContent = $this->_decryptOfLoginCookie($userLoginCookie);
        if (empty($loginContent)) {
            return null; 
        }

        //用户信息
        $userDao = Dao_Sop_User::fetchRowFromMaster('userid=?', array('userid'=>$loginContent['userid']));
        if (empty($userDao)) {
            return null; 
        }
        
        if (intval($userDao->status) === 10) {//用户被锁定
            return null;
        }
        
        return $userDao;
    }
    
    /**
     * 解密登陆cookie
     * 
     * @param string $userLoginCookie
     * @return array
     */
    private function _decryptOfLoginCookie($userLoginCookie)
    {
        $decryptContent = substr($userLoginCookie, 0, 5);
        $decryptContent.= substr($userLoginCookie, 8, 10);
        $decryptContent.= substr($userLoginCookie, 21, 18);
        $decryptContent.= substr($userLoginCookie, 43);
        
        $lastLoginTime  = substr($userLoginCookie, 5, 3);
        $lastLoginTime .= substr($userLoginCookie, 18, 3);
        $lastLoginTime .= substr($userLoginCookie, 39, 4);
        
        return Utils_EncryptAndDecrypt::timeRange($decryptContent, 'DECODE', Utils_EncryptAndDecrypt::LOGIN_SECRET_KEY, 1800, $lastLoginTime);
    }
}