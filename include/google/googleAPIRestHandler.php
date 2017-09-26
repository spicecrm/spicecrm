<?php

class googleAPIRestHandler
{

    public function autocomplete($term)
    {
        global $sugar_config;

        $results = array(
            'status' => 'NOK'
        );

        $ch = curl_init();
        $url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" . $sugar_config['googleapikey'] . "&types=geocode&input=" . urlencode($term);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

        // Timeout in seconds
        // curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);

        if ($response) {
            $results = json_decode($response);
        }

        return $results;
    }

    public function getplacedetails($placeid)
    {
        global $sugar_config;

        $results = array(
            'status' => 'NOK'
        );

        $ch = curl_init();
        $url = "https://maps.googleapis.com/maps/api/place/details/json?key=" . $sugar_config['googleapikey'] . "&placeid=" . $placeid;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

        $response = curl_exec($ch);

        if ($response) {
            $responseObject = json_decode($response);
            $addrArray = array();
            foreach ($responseObject->result->address_components as $resultItem) {
                foreach ($resultItem->types as $resultType) {
                    $addrArray[$resultType] = $resultItem->short_name;
                }
            }
            $results['status'] = 'OK';
            $results['address'] = array(
                'street' => $addrArray['route'] . ' ' . $addrArray['street_number'],
                'city' => $addrArray['locality'],
                'state' => $addrArray['administrative_area_level_1'],
                'postalcode' => $addrArray['postal_code'],
                'country' => $addrArray['country'],
                'location' => $responseObject->result->geometry->location
            );
        }

        return $results;
    }



}