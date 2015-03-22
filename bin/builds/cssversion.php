<?php
if (substr(php_sapi_name(), 0, 3) !== 'cli') {
    die("run the script only in CLI mode");
}

function ergodicDir($pattern, $exts = array())
{
    if(!empty($exts)){
         for($i = 0,$total = count($exts); $i < $total; $i++){
              $exts[$i] = '*.' . $exts[$i];
         }
    }
    $filter = !($exts)? '*':'{'.implode(',', $exts).'}';
    $pattern = $pattern . "/" . $filter;
    return glob($pattern, GLOB_BRACE);
}

function recursionDir($pattern, $exts = array(), $globExts = array(), $fileDir = array())
{
   static $list = array();

   $dirAry = ergodicDir($pattern, $globExts);
   $extsPattern = '';
   if(!empty($exts)){
       $extsPattern = array();
       for($i = 0,$total = count($exts); $i < $total; $i++){
          $extsPattern[$i] = '\.' . $exts[$i];
       }
       $extsPattern = '/('.implode('|', $extsPattern).')$/i';
   }
   foreach($dirAry as $filename){
       if(is_dir($filename)){
           if(!in_array($filename, $fileDir)){
               recursionDir($filename, $exts, $globExts);
           }
       } else {
           if(!empty($extsPattern)){
               if(preg_match($extsPattern, $filename)){
                   array_push($list, $filename);
               }
           } else {
               array_push($list, $filename);
           }
       }
   }
   return $list;
}

function fileWrite($dir, $filename, $con)
{
    if (!is_readable($dir)) {
        self::dirCreate($dir);
    }
    $uid = posix_getuid();
    if (0 === $uid) {
        //$filename .= '_root';
    }
    file_put_contents($dir . $filename, $con);
}

/**
 * 构造 js 版本号 配置文件
 */
$pattern = realpath(__DIR__ . '/../../public/asset/css/');
if(!file_exists($pattern)){
    echo '目录不存在'.PHP_EOL;
    exit;
}

$dirAry = recursionDir($pattern, array('css'));

$jsList = array();
foreach($dirAry as $filename){
    $jsList[str_replace($pattern, '', $filename)] = filemtime($filename);
}

$filepath = realpath(__DIR__ . '/../../runtime/version/');
$filename = 'cssVersionCache.php';

fileWrite($filepath . '/', $filename, '<?php'.PHP_EOL.'//'.date('Y-m-d').' 创建'.PHP_EOL.'return '.var_export($jsList, true).';');

echo '完毕'.PHP_EOL;
