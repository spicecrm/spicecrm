<?php

require_once 'KREST/handlers/module.php';

class CalendarRestHandler
{
    function getUserCalendar($userid, $params)
    {
        global $current_user, $db;

        $retArray = [];

        $start = $params['start'];
        $end = $params['end'];

        $krestModuleHandler = new KRESTModuleHandler();

        if(ACLController::checkAccess('Meetings', 'list', $current_user->id)) {
            $seedMeeting = BeanFactory::getBean('Meetings');
            $meetings = $db->query("SELECT id FROM meetings WHERE deleted = 0 and date_start >='$start' AND date_end <='$end' AND assigned_user_id = '$userid'");
            while($meeting = $db->fetchByAssoc($meetings)){
                if($seedMeeting->retrieve($meeting['id'])){
                    $retArray[] = array(
                        'id' => $seedMeeting->id,
                        'module' => 'Meetings',
                        'type' => 'event',
                        'start' => $seedMeeting->date_start,
                        'end' => $seedMeeting->date_end,
                        'data' => $krestModuleHandler->mapBeanToArray('Meetings', $seedMeeting)
                    );
                }
            }
        }

        if(ACLController::checkAccess('Calls', 'list', $current_user->id)) {
            $seedCall = BeanFactory::getBean('Calls');
            $calls = $db->query("SELECT id FROM calls WHERE deleted = 0 and date_start >='$start' AND date_end <='$end' AND assigned_user_id = '$userid'");
            while($call = $db->fetchByAssoc($calls)){
                if($seedCall->retrieve($call['id'])){
                    $retArray[] = array(
                        'id' => $seedCall->id,
                        'module' => 'Calls',
                        'type' => 'event',
                        'start' => $seedCall->date_start,
                        'end' => $seedCall->date_end,
                        'data' => $krestModuleHandler->mapBeanToArray('Calls', $seedCall)
                    );
                }
            }
        }

        return $retArray;
    }
}