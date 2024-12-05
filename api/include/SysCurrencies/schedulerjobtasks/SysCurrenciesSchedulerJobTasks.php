<?php
namespace SpiceCRM\includes\SysCurrencies\schedulerjobtasks;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysCurrencies\SysCurrencies;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class SysCurrenciesSchedulerJobTasks
{

    public function getFromExchangeratesAPI(): bool {

        $apiKey = SpiceConfig::getInstance()->get('currencies.exchangeratesapikey');
        if(!$apiKey) return false;

        $db = DBManagerFactory::getInstance();

        $curl = curl_init();

        $options = [
            CURLOPT_URL => "https://api.exchangeratesapi.io/v1/latest?access_key={$apiKey}",
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
                $currency = SysCurrencies::getInstance()->getCurrencyByISO($iso);
                if($currency){
                    $db->insertQuery('syscurrenciesexchangerates', [
                        'id' => SpiceUtils::createGuid(),
                        'syscurrency_id' => $currency->id,
                        'exchangerate_date' => $datetime,
                        'exchange_rate' => $rate
                    ]);
                }
            }
        }

        curl_close($curl);

        return $response->success;
    }

    public function getFromCRM(): bool {
        $crmurl = SpiceConfig::getInstance()->get('currencies.crmurl');
        if(!$crmurl) return false;

        $db = DBManagerFactory::getInstance();

        $curl = curl_init();

        $options = [
            CURLOPT_URL => "{$crmurl}/api/system/currencies/exchangerates",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET'
        ];

        curl_setopt_array($curl, $options);

        $logger = new APILogEntryHandler();
        $logger->generateOutgoingLogEntry($options, 'exchangeratescrm');

        $response = json_decode(curl_exec($curl));

        $logger->updateOutgoingLogEntry($curl, $response);
        $logger->writeOutogingLogEntry();

        if($response){
            foreach ($response as $iso => $rateDetails) {
                // check if we have the record already
                if($db->fetchOne("SELECT id FROM syscurrencyexchangerates WHERE id='{$rateDetails->id}'")){
                    continue;
                }

                // get the iso
                $currency = SysCurrencies::getInstance()->getCurrencyByISO($iso);
                if($currency){
                    $db->insertQuery('syscurrenciesexchangerates', [
                        'id' => $rateDetails->id,
                        'syscurrency_id' => $currency->id,
                        'exchangerate_date' => $rateDetails->date,
                        'exchange_rate' => $rateDetails->rate
                    ]);
                }
            }
        }

        curl_close($curl);

        return true;
    }
}