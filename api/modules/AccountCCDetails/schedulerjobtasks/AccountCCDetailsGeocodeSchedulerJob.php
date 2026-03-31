<?php

namespace SpiceCRM\modules\AccountCCDetails\schedulerjobtasks;
use SpiceCRM\includes\google\GoogleAPIRestHandler;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class AccountCCDetailsGeocodeSchedulerJob
{

    /**
     * geocode accounts
     * @return bool
     */
    public function geocodeAccountCCDetailss(): bool
    {

        $db = DBManagerFactory::getInstance();
        set_time_limit(1200);
        $accountccdetails = $db->limitQuery("SELECT id FROM accountccdetails WHERE deleted = 0 AND geocoderesult IS NULL AND bau_address_1 IS NOT NULL", 0, 500);
        while ($accountccdetail = $db->fetchByAssoc($accountccdetails)) {
            $seed = BeanFactory::getBean('AccountCCDetails', $accountccdetail['id']);

            $response = (new GoogleAPIRestHandler())->geocode($seed->bau_address_1 . ' ' . $seed->bau_address_2 . ' ' . $seed->bau_address_country);

            if ($response->geocoderesult) {
                $seed->geocoderesult = $response->geocoderesult;
                if ($response->status == 'OK') {
                    $seed->address_latitude = $response->address->latitude;
                    $seed->address_longitude = $response->address->longitude;
                    $seed->address_country = $response->address->country;
                    $seed->address_state = $response->address->state;
                    $seed->address_city = $response->address->city;
                    $seed->address_district = $response->address->district;
                    $seed->address_street = $response->address->street;
                    $seed->address_street_number = $response->address->street_number;
                    $seed->address_postalcode = $response->address->postalcode;
                }

                $seed->save();
            } else {
                $seed->geocoderesult = json_encode(['status' => 'error']);
            }
        }

        return true;
    }

}