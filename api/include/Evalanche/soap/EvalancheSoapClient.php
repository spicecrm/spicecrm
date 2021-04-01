<?php

namespace SpiceCRM\includes\Evalanche\soap;

use SoapClient;

class EvalancheSoapClient extends SoapClient
{
    public $wsdl;
    public $options;

    public function __construct($wsdl = '', $options = [])
    {
        $this->wsdl = $wsdl;
        $this->options = $options;

        parent::__construct($wsdl, $options);
    }

    public function __soapCall($function = '', $arguments = [], $options = null, $input_headers = null, &$output_headers = null)
    {
        return parent::__soapCall($function, $arguments, $options, $input_headers,$output_headers);

    }

    public function __doRequest($request, $location, $action, $version, $one_way = 0){
        return parent::__doRequest($request, $location, $action, $version, $one_way = 0);

    }

    public function __getLastRequestHeaders(){
        parent::__getLastRequestHeaders();
    }

}
