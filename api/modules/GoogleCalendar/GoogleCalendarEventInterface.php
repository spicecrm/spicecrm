<?php
namespace SpiceCRM\modules\GoogleCalendar;

use SpiceCRM\extensions\modules\GoogleCalendar\GoogleCalendarEvent;

interface GoogleCalendarEventInterface {
    public function toEvent();

    public function fromEvent(GoogleCalendarEvent $event);

    public function removeGcalId();
}