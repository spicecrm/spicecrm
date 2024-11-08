<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\EventRegistrations;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\TimeDate;

class EventRegistration extends SpiceBean {

    public function save( $check_notify = false, $fts_index_bean = true )
    {
        if ( empty( $this->fetched_row['date_registered'] ) and
            $this->fetched_row['registration_status'] !== $this->registration_status and
            $this->registration_status === 'registered' )
        {
            $this->date_registered = TimeDate::getInstance()->nowDb();
        }
        return parent::save( $check_notify, $fts_index_bean );
    }

}
