<?php

namespace SpiceCRM\modules\Contacts\api\controllers;

use SpiceCRM\data\BeanFactory;
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
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class ContactsPortalController {

    public $contact;
    public $bodyParams;

    /**
     * handles the creating and updating of contacts
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function getPortalUser( Request $req, Response $res, array $args ): Response {
        $db = DBManagerFactory::getInstance();

        $retArray = [
            'aclRoles' => [],
            'portalRoles' => [],
            'user' => new stdClass()
        ];

        $this->loadContact( $args['id'] );

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

        if ( !empty( $this->contact->portal_user_id )) {
            $user = BeanFactory::getBean('Users');
            $user->retrieve( $this->contact->portal_user_id );
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
            'guideline' => UserAuthenticate::getPwdGuideline( $req->getQueryParams()['lang'] )
        ];
        return $res->withJson( $retArray );

    }

    /**
     * Loads a Contact.
     * @param $contactId
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function loadContact( string $contactId ) {
        $contact = BeanFactory::getBean('Contacts');
        $contact->retrieve( $contactId );
        if ( !isset( $contact->id )) throw ( new NotFoundException('Contact not found.'))->setLookedFor([ 'id' => $contactId, 'module' => 'Contacts' ]);
        if ( !$contact->ACLAccess( 'edit' )) throw ( new ForbiddenException('Forbidden to edit contact.'))->setErrorCode('noModuleEdit');
    }

    /**
     * Create an portal user.
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function createPortalUser( Request $req, Response $res, array $args ): Response {
        $this->bodyParams = $req->getParsedBody();
        foreach ($this->bodyParams as $k => $v ) $this->bodyParams[$k] = trim( $v );
        $this->loadContact( $args['id'] );
        return $res->withJson(['success' => true, 'action' => 'create', 'userId' => self::createOrUpdatePortalUser('create') ]);
    }

    /**
     * Update the data of an existing portal user.
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     */
    public function updatePortalUser( Request $req, Response $res, array $args ): Response {
        $this->bodyParams = $req->getParsedBody();
        foreach ($this->bodyParams as $k => $v ) $this->bodyParams[$k] = trim( $v );
        $this->loadContact( $args['id'] );
        return $res->withJson(['success' => true, 'action' => 'update', 'userId' => $this->createOrUpdatePortalUser('update') ]);
    }

    /**
     * Handles the creating or updating of a new/existing portal user.
     * @param $action 'create' or 'update'
     * @return string GUID of the portal user
     * @throws BadRequestException
     * @throws Exception
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function createOrUpdatePortalUser( string $action ): Response {
        $db = DBManagerFactory::getInstance();

        $db->transactionStart();

        $user = BeanFactory::getBean('Users');

        if ( $action === 'update' ) {
            if ( !empty( $contact->portal_user_id ) ) $user->retrieve( $contact->portal_user_id );
            if ( empty( $user->id ) ) throw ( new NotFoundException( 'Portal user not found.' ) )->setLookedFor([ 'id' => $contact->portal_user_id, 'module' => 'Users' ]);
            $isNewUser = false;
        } else {
            $isNewUser = true;
            if ( !empty( $contact->portal_user_id ))
                throw ( new BadRequestException('Contact already has portal user data. Creation of another portal user is not possible.'))->setErrorCode('contactAlreadyHasPortalUser');
        }

        if ( $db->fetchOne( sprintf('SELECT id FROM users WHERE user_name = "%s" AND id <> "%s" AND deleted = 0 LIMIT 1', $db->quote( $this->bodyParams['username']), $contact->portal_user_id )))
            throw ( new BadRequestException('User name already taken.'))->setErrorCode('usernameAlreadyTaken');
        if ( empty( $this->bodyParams['username'] ))
            throw ( new BadRequestException('Missing user name.'))->setErrorCode('missingUserName');
        # if ( strlen( $this->bodyParams['username'] ) > $GLOBALS['dictionary']['User']['fields']['user_name']['len'] )
        #    throw ( new BadRequestException('User name to long (max. '.$GLOBALS['dictionary']['User']['fields']['user_name']['len'].' chars).'))->setErrorCode('usernameToLong');
        $user->user_name = $this->bodyParams['username'];
        # if ( empty( $this->bodyParams['aclRole'] ))
        #    throw ( new BadRequestException('Missing acl role.'))->setErrorCode('missingAclRole');
        # if ( empty( $this->bodyParams['portalRole'] ))
        #    throw ( new BadRequestException('Missing portal role.'))->setErrorCode('missingPortalRole');

        $user->status = @$this->bodyParams['status'] ? 'Active':'Inactive';

        $user->first_name = $contact->first_name;
        $user->last_name = $contact->last_name;

        # if ( $isNewUser and !isset( $this->bodyParams['password'][0]) )
        #    throw ( new BadRequestException('Missing Password of New User'))->setErrorCode('missingPassword');

        if ( isset( $this->bodyParams['password'][0])) {
            if ( !preg_match( '/' . UserAuthenticate::getPwdCheckRegex() . '/', $user->user_hash = User::getPasswordHash( $this->bodyParams['password'] ) ) )
                throw ( new BadRequestException('Password does not match the Guideline.'))->setErrorCode('invalidPassword');
            $user->user_hash = User::getPasswordHash( $this->bodyParams['password'] );
            $user->pwd_last_changed = TimeDate::getInstance()->nowDb();
        }

        if ( $isNewUser ) {
            $user->portal_only = 1;
            $user->is_admin = 0;
            $user->inbound_processing_allowed = 0;
        }

        try {
            $user->save();
        } catch( Exception $e ) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Update portal user: Could not save user for contact ' . $this->contact->id . '.' );
            throw ( new Exception( 'Could not save user. '.$e->getMessage() ));
        }

        if ( $isNewUser ) {
            $contact->portal_user_id = $user->id;
            try {
                $contact->save();
            } catch( Exception $e ) {
                $db->transactionRollback();
                LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Could not save contact '.$this->contact->id.'.' );
                throw ( new Exception( 'Could not save contact. '.$e->getMessage() ));
            }
        }

        // set the acl role
        $roles = $user->get_linked_beans('aclroles', 'ACLRole');
        foreach( $roles as $role ) {
            $user->aclroles->delete( $role->id );
            break;
        }

        if ( ! $user->aclroles->add( $this->bodyParams['aclRole'] )) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Error assigning ACL role (ID: ' . $this->bodyParams['aclRole'] . ') for contact ' . $this->contact->id . '.' );
            throw ( new Exception( 'Could not assign ACL role (ID: ' . $this->bodyParams['aclRole'] . ').' ) );
        }

        // set the portal role
        $sqlResult = $db->query('SELECT id, name FROM sysuiroles ORDER BY name');
        while ( $row = $db->fetchByAssoc( $sqlResult )) $portalRoles[$row['id']] = $row;
        if ( !isset( $portalRoles[$this->bodyParams['portalRole']] )) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Unknown portal role (ID: ' . $this->bodyParams['portalRole'] . ') for contact ' . $this->contact->id . '.' );
            throw ( new Exception( 'Unknown portal role (ID: ' . $this->bodyParams['portalRole'] . ').' ) );
        }
        $db->query("DELETE FROM sysuiuserroles WHERE user_id = '$user->id'");
        $sqlResult = $db->query( sprintf('INSERT INTO sysuiuserroles ( id, user_id, sysuirole_id ) VALUES( "%s", "%s", "%s" )', SpiceUtils::createGuid(), $user->id, $db->quote( $this->bodyParams['portalRole'] )));
        if ( $db->getAffectedRowCount( $sqlResult ) != 1 ) {
            $db->transactionRollback();
            LoggerManager::getLogger()->fatal( 'Create/Edit portal user: Error assigning portal role (ID: ' . $this->bodyParams['portalRole'] . ') for contact ' . $this->contact->id . '.' );
            throw ( new Exception( 'Could not assign portal role (ID: ' . $this->bodyParams['portalRole'] . ').' ) );
        }

        $db->transactionCommit();

        if ( @$this->bodyParams['setDateTimePrefsWithSystemDefaults'] ) {
            $userPreference = new UserPreference( $user );
            $userPreference->setPreferenceForUser('datef', UserPreference::getDefaultPreference('date_format'));
            $userPreference->setPreferenceForUser('timef', UserPreference::getDefaultPreference('time_format'));
            $userPreference->setPreferenceForUser('timezone', UserPreference::getDefaultPreference('timezone'));
        }

        return $user->id;

    }

    /**
     * Checks if a potential user name already exists (except the concerning user).
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws NotFoundException
     */
    public function checkUsernameExistance( Request $req, Response $res, array $args ): Response {
        $db = DBManagerFactory::getInstance();
        $queryParams = $req->getQueryParams();

        $contact = $db->fetchOne( sprintf('SELECT portal_user_id FROM contacts WHERE id = "%s" AND deleted = 0', $db->quote( $this->contact->id )));
        if ( !$contact ) throw ( new NotFoundException( 'Contact Not Found' ))->setLookedFor(['id'=>$this->contact->id,'module'=>'Contacts']);

        $user = $db->fetchOne( sprintf('SELECT id FROM users WHERE user_name = "%s" AND id <> "%s" AND deleted = 0 LIMIT 1', $db->quote( $queryParams['username']), $contact['portal_user_id'] ));

        return $res->withJson([ 'exists' => ( $user !== false ) ]);
    }

}