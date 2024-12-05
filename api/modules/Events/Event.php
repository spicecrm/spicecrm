<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Events;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\EventCapacities\EventCapacity;
use SpiceCRM\modules\EventCapacityTypes\EventCapacityType;
use SpiceCRM\includes\TimeDate;

class Event extends SpiceBean
{
    public $capacitiesByTypes = [];
    public $bookingsByTimeslots = [];
    public $dates = [ 'result_date_start' => 0, 'result_date_end' => 0 ];

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

    public function getBookingTable( ?string $capacity_id ): array
    {
        $result = [];

        $result['id'] = $this->id;
        $result['name'] = $this->name;
        $result['date_start'] = $this->date_start;
        $result['date_end'] = $this->date_end;
        $result['status'] = $this->status;
        $result['location_type'] = $this->location_type;
        $result['location_id'] = $this->location_id;
        $result['location_name'] = $this->location_name;
        $result['capacityTypes'] = $capacity_id ? $this->getCapacityWithType( $capacity_id ) : $this->getCapacityTypes();

        return $result;
    }

    /**
     * get eventcapacitytypes by event
     *
     * @param string $capacity_id
     * @return array $eventcapacities
     * @throws NotFoundException
     */
    public function getCapacityWithType( string $capacity_id ): array
    {
        $result = [];
        /** @var $capacity EventCapacity */
        $capacity = BeanFactory::getBean('EventCapacities', $capacity_id );

        /** @var $capacityType EventCapacityType */
        $capacityType = BeanFactory::getBean('EventCapacityTypes', $capacity->eventcapacitytype_id );
        $result = ( $capacityType->no_booking_offer ? [] : [ $this->getEventTableCapacityType( $capacityType, $capacity_id ) ]);

        return $result;
    }

    /**
     * get eventcapacitytypes by event
     *
     * @return array $eventcapacities
     * @throws NotFoundException
     */
    public function getCapacityTypes(): array
    {
        $result = [];
        $capacities = $this->get_linked_beans('eventcapacities');
        foreach ( $capacities as $capacity ) {
            if ( !isset( $result[$capacity->eventcapacitytype_id] )) {
                $capacityType = BeanFactory::getBean('EventCapacityTypes', $capacity->eventcapacitytype_id);
                if ( empty( $capacityType->no_booking_offer )) {
                    $result[$capacity->eventcapacitytype_id] = $this->getEventTableCapacityType($capacityType, null);
                }
            }
        }
        return array_values( $result );
    }

    /**
     * get EventCapacityType
     *
     * @param EventCapacityType $capacityType
     * @param string $capacity_id
     * @return array $result
     * @throws NotFoundException
     */
    public function getEventTableCapacityType( EventCapacityType $capacityType, ?string $capacity_id ): array
    {
        $result = [];
        $this->retrieveCapacitiesByTypeFromDB( $capacityType, $capacity_id );
        $this->calculateStartAndEndDate( $capacityType );

        $timeslots = self::calculateTimeSlots( $this->dates['result_date_start'], $this->dates['result_date_end'], $capacityType->duration );
        $capacityType->timeslots = $timeslots;

        $this->fillTimeSlots( $timeslots, $capacityType, true, true );
        $result['id'] = $capacityType->id;
        $result['name'] = $capacityType->name;
        $result['duration'] = $capacityType->duration;
        $result['subtype'] = $capacityType->subtype;
        $result['calculated_ts_date_start'] = strtotime($this->dates['result_date_start']);
        $result['calculated_date_start'] = $this->dates['result_date_start'];
        $result['calculated_date_end'] = $this->dates['result_date_end'];
        $result['calculated_timeslots'] = $timeslots;

        return $result;
    }

    /**
     * calculate timeslots for the given event
     *
     * @param EventCapacityType $capacityType
     * @param string $date_start
     * @param string $date_end
     * @param boolean $withCapacities
     * @param boolean $withBookings
     * @return array $timeslots
     * @throws NotFoundException
     */

    public static function calculateTimeSlots( string $dateStart, string $dateEnd, int $duration ): array
    {
        $timeslots = [];
        $tsDateStart = strtotime( $dateStart );
        $tsDateEnd = strtotime( $dateEnd );

        // iterate through start and end and calculate the timeslots
        for ( $i = 0; $i < floor(( $tsDateEnd - $tsDateStart ) / ( $duration * 60 )); $i++ )
        {
            $tsFrom = $tsDateStart + $i * $duration * 60;
            $tsTo = $tsFrom + $duration * 60;
            $timeslots[] = [
                'from' => TimeDate::getInstance()->fromTimestamp( $tsFrom )->format('Y-m-d H:i:s'),
                'to' => TimeDate::getInstance()->fromTimestamp( $tsTo )->format('Y-m-d H:i:s'),
                'tsFrom' => $tsFrom,
                'tsTo' => $tsTo
            ];
        }
        return $timeslots;
    }

    public function fillTimeSlots( array &$timeslots, EventCapacityType $capacityType, bool $withCapacities, bool $withBookings ): void
    {
        foreach ( $timeslots as $k => $timeslot ) {
            $capacitiesData = $this->getEventTableCapacitiesByTimeSlot( $capacityType, $timeslot['from'] );
            $timeslots[$k]['numberPlaces'] = $capacitiesData['numberPlaces'];
            if ( $withCapacities ) $timeslots[$k]['capacities'] = $capacitiesData['capacities'] ?: [];

            $this->getEventBookingsByTimeslotFromDB($timeslot['from'], $timeslots[$k]['capacities']);
            $bookings = $this->bookingsByTimeslots[$capacityType->id][$timeslot['from']] ?: [];

            if ( $withBookings ) {
                $timeslots[$k]['bookings'] = $bookings;
                $timeslots[$k]['overbooked'] = ( count( $bookings ) > $timeslot[$k]['numberPlaces'] );
            }
            $timeslots[$k]['availablePlaces'] = $capacitiesData['numberPlaces'] - count( $bookings );
        }
    }

    /**
     * get all eventcapacities by timeslot
     *
     * @param EventCapacityType $capacityType
     * @param array $timeslot
     * @return array $result
     * @throws NotFoundException
     */
    public function getEventTableCapacitiesByTimeSlot(EventCapacityType $capacityType, string $date_start ): array
    {
        $result = [ 'capacities' => [], 'numberPlaces' => 0 ];
        foreach ( $this->capacitiesByTypes[$capacityType->id] as $capacity ) {
            foreach ( $capacityType->timeslots as $capacityTimeSlot )
            {
                if ( $capacityTimeSlot['from'] == $date_start && $capacityTimeSlot['from'] >= $capacity->date_start && $capacityTimeSlot['to'] <= $capacity->date_end )
                {
                    $result['capacities'][] = [
                        'id' => $capacity->id,
                        'name' => $capacity->name,
                        'numberPlaces' => $capacity->number_places
                    ];
                    $result['numberPlaces'] += $capacity->number_places;
                    break;
                }
            }
        }
        return $result;
    }

    /**
     * find start and end point
     * lowest date_start of all capacities; highest date_end of all capacities
     *
     * @param EventCapacityType $capacityType
     * @throws NotFoundException
     */
    public function calculateStartAndEndDate( EventCapacityType $capacityType )
    {
        $result_date_start = null;
        $result_date_end = null;

        // find start and end point (lowest date_start of all capacities; highest date_end of all capacities)
        foreach ( $this->capacitiesByTypes[$capacityType->id] as $eventCapacity ) {

            $date_start = $eventCapacity->date_start;
            $date_end = $eventCapacity->date_end;

            if( $result_date_start == null ) {
                $result_date_start = $date_start;
            } else {
                $result_date_start = $result_date_start < $date_start ? $result_date_start : $date_start;
            }
            if ( $result_date_end == null ) {
                $result_date_end = $date_end;
            } else {
                $result_date_end = $result_date_end > $date_end ? $result_date_end : $date_end;
            }
        }
        $this->dates = [ 'result_date_start' => $result_date_start, 'result_date_end' => $result_date_end ];
    }

    /**
     * get eventcapacities from db
     *
     * @param EventCapacityType $capacityType
     * @return array $eventcapacities
     * @throws NotFoundException
     */
    public function retrieveCapacitiesByTypeFromDB( EventCapacityType $capacityType, ?string $capacity_id )
    {
        $addWhere = "eventcapacitytype_id = '$capacityType->id'";
        if ( $capacity_id ) $addWhere .= "AND id = '$capacity_id'";

        $capacities = $this->get_linked_beans('eventcapacities', 'EventCapacity', [], 0, -1, 0, $addWhere);
        foreach ( $capacities as $capacity ) $this->capacitiesByTypes[$capacityType->id][$capacity->id] = $capacity;
    }

    /**
     * get eventbookings from db
     *
     * @param array $timeslot
     * @throws NotFoundException
     */
    public function getEventBookingsByTimeslotFromDB( string $date_start, $capacities )
    {
        $moduleHandler = new SpiceBeanHandler(RESTManager::getInstance()->app);
        foreach ( $capacities as $capacity ) {
            $capacity = BeanFactory::getBean('EventCapacities', $capacity['id'] );

            $addWhere = "date_start = '" . $date_start . "' ";
            $bookings = $capacity->get_linked_beans('eventbookings', 'EventBooking', [], 0, -1, 0, $addWhere );
            foreach ( $bookings as $booking ) {
                if ( !isset( $this->bookingsByTimeslots[$capacity->eventcapacitytype_id] )) $this->bookingsByTimeslots[$capacity->eventcapacitytype_id] = [];
                if ( !isset( $this->bookingsByTimeslots[$capacity->eventcapacitytype_id][$booking->date_start] )) $this->bookingsByTimeslots[$capacity->eventcapacitytype_id][$booking->date_start] = [];
                $this->bookingsByTimeslots[$capacity->eventcapacitytype_id][$booking->date_start][] = $moduleHandler->mapBeanToArray('EventBookings', $booking );
            }
        }
    }

    function getCapacitiesWithSlots() {

        $result = [];

        $timedate = TimeDate::getInstance();
        $now = $timedate->nowDb();
        $capacityTypes = $this->getCapacityTypes();

        foreach ($capacityTypes as $capacityType) {
            if ( empty( $capacityType['no_booking_offer'] )) {
                if ( !isset( $result[$capacityType['id']] )) {
                    $result[$capacityType['id']] = [
                        'name' => $capacityType['name'],
                        'subtype' => $capacityType['subtype'],
                        'slots' => []
                    ];
                }
                foreach ( $capacityType['calculated_timeslots'] as $calculated_timeslot ) {
                    if($calculated_timeslot['to'] >= $now) {
                        $result[$capacityType['id']]['slots'][$calculated_timeslot['from']]['free'] = $calculated_timeslot['availablePlaces'];
                    }
                }
            }
        }
        return $result;
    }

    function getSlotsOfCapacities()
    {
        $capacities = $this->getCapacitiesWithSlots();

        $result = [];
        foreach ( $capacities as $capacity ) {
            if ( !isset( $result[$capacity['subtype']] )) $result[$capacity['subtype']] = [];
            foreach ( $capacity['slots'] as $time => $slot ) {
                if ( isset( $result[$capacity['subtype']][$time] )) $result[$capacity['subtype']][$time]['free'] += $slot['free'];
                else $result[$capacity['subtype']][$time] = [ 'free' => $slot['free'] ];
            }
        }

        return $result;
    }

    function getAllTypeNames() {
        $result = [];
        $capacityTypes = $this->getCapacityTypes();
        foreach ( $capacityTypes as $capacityType ) $result[$capacityType['subtype']] = true; # array_push($result, $eventcapacitytype['name']);
        return array_keys( $result );
    }

    public function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        $this->booking_url = $this->getBookingURL();
    }

    /**
     * Determine the URL of the booking landing page for this specific event.
     */
    function getBookingURL()
    {
        $config = SpiceConfig::getInstance()->config;
        return ( isset( $config['pcs']['landingpage_portal_config'][0] ) and isset( $config['landingpage']['event_booking_landingpage_id'][0] )) ?
                $config['landingpage']['base_url'].'/#/'.$config['pcs']['landingpage_portal_config'].'/'.$config['landingpage']['event_booking_landingpage_id'].'/'.$this->id : null;
    }

}
