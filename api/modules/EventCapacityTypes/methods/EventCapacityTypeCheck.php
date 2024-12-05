<?php

namespace SpiceCRM\modules\EventCapacityTypes\methods;

use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\TimeDate;

class EventCapacityTypeCheck
{
    /**
     * default method to check the booking conditions
     *
     * @param $participant
     * @return array
     * @throws NotFoundException
     */
    public function defaultMethod($participant) {

        $timedate = TimeDate::getInstance();
        $now = $timedate->nowDb();
        $participant->load_relationship('eventbookings');
        $relatedBookings = $participant->get_linked_beans('eventbookings', 'EventBookings');
        foreach ($relatedBookings as $relatedBooking) {
            if($relatedBooking->date_start > $now) {
                throw ( new BadRequestException('Has already a booking in the future!'))
                    ->setErrorCode('alreadyBookingInFuture')
                    ->setLbl('LBL_ALREADY_BOOKING_IN_FUTURE')
                    ->setDetails(['bookingOn' => $relatedBooking->date_start]);
            }
        }
        return ['success' => true];
    }

}
