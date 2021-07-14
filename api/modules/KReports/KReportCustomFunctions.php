<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\authentication\AuthenticationController;

$kreportCustomFunctions = [
	'getcurrentuserid' => 'current User ID',
        'interval1630' => 'Interval 16:30'
];

if(!function_exists('getcurrentuserid'))
{
	function getcurrentuserid($whereConditionRecord)
	{
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
		
		return [
		    'operator' => 'oneof',
		    'value' => $current_user->id
        ];
	}
}

if(!function_exists('interval1630'))
{
	function interval1630($whereConditionRecord)
	{
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
		
		return [
                    'operator' => 'between',
                    'value' => '',
		    'valuekey' => date('Y-m-d', time()-86400) . ' 16:30:01', 
                    'valueto' => '',
                    'valuetokey' => date('Y-m-d') . ' 16:30:00',
        ];
	}
}

if(file_exists('custom/modules/KReports/KReportCustomFunctions.php'))
    include('custom/modules/KReports/KReportCustomFunctions.php');
