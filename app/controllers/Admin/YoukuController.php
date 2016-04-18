<?php
/**
 * 系统管理区 - 首页
 * 
 */
class Admin_YoukuController extends AbstractController
{
    const CLIENT_ID = 'e1a4f3a23c0bed2a';
    const CLIENT_SECRET = 'ae0aa5f4d1d079582a732f0bac4047fd';
    
    private function _oauth()
    {
        $url = 'https://openapi.youku.com/v2/oauth2/authorize?client_id='.self::CLIENT_ID.'&response_type=code&redirect_uri=http%3A%2F%2Ftechnology.zhuyanhai.com%2Fadmin%2Fyouku%2Foauthcallback&state=allen';
        
        $this->_redirectorObj->gotoUrlAndExit($url);
    }
    
    public function oauthcallbackAction()
    {
        $code  = $_GET['code'];
        $state = $_GET['state'];
        
        $this->_getAccessToken($code);
        
        $this->_redirectorObj->gotoUrlAndExit('http://technology.zhuyanhai.com/admin/youku/');
    }
    
    private function _getAccessToken($code)
    {
        $url = 'https://openapi.youku.com/v2/oauth2/token';
        $accessTokens = Utils_Curl::post($url, 'client_id='.self::CLIENT_ID.'&client_secret='.self::CLIENT_SECRET.'&grant_type=authorization_code&code='.$code.'&redirect_uri=http%3A%2F%2Ftechnology.zhuyanhai.com%2Fadmin%2Fyouku%2Foauthcallback');
        $accessTokens = json_decode($accessTokens, true);
        Utils_Session::set('access_token', $accessTokens['access_token']);
        print_r($accessTokens);exit;
        return $accessTokens['access_token'];
    }
    
    private function _refreshToken($refershToken)
    {
        $url = 'https://openapi.youku.com/v2/oauth2/token';
        $accessTokens = Utils_Curl::post($url, 'client_id='.self::CLIENT_ID.'&client_secret='.self::CLIENT_SECRET.'&grant_type=refresh_token&refresh_token='.$refershToken);
        $accessTokens = json_decode($accessTokens, true);
        return $accessTokens;
    }
    
    public function playAction()
    {
        
    }
    
    /**
     * 首页
     */
    public function indexAction()
    {
        $token = '13452bdaf00f812d1b2f516835d33ea5';
        $refershToken = 'e71a4f0577a3d4c36c7c7357db6371f3';
        
        //$token = Utils_Session::get('access_token');
        //echo $token;
        if (empty($token)) {
            return $this->_oauth();
        }
        
        //videoid=XMTQzNzI4NDUwOA==;title=video_11
        
        $userUrl = 'https://openapi.youku.com/v2/users/myinfo.json?client_id='.self::CLIENT_ID.'&access_token='.$token;
        $user = Utils_Curl::get($userUrl);
        
        //print_r($user);
        //exit;
        
        /*
        header('Content-type: text/html; charset=utf-8');
        include("include/YoukuUploader.class.php");

        $client_id = ""; // Youku OpenAPI client_id
        $client_secret = ""; //Youku OpenAPI client_secret


        $params['access_token'] = ""; 
        $params['refresh_token'] = "";
        $params['username'] = ""; //Youku username or email
        $params['password'] = md5(""); //Youku password

        set_time_limit(0);
        ini_set('memory_limit', '128M');
        $youkuUploader = new YoukuUploader($client_id, $client_secret);
        $file_name = ""; //video file
        try {
            $file_md5 = @md5_file($file_name);
            if (!$file_md5) {
                throw new Exception("Could not open the file!\n");
            }
        }catch (Exception $e) {
            echo "(File: ".$e->getFile().", line ".$e->getLine()."): ".$e->getMessage();
            return;
        }
        $file_size = filesize($file_name);
        $uploadInfo = array(
                "title" => "", //video title
                "tags" => "", //tags, split by space
                "file_name" => $file_name, //video file name
                "file_md5" => $file_md5, //video file's md5sum
                "file_size" => $file_size //video file size
        );
        $progress = true; //if true,show the uploading progress 
        $youkuUploader->upload($progress, $params,$uploadInfo); 
        */
    }
    
}