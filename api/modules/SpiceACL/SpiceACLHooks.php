<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceACL;

use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\modules\SpiceACL\SpiceACLUsers;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
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
        if ( isset($bean->field_defs['spiceacl_users_hash']) && !empty($bean->spiceacl_users_hash)) {
            $userManager = new SpiceACLUsers();
            $bean->spiceacl_additional_users = json_encode($userManager->getHashUsers($bean->spiceacl_users_hash));
        }
    }

    public function hook_before_save(&$bean, $event, $arguments)
    {
        if ( isset($bean->field_defs['spiceacl_users_hash'])) {

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
}
