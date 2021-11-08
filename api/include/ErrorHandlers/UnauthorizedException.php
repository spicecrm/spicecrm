<?php
namespace SpiceCRM\includes\ErrorHandlers;

class UnauthorizedException extends Exception {

    protected $isFatal = false;
    protected $httpCode = 401;
    protected $loginBlocked = false;

    /**
     * UnauthorizedException constructor.
     * @param null $message
     * @param null $errorCode
     *
     * errorCodes:
     * 1= invalid username/password combination
     * 2= password expired
     * 3= user is blocked
     * 4= user is inactive
     * 5= user status is unknown
     * 6= no authentication infos
     * 7=invalid sessionid
     * 8=user in ad found, no local user found
     * 9=required ldap group membership is missing
     * 10=invalid username/password combination on ldap bind
     * 11=client ip address not allowed (black listed)
     */
    function __construct( $message = null, $errorCode = null ) {
        if ( !isset( $message )) $this->lbl = 'ERR_HTTP_NO_AUTHORIZATION';
        parent::__construct( isset( $message ) ? $message : 'No Authorization', $errorCode );
    }

    public function setLoginBlocked( $bool ) {
        $this->loginBlocked = $bool;
        return $this;
    }

    public function isLoginBlocked() {
        return $this->loginBlocked;
    }

}
