<?php
/**
 * 打印记录
 */
class F_Log_Handler_Echo extends F_Log_Handler_Abstract
{
    /**
     * 打印
     */
	public function save()
	{
		echo $logMessage;
	}
}
