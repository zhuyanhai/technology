<?php
/**
 * 框架应用程序全局的并且是必须的配置文件
 * 
 * @author allen <allenifox@163.com>
 */
return array(
    //php 错误配置
    'phpSettings' => array(
        'display_errors' => 1,
        'error_reporting' => E_ALL | E_STRICT,
    ),
    //页面布局配置
    'view' => array(
        'charset'    => 'utf-8',
        'layoutPath' => APPLICATION_PATH . '/views/layouts/',
        'scriptPath' => APPLICATION_PATH . '/views/scripts/',
    ),
    //autoload 命名空间配置
    'autoloaderNamespaces' => array(
        'DAPI_' => APPLICATION_PATH . '/controllers/',
        'MAPI_' => APPLICATION_PATH . '/controllers/',
    ),
    //bootstrap 框架执行时的引导程序
    'bootstrap' => array(
        'path'  => APPLICATION_PATH . '/Bootstrap.php',
        'class' => "Bootstrap",
    ),
    'cookie' => array(
    ),
    'domain' => array(
        
    ),
    'asset' => array(
        'isDedicatedDomain' => 'off',
        'combo' => array(//是否使用nginx combo 加载 合并静态文件
            'jsEnable'  => 'off',
            'cssEnable' => 'off',
        ),
        'cdn' => array(//是否使用第三方 cdn 加载 静态文件
            'jsEnable'  => 'off',
            'cssEnable' => 'off',
            'js' => array(
                'jquery_1_11_1_min_js' => 'http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js',
            ),
            'css' => array(
            ),
        ),
    ),
);