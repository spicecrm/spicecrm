<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\authentication\TOTPAuthentication;

use Com\Tecnick\Barcode\Barcode;
use SpiceCRM\includes\authentication\api\controllers\AuthenticateController;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;

/**
 * Class TOTPAuthentication
 *
 * provides authentication using the OATH-TOTP codes like in Google Authenticator
 *
 * @package SpiceCRM\includes\authentication\TOTPAuthentication
 */
class TOTPAuthentication
{
    static $PASS_CODE_LENGTH = 6;
    static $PIN_MODULO;
    static $SECRET_LENGTH = 10;

    public function __construct() {
        self::$PIN_MODULO = pow(10, self::$PASS_CODE_LENGTH);
    }

    /**
     * checks if a user has a TOTP secret set that is active
     * if userid is not passed in the current user is considered
     *
     * @param $userid
     * @return bool
     */
    public static function checkTOTPActive($userid = null){
        $db = DBManagerFactory::getInstance();

        if(!$userid) {
            $userid = AuthenticationController::getInstance()->getCurrentUser()->id;
        }

        $record = $db->fetchOne("SELECT id FROM users_totp WHERE user_id='$userid' AND auth_status='A' AND deleted = 0");
        return $record !== false;
    }

    /**
     * deletes an active TOTP Record
     *
     * @param null $userid
     * @return bool
     */
    public static function deleteTOTP($userid = null){
        $db = DBManagerFactory::getInstance();

        if(!$userid) {
            $userid = AuthenticationController::getInstance()->getCurrentUser()->id;
        }

        $db->query("UPDATE users_totp SET deleted = 1 WHERE user_id='$userid' AND auth_status='A' AND deleted = 0");
        return true;
    }

    /**
     * checks if a user has a TOTP secret set that is active
     *
     * @param $userid
     * @return bool
     */
    public function checkTOTPCode($userid, $code){
        $db = DBManagerFactory::getInstance();
        $record = $db->fetchOne("SELECT user_secret FROM users_totp WHERE user_id='$userid' AND auth_status='A' AND deleted = 0");
        return $this->checkCode($record['user_secret'], $code);
    }

    /**
     * checks the code generated now based on the given secret
     *
     * @param $secret
     * @param $code
     * @return bool
     */
    public function checkCode($secret,$code) {
        $time = floor(time() / 30);
        for ( $i = -1; $i <= 1; $i++) {

            if ($this->getCode($secret,$time + $i) == $code) {
                return true;
            }
        }

        return false;

    }

    /**
     * gets the current valid code for a given secret
     *
     * @param $secret
     * @param null $time
     * @return string
     */
    public function getCode($secret,$time = null) {

        if (!$time) {
            $time = floor(time() / 30);
        }
        $base32 = new FixedBitNotation(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', TRUE, TRUE);
        $secret = $base32->decode($secret);

        $time = pack("N", $time);
        $time = str_pad($time,8, chr(0), STR_PAD_LEFT);

        $hash = hash_hmac('sha1',$time,$secret,true);
        $offset = ord(substr($hash,-1));
        $offset = $offset & 0xF;

        $truncatedHash = self::hashToInt($hash, $offset) & 0x7FFFFFFF;
        $pinValue = str_pad($truncatedHash % self::$PIN_MODULO,6,"0",STR_PAD_LEFT);;
        return $pinValue;
    }

    protected  function hashToInt($bytes, $start) {
        $input = substr($bytes, $start, strlen($bytes) - $start);
        $val2 = unpack("N",substr($input,0,4));
        return $val2[1];
    }

    /**
     * generates a base64 encoded QR code
     *
     * @param $user
     * @param $hostname
     * @param $secret
     * @return string
     * @throws BadRequestException
     * @throws \Com\Tecnick\Color\Exception
     */
    public function getQRCode($user, $hostname, $secret){
        $barcodeFactory = new Barcode(); // instantiate the barcode class
        try {
            $barcode = $barcodeFactory->getBarcodeObj(
                strtoupper( 'QRCODE' ),
                sprintf( "otpauth://totp/%s@%s?secret=%s&issuer:Example",$user, $hostname, $secret),
                200, 200, 'black'
            );
        } catch (\Exception $e) {
            throw new BadRequestException( 'Output template function "barcode": '.$e->getMessage());
        }
        $barcode->setBackgroundColor('white'); // background color
        # Return the barcode/qrcode as PNG base64 encoded.
        $pngData = $barcode->getPngData();
        return base64_encode( $pngData );
    }

    /**
     * gernerates a secret
     *
     * @return string
     */
    public function generateSecret() {
        $secret = "";
        for($i = 1;  $i<= self::$SECRET_LENGTH;$i++) {
            $c = rand(0,255);
            $secret .= pack("c",$c);
        }
        $base32 = new FixedBitNotation(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', TRUE, TRUE);
        return  $base32->encode($secret);
    }
}