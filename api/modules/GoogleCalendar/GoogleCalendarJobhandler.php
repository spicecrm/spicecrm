<?php

namespace SpiceCRM\modules\GoogleCalendar;

use DateInterval;
use DateTime;
use DateTimeZone;
use SpiceCRM\includes\database\DBManagerFactory;

class GoogleCalendarJobhandler{

    public function renewSubscriptions(){
        global $timedate;
$db = DBManagerFactory::getInstance();

        $handledUserIds = [];

        $now = new DateTime("now", new DateTimeZone('UTC'));
        $now->add(new DateInterval('P1D'));

        $expiredSubscriptions = $db->query("SELECT * FROM sysgsuiteusersubscriptions WHERE expiration <= '".$now->format($timedate->get_db_date_time_format())."'");
        while($expiredSubscription = $db->fetchByAssoc($expiredSubscriptions)){
            $calendar = new GoogleCalendar($expiredSubscription['user_id']);
            if($calendar->stopSubscription() === true) {
                $calendar->startSubscription();
            } else {
                if($calendar->startSubscription() === true) {
                    $db->query("DELETE FROM sysgsuiteusersubscriptions WHERE subscriptionid = '{$expiredSubscription['subscriptionid']}'");
                }
            }

            $handledUserIds[] = $expiredSubscription['user_id'];
        }
    }

}
