<?php

/***** SPICE-HEADER-SPACEHOLDER *****/

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
