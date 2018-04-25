<?php
class SendGrid
{
    var $api_key;
    var $from;


    function __construct($relaisInfo)
    {
        $this->api_key = $relaisInfo['api_key'];
        $this->from = array(
            'email' => $relaisInfo['from_email'],
            'name' => $relaisInfo['from_name']
        );
    }

    function send($addresses, $email)
    {
        // compose email
        $content = array(
            'personalizations' => array(
                $addresses
            ),
            'from' => $this->from,
            'subject' => $email['subject'],
            'content' => $email['content']
        );

        $curl = curl_init();
        $options = array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/mail/send",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($content),
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $this->api_key,
                "content-type: application/json"
            ),
        );
        curl_setopt_array($curl, $options);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        $GLOBALS['log']->info('SendGrid mail send response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid mail send error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
    }

    function getBlocks()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/suppression/blocks",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "{}",
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $this->api_key,
                "content-type: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $return = array();
        $res = json_decode($response, true);
        foreach ($res as $row) {
            $return[] = $row['email'];
        }

        $GLOBALS['log']->info('SendGrid get blocks response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid get blocks error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
        return $return;
    }

    function getBounces()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/suppression/bounces",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "{}",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "authorization: Bearer " . $this->api_key,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $return = array();
        $res = json_decode($response, true);
        foreach ($res as $row) {
            $return[] = $row['email'];
        }

        $GLOBALS['log']->info('SendGrid get bounces response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid get bounces error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
        return $return;
    }

    function getInvalid()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/suppression/invalid_emails",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "{}",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "authorization: Bearer " . $this->api_key,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $return = array();
        $res = json_decode($response, true);
        foreach ($res as $row) {
            $return[] = $row['email'];
        }

        $GLOBALS['log']->info('SendGrid get invalid response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid get invalid error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
        return $return;
    }

    function getOptOuts()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/suppression/unsubscribes",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "{}",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "authorization: Bearer " . $this->api_key,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $return = array();
        $res = json_decode($response, true);
        foreach ($res as $row) {
            $return[] = $row['email'];
        }

        $GLOBALS['log']->info('SendGrid get invalid response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid get invalid error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
        return $return;
    }

    function getSpam()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.sendgrid.com/v3/suppression/spam_reports",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "{}",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "authorization: Bearer " . $this->api_key,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $return = array();
        $res = json_decode($response, true);
        foreach ($res as $row) {
            $return[] = $row['email'];
        }

        $GLOBALS['log']->info('SendGrid get invalid response:');
        $GLOBALS['log']->info(print_r($response, true));
        $GLOBALS['log']->info('SendGrid get invalid error:');
        $GLOBALS['log']->info(print_r($err, true));

        curl_close($curl);
        return $return;
    }

}