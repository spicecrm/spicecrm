<?php

namespace SpiceCRM\includes\SpiceTemplateCompiler\TemplateFunctions;

use Com\Tecnick\Barcode\Barcode;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use DateTime;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;

class SystemTemplateFunctions {

    static function dateFormat($inputString, $format){
        $date = DateTime::createFromFormat(TimeDate::getInstance()->get_db_date_time_format(), $inputString);
        if(!$date){
            $date = DateTime::createFromFormat(TimeDate::getInstance()->get_date_time_format(), $inputString);
        }
        if(!$date){
            $date = DateTime::createFromFormat(AuthenticationController::getInstance()->getCurrentUser()->getPreference("datef")." ". AuthenticationController::getInstance()->getCurrentUser()->getPreference("timef"), $inputString);
        }

        return $date->format( $format );
    }

    static function cat( $inputstring, $stringToAdd ) {
        return isset( $inputstring[0] ) ? $$inputstring.$stringToAdd : $$inputstring;
    }

    static function uppercase( $inputstring ) {
        return strtoupper( $inputstring );
    }

    static function lowercase( $inputstring ) {
        return strtolower( $inputstring );
    }

    static function nl2br( $inputstring ) {
        return nl2br( $inputstring );
    }

    static function truncate( $inputstring, $length, $endchars = '' ) {
        if ( !is_numeric( $length ) and !ctype_digit( $length )) {
            throw new BadRequestException('Output template function "truncate": Invalid truncation length "'.$length.'"');
        }
        return substr( $inputstring, 0, $length ).$endchars;
    }

    static function replace( $inputstring, $needle, $replacement ) {
        return str_replace( $needle, $replacement, $inputstring );
    }

    static function capitalize( $inputstring ) {
        return ucwords( $inputstring );
    }

    static function spacify( $inputstring ) {
        return preg_replace( '#[\w\-](?!$)#', '\\0 ', str_replace( ' ', '   ', $inputstring ));
    }

    static function barcode( $inputstring, $type = null, $width = null, $height = null, $color = 'black') {
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
                $inputstring,
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

    static function lorem( $length ) {
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

    static function currentDateTime( $format = null ) {
        if ( !isset( $format[0] )) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $format = $current_user->getUserDateTimePreferences()['date'];
        }
        $now = new DateTime();
        return $now->format( $format );
    }

}