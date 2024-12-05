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

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SysCurrencies\SysCurrencies;

/**
 * Currency.php
 * This class encapsulates the handling of currency conversions and
 * formatting in the SugarCRM application.
 *
 */
class Currency extends SpiceBean
{

    var $id;
    var $name;
    var $symbol ;
    var $iso4217;
    var $deleted;
    var $conversion_rate;

    public function convertToBase($amount, $precision = 6)
    {
        return SysCurrencies::getInstance()->convertToBase($this->id, $amount, null, $precision);
    }

    public function convertFromBase($amount, $precision = 6)
    {
        return SysCurrencies::getInstance()->convertFromBase($this->id, $amount, null, $precision);
    }

    /**
     * getDefaultCurrencyName
     *
     * Returns the default currency name as defined in application
     * @return String value of default currency name
     */
    function getDefaultCurrencyName()
    {
        return SysCurrencies::getInstance()->getSystemCurrency()->name;
    }

    /**
     * getDefaultCurrencySymbol
     *
     * Returns the default currency symobol in application
     * @return String value of default currency symbol(e.g. $)
     */
    function getDefaultCurrencySymbol()
    {
        return SysCurrencies::getInstance()->getSystemCurrency()->currency_symbol;
    }

    /**
     * getDefaultISO4217
     *
     * Returns the default ISO 4217 standard currency code value
     * @return String value for the ISO 4217 standard code(e.g. EUR)
     */
    function getDefaultISO4217()
    {
        return SysCurrencies::getInstance()->getSystemCurrency()->iso4217;
    }

    function retrieveIDByIso($isoCode)
    {
        if ($this->getDefaultISO4217() == $isoCode) {
            return "-99";
        } else {
            $c = SysCurrencies::getInstance()->getCurrencyByISO($isoCode);
            if ($c)
                return $c->id;
            else
                return "-99";
        }
    }


    function retrieve($id = -1, $encode = true, $deleted = true, $relationships = true)
    {
        $c = SysCurrencies::getInstance()->getCurrencyByID($id);

        if (!$c) return false;

        $this->id = $id;
        $this->name = $c->name;
        $this->symbol = $c->currency_symbol;
        $this->iso4217 = $c->iso4217;
        $this->deleted = 0;
        $this->conversion_rate = $c->exchange_rate;
    }

    /**
     * Method for returning the currency symbol, must return chr(2) for the € symbol
     * to display correctly in pdfs
     * Parameters:
     *    none
     * Returns:
     *    $symbol otherwise chr(2) for euro symbol
     */
    function getPdfCurrencySymbol()
    {
        if ($this->symbol == '&#8364;' || $this->symbol == '€')
            return chr(2);
        return $this->symbol;
    }

    // saving is not allowe
    function save($check_notify = FALSE, $fts_index_bean = TRUE)
    {
        return false;

        // SpiceCache::clear('currency_list');
        // return parent::save($check_notify, $fts_index_bean);
    }
} // end currency class
