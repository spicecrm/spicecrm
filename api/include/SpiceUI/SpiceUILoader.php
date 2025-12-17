<?php
/**
 * Class SpiceUILoader
 * Utility class for SpiceCRM backend
 * get records from referenced database
 * Endpoint for default values is located in SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource
 */

namespace SpiceCRM\includes\SpiceUI;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceCurlWrapper\SpiceCurlRequest;
use SpiceCRM\includes\SpiceCurlWrapper\SpiceCurlWrapper;
use SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource;

class SpiceUILoader
{

    public $db;
    public $endpoint;
    public $curl;

    /**
     * SpiceUIConfLoader constructor.
     * @param null $endpoint introduced with CR1000133
     */
    public function __construct($endpoint = null)
    {


        // get database object
        /**
         * todo-uebelmar clarify:seems to be unused
         *
         *
         * $this->db = DBManagerFactory::getTypeInstance(\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['dbconfig']['db_type']);
         * if (!$this->db->connect(\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['dbconfig']))
         * die('database connection failed');
         */
        // set default endpoint
        if (empty($this->endpoint)) {
            $this->endpoint = SystemDeploymentPackageSource::getPublicSource();
        }
        // set selected endpoint
        if (!empty($endpoint)) {
            $this->endpoint = $endpoint;
            // cleanup endpoint (ending /)
            if (substr($this->endpoint, -1) != "/") {
                $this->endpoint .= "/";
            }
        }

        // catch empty endpint
        if (empty($this->endpoint) || strlen($this->endpoint) < 5) {
            LoggerManager::getLogger()->error("No endpoint defined");
        }

        // initialize curl
        $this->curl = curl_init();
    }


    public function callMethod($method, $route, $getParams = null, $postParams = [])
    {
        if (!empty($getParams) && is_array($getParams))
            $getParams = "?" . http_build_query($getParams);
        $url = $this->endpoint . $route . $getParams;

        $response = SpiceCurlWrapper::newRequest($url, $method)
                    ->setSsl(false)
                    ->setRawOption(CURLOPT_ENCODING, SpiceCurlRequest::ENCODING_UTF8)
                    ->send();

        if (!$response->getRawResponse()) {
            LoggerManager::getLogger()->fatal("ERROR curl in " . __CLASS__ . $response->getErrors());
        }

        //catch empty response
        if ($response->getRawResponse() == "[]") {
            return ['nodata' => []];
        }


        //decode reponse
        if (!$data = $response->getResponse()) {
            LoggerManager::getLogger()->fatal('json_decode error on REST response from reference server. Response: '
                . print_r($response->getRawResponse(), true) . '. URL: ' . $url . '. Please check call parameters!');
        }

        return $data;
    }

    public function close()
    {
        curl_close($this->curl);
    }

    /**
     * checkt if any change request log is found for a chnage request that hasn't been completed yet
     * if found abort.
     */
    public function hasOpenChangeRequest()
    {
        //if release_core only: no SystemDeploymentCR class available
        if (!class_exists('SystemDeploymentCR'))
            return false;

        /** @var SystemDeploymentCR $cr */
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $list = $cr->getList([], 'active');

        if (count($list['list']) > 0)
            return true;
        return false;
    }
}
