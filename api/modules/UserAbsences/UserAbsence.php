<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\UserAbsences;

use DateTime;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class UserAbsence extends SpiceBean
{

    public function get_summary_text()
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $language = $currentUser->getPreference('language');
        if ( empty( $language )) $language = 'en_us';
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage( $language );

        $dateFormat = $currentUser->getPreference('datef');
        # if ( empty( $dateFormat )) $dateFormat = SpiceConfig::getInstance()->config['default_date_format'];
        if ( empty( $dateFormat )) $dateFormat = SpiceConfig::getInstance()->config['default_preferences']['datef'];
        $start = ( new \DateTime( $this->date_start ))->format( $dateFormat );

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

    /**
     * @deprecated since 2023.03.001
     * @return array
     * @throws \Exception
     */
    public function getSubstituteOrgUnitIDs()
    {
        return $this->getSubstituteEmployeeOrgUnitIDs();

//        $current_user = AuthenticationController::getInstance()->getCurrentUser();
//        $db = DBManagerFactory::getInstance();
//        $timeDate = TimeDate::getInstance();
//        $userIDs = [];
//        $today = new DateTime();
//        $today = $today->format($timeDate->get_date_format());
//        $substituteids = $db->query("SELECT distinct orgunit_id FROM users, userabsences WHERE users.id = userabsences.assigned_user_id AND representative_id='{$current_user->id}' AND date_start <= '$today' AND date_end >= '$today' AND userabsences.deleted = 0");
//        while ($substitute = $db->fetchByAssoc($substituteids)) {
//            $userIDs[] = $substitute['orgunit_id'];
//        }
//        return $userIDs;
    }

    /**
     * get the orgunits allocate to the employee object of the substitute
     * @return array
     * @throws \Exception
     */
    public function getSubstituteEmployeeOrgUnitIDs()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $timeDate = TimeDate::getInstance();
        $orgUnitIDs = [];
        $today = new DateTime();
        $today = $today->format($timeDate->get_date_format());
        $substituteids = $db->query("SELECT distinct orgunit_id FROM users, userabsences, orgunit_employees oe WHERE users.parent_id = oe.employee_id AND oe.deleted=0 AND users.id = userabsences.assigned_user_id AND representative_id='{$current_user->id}' AND date_start <= '$today' AND date_end >= '$today' AND userabsences.deleted = 0");
        while ($substitute = $db->fetchByAssoc($substituteids)) {
            $orgUnitIDs[] = $substitute['orgunit_id'];
        }
        return $orgUnitIDs;
    }
}
