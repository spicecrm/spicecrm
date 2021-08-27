<?php
namespace SpiceCRM\includes\ErrorHandlers;

class Exception extends \Exception {

    protected $isFatal = true;
    protected $responseData = [];
    protected $httpCode;
    protected $errorCode;
    protected $lbl = null;
    protected $details;
    protected $logMessage = null;
    protected $httpHeaders = [];

    function __construct( $message = null, $errorCode = null ) {
        if ( isset( $errorCode )) $this->errorCode = $errorCode;
        parent::__construct( $message );
    }

    function getResponseData() {
        $this->responseData['message'] = $this->getMessage();
        #if ( isset( $this->httpCode )) $this->responseData['httpCode'] = $this->httpCode;
        if ( isset( $this->lbl )) $this->responseData['lbl'] = $this->lbl;
        if ( isset( $this->errorCode )) $this->responseData['errorCode'] = $this->errorCode;
        if ( isset( $this->details )) $this->responseData['details'] = $this->details;
        $this->extendResponseData();
        return $this->responseData;
    }

    protected function extendResponseData() { } # Placeholder. Method may be defined/used in child classes.

    function getHttpCode() {
        return $this->httpCode;
    }

    public function setHttpCode( $httpCode ) {
        $this->httpCode = $httpCode;
        return $this;
    }

    public function setLbl( $lbl ) {
        $this->lbl = $lbl;
        return $this;
    }

    public function getLbl() {
        return $this->lbl;
    }

    function isFatal() {
        return $this->isFatal;
    }

    public function setFatal( $bool ) {
        $this->isFatal = $bool;
        return $this;
    }

    public function setErrorCode( $errorCode ) {
        $this->errorCode = $errorCode;
        return $this;
    }

    public function getErrorCode() {
        return $this->errorCode;
    }

    public function setDetails( $details ) {
        $this->details = $details;
        return $this;
    }

    public function setLogMessage( $message ) {
        $this->logMessage = $message;
        return $this;
    }

    public function getLogMessage() {
        return $this->logMessage;
    }

    public function getMessageToLog() {
        return isset( $this->logMessage ) ? $this->logMessage : $this->message;
    }

    public function setHttpHeader( $name, $value ) {
        return $this->httpHeaders[$name] = $value;
    }

    public function getHttpHeaders() {
        return $this->httpHeaders;
    }

}
