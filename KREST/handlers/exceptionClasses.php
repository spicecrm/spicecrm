<?php

namespace KREST;

class Exception extends \Exception {

    protected $isFatal = true;
    protected $responseData = [];
    protected $httpCode;
    protected $errorCode;
    protected $lbl = null;

    function __construct( $message = null, $errorCode = null ) {
        if ( isset( $errorCode )) $this->errorCode = $errorCode;
        parent::__construct( $message );
    }

    function getResponseData() {
        $this->responseData['message'] = $this->getMessage();
        if ( isset( $this->httpCode )) $this->responseData['httpCode'] = $this->httpCode;
        if ( isset( $this->lbl )) $this->responseData['lbl'] = $this->lbl;
        if ( isset( $this->errorCode )) $this->responseData['errorCode'] = $this->errorCode;
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

}

class NotFoundException extends Exception {

    protected $isFatal = false;
    protected $lookedFor;
    protected $httpCode = 404;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_NOT_FOUND';
        parent::__construct( isset( $message ) ? $message : 'Not Found', $errorCode );
    }

    protected function extendResponseData() {
        if ( isset( $this->lookedFor )) $this->responseData['lookedFor'] = $this->lookedFor;
    }

    public function setLookedFor( $lookedFor ) {
        $this->lookedFor = $lookedFor;
        return $this;
    }

}

class ForbiddenException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 403;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_FORBIDDEN';
        parent::__construct( isset( $message ) ? $message : 'Forbidden', $errorCode );
    }

    protected function extendResponseData() {
        $this->responseData['currentUser'] = @$GLOBALS['current_user']->user_name;
    }

}

class BadRequestException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 400;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_BAD_REQUEST';
        parent::__construct( isset( $message ) ? $message : 'Bad Request', $errorCode );
    }

}

class UnauthorizedException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 401;

    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_NO_AUTHORIZATION';
        parent::__construct( isset( $message ) ? $message : 'No Authorization', $errorCode );
    }

}
