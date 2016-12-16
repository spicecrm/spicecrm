<?php

global $current_user;
if (!$current_user->is_admin)
    echo 'you are not an admin';
else {
    $ss = new Sugar_Smarty();
    echo $ss->fetch('modules/KDeploymentSystems/tpls/manager.tpl');
}