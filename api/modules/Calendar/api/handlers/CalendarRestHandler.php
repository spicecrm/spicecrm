<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Calendar\api\handlers;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;

class CalendarRestHandler
{
    public function getCalendarModules(): array {
        $result = [];
        $modules = SpiceFTSUtils::getCalendarModules();
        foreach ($modules as $module => $data) {
            $dateStartFieldName = null;
            $dateEndFieldName = null;
            foreach ($data['ftsfields'] as $field) {
                if ($field['activitytype'] == 'activitydate')
                    $dateStartFieldName = $field['fieldname'];
                if ($field['activitytype'] == 'activityenddate')
                    $dateEndFieldName = $field['fieldname'];
            }
            if ($dateStartFieldName) {
                $result[] = [
                    'name' => $module,
                    'dateStartFieldName' => $dateStartFieldName,
                    'dateEndFieldName' => $dateEndFieldName
                ];
            }
        }
        return $result;
    }

    /**
     * get user calendar events
     * @param string $userId
     * @param string $calendarId
     * @param array $params
     * @return array
     * @throws Exception
     */
    public function getUserCalendarEvents(string $userId, string $calendarId, array $params): array {
        $db = DBManagerFactory::getInstance();
        $start = $db->quote($params['start']);
        $end = $db->quote($params['end']);
        $modules = [];

        if ($calendarId != 'owner') {
            foreach ($this->getCalendarItems($calendarId, $userId) as $item) {
                $modules[$item['module']] = [
                    'settings' => ['calendarfilter' => $item['module_filter']],
                    'type' => $item['type'],
                    'allUsers' => true
                ];
            }
        }

        return SpiceFTSActivityHandler::loadCalendarEvents($start, $end, $userId, $params['searchTerm'], $modules);
    }

    /**
     * get available calendars
     * @return array
     * @throws Exception
     */
    public function getCalendars(): array {
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $calendars = "SELECT id, name, icon FROM sysuicalendars WHERE is_default = 1";
        $calendars = $db->query($calendars);

        while($calendar = $db->fetchByAssoc($calendars)) {
                $retArray[] = $calendar;
        }
        return $retArray;
    }

    /**
     * get calendar items
     * @param string $calendarId
     * @param string $userId
     * @return array
     * @throws Exception
     */
    private function getCalendarItems(string $calendarId, string $userId): array
    {
        $db = DBManagerFactory::getInstance();
        return $db->fetchAll("SELECT module, type, module_filter FROM sysuicalendaritems WHERE calendar_id = '$calendarId' AND owner = '$userId' UNION SELECT module, type, module_filter FROM sysuicustomcalendaritems WHERE calendar_id = '$calendarId' AND owner = '$userId'") ?: [];
    }
}
