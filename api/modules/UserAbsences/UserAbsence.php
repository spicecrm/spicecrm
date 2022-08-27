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

    public function getSubstituteOrgUnitIDs()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $timeDate = TimeDate::getInstance();
        $userIDs = [];
        $today = new DateTime();
        $today = $today->format($timeDate->get_date_format());
        $substituteids = $db->query("SELECT distinct orgunit_id FROM users, userabsences WHERE users.id = userabsences.assigned_user_id AND representative_id='{$current_user->id}' AND date_start <= '$today' AND date_end >= '$today' AND deleted = 0");
        while ($substitute = $db->fetchByAssoc($substituteids)) {
            $userIDs[] = $substitute['orgunit_id'];
        }
        return $userIDs;
    }
}
