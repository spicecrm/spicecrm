<?php

namespace SpiceCRM\includes\SysCurrencies;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Users\User;

class SysCurrencies
{
    /**
     * Global instance of TimeDate
     * @var SysCurrencies
     */
    protected static $sysCurrencies;

    /*
     * the currecnies
     */
    protected $currencies;

    protected $systemCurrency;

    /**
     * Create SysCurrencies handler
     */
    public function __construct(User $user = null)
    {
        $exchangeRateLimitQuery = DBManagerFactory::getInstance()->limitQuerySql("SELECT exchange_rate FROM syscurrenciesexchangerates WHERE syscurrency_id =  syscurrencies.id ORDER BY exchangerate_date DESC", 0, 1);

        $currencies = DBManagerFactory::getInstance()->fetchAll("SELECT *, ($exchangeRateLimitQuery) exchange_rate FROM syscurrencies");

        // if we have no currencies Migrate them and load
        if($currencies == false || count($currencies) == 0){
            // migrate
            $this->MigrateAndInitialize();

            // reload
            $currencies = DBManagerFactory::getInstance()->fetchAll("SELECT *, ($exchangeRateLimitQuery) exchange_rate FROM syscurrencies");
        }

        if($currencies) {
            foreach ($currencies as $currency) {

                $currency['is_systemcurrency'] = (int)$currency['is_systemcurrency'];
                $currency['is_inactive'] = (int)$currency['is_inactive'];

                $this->currencies[$currency['iso4217']] = $currency;

                // set the system currency
                if ($currency['is_systemcurrency']) $this->systemCurrency = $currency;
            }
        }
    }

    /**
     * Get SysCurrencies instance
     * @return SysCurrencies
     */
    public static function getInstance()
    {
        if(empty(self::$sysCurrencies)) {

            self::$sysCurrencies = new self;
        }
        return self::$sysCurrencies;
    }

    /**
     * returns all maintained currencies
     *
     * @return array
     */
    public function getAllCurrencies($activeOnly = true){
        return $activeOnly ? array_values(array_filter($this->currencies, function($c){
            return $c['is_inactive'] != 1;
        })) : array_values($this->currencies);
    }

    /**
     * returns the system currency as object
     *
     * @return object
     */
    public function getSystemCurrency(){
        return (object) $this->systemCurrency;
    }

    public function getCurrencyByISO($isoCode){
        return isset($this->currencies[$isoCode]) ? (object) $this->currencies[$isoCode] : false;
    }

    public function getCurrencyByID($id){
        if($id == '-99') return (object) $this->systemCurrency;

        foreach ($this->currencies as $currency) {
            if ($currency['id'] == $id) {
                return (object) $currency;
            }
        }
        return false;
    }

    private function MigrateAndInitialize() {
        $db = DBManagerFactory::getInstance();
        // migrate the system currency
        $sysCur = SpiceConfig::getInstance()->config['currencies'];
        $db->insertQuery('syscurrencies', [
            'id' => '-99',
            'name' => $sysCur['default_currency_name'],
            'iso4217' => $sysCur['default_currency_iso4217'],
            'currency_symbol' => $sysCur['default_currency_symbol'],
            'is_inactive' => 0,
            'is_systemcurrency' => 1,
            'currency_precision' => $sysCur['default_currency_significant_digits']
        ]);

        // migrate currencies table
        $legacyCurrencies = $db->fetchAll("SELECT * FROM currencies WHERE deleted = 0");
        foreach ($legacyCurrencies as $legacyCurrency) {
            $db->insertQuery('syscurrencies', [
                'id' => $legacyCurrency['id'],
                'name' => $legacyCurrency['name'],
                'iso4217' => $legacyCurrency['iso4217'],
                'currency_symbol' => $legacyCurrency['symbol'],
                'is_inactive' => 0,
                'is_systemcurrency' => 0
            ]);

            if($legacyCurrency['conversion_rate']){
                $db->insertQuery('syscurrenciesexchangerates', [
                    'id' => SpiceUtils::createGuid(),
                    'syscurrency_id' => $legacyCurrency['id'],
                    'exchangerate_date' => TimeDate::getInstance()->nowDb(),
                    'exchange_rate' => $legacyCurrency['conversion_rate']
                ]);
            }
        }

        // load all other currencies from the file and set inactive if we already loaded some other currencies
        $this->initializeCurrencies($legacyCurrencies && count($legacyCurrencies) > 0 ? false : true);

    }

    /**
     * loads currencies from the json file
     *
     * @param $setActive if set to true all currencies will be set active, otherwise they will be loaded as inactive
     *
     * @return true
     * @throws \Exception
     */
    public function initializeCurrencies($setActive = true){
        $db = DBManagerFactory::getInstance();

        $currencies = json_decode(file_get_contents('include/SysCurrencies/currencies.json'));

        foreach ($currencies as $currency) {
            $record = $db->fetchOne("SELECT * FROM syscurrencies WHERE iso4217='{$currency->alpha}'");

            if($record){
                $values = [
                    'id' => $record['id'],
                    'is_inactive' => $record['is_inactive'],
                    'is_systemcurrency' => $record['is_systemcurrency']
                ];
            } else {
                $values = [
                    'id' => SpiceUtils::createGuid(),
                    'is_inactive' => $setActive ? 0 : 1,
                    'is_systemcurrency' => 0
                ];
            }

            // set values
            $values['iso4217'] = $currency->alpha;
            $values['name'] = $currency->name;
            $values['currency_symbol'] = $currency->symbol;
            $values['currency_isonumeric'] = $currency->numeric;
            $values['currency_precision'] = $currency->precision;

            if($record){
                $db->updateQuery('syscurrencies', ['id' => $values['id']], $values);
            } else {
                $db->insertQuery('syscurrencies', $values);
            }
        }

        return true;
    }

    /**
     * sets the system currency
     *
     * @param string $currencyID
     * @return true
     * @throws NotFoundException
     * @throws \SpiceCRM\includes\ErrorHandlers\DatabaseException
     */
    public function setSystemCurrency(string $currencyID){
        $db = DBManagerFactory::getInstance();

        $seed = $db->fetchOne("SELECT * FROM syscurrencies WHERE id='$currencyID'");
        if(!$seed){
            throw new NotFoundException('Currency with the given ID not found');
        }

        // remove system currency flag
        // $db->query("UPDATE syscurrencies SET is_systemcurrency=0 WHERE is_systemcurrency=1");

        // set the system currency on the new flag
        $db->query("UPDATE syscurrencies SET is_systemcurrency=1, id='-99' WHERE id='{$currencyID}'");

        // set the new systemcurrency
        $this->systemCurrency = $seed;

        // return success
        return true;
    }

    /**
     * toggles the active/inactive flag
     *
     * @param string $currencyID
     * @param bool $active
     * @return true
     * @throws NotFoundException
     */
    public function toggleActive(string $currencyID, bool $active){
        $db = DBManagerFactory::getInstance();

        $seed = $db->fetchOne("SELECT * FROM syscurrencies WHERE id='$currencyID'");
        if(!$seed){
            throw new NotFoundException('Currency with the given ID not found');
        }

        $db->updateQuery('syscurrencies', ['id' => $currencyID], ['is_inactive' => $active ? 0 : 1]);

        return true;
    }

    /**
     * returns exchange rate records for a given currency id
     *
     * @param string $currencyID
     * @return array|false
     * @throws \Exception
     */
    public function getExchangeRates(string $currencyID){
        return DBManagerFactory::getInstance()->fetchAll("SELECT exchangerate_date, exchange_rate FROM syscurrenciesexchangerates WHERE syscurrency_id='{$currencyID}' ORDER BY exchangerate_date DESC");
    }

    public function convertFromBase($currencyId, $amount, $precision = 6){
        $c = $this->getCurrencyByID($currencyId);
        return round(($amount * $c->exchange_rate), $precision);
    }

    public function convertToBase($currencyId, $amount, $precision = 6){
        $c = $this->getCurrencyByID($currencyId);
        return round(($amount / $c->exchange_rate), $precision);
    }

}