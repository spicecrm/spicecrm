<?php
namespace SpiceCRM\includes\SysCurrencies\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class SysCurrenciesSchedulerJobTasks
{

    public function loadCurrencies(): bool {
        $db = DBManagerFactory::getInstance();

        $curl = curl_init();

        $options = [
            CURLOPT_URL => "https://api.exchangeratesapi.io/v1/latest?access_key=924c35d682071042e77bc0440c854e88",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CUSTOMREQUEST => 'GET'
        ];

        curl_setopt_array($curl, $options);

        $logger = new APILogEntryHandler();
        $logger->generateOutgoingLogEntry($options, 'exchangeratesapi');

        $response = json_decode(curl_exec($curl));

        $logger->updateOutgoingLogEntry($curl, $response);
        $logger->writeOutogingLogEntry();

        if($response->success){
            $datetime = TimeDate::getInstance()->nowDb();
            foreach ($response->rates as $iso => $rate) {
                $currency = $db->fetchOne("SELECT id FROM syscurrencies WHERE iso4217='{$iso}'");
                if($currency){
                    $db->insertQuery('syscurrenciesexchangerates', [
                        'id' => SpiceUtils::createGuid(),
                        'syscurrency_id' => $currency['id'],
                        'exchangerate_date' => $datetime,
                        'exchange_rate' => $rate
                    ]);
                }
            }
        }

        curl_close($curl);

        return $response->success;
    }

}