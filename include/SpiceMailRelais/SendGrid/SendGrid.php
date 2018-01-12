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

        curl_close($curl);
    }
}