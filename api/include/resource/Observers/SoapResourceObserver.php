<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\resource\Observers;

class SoapResourceObserver extends ResourceObserver
{
    private $soapServer;

    function __construct($module) {
       parent::__construct($module);
    }


    /**
     * set_soap_server
     * This method accepts an instance of the nusoap soap server so that a proper
     * response can be returned when the notify method is triggered.
     * @param $server The instance of the nusoap soap server
     */
    function set_soap_server(& $server) {
       $this->soapServer = $server;
    }


    /**
     * notify
     * Soap implementation to notify the soap clients of a resource management error
     * @param msg String message to possibly display
     */
    public function notify($msg = '') {

        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
        header('Content-Type: text/xml; charset="ISO-8859-1"');
        $error = new SoapError();
        $error->set_error('resource_management_error');
        //Override the description
        $error->description = $msg;
        $this->soapServer->methodreturn = ['result'=>$msg, 'error'=>$error->get_soap_array()];
        $this->soapServer->serialize_return();
        $this->soapServer->send_response();
        sugar_cleanup(true);

    }
	
}
