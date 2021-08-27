<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

namespace SpiceCRM\modules\Currencies;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

/**
 * Currency.php
 * This class encapsulates the handling of currency conversions and
 * formatting in the SugarCRM application.
 *
 */
class Currency extends SugarBean
{

	var $table_name = "currencies";
	var $object_name = "Currency";
	var $module_dir = "Currencies";
	var $disable_num_format = true;

    public function __construct()
	{
		parent::__construct();
		global $app_strings,  $locale;
$current_user = AuthenticationController::getInstance()->getCurrentUser();
		$this->field_defs['hide'] = ['name'=>'hide', 'source'=>'non-db', 'type'=>'varchar','len'=>25];
		$this->field_defs['unhide'] = ['name'=>'unhide', 'source'=>'non-db', 'type'=>'varchar','len'=>25];
		$this->disable_row_level_security =true;
	}

    /**
     * convertToDollar
     * This method accepts a currency amount and converts it to the US Dollar amount
     *
     * @param $amount The currency amount to convert to US Dollars
     * @param $precision The rounding precision scale
     * @return currency value in US Dollars from conversion
     */
	function convertToDollar($amount, $precision = 6) {
		return round(($amount / $this->conversion_rate), $precision);
	}

    /**
     * convertFromCollar
     * This method accepts a US Dollar amount and returns a currency amount
     * with the conversion rate applied to it.
     *
     * @param $amount The currency amount in US Dollars
     * @param $precision The rounding precision scale
     * @return currency value from US Dollar conversion
     */
	function convertFromDollar($amount, $precision = 6){
		return round(($amount * $this->conversion_rate), $precision);
	}

    /**
     * getDefaultCurrencyName
     *
     * Returns the default currency name as defined in application
     * @return String value of default currency name
     */
	function getDefaultCurrencyName(){
		
		return SpiceConfig::getInstance()->config['currencies']['default_currency_name'] ?: SpiceConfig::getInstance()->config['default_currency_name'];
	}

    /**
     * getDefaultCurrencySymbol
     *
     * Returns the default currency symobol in application
     * @return String value of default currency symbol(e.g. $)
     */
	function getDefaultCurrencySymbol(){
		
		return SpiceConfig::getInstance()->config['currencies']['default_currency_symbol'] ?: SpiceConfig::getInstance()->config['default_currency_symbol'];
	}

    /**
     * getDefaultISO4217
     *
     * Returns the default ISO 4217 standard currency code value
     * @return String value for the ISO 4217 standard code(e.g. EUR)
     */
	function getDefaultISO4217(){
		
		return SpiceConfig::getInstance()->config['currencies']['default_currency_iso4217'] ?: SpiceConfig::getInstance()->config['default_currency_iso4217'];
	}

    function retrieveIDByIso($isoCode){
        $db = DBManagerFactory::getInstance();
        if($this->getDefaultISO4217() == $isoCode)
        {
            return "-99";
        }
        else
        {
            $c = $this->retrieve_by_string_fields(['iso4217' => $isoCode]);
            if($c->id)
                return $c->id;
            else
                return "-99";
        }
    }

	
    function retrieve($id = -1, $encode=true, $deleted=true, $relationships = true) {
     	if($id == '-99'){
     		$this->name = 	$this->getDefaultCurrencyName();
     		$this->symbol = $this->getDefaultCurrencySymbol();
     		$this->id = '-99';
     		$this->conversion_rate = 1;
     		$this->iso4217 = $this->getDefaultISO4217();
     		$this->deleted = 0;
     		$this->status = 'Active';
     		$this->hide = '<!--';
     		$this->unhide = '-->';
     	}else{
     		parent::retrieve($id, $encode, $deleted, $relationships);
     	}
     	if(!isset($this->name) || $this->deleted == 1){
     		$this->name = 	$this->getDefaultCurrencyName();
     		$this->symbol = $this->getDefaultCurrencySymbol();
     		$this->conversion_rate = 1;
     		$this->iso4217 = $this->getDefaultISO4217();
     		$this->id = '-99';
     		$this->deleted = 0;
     		$this->status = 'Active';
     		$this->hide = '<!--';
     		$this->unhide = '-->';
     	}
        return $this;
     }

    /**
     * Method for returning the currency symbol, must return chr(2) for the € symbol
     * to display correctly in pdfs
     * Parameters:
     * 	none
     * Returns:
     * 	$symbol otherwise chr(2) for euro symbol
     */
     function getPdfCurrencySymbol() {
     	if($this->symbol == '&#8364;' || $this->symbol == '€')
     		return chr(2);
     	return $this->symbol;
     }

    function save($check_notify = FALSE, $fts_index_bean = TRUE) {
        SugarCache::sugar_cache_clear('currency_list');
        return parent::save($check_notify, $fts_index_bean);
    }
} // end currency class
