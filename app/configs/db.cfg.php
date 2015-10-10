<?php
/**
 * 数据库 配置文件
 * 
 * @author allen <allenifox@163.com>
 */
return array(
    'default' => array(
        'master' => array(
            'host'     => '192.168.0.235',
            'port'     => '3306',
        ),
        'slave' => array(
            'host'     => '192.168.0.235',
            'port'     => '3306',
        ),
        'username' => 'app1',
        'password' => '19820111',
        'charset'  => 'utf8mb4',
        'collation' => 'utf8mb4_general_ci',
    ),
    'sop' => array(
        'dbName' => 'f_sop',
    ),
//    'wunderlist' => array(
//        'dbName' => 'zhuyanhai_wunderlist',
//    ),
);