<?php

namespace SpiceCRM\includes\SpiceTemplateCompiler\TemplateFunctions;

use Com\Tecnick\Barcode\Barcode;
use DateTime;
use DateTimeZone;
use IntlDateFormatter;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

# use SpiceCRM\includes\utils\SpiceUtils;

class SystemTemplateFunctions {

    static function dateFormat($compiler, $beans, $inputString, $format, $placeHolderForOldLanguageParameter = null){

        if (empty($inputString)) return '';

        # For formatting look here:
        # https://www.php.net/manual/de/datetime.format.php

        $date = DateTime::createFromFormat(TimeDate::getInstance()->get_db_date_time_format(), $inputString);
        if(!$date){
            $date = DateTime::createFromFormat(TimeDate::getInstance()->get_date_time_format(), $inputString);
        }
        if(!$date){
            $date = DateTime::createFromFormat(AuthenticationController::getInstance()->getCurrentUser()->getPreference("datef")." ". AuthenticationController::getInstance()->getCurrentUser()->getPreference("timef"), $inputString);
        }

        return $date->format( $format );

    }

    static function dateFormatIntl( $compiler, $beans, $inputString, $format, $language = 'en_US'){

        # For formatting look here:
        # https://unicode-org.github.io/icu/userguide/format_parse/datetime/

        $date = DateTime::createFromFormat(TimeDate::getInstance()->get_db_date_time_format(), $inputString);
        if(!$date){
            $date = DateTime::createFromFormat(TimeDate::getInstance()->get_date_time_format(), $inputString);
        }
        if(!$date){
            $date = DateTime::createFromFormat(AuthenticationController::getInstance()->getCurrentUser()->getPreference("datef")." ". AuthenticationController::getInstance()->getCurrentUser()->getPreference("timef"), $inputString);
        }

        if ( class_exists('IntlDateFormatter')) {
            $formatter = new IntlDateFormatter($language, IntlDateFormatter::SHORT, IntlDateFormatter::SHORT);
            $formatter->setPattern($format);
            return $formatter->format($date);
        } else {
            return '*** Missing PHP Class IntlDateFormatter ***';
        }

    }

    static function cat( $compiler, $beans, $inputString, $stringToAdd ) {
        return isset( $inputstring[0] ) ? $$inputstring.$stringToAdd : $$inputString;
    }

    static function uppercase( $compiler, $beans, $inputstring ) {
        return strtoupper( $inputstring );
    }

    static function lowercase( $compiler, $beans, $inputstring ) {
        return strtolower( $inputstring );
    }

    static function nl2br( $compiler, $beans, $inputstring ) {
        return nl2br( $inputstring );
    }

    static function truncate( $compiler, $beans, $inputString, $length, $endchars = '' ) {
        if ( !is_numeric( $length ) and !ctype_digit( $length )) {
            throw new BadRequestException('Output template function "truncate": Invalid truncation length "'.$length.'"');
        }
        return substr( $inputString, 0, $length ).$endchars;
    }

    static function replace( $compiler, $beans, $inputString, $needle, $replacement ) {
        return str_replace( $needle, $replacement, $inputString );
    }

    static function capitalize( $compiler, $beans, $inputString ) {
        return ucwords( $inputString );
    }

    static function spacify( $compiler, $beans, $inputString ) {
        return preg_replace( '#[\w\-](?!$)#', '\\0 ', str_replace( ' ', '   ', $inputString ));
    }

    static function barcode( $compiler, $beans, $inputString, $type = null, $width = null, $height = null, $color = 'black') {
        if( !extension_loaded('gd')) {
            // throw new Exception('Output template function "barcode": GD library not loaded!');
            throw new BadRequestException('Output template function "barcode": GD library not loaded!');
        }
        if ( isset( $width ) and !is_numeric( $width ) and !ctype_digit( $width )) {
            throw new BadRequestException('Output template function "barcode": Invalid barcode width "'.$width.'"');
        }
        if ( isset( $height ) and !is_numeric( $height ) and !ctype_digit( $height )) {
            throw new BadRequestException('Output template function "barcode": Invalid barcode height "'.$height.'"');
        }
        if ( $height === null ) $height = $width;
        if ( $width === null ) $width = 100;
        if ( $height === null ) $height = 100;
        $barcodeFactory = new Barcode(); // instantiate the barcode class
        // generate a barcode
        try {
            $barcode = $barcodeFactory->getBarcodeObj(
                strtoupper( $type ),
                $inputString,
                $width, $height, $color
            );
        } catch (\Exception $e) {
            throw new BadRequestException( 'Output template function "barcode": '.$e->getMessage());
        }
        $barcode->setBackgroundColor('white'); // background color
        # Return the barcode/qrcode as PNG base64 encoded.
        $pngData = $barcode->getPngData();
        return 'data:image/png;base64,'.base64_encode( $pngData );
    }

    // No piping functions (functions without input value):

    static function lorem( $compiler, $beans, $length ) {
        if ( !is_numeric( $length ) and !ctype_digit( $length )) {
            throw new BadRequestException('Output template function "lorem": Missing or invalid text length "'.$length.'".');
        }
        $text = 'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        if ( strlen( $text ) < $length ) $output = str_pad( $text, $length, $text, STR_PAD_RIGHT );
        else $output = substr( $text, 0, $length );
        $output = trim( $output );
        if ( $output[strlen($output)-1] !== '.' ) $output[strlen($output)-1] = '.';
        return $output;
    }

    static function currentDateTime( $compiler, $beans, $format = null ) {
        if ( !isset( $format[0] )) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $format = $current_user->getUserDateTimePreferences()['date'];
        }

        $timezone = SpiceConfig::getInstance()->config['default_preferences']['timezone'] ?: 'UTC';

        $now = new DateTime();
        if ( !empty( $tz = SpiceConfig::getInstance()->config['default_preferences']['timezone'] )) {
            $now->setTimezone( new DateTimeZone( $tz ));
        }
        return $now->format( $format );
    }


    /**
     * returns the remote IP address
     *
     * @param $compiler
     * @param $bean
     * @param $format
     * @return string
     */
    static function remoteIP( $compiler, $beans ) {
        return $_SERVER['REMOTE_ADDR'];
    }

    /*
    static function shorturl( $longUrl ) {
        return SpiceUtils::createShortUrl( $longUrl );
    }
    */

    /**
     * returns the default country name from the language table
     *
     * @param $inputstring
     * @param $language
     * @return mixed
     */
    static function getCountryName( $compiler, $beans, $inputString, $language = 'en_us') {
        $db = DBManagerFactory::getInstance();
        $c = $db->fetchOne("SELECT * FROM syscountries WHERE cc = '{$inputString}'");

        // if no country is found return it
        if(!$c) return $inputString;

        // get the label
        $label = $db->fetchOne("SELECT st.* FROM syslanguagetranslations st, syslanguagelabels sl WHERE st.syslanguagelabel_id = sl.id AND sl.name = '{$c['label']}' AND st.syslanguage = '{$language}'");

        return $label['translation_default'] ?: $inputString;
    }

    /**
     * formats a number
     *
     * @param $compiler
     * @param $beans
     * @param $inputString
     * @return string
     */
    static function currencyFormatNumber($compiler, $beans, $inputString){

        if (empty($inputString)) return '';

        return SpiceUtils::currencyFormatNumber($inputString);

    }

}