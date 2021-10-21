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

namespace SpiceCRM\includes\SysTrashCan;

use SpiceCRM\includes\TimeDate;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class SysTrashCan
{

    /**
     * @param $recordtype
     * @param $recordmodule
     * @param $recordid
     * @param string $recordname
     * @param string $linkname
     * @param string $linkmodule
     * @param string $linkid
     * @param string $recorddata
     * @throws \Exception
     */
    static function addRecord($recordtype, $recordmodule, $recordid, $recordname = '', $linkname = '', $linkmodule = '', $linkid = '', $recorddata = '')
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $now = $timedate->nowDb();
        $db->query("INSERT INTO systrashcan (id, transactionid, date_deleted, user_deleted, recordtype, recordmodule, recordid, recordname, linkname, linkmodule, linkid, recorddata) VALUES('" . create_guid() . "', '" . LoggerManager::getLogger()->getTransactionId() . "', '$now', '$current_user->id','$recordtype', '$recordmodule', '$recordid', '$recordname', '$linkname', '$linkmodule', '$linkid', '".base64_encode($recorddata)."' )");
    }

    /**
     * @return array
     * @throws \Exception
     */
    static function getRecords(){
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $records = $db->query("SELECT systrashcan.*, users.user_name FROM systrashcan, users WHERE systrashcan.user_deleted = users.id AND recordtype = 'bean' AND recovered = '0' ORDER BY date_deleted DESC");
        while($record = $db->fetchByAssoc($records)){
            $retArray[] = $record;
        }

        return $retArray;
    }

    /**
     * @param $transactionid
     * @param $recordid
     * @return array
     * @throws \Exception
     */
    static function getRelated($transactionid, $recordid): array
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $records = $db->query("SELECT systrashcan.* FROM systrashcan WHERE recordtype = 'related' AND transactionid='$transactionid' AND recordid='$recordid' AND recovered = '0' ORDER BY date_deleted DESC");
        while($record = $db->fetchByAssoc($records)){
            $retArray[] = $record;
        }
        return $retArray;
    }

    /**
     * mark a bean undeleted
     * re-insert related relations if wanted
     * @param $id
     * @param $related
     * @return bool|string
     * @throws \Exception
     */
    public static function recover($id, $related) {
        $db = DBManagerFactory::getInstance();

        $record = $db->fetchByAssoc($db->query("SELECT systrashcan.* FROM systrashcan WHERE id='$id' AND recovered = '0'"));

        if(!$focus = BeanFactory::getBean($record['recordmodule'])){
            // BWC try using object name ... used to be the string saved in recordmodule
            $bean = array_search($record['recordmodule'], SpiceModules::getInstance()->getBeanList());
            $focus = BeanFactory::getBean($bean);
        }
        if($focus->retrieve($record['recordid'], true, false)){
            $focus->mark_undeleted($focus->id);

            if($related){
                $focus->load_relationships();

                // set as recovered
                $db->query("UPDATE systrashcan SET recovered = 1 WHERE id='$id'");

                $relRecords = SysTrashCan::getRelated($record['transactionid'], $focus->id);
                foreach($relRecords as $relRecord){
                    if($focus->{$relRecord['linkname']}) {
                        $focus->{$relRecord['linkname']}->add($relRecord['linkid']);
                    }
                    // set as recovered
                    $db->query("UPDATE systrashcan SET recovered = 1 WHERE id='".$relRecord['id']."'");
                }
            }

        } else {
            return 'unable to load bean';
        }

        return true;
    }
}
