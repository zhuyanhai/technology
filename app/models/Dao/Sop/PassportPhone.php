<?php
/**
 * tbl_passport_phone 数据表类
 * 
 * 账号信息 - 关于手机号登录校验
 * 
 * @package Dao
 * @subpackage Dao_Sop
 * @author allen <allenifox@163.com>
 */
class Dao_Sop_PassportPhone extends Dao_Abstract
{
    /**
     * 完整表名
     *
     * @var string
     */
	protected static $_tableName = 'tbl_passport_phone';
    
    /**
     * 数据库缩略名
     *
     * @var string
     */
	protected static $_dbShortName = 'sop';
    
    /**
     * 数据表主键字段名
     * 
     * @var string
     */
    protected static $_primaryKey = 'phone';
}