<?php

namespace SpiceCRM\modules\Users\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\UserPreferences\UserPreference;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\authentication\AuthenticationController;
use Slim\Psr7\Request as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class UsersPreferencesController
{
    /**
     * called from the settings in the taskloaderitems. So no paramaters are expected and the reonse is an array.
     * The rest is handled by the REST extension there.
     *
     * @return mixed
     */
    public function getGlobalPreferences()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        return $this->get_all_user_preferences('global', $current_user->id );
    }

    public function getPreferences(Request $req, Response $res, array $args): Response
    {
        $names = $req->getQueryParams()['names'];
        if (!isset($names)) {
            return $res->withJson($this->get_all_user_preferences( $args['category'], $args['userId'] ));
        } else {
            return $res->withJson($this->get_user_preferences($args['category'], $names, $args['userId'] ));
        }
    }

    public function getUserPreferences(Request $req, Response $res, array $args): Response
    {
        return $res->withJson($this->get_user_preferences($args['category'], $args['names'], $args['userId']));
    }

    public function get_all_user_preferences( $category, $userId )
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if ( $current_user->id === $userId ) $user = $current_user;
        else {
         if ( $this->editingEnabled() ) {
                $user = BeanFactory::getBean('Users');
                $user->retrieve( $userId );
                if ( empty( $user->id )) throw ( new NotFoundException('User not found.'))->setLookedFor([ 'id'=>$userId, 'module'=>'Users' ]);
            } else {
                throw new ForbiddenException('Forbidden to access user preferences of foreign user.');
            }
        }

        $userPreference = new UserPreference( $user );

        $prefArray = [];

        $userPreference->loadPreferences($category);

        return $_SESSION[$user->user_name . '_PREFERENCES'][$category];
    }

    public function get_user_preferences( $category, $names, $userId ) {

        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if ( $current_user->id === $userId ) $user = $current_user;
        else {
            if ( $this->editingEnabled() ) {
                $user = BeanFactory::getBean('Users');
                $user->retrieve( $userId );
                if ( empty( $user->id )) throw ( new NotFoundException( 'User not found.' ) )->setLookedFor( [ 'id' => $userId, 'module' => 'Users' ] );
            } else {
                throw new ForbiddenException('Forbidden to access user preferences of foreign user.');
            }
        }

        $userPreference = new UserPreference( $user );

        $prefArray = [];

        $namesArray = json_decode($names);
        if (!is_array($namesArray))
            $namesArray = [$names];

        foreach ($namesArray as $name)
            $prefArray[$name] = $userPreference->getPreference($name, $category);

        return $prefArray;
    }

    /**
     * CR1000276 Depending on which user (an admin or a regular user) is editing settings
     * Use original setPreference/getPreference function when edited record is current user himself
     * Use new setPreferenceForUser/getPreferenceForUser when edited record is not current user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */
    public function set_user_preferences(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $category = $args['category'];
        $userId = $args['userId'];
        $preferences = $req->getParsedBody();
        $setPreferenceFunction = "setPreference";
        $getPreferenceFunction = "getPreference";

        if ( $current_user->id === $userId ) $user = $current_user;
        else {
            if ( $this->editingEnabled() ) {
                $user = BeanFactory::getBean('Users');
                $user->retrieve( $userId );
                $setPreferenceFunction = "setPreferenceForUser";
                $getPreferenceFunction = "getPreferenceForUser";
                if ( empty( $user->id )) throw ( new NotFoundException('User not found.'))->setLookedFor([ 'id'=>$userId, 'module'=>'Users' ]);
            } else {
                throw new ForbiddenException('Forbidden to change user preferences of foreign user.');
            }
        }

        $userPreference = new UserPreference( $user );
        $retData = [];
        // do the magic
        foreach ($preferences as $name => $value) {
            if ($value === null) $userPreference->deletePreference($name, $category);
            else $userPreference->{$setPreferenceFunction}($name, $value, $category);
            if (($memmy = $userPreference->{$getPreferenceFunction}($name, $category)) !== null) $retData[$name] = $memmy;
        }

        if ($current_user->id === $userId) {
            // save the preferences
            $userPreference->savePreferencesToDB();
        }

        return $res->withJson($retData);
    }

    public function getDefaultPreferences()
    {
        return SpiceConfig::getInstance()->config['default_preferences'] ?: [];
    }


    /**
     * CR1000463 use SpiceACL for user preferences editing
     * keep bwc compatibility
     * @return bool
     */
    public function editingEnabled(){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $editEnabled = false;
        if(SpiceConfig::getInstance()->config['acl']['controller'] && !preg_match('/SpiceACL/', SpiceConfig::getInstance()->config['acl']['controller'])){
            if ( $current_user->is_admin and SpiceConfig::getInstance()->config['enableSettingUserPrefsByAdmin'] ){
                $editEnabled = true;
            }
        } else{
            if(SpiceACL::getInstance()->checkAccess('UserPreferences', 'edit')){
                $editEnabled = true;
            }
        }
        return $editEnabled;
    }

}
