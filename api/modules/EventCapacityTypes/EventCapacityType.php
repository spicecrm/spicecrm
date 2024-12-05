<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\EventCapacityTypes;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;

class EventCapacityType extends SpiceBean
{

    public function get_summary_text()
    {
        return $this->name;
    }

    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    /**
     * call the eventcapacitytype check method
     *
     * @param $participantType
     * @param $participantId
     * @return array
     * @throws NotFoundException
     */
    public function callCapacityTypeMethod($participantType, $participantId )
    {
        $participant = BeanFactory::getBean( $participantType, $participantId );

        $class = $this->check_class;
        $method = $this->check_method;

        if (class_exists($class)) {
            $focus = new $class();
            if (method_exists($focus, $method)) {
                $result = $focus->$method($participant);
                return $result;
            }
        }
        if ( $class ) {
            throw (new BadRequestException('Class not found!'))->setErrorCode('classnotfound'); # todo: not a bad request
        } else {
            return true;
        }
    }


    /**
     * check if participant is blocked
     *
     * @param $date_start
     * @param $participantType
     * @param $participantId
     * @return bool
     * @throws NotFoundException
     */
    public static function participantIsBlocked( string $date_start, $capacityTypeOrSubtype, $participant ): bool # 2nd param: object|string
    {
        if ( is_object( $capacityTypeOrSubtype )) $subtype = $capacityTypeOrSubtype->subtype;
        else $subtype = $capacityTypeOrSubtype;

        if ( !is_object( $participant )) {
            $participantType = $participant['participantType'];
            $participantId = $participant['participantId'];
            $participant = BeanFactory::getBean( $participantType, $participantId ); # todo: throw exception
        }

        $addWhere = "subtype = '" . $subtype . "' ";
        $bookingBlockers = $participant->get_linked_beans('eventbookingblockers', 'EventBookingBlocker', [], 0, -1, 0, $addWhere);

        foreach ( $bookingBlockers as $bookingBlocker ) {
            if ( empty( $bookingBlocker->booking_blocked_from ) and empty( $bookingBlocker->booking_blocked_until )) return true;
            if ( empty( $bookingBlocker->booking_blocked_until )) {
                if ( $bookingBlocker->booking_blocked_from <= $date_start ) return true;
            } else {
                if ( $bookingBlocker->booking_blocked_until >= $date_start and
                    ( empty( $bookingBlocker->booking_blocked_from ) or $bookingBlocker->booking_blocked_from <= $date_start )) return true;
            }
        }
        return false;
    }

}
