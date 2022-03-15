<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\UserAbsences;

use DateTime;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class UserAbsence extends SugarBean
{
    public $module_dir = 'UserAbsences';
    public $object_name = 'UserAbsence';
    public $table_name = 'userabsences';
    public $new_schema = true;

    public function get_summary_text()
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $language = $currentUser->getPreference('language');
        if ( empty( $language )) $language = 'en_us';
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage( $language );

        $dateFormat = $currentUser->getPreference('datef');
        if ( empty( $dateFormat )) $dateFormat = SpiceConfig::getInstance()->config['default_date_format'];
        $start = ( new \DateTime( $this->starttime ))->format( $dateFormat );

        return $app_list_strings['userabsences_type_dom'][$this->type].', '.$start;
    }
    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    public function getSubstituteIDs()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $timeDate = TimeDate::getInstance();
        $userIDs = [];
        $today = new DateTime();
        $today = $today->format($timeDate->get_date_format());
        $substituteids = $db->query("SELECT distinct assigned_user_id FROM userabsences WHERE representative_id='{$current_user->id}' AND date_start <= '$today' AND date_end >= '$today' AND deleted = 0");
        while ($substitute = $db->fetchByAssoc($substituteids)) {
            $userIDs[] = $substitute['assigned_user_id'];
        }
        return $userIDs;
    }
}
