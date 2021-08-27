<?php
namespace SpiceCRM\includes\utils;

use SpiceCRM\includes\ErrorHandlers\TooManyRequestsException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

class RESTRateLimiter {

    private static $userId;
    private static $fp; # File pointer for reading/writing the user file.
    private static $data; # Data from the user file.
    private static $myRules = null; # Those rules which are to be applied to the request (maybe affected by the user and/or the http method).

    static function getUserId() {
        return isset( AuthenticationController::getInstance()->getCurrentUser()->id ) ? AuthenticationController::getInstance()->getCurrentUser()->id : null;
    }

    static function determineMyRules( $userId, $httpMethod ) {

        # Get the rule definitions and the rules from config.php:
        $ruleDefinitions = &SpiceConfig::getInstance()->config['krest']['rateLimiting']['ruleDefinitions'];
        $rules = &SpiceConfig::getInstance()->config['krest']['rateLimiting']['rules'];

        $kasimir = isset( $rulesApplied[$userId] ) ? $userId : '*';

        # Get the rules from config.php (noticing specific rules for a specific user, noticing specific rules for the http method of the request):
        foreach ( [ '*', $httpMethod ] as $m )
            if ( isset( $rules[$kasimir][$m] ))
                foreach ( $rules[$kasimir][$m] as $v ) self::$myRules[$m][$v] = &$ruleDefinitions[$v];

    }

    # Load the user data from the user file.
    static function loadData( $userId ) {
        if ( self::$fp = fopen( session_save_path().'/rali_'. SpiceConfig::getInstance()->config['unique_key'].'_'.$userId, 'c+' )) {#} and flock( self::$fp, LOCK_EX )) {
            self::$data = unserialize( fgets( self::$fp ));
        } else {
            throw new TooManyRequestsException();
        }
    }

    # Save back the user data to the user file.
    static function saveData() {
        ftruncate( self::$fp,0 );
        rewind( self::$fp );
        fwrite( self::$fp, serialize( self::$data ));
        self::unlockFile( self::$fp );
        fclose( self::$fp );
    }

    # Unlock the user file.
    # Used by saveData(). But also has to be called, when nothing to save. Otherwise the file would left locked!
    static function unlockFile() {
        fflush( self::$fp );
        flock( self::$fp, LOCK_UN );
    }

    # Do the main thing:
    # Check, if rate limiting should happen, if the request has to be blocked - and do it:
    static function check( $httpMethod ) {

        $now = microtime( true );

        self::$userId = self::getUserId();
        if ( self::$userId === null ) return; # Currently rate limiting does not work for anonymous requests.

        # Get the rules which are to be applied:
        if ( self::$myRules === null ) self::determineMyRules( self::$userId, $httpMethod );

        # Load the data from the user file:
        self::loadData( self::$userId );

        $doBlock = false; # Indicates if the request has to be blocked.
        $doSave = false; # Indicates if the user data has been changed and therefore the data has to get saved to the user file.
        $retryAfter = 0; # When the request has to be blocked: Indicates the amount of seconds the client should wait before retrying.

        # Iterate through the rules, by http method.
        foreach ( self::$myRules as $method => $rulesOfMethod ) {

            # There can be defined more than one rule. Iterate:
            foreach ( $rulesOfMethod as $ruleName => $rule ) {

                # There is already user data for this rule:
                if ( isset( self::$data[$method][$ruleName] )) {

                    # The last request for this rule was to long ago, so renew timestamp and counter:
                    if ( self::$data[$method][$ruleName]['timestamp'] < ( $now - $rule['duration'] )) {

                        self::$data[$method][$ruleName]['timestamp'] = $now;
                        self::$data[$method][$ruleName]['count'] = 1;
                        $doSave = true;

                    # The last request for this rule is young enough to be relevant.
                    } else {

                        # The limit is not reached yet, so only count the request.
                        if ( self::$data[$method][$ruleName]['count'] < $rule['limit'] ) {
                            self::$data[$method][$ruleName]['count']++;
                            $doSave = true;

                        # The limit is reached, so the request has to blocked and the retry-after-seconds are to be calculated.
                        } else {
                            $doBlock = true;
                            $dummy = $rule['duration'] - floor( ( $now - self::$data[$method][$ruleName]['timestamp'] ));
                            if ( $dummy > $retryAfter ) $retryAfter = $dummy;
                        }

                    }

                # There is no user data yet for this rule. Create it:
                } else {

                    if ( !isset( self::$data[$method] )) self::$data[$method] = [];
                    self::$data[$method][$ruleName] = [ 'timestamp' => $now, 'count' => 1 ];
                    $doSave = true;

                }
            }
        }

        # Remove old user data (but do the check not every time).
        if ( time() % 123 === 0 ) $doSave = self::cleanData() || $doSave;

        if ( $doSave ) self::saveData();
        else self::unlockFile();

        # The blocking:
        if ( $doBlock ) throw ( new TooManyRequestsException())->setRetryAfter( $retryAfter );

    }

    # Maybe somebody changed the rules in the config.php. Then there might be user data, which is not longer necessary.
    private static function cleanData() {

        $now = microtime(true);

        $weekBefore = $now - 5;#7*24*60*60; # All data older than one week will be deleted.

        $doSave = false;

        foreach ( self::$data as $method => $dataForMethod ) {
            foreach ( $dataForMethod as $ruleName => $data ) {
                if ( $data['timestamp'] < $weekBefore ) {
                    unset( self::$data[$method][$ruleName] );
                    $doSave = true;
                }
            }
        }

        return $doSave;

    }

}
