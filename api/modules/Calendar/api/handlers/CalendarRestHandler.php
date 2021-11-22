<?php

namespace SpiceCRM\modules\Calendar\api\handlers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\authentication\AuthenticationController;

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

    public function getUserCalendar(string $userId, array $params): array {
        $db = DBManagerFactory::getInstance();
        $start = $db->quote($params['start']);
        $end = $db->quote($params['end']);
        return SpiceFTSActivityHandler::loadCalendarEvents($start, $end, $userId);
    }

    public function getUsersCalendar(string $userId, array $params): array {
        $db = DBManagerFactory::getInstance();
        $start = $db->quote($params['start']);
        $end = $db->quote($params['end']);
        return SpiceFTSActivityHandler::loadCalendarEvents($start, $end, $userId, '', json_decode($params['users']));
    }

    public function getCalendars(): array {
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $calendars = "SELECT id, name, icon FROM sysuicalendars WHERE `default` = 1";
        $calendars = $db->query($calendars);

        while($calendar = $db->fetchByAssoc($calendars)) {
                $retArray[] = $calendar;
        }
        return $retArray;
    }

    public function getOtherCalendars(string $calendarId, array $params): array {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $start = $db->quote($params['start']);
        $end = $db->quote($params['end']);
        $calendarId = $db->quote($calendarId);
        $krestModuleHandler = new KRESTModuleHandler();
        $calendars = "SELECT citems.* FROM sysuicalendaritems as citems ";
        $calendars .= "LEFT JOIN sysuicalendars ON citems.calendar_id = sysuicalendars.id ";
        $calendars .= "WHERE sysuicalendars.default = 1 AND citems.calendar_id = '$calendarId'";
        $calendars = $db->query($calendars);

        while ($calendar = $db->fetchByAssoc($calendars)) {
            $type = $calendar['type'];
            $isFull = $type == 'Full' || $type == 'Voll';
            $module = $calendar['module'];
            $fieldEvent = $calendar['field_event'];
            $fieldStart = $calendar['field_date_start'];
            $fieldEnd = $calendar['field_date_end'];
            $moduleFilter = $calendar['module_filter'];

            if (empty($module) || empty($type) || ($isFull && (empty($fieldStart) || empty($fieldEnd))) || (!$isFull && empty($fieldEvent))) continue;

            if ($module == 'SpiceReminders') {
                $reminders = "SELECT * FROM spicereminders WHERE $fieldEvent BETWEEN CAST('$start' as DATE) AND CAST('$end' as DATE) AND user_id = '$current_user->id'";
                $reminders = $db->query($reminders);
                while ($reminder = $db->fetchByAssoc($reminders)) {
                    $seed = BeanFactory::getBean($reminder['bean']);
                    if($seed->retrieve($reminder['bean_id'])){
                        $eventStart = new DateTime($reminder[$fieldEvent]);
                        $eventEnd = $eventStart;
                        $retArray[] = [
                            'id' => $reminder['bean_id'],
                            'module' => $reminder['bean'],
                            'type' => 'other',
                            'start' => $eventStart->format('Y-m-d H:i:s'),
                            'end' => $eventEnd->format('Y-m-d H:i:s'),
                            'data' => $krestModuleHandler->mapBeanToArray($reminder['bean'], $seed)
                        ];
                    }
                }
            } else {
                $bean = BeanFactory::getBean($module);
                $beanFieldEvent = $bean->table_name . '.' . $fieldEvent;
                $beanFieldStart = $bean->table_name . '.' . $fieldStart;
                $beanFieldEnd = $bean->table_name . '.' . $fieldEnd;

                switch ($module) {
                    case 'Contacts':
                        $where = "(MONTH($beanFieldEvent) = MONTH('$start') OR MONTH($beanFieldEvent) = MONTH('$end')) AND (DAYOFMONTH($beanFieldEvent) BETWEEN DAYOFMONTH('$start') AND DAYOFMONTH('$end'))";
                        break;
                    case 'Tasks':
                        $where = "$beanFieldEvent BETWEEN '$start' AND '$end'";
                        break;
                    case 'Campaigns':
                        $where = "IFNULL($beanFieldStart, $beanFieldEnd) <=  CAST('$end' as DATE) AND $beanFieldEnd >= CAST('$start' as DATE)";
                        break;
                    case 'UserAbsences':
                        $absenceType = $bean->table_name . '.type';
                        $where = "$beanFieldStart <=  CAST('$end' as DATE) AND $beanFieldEnd >= CAST('$start' as DATE) AND user_id <> '$current_user->id' AND ($absenceType = 'Vacation' OR $absenceType = 'Urlaub')";
                        break;
                    default:
                        $where = "$beanFieldStart <=  CAST('$end' as DATE) AND $beanFieldEnd >= CAST('$start' as DATE)";

                }

                if (!empty($moduleFilter)) {
                    $sysModuleFilters = new SpiceCRM\includes\SysModuleFilters\SysModuleFilters();
                    $filterWhere = $sysModuleFilters->generareWhereClauseForFilterId($moduleFilter);
                    if ($filterWhere) {
                        $where .= ' AND ('. $filterWhere .')';
                    }
                }

                $list = $bean->get_full_list($isFull ? $beanFieldEnd : $beanFieldEvent, $where);
                if (!$list) continue;

                foreach ($list as $seed) {
                    $seedEvent = $seed->{$fieldEvent};
                    $seedStart = $seed->{$fieldStart};
                    $seedEnd = $seed->{$fieldEnd};
                    if ($isFull) {
                        $eventStart = new DateTime($seedStart ?: $seedEnd);
                        $eventEnd = new DateTime($seedEnd);
                    } else {
                        $eventStart = new DateTime($seedEvent);
                        $eventEnd = $eventStart;
                    }

                    $retArray[] = [
                        'id' => $seed->id,
                        'module' => $module,
                        'type' => 'other',
                        'start' => $eventStart->format('Y-m-d H:i:s'),
                        'end' => $eventEnd->format('Y-m-d H:i:s'),
                        'data' => $krestModuleHandler->mapBeanToArray($module, $seed)
                    ];
                }
            }
        }
        return $retArray;
    }
}
