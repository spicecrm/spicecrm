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

namespace SpiceCRM\includes\Localization;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * Localization manager
 * @api
 */
class Localization
{
	var $availableCharsets = [
		'BIG-5',        //Taiwan and Hong Kong
		/*'CP866'			  // ms-dos Cyrillic */
		/*'CP949'			  //Microsoft Korean */
		'CP1251',       //MS Cyrillic
		'CP1252',       //MS Western European & US
		'EUC-CN',       //Simplified Chinese GB2312
		'EUC-JP',       //Unix Japanese
		'EUC-KR',       //Korean
		'EUC-TW',       //Taiwanese
		'ISO-2022-JP',  //Japanese
		'ISO-2022-KR',  //Korean
		'ISO-8859-1',   //Western European and US
		'ISO-8859-2',   //Central and Eastern European
		'ISO-8859-3',   //Latin 3
		'ISO-8859-4',   //Latin 4
		'ISO-8859-5',   //Cyrillic
		'ISO-8859-6',   //Arabic
		'ISO-8859-7',   //Greek
		'ISO-8859-8',   //Hebrew
		'ISO-8859-9',   //Latin 5
		'ISO-8859-10',  //Latin 6
		'ISO-8859-13',  //Latin 7
		'ISO-8859-14',  //Latin 8
		'ISO-8859-15',  //Latin 9
		'KOI8-R',       //Cyrillic Russian
		'KOI8-U',       //Cyrillic Ukranian
		'SJIS',         //MS Japanese
		'UTF-8',        //UTF-8
    ];
	var $localeNameFormat;
	var $localeNameFormatDefault;
	var $default_export_charset = 'UTF-8';
	var $default_email_charset = 'UTF-8';
	var $currencies = []; // array loaded with current currencies
    var $invalidNameFormatUpgradeFilename = 'upgradeInvalidLocaleNameFormat.php';
    /* Charset mappings for iconv */
    var $iconvCharsetMap = [
        'KS_C_5601-1987' => 'CP949',
        'ISO-8859-8-I' => 'ISO-8859-8'
    ];

	/**
	 * sole constructor
	 */
	public function __construct()
    {
		$this->localeNameFormatDefault = empty( SpiceConfig::getInstance()->config['default_preferences']['locale_name_format'] ) ? 's f l' : SpiceConfig::getInstance()->config['default_preferences']['locale_name_format'];
	}

	/**
	 * returns an array of Sugar Config defaults that are determined by locale settings
	 * @return array
	 */
	function getLocaleConfigDefaults() {
		$coreDefaults = [
			'currency'								=> '',
			'datef'									=> 'm/d/Y',
			'timef'									=> 'H:i',
			'currency_significant_digits'	=> 2,
			'currency_symbol'				=> '$',
			'export_charset'				=> $this->default_export_charset,
			'locale_name_format'			=> 's f l',
            'name_formats'                          => ['s f l' => 's f l', 'f l' => 'f l', 's l' => 's l', 'l, s f' => 'l, s f',
                                                            'l, f' => 'l, f', 's l, f' => 's l, f', 'l s f' => 'l s f', 'l f s' => 'l f s'],
			'number_grouping_seperator'		=> ',',
			'decimal_seperator'				=> '.',
			'export_delimiter'						=> ',',
			'email_charset'					=> $this->default_email_charset,
        ];

		return $coreDefaults;
	}

	/**
	 * abstraction of precedence
	 * @param string prefName Name of preference to retrieve based on overrides
	 * @param object user User in focus, default null (current_user)
	 * @return string pref Most significant preference
	 */
	function getPrecedentPreference($prefName, $user=null, $sugarConfigPrefName = '') {
		$current_user = AuthenticationController::getInstance()->getCurrentUser();
		

		$userPref = '';
		$coreDefaults = $this->getLocaleConfigDefaults();
		$pref = isset($coreDefaults[$prefName]) ? $coreDefaults[$prefName] : ''; // defaults, even before config.php

		if($user != null) {
			$userPref = $user->getPreference($prefName);
		} elseif(!empty($current_user)) {
			$userPref = $current_user->getPreference($prefName);
		}
		// Bug 39171 - If we are asking for default_email_charset, check in emailSettings['defaultOutboundCharset'] as well
		if ( $prefName == 'email_charset' ) {
		    if($user != null) {
                $emailSettings = $user->getPreference('emailSettings', 'Emails');
            } elseif(!empty($current_user)) {
                $emailSettings = $current_user->getPreference('emailSettings', 'Emails');
            }
            if ( isset($emailSettings['defaultOutboundCharset']) ) {
                $userPref = $emailSettings['defaultOutboundCharset'];
            }
		}

		// set fallback defaults defined in this class
		if(isset($this->$prefName)) {
			$pref = $this->$prefName;
		}
		//rrs: 33086 - give the ability to pass in the preference name as stored in \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config.
		if(!empty($sugarConfigPrefName)){
			$prefName = $sugarConfigPrefName;
		}
		// cn: 9549 empty() call on a value of 0 (0 significant digits) resulted in a false-positive.  changing to "isset()"
		$pref = (!isset(SpiceConfig::getInstance()->config[$prefName]) || (empty(SpiceConfig::getInstance()->config[$prefName]) && SpiceConfig::getInstance()->config[$prefName] !== '0')) ? $pref : SpiceConfig::getInstance()->config[$prefName];
		$pref = (empty($userPref) && $userPref !== '0') ? $pref : $userPref;
		return $pref;
	}


	///////////////////////////////////////////////////////////////////////////
	////	CHARSET TRANSLATION


	/**
	 * translates a character set from one encoding to another encoding
	 * @param string string the string to be translated
	 * @param string fromCharset the charset the string is currently in
	 * @param string toCharset the charset to translate into (defaults to UTF-8)
	 * @param bool   forceIconv force using the iconv library instead of mb_string
	 * @return string the translated string
	 */
    function translateCharset($string, $fromCharset, $toCharset='UTF-8', $forceIconv = false)
    {
        LoggerManager::getLogger()->debug("Localization: translating [{$string}] from {$fromCharset} into {$toCharset}");

        // Bug #35413 Function has to use iconv if $fromCharset is not in mb_list_encodings
        $isMb = function_exists('mb_convert_encoding') && !$forceIconv;
        $isIconv = function_exists('iconv');
        if ($isMb == true)
        {
            $fromCharset = strtoupper($fromCharset);
            $listEncodings = mb_list_encodings();
            $isFound = false;
            foreach ($listEncodings as $encoding)
            {
                if (strtoupper($encoding) == $fromCharset)
                {
                    $isFound = true;
                    break;
                }
            }
            $isMb = $isFound;
        }

        if($isMb)
        {
            return mb_convert_encoding($string, $toCharset, $fromCharset);
        }
        elseif($isIconv)
        {
            $newFromCharset = $fromCharset;
            if (isset($this->iconvCharsetMap[$fromCharset])) {
                $newFromCharset = $this->iconvCharsetMap[$fromCharset];
                LoggerManager::getLogger()->debug("Localization: iconv using charset {$newFromCharset} instead of {$fromCharset}");
            }
            $newToCharset = $toCharset;
            if (isset($this->iconvCharsetMap[$toCharset])) {
                $newToCharset = $this->iconvCharsetMap[$toCharset];
                LoggerManager::getLogger()->debug("Localization: iconv using charset {$newToCharset} instead of {$toCharset}");
            }
            return iconv($newFromCharset, $newToCharset, $string);
        }
        else
        {
            return $string;
        } // end else clause
    }


	/**
	 * returns the charset preferred in descending order: User, Sugar Config, DEFAULT
	 * @param string charset to override ALL, pass a valid charset here
	 * @return string charset the chosen character set
	 */
	function getExportCharset($charset='', $user=null) {
		$charset = $this->getPrecedentPreference('export_charset', $user);
		return $charset;
	}


	////	END CHARSET TRANSLATION
	///////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////////////
	////	NUMBER DISPLAY FORMATTING CODE
    /**
     * @deprecated
     * @param $user
     * @return string|null
     */
	function getDecimalSeparator($user=null) {
        // Bug50887 this is purposefully misspelled as ..._seperator to match the way it's defined throughout the app.
		$dec = $this->getPrecedentPreference('decimal_seperator', $user);
		return $dec;
	}

    /**
     * @deprecated
     */
	function getPrecision($user=null) {
		$precision = $this->getPrecedentPreference('currency_significant_digits', $user);
		return $precision;
	}

	////	END NUMBER DISPLAY FORMATTING CODE
	///////////////////////////////////////////////////////////////////////////

}
