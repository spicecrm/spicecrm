<?php
namespace SpiceCRM\modules\GoogleCalendar;

interface GoogleCalendarEventInterface {
    public function toEvent();

    public function fromEvent(GoogleCalendarEvent $event);

    public function removeGcalId();
}