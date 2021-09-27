<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
namespace SpiceCRM\modules\SpiceACL;

use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\modules\SpiceACL\SpiceACLUsers;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;

/**
 * Class SpiceACLHooks
 *
 * handles the vardefs, retirvbeal and storage fo the users hash
 */
class SpiceACLHooks
{

    public function hook_after_retrieve(&$bean, $event, $arguments)
    {
        if ( isset($bean->field_name_map['spiceacl_users_hash']) && !empty($bean->spiceacl_users_hash)) {
            $userManager = new SpiceACLUsers();
            $bean->spiceacl_additional_users = json_encode($userManager->getHashUsers($bean->spiceacl_users_hash));
        }
    }

    public function hook_before_save(&$bean, $event, $arguments)
    {
        if ( isset($bean->field_name_map['spiceacl_users_hash'])) {

            if($bean->spiceacl_additional_users){

                $additonalUsers = json_decode($bean->spiceacl_additional_users);

                $users = [];
                foreach($additonalUsers as $additonalUser){
                    $users[]= $additonalUser->id;
                }

                $userManager = new SpiceACLUsers();
                $bean->spiceacl_users_hash = $userManager->manageUsersHash($users);
            } else {
                $bean->spiceacl_users_hash = '';
            }
        }
    }

    public function hook_create_vardefs(&$bean, $event, $arguments)
    {
        if(!isset($GLOBALS['dictionary'][$bean->object_name]['templates']['spiceaclusers'])) {
            $loader = new SpiceUIModulesController();
            $modules = $loader->geUnfilteredModules();
            if ($modules[$bean->module_dir]['acl_multipleusers'] == 1){
                VardefManager::addTemplate($bean->module_dir, $bean->object_name, 'spiceaclusers');
            }
        }
    }
}
