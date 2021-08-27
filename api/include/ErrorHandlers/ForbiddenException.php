<?php
namespace SpiceCRM\includes\ErrorHandlers;

use SpiceCRM\includes\authentication\AuthenticationController;

class ForbiddenException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 403;

    /**
     * ForbiddenException constructor.
     * @param null $message
     * @param null $errorCode
     * error codes
     * 1 = password change forbidden when ldap is enabled
     * 2 = password change forbidden when external_auth_only on User is true
     */
    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_FORBIDDEN';
        parent::__construct( isset( $message ) ? $message : 'Forbidden', $errorCode );
    }

    protected function extendResponseData() {
        $this->responseData['currentUser'] = @AuthenticationController::getInstance()->getCurrentUser()->user_name;
    }

}
