<?php

class MailGun
{
    var $api_key;
    var $from;
    var $domain;


    function __construct($relaisInfo)
    {
        $this->api_key = $relaisInfo['api_key'];
        $this->from = array(
            'email' => $relaisInfo['from_email'],
            'name' => $relaisInfo['from_name']
        );
        $this->domain = $relaisInfo['domain'];

        //get DOMAIN
        /*$array_data = array(
            'skip'=> 0,
            'limit'=> 1,
        );
        $session = curl_init('https://api.mailgun.net/v3/domains');
        curl_setopt($session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($session, CURLOPT_USERPWD, 'api:'.MAILGUN_KEY);
        curl_setopt($session, CURLOPT_POST, true);
        curl_setopt($session, CURLOPT_POSTFIELDS, $array_data);
        curl_setopt($session, CURLOPT_HEADER, false);
        curl_setopt($session, CURLOPT_ENCODING, 'UTF-8');
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($session);
        curl_close($session);
        $result = json_decode($response, true);
        */

    }

    function send($addresses, $email)
    {
        // compose email
        $to_arr = array();
        foreach ($addresses['to'] as $addr) $to_arr[] = $addr['name'] . "<" . $addr['email'] . ">";
        $to = implode(",", $to_arr);

        $cc_arr = array();
        foreach ($addresses['cc'] as $addr) $cc_arr[] = $addr['name'] . "<" . $addr['email'] . ">";
        $cc = implode(",", $cc_arr);

        $bcc_arr = array();
        foreach ($addresses['bcc'] as $addr) $bcc_arr[] = $addr['name'] . "<" . $addr['email'] . ">";
        $bcc = implode(",", $bcc_arr);

        $text = "";
        $html = "";
        foreach ($email['content'] as $cont) {
            if (strpos($cont['type'], 'text') !== false) {
                $text = $cont['value'];
            }
            if (strpos($cont['type'], 'html') !== false) {
                $html = $cont['value'];
            }
        }

        $array_data = array(
            'from' => $this->from->name . '<' . $this->from->email . '>',
            'to' => $to,
            'cc' => $cc,
            'bcc' => $bcc,
            'subject' => $email['subject'],
            'html' => $html,
            'text' => $text,
        );
        $session = curl_init('https://api.mailgun.net/v3/' . $this->domain . '/messages');
        curl_setopt($session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($session, CURLOPT_USERPWD, 'api:' . MAILGUN_KEY);
        curl_setopt($session, CURLOPT_POST, true);
        curl_setopt($session, CURLOPT_POSTFIELDS, $array_data);
        curl_setopt($session, CURLOPT_HEADER, false);
        curl_setopt($session, CURLOPT_ENCODING, 'UTF-8');
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($session);
        $err = curl_error($session);
        $return = array();
        $res = json_decode($response, true);

        $GLOBALS['log']->info('MailGun send mail response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('MailGun send mail error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($session);
    }
}