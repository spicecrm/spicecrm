<?php
/**
 * Class SpiceUILoader
 * Utility class for SpiceCRM backend
 * get records from reference database
 * Endpoint to retrieve data is located in config.php
 */

class SpiceUILoader
{

    public $db;
    public $endpoint = 'https://packages.spicecrm.io/';
    public $curl;

    public function __construct()
    {
        global $sugar_config;
        $this->db = DBManagerFactory::getTypeInstance($sugar_config['dbconfig']['db_type']);
        if (!$this->db->connect($sugar_config['dbconfig']))
            die('database connection failed');

        if(isset($sugar_config['spiceconfigreference']['endpoint'])) {
            $this->endpoint = $sugar_config['spiceconfigreference']['endpoint'];
            if (substr($this->endpoint, -1) != "/") {
                $this->endpoint .= "/";
            }
        }

        $this->curl = curl_init();
    }


    public function callMethod($method, $route, $getParams = null, $postParams = array())
    {
        if (!empty($getParams) && is_array($getParams))
            $getParams = "?" . http_build_query($getParams);
        $url = $this->endpoint . $route . $getParams;

        curl_setopt($this->curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($this->curl, CURLOPT_URL, $url);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);

        // turn off ssl check
        curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($this->curl, CURLOPT_ENCODING, "UTF-8");

//        //post
//        if($method=="POST"){
//            $url = $this->endpoint."/".$route;
//            curl_setopt($this->curl,CURLOPT_POST, true);
//            curl_setopt($this->curl,CURLOPT_POSTFIELDS, json_encode($postParams));
//        }
//        //DELETE
//        if($method=="DELETE"){
//            $url = $this->endpoint."/".$route;
//            curl_setopt($this->curl,CURLOPT_CUSTOMREQUEST, $method);
//            curl_setopt($this->curl,CURLOPT_POSTFIELDS, json_encode($postParams));
//        }

        $response = curl_exec($this->curl);
        if (!$response)
            $GLOBALS['log']->fatal("ERROR curl in " . __CLASS__ . curl_error($this->curl));
//        echo '<pre>'. print_r($response, true);die();

        if (!$data = json_decode($response, true))
            $GLOBALS['log']->fatal("json_decode error on REST response from reference server. " . print_r($response, true) . " Please check call parameters!");

        return $data;
    }

    public function close(){
        curl_close($this->curl);
    }
}