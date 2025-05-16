<?php
namespace SpiceCRM\includes\google;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class GoogleAPIRestHandler
{
    // check if we can geocode
    static function canGeoCode()
    {
        return !!SpiceConfig::getInstance()->get('googleapi.geocodingkey');
    }

    public function search($term, $locationbias = 'ipbias')
    {
        $results = [
            'status' => 'NOK'
        ];

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $current_user->getPreference('language');

        $lang = 'en';
        if (!empty($currentLanguage)) {
            $lang = strtolower(substr($currentLanguage, 0, 2));
        }

        // https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=sol4 it&inputtype=textquery&fields=photos,formatted_address,name,place_id&key=AIzaSyCmw4Z9h4lf9eUGVyjKPyr9yr1s8WeXlPM
        $geocodingkey = SpiceConfig::getInstance()->config['googleapi']['geocodingkey'] ?: SpiceConfig::getInstance()->config['googleapi']['mapskey'];

        // Timeout in seconds
        // curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $ch = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key={$geocodingkey}&locationbias=".trim($locationbias)."&inputtype=textquery&language={$lang}&fields=photos,formatted_address,name,place_id&input=" . urlencode($term),
            CURLOPT_HEADER         => 1
        ];
        curl_setopt_array($ch, $curlOptions);

        // Timeout in seconds
        // curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/google/search');
        $logEntryHandler->writeOutogingLogEntry();

        $response = curl_exec($ch);

        $logEntryHandler->updateOutgoingLogEntry($ch, $response);

        $info = curl_getinfo($ch);
        curl_close($ch);

        $response = substr($response, $info['header_size']);

        if ($response) {
            $results = json_decode($response);
        }

        return $results;
    }

    public function autocomplete($term)
    {


        $results = [
            'status' => 'NOK'
        ];

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $current_user->getPreference('language');

        $lang = 'en';
        if (!empty($currentLanguage)) {
            $lang = strtolower(substr($currentLanguage, 0, 2));
        }

        $geocodingkey = SpiceConfig::getInstance()->config['googleapi']['geocodingkey'] ?: SpiceConfig::getInstance()->config['googleapi']['mapskey'];


        $ch = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => "https://maps.googleapis.com/maps/api/place/autocomplete/json?key={$geocodingkey}&types=geocode&language={$lang}&input=" . urlencode($term),
            CURLOPT_HEADER         => 1
        ];
        curl_setopt_array($ch, $curlOptions);

        // Timeout in seconds
        // curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/google/autocomplete');
        $logEntryHandler->writeOutogingLogEntry();

        $response = curl_exec($ch);

        $logEntryHandler->updateOutgoingLogEntry($ch, $response);

        $info = curl_getinfo($ch);
        curl_close($ch);

        $response = substr($response, $info['header_size']);

        if ($response) {
            $results = json_decode($response);
        }

        return $results;
    }

    public function getplacedetails($placeid)
    {
        $db = DBManagerFactory::getInstance();

        $results = [
            'status' => 'NOK'
        ];

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $current_user->getPreference('language');

        $lang = 'en';
        if (!empty($currentLanguage)) {
            $lang = strtolower(substr($currentLanguage, 0, 2));
        }

        $geocodingkey = SpiceConfig::getInstance()->config['googleapi']['geocodingkey'] ?: SpiceConfig::getInstance()->config['googleapi']['mapskey'];

        $ch = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => "https://maps.googleapis.com/maps/api/place/details/json?language={$lang}&key={$geocodingkey}&placeid={$placeid}",
            CURLOPT_HEADER         => 1
        ];
        curl_setopt_array($ch, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/google/placedetails');
        $logEntryHandler->writeOutogingLogEntry();

        $response = curl_exec($ch);

        $logEntryHandler->updateOutgoingLogEntry($ch, $response);

        $info = curl_getinfo($ch);
        curl_close($ch);

        $response = substr($response, $info['header_size']);

        if ($response) {
            $responseObject = json_decode($response);
            $addrArray = [];
            foreach ($responseObject->result->address_components as $resultItem) {
                foreach ($resultItem->types as $resultType) {
                    $addrArray[$resultType] = ['long' => $resultItem->long_name,'short' => $resultItem->short_name];
                }
            }

            // build state
            $state = $db->fetchByAssoc($db->query("SELECT sc FROM syscountrystates WHERE cc='{$addrArray['country']['short']}' AND google_aa like '%{$addrArray['administrative_area_level_1']['short']}%'"));

            $results['status'] = 'OK';
            $results['address'] = [
                'street' => $addrArray['route']['long'] . ' ' . $addrArray['street_number']['long'],
                'street_name' => $addrArray['route']['long'],
                'street_number' => $addrArray['street_number']['long'],
                'city' => $addrArray['locality']['long'],
                'district' => $addrArray['sublocality_level_1']['long'],
                'state' => $state ? $state['sc'] : $addrArray['administrative_area_level_1']['short'],
                'postalcode' => $addrArray['postal_code']['short'],
                'country' => $addrArray['country']['short'],
                'location' => $responseObject->result->geometry->location
            ];
            $results['formatted_address'] = $responseObject->result->formatted_address;
            $results['formatted_phone_number'] = $responseObject->result->formatted_phone_number;
            $results['international_phone_number'] = $responseObject->result->international_phone_number;
            $results['website'] = $responseObject->result->website;
            $results['name'] = $responseObject->result->name;
        }

        return $results;
    }

    public function geocodeAddress($searchString){
        $geocodingkey = SpiceConfig::getInstance()->get('googleapi.geocodingkey');

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => "https://maps.googleapis.com/maps/api/geocode/json?address={$searchString}&key={$geocodingkey}",
            CURLOPT_HEADER         => 1
        ];
        curl_setopt_array($curl, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/google/geocode');
        $logEntryHandler->writeOutogingLogEntry();

        $response = curl_exec($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $response);

        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        if ($response) {
            $body = substr($response, $info['header_size']);
            $results = json_decode($body);

            return $results;

        }

        return false;
    }
}
