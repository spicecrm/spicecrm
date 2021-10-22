<?php

namespace SpiceCRM\includes\SpiceGDPRManager;

use DateTime;
use DateInterval;
use SpiceCRM\includes\TimeDate;

class SpiceGDPRManager
{
    // examplefunction to get related activities Filter
    public function getNoActivityInLast3YearsFilter(){
        $timeDate = TimeDate::getInstance();

        $now = new DateTime();
        $now->sub(new DateInterval('P3Y'));

        $clauses = [];
        $clauses[] = "NOT EXISTS (SELECT id FROM calls WHERE calls.parent_id = contacts.id AND date_start > '".$now->format($timeDate->get_db_date_time_format())."' AND calls.deleted = 0)";
        $clauses[] = "NOT EXISTS (SELECT id FROM meetings WHERE meetings.parent_id = contacts.id AND date_start > '".$now->format($timeDate->get_db_date_time_format())."' AND meetings.deleted = 0)";
        $clauses[] = "NOT EXISTS (SELECT id FROM campaign_log WHERE campaign_log.target_id = contacts.id AND activity_date > '".$now->format($timeDate->get_db_date_time_format())."' AND campaign_log.deleted = 0)";
        return implode(' AND ', $clauses);
    }
}