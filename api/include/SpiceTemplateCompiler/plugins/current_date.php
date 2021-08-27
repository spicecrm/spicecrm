<?php
namespace SpiceCRM\includes\SpiceTemplateCompiler\plugins;

use DateTime;
use SpiceCRM\includes\authentication\AuthenticationController;

function current_date()
{
    $current_user = AuthenticationController::getInstance()->getCurrentUser();
    $timeFormat = $current_user->getUserDateTimePreferences();

    $now = new DateTime();
    return $now->format($timeFormat['date']);
}