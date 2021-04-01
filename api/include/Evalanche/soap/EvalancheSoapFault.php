<?php
namespace SpiceCRM\includes\Evalanche\soap;


use SoapFault;

class EvalancheSoapFault extends SoapFault {
    public $faultcode;
    public $faultstring;
    public $detail;
    public $faultactor;
    public $faultname;
    public $headerfault;


    public function SoapFault($faultcode, $faultstring, $faultactor = null, $detail = null, $faultname = null, $headerfault = null)
    {
        parent::SoapFault($faultcode, $faultstring, $faultactor, $detail, $faultname, $headerfault);
    }

    public function __toString()
    {
        parent::__toString();
    }
}
