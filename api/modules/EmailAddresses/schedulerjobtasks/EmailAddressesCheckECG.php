<?php

namespace SpiceCRM\modules\EmailAddresses\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class EmailAddressesCheckECG
{

    public function runCheck(){
        $db = DBManagerFactory::getInstance();

        $emailAddressArray = [];
        $domainArray = [];

        $records = $db->query("SELEDCT id, email_address FROM email_addresses WHERE deleted = 0 AND _regulatory_blocked IS NULL LIMIT 1000");
        while($record = $db->fetchByAssoc($records)){
            $email_address_lowercase = strtolower($record['email_address']);

            $emailAddressArray[hash('sha512', $email_address_lowercase)] = $record['id'];

            // get the domain
            $email_address_array = explode('@', $email_address_lowercase);
            $domainArray[hash('sha512', $email_address_array[1])] = $email_address_array[1];
        }

        // curl request
        $body = [
            'emails' => array_merge(array_keys($emailAddressArray), array_keys($domainArray)),
            'contained' => true,
            'hashed' => true
        ];

        $curl = curl_init();

        $curlOptions = [
            //CURLOPT_SSL_VERIFYPEER => 0,
            //CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CONNECTTIMEOUT => 30,
            CURLOPT_URL => SpiceConfig::getInstance()->get('ecg.url'),
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'X-API-KEY: ' . SpiceConfig::getInstance()->get('ecg.api_key')
            ]
        ];
        curl_setopt_array($curl, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'ecg');

        $response = curl_exec($curl);

        // parse response


        return true;
    }
}