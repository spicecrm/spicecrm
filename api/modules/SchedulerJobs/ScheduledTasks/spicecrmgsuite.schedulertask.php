<?php

use SpiceCRM\extensions\modules\GoogleCalendar\GoogleCalendarJobhandler;

$job_strings[] = 'renewGoogleSubscriptions';

function renewGoogleSubscriptions()
{
    $handler = new GoogleCalendarJobhandler();
    $handler->renewSubscriptions();
    return true;
}
