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


namespace SpiceCRM\modules\Mailboxes\processors;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\modules\Mailboxes\processors\Processor;

class TrackingProcessor extends Processor {
    private $method = 'blowfish';
    private $key = '2fs5uhnjcnpxcpg9';
    private $pattern = '/img src="([^"]+)"/';
    private $httpPattern = '/img src="http:\/\/([^"]+)"/';

    /**
     * extracts the base64 encoded string based on two possible patterns
     */
    public function process() {
        if (preg_match($this->httpPattern, $this->email->body, $matches)) {
            $this->decodeTrackingPixel($matches[1]);
        } elseif (preg_match($this->pattern, $this->email->body, $matches)) {
            $this->decodeTrackingPixel($matches[1]);
        }

    }

    /**
     * decrypts the hash
     * @param $encrypted
     * @return false|string
     */
    private function decryptBlowfishHash($encrypted) {
        return openssl_decrypt($encrypted, $this->method, $this->key);
    }

    /** decodes the tracking pixel and assigns its contents as parent type and parent id of the fetched email
     * @param $string
     */
    private function decodeTrackingPixel($string) {
        $encrypted =  base64_decode($string);
        $decrypted = $this->decryptBlowfishHash($encrypted);

        if($decrypted) {
            $data = explode(':', $decrypted);
            $email= BeanFactory::getBean($this->email->_module, $this->email->id);
            $email->parent_type = $data[0];
            $email->parent_id = $data[1];
            $email->save();
        }
    }
}
