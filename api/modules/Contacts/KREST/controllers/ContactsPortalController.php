<?php

namespace SpiceCRM\modules\Contacts\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\modules\UserPreferences\UserPreference;
use SpiceCRM\modules\Users\User;
use stdClass;

class ContactsPortalController{

    /**
     * handles the creting and updating of contacts
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     * @throws NotFoundException
     */

    public function ContactsContacHandling($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $retArray = [
            'aclRoles' => [],
            'portalRoles' => [],
            'user' => new stdClass()
        ];

        $contact = BeanFactory::getBean('Contacts');
        $contact->retrieve( $args['id'] );
        if ( !isset($contact->id )) throw ( new NotFoundException('Contact not found.'))->setLookedFor(['id'=>$args['id'],'module'=>'Contacts']);
        if ( !$contact->ACLAccess( 'edit' )) throw ( new ForbiddenException('Forbidden to edit contact.'))->setErrorCode('noRecordEdit');

        // get acl roles
        $roles = $db->query("SELECT id, name FROM acl_roles WHERE deleted = 0 ORDER BY name");
        while ( $role = $db->fetchByAssoc( $roles )){
            $retArray['aclRoles'][] = $role;
        }

        // get ui roles
        $roles = $db->query("SELECT id, name FROM sysuiroles ORDER BY name");
        while( $role = $db->fetchByAssoc( $roles )){
            $retArray['portalRoles'][] = $role;
        }

        if ( !empty( $contact->portal_user_id )) {
            $user = BeanFactory::getBean('Users');
            $user->retrieve( $contact->portal_user_id );
            if ( !empty( $user->id )) {

                $retArray['user']->id = $user->id;
                $retArray['user']->username = $user->user_name;
                $retArray['user']->status = $user->status == 'Active' ? true : false;

                $roles = $user->get_linked_beans( 'aclroles', 'ACLRole' );

                foreach ( $roles as $role ) {
                    $retArray['user']->aclRole = $role->id;
                    break;
                }

                // portalRole
                $portalRoles = $db->query( "SELECT * FROM sysuiuserroles WHERE user_id='$user->id'" );
                $portalRole = $db->fetchByAssoc( $portalRoles );
                $retArray['user']->portalRole = $portalRole['sysuirole_id'];

            }
        }

        $retArray['pwdCheck'] = [
            'regex' => '^'.UserAuthenticate::getPwdCheckRegex().'$',
            'guideline' => UserAuthenticate::getPwdGuideline( $req->getParam('lang') )
        ];
        return $res->withJson( $retArray );

    }

    /**
     * handles the creating and updating of new users
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws Exception
     * @throws ForbiddenException
     * @throws NotFoundException
     */

    public function ConctactsUserHandling($req,$res,$args){
        $db = DBManagerFactory::getInstance();

        $db->transactionStart();

        $contact = BeanFactory::getBean('Contacts');
        $contact->retrieve( $args['contactId'] );
        if ( !isset( $contact->id )) throw ( new NotFoundException('Contact not found.'))->setLookedFor([ 'id' => $args['contactId'], 'module' => 'Contacts' ]);
        if ( !$contact->ACLAccess( 'edit' )) throw ( new ForbiddenException('Forbidden to edit contact.'))->setErrorCode('noModuleEdit');

        $postParams = $req->getParsedBody();
        foreach ( $postParams as $k => $v ) $postParams[$k] = trim( $v );

        $user = BeanFactory::getBean('Users');

        if ( $args['action'] === 'update' ) {
            if ( !empty( $contact->portal_user_id ) ) $user->retrieve( $contact->portal_user_id );
            if ( empty( $user->id ) ) throw ( new NotFoundException( 'Portal user not found.' ) )->setLookedFor([ 'id' => $contact->portal_user_id, 'module' => 'Users' ]);
            $isNewUser = false;
        } else {
            $isNewUser = true;
            if ( !empty( $contact->portal_user_id ))
                throw ( new BadRequestException('Contact already has portal user data. Creation of another portal user is not possible.'))->setErrorCode('contactAlreadyHasPortalUser');
        }

        if ( $db->fetchOne( sprintf('SELECT id FROM users WHERE user_name = "%s" AND id <> "%s" AND deleted = 0 LIMIT 1', $db->quote( $postParams['username']), $contact->portal_user_id )))
            throw ( new BadRequestException('User name already taken.'))->setErrorCode('usernameAlreadyTaken');
        if ( empty( $postParams['username'] ))
            throw ( new BadRequestException('Missing user name.'))->setErrorCode('missingUserName');
        if ( strlen( $postParams['username'] ) > $GLOBALS['dictionary']['User']['fields']['user_name']['len'] )
            throw ( new BadRequestException('User name to long (max. '.$GLOBALS['dictionary']['User']['fields']['user_name']['len'].' chars).'))->setErrorCode('usernameToLong');
        $user->user_name = $postParams['username'];
        if ( empty( $postParams['aclRole'] ))
            throw ( new BadRequestException('Missing acl role.'))->setErrorCode('missingAclRole');
        if ( empty( $postParams['portalRole'] ))
            throw ( new BadRequestException('Missing portal role.'))->setErrorCode('missingPortalRole');

        $user->status = @$postParams['status'] ? 'Active':'Inactive';

        $user->first_name = $contact->first_name;
        $user->last_name = $contact->last_name;

        if ( $isNewUser and !isset( $postParams['password'][0]) )
            throw ( new BadRequestException('Missing Password of New User'))->setErrorCode('missingPassword');

        if ( isset( $postParams['password'][0])) {
            if ( !preg_match( '/' . UserAuthenticate::getPwdCheckRegex() . '/', $user->user_hash = User::getPasswordHash( $postParams['password'] ) ) )
                throw ( new BadRequestException('Password does not match the Guideline.'))->setErrorCode('invalidPassword');
            $user->user_hash = User::getPasswordHash( $postParams['password'] );
            $user->pwd_last_changed = TimeDate::getInstance()->nowDb();
        }

        if ( $isNewUser ) {
            $user->portal_only = 1;
            $user->is_admin = 0;
            $user->inbound_processing_allowed = 0;
        }

        /*
        if ( empty( $user->save() )) {
            $db->transactionRollback();
            \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal( 'Create/Update portal user: Could not save user for contact '.$args['contactId'].'.' );
            throw ( new \SpiceCRM\KREST\Exception( 'Could not save user.' ) );
        }
        */
        try {
            $user->save();
        } catch( Exception $e ) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Update portal user: Could not save user for contact ' . $args['contactId'] . '.' );
            throw ( new Exception( 'Could not save user. '.$e->getMessage() ));
        }

        /*
        if ( $isNewUser ) {
            $contact->portal_user_id = $user->id;
            if ( empty( $contact->save() )) {
                $db->transactionRollback();
                \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Could not save contact '.$args['contactId'].'.' );
                throw ( new \SpiceCRM\KREST\Exception( 'Could not save contact.' ) );
            }
        }
        */
        if ( $isNewUser ) {
            $contact->portal_user_id = $user->id;
            try {
                $contact->save();
            } catch( Exception $e ) {
                $db->transactionRollback();
                LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Could not save contact '.$args['contactId'].'.' );
                throw ( new Exception( 'Could not save contact. '.$e->getMessage() ));
            }
        }

        // set the acl role
        $roles = $user->get_linked_beans('aclroles', 'ACLRole');
        foreach( $roles as $role ) {
            $user->aclroles->delete( $role->id );
            break;
        }

        if ( ! $user->aclroles->add( $postParams['aclRole'] )) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Error assigning ACL role (ID: ' . $postParams['aclRole'] . ') for contact ' . $args['contactId'] . '.' );
            throw ( new Exception( 'Could not assign ACL role (ID: ' . $postParams['aclRole'] . ').' ) );
        }
        #$postParams['portalRole'].='x';
        // set the portal role
        $sqlResult = $db->query('SELECT id, name FROM sysuiroles ORDER BY name');
        while ( $row = $db->fetchByAssoc( $sqlResult )) $portalRoles[$row['id']] = $row;
        if ( !isset( $portalRoles[$postParams['portalRole']] )) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Unknown portal role (ID: ' . $postParams['portalRole'] . ') for contact ' . $args['contactId'] . '.' );
            throw ( new Exception( 'Unknown portal role (ID: ' . $postParams['portalRole'] . ').' ) );
        }
        $db->query("DELETE FROM sysuiuserroles WHERE user_id = '$user->id'");
        $sqlResult = $db->query( sprintf('INSERT INTO sysuiuserroles ( id, user_id, sysuirole_id ) VALUES( "%s", "%s", "%s" )', create_guid(), $user->id, $db->quote( $postParams['portalRole'] )));
        if ( $db->getAffectedRowCount( $sqlResult ) != 1 ) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Error assigning portal role (ID: ' . $postParams['portalRole'] . ') for contact ' . $args['contactId'] . '.' );
            throw ( new Exception( 'Could not assign portal role (ID: ' . $postParams['portalRole'] . ').' ) );
        }

        $db->transactionCommit();

        if ( @$postParams['setDateTimePrefsWithSystemDefaults'] ) {
            $userPreference = new UserPreference( $user );
            $userPreference->setPreferenceForUser('datef', UserPreference::getDefaultPreference('date_format'));
            $userPreference->setPreferenceForUser('timef', UserPreference::getDefaultPreference('time_format'));
            $userPreference->setPreferenceForUser('timezone', UserPreference::getDefaultPreference('timezone'));
        }

        return $res->withJson(['success' => true, 'action' => $isNewUser ? 'create':'update', 'userId' => $user->id ]);

    }

    /**
     * fetches a ccontact form the database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws NotFoundException
     */

    public function ContactsFetchOneContact($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $contact = $db->fetchOne( sprintf('SELECT portal_user_id FROM contacts WHERE id = "%s" AND deleted = 0', $db->quote( $args['contactId'] )));
        if ( !$contact ) throw ( new NotFoundException( 'Contact Not Found' ))->setLookedFor(['id'=>$args['contactId'],'module'=>'Contacts']);

        $user = $db->fetchOne( sprintf('SELECT id FROM users WHERE user_name = "%s" AND id <> "%s" AND deleted = 0 LIMIT 1', $db->quote( $req->getQueryParam('username')), $contact['portal_user_id'] ));

        return $res->withJson([ 'exists' => ( $user !== false ) ]);


    }

}