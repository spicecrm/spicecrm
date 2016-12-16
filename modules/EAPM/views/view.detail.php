<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/06_Customer_Center/10_Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

require_once('include/MVC/View/views/view.detail.php');

class EAPMViewDetail extends ViewDetail {

    private $_returnId;

    protected function _getModuleTab()
    {
        return 'Users';
    }

    /**
	 * @see SugarView::_getModuleTitleParams()
	 */
	protected function _getModuleTitleParams($browserTitle = false)
	{
	    global $mod_strings;

        $returnAction = 'DetailView';
        $returnModule = 'Users';
        $returnId = $GLOBALS['current_user']->id;
        $returnName = $GLOBALS['current_user']->full_name;
        if(!empty($_REQUEST['return_action']) && !empty($_REQUEST['return_module'])){
            if('Users' == $_REQUEST['return_module']){
                if('EditView' == $_REQUEST['return_action']){
                    $returnAction = 'EditView';
                }
                if(!empty($_REQUEST['return_name'])){
                    $returnName = $_REQUEST['return_name'];
                }
                if(!empty($_REQUEST['user_id'])){
                    $returnId = $_REQUEST['user_id'];
                }
            }
        }

        $this->_returnId = $returnId;

        $iconPath = $this->getModuleTitleIconPath($this->module);
        $params = array();
        if (!empty($iconPath) && !$browserTitle) {
            $params[] = "<a href='index.php?module=Users&action=index'><!--not_in_theme!--><img src='{$iconPath}' alt='".translate('LBL_MODULE_NAME','Users')."' title='".translate('LBL_MODULE_NAME','Users')."' align='absmiddle'></a>";

        }
        else {
            $params[] = translate('LBL_MODULE_NAME','Users');
        }
        $params[] = "<a href='index.php?module={$returnModule}&action=EditView&record={$returnId}'>".$returnName."</a>";
        if($returnAction == 'EditView'){
            $params[] = $GLOBALS['app_strings']['LBL_EDIT_BUTTON_LABEL'];
        }
        return $params;
    }

    /**
	 * @see SugarView::getModuleTitleIconPath()
	 */
	protected function getModuleTitleIconPath($module) 
    {
        return parent::getModuleTitleIconPath('Users');
    }

 	function display(){
        $this->bean->password = empty($this->bean->password) ? '' : EAPM::$passwordPlaceholder;
        $this->ss->assign('return_id', $this->_returnId);
        if($GLOBALS['current_user']->is_admin || empty($this->bean) || empty($this->bean->id) || $this->bean->isOwner($GLOBALS['current_user']->id)){
 			parent::display();
        } else {
        	ACLController::displayNoAccess();
        }
 	}
}

?>