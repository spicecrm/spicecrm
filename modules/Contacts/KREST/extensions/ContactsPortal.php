<?php

$app->get('/portal/{id}/portalaccess', function($req, $res, $args) use ( $app ) {
    global $db;

    $retArray = array(
        'aclroles' => array(),
        'portalroles' => array(),
        'user' => new stdClass()
    );

    $contact = BeanFactory::getBean('Contacts', $args['id']);

    if ( !$contact || !$contact->ACLAccess('edit')) throw new KREST\ForbiddenException();

    // get acl roles
    $roles = $db->query("SELECT id, name FROM acl_roles WHERE deleted = 0 ORDER BY name");
    while($role = $db->fetchByAssoc($roles)){
        $retArray['aclroles'][] = $role;
    }

    // get ui roles
    $roles = $db->query("SELECT id, name FROM sysuiroles ORDER BY name");
    while($role = $db->fetchByAssoc($roles)){
        $retArray['portalroles'][] = $role;
    }

    if ( $contact->portal_user_id and $user = BeanFactory::getBean('Users', $contact->portal_user_id )) {

        $retArray['user']->id = $user->id;
        $retArray['user']->username = $user->user_name;
        $retArray['user']->status = $user->status == 'Active' ? true : false;

        $roles = $user->get_linked_beans('aclroles', 'ACLRole');

        foreach($roles as $role){
            $retArray['user']->aclrole = $role->id;
            break;
        }

        // portalRole
        $portalRoles = $db->query("SELECT * FROM sysuiuserroles WHERE user_id='$user->id'");
        $portalRole = $db->fetchByAssoc($portalRoles);
        $retArray['user']->portalrole = $portalRole['sysuirole_id'];
    }

    $retArray['pwdCheck'] = array(
        'regex' => '^'.KRESTUserHandler::getPwdCheckRegex().'$',
        'guideline' => KRESTUserHandler::getPwdGuideline( $req->getParam('lang') )
    );
    return $res->withJson( $retArray );
});

$app->post('/portal/{id}/portalaccess', function($req, $res, $args) use ($app) {
    global $db;
    $retArray = array();

    $contact = BeanFactory::getBean('Contacts', $args['id']);

    if( !$contact || !$contact->ACLAccess('edit')) throw new KREST\ForbiddenException();

    $postParams = $req->getParsedBody();

    $user = BeanFactory::getBean('Users');

    if ( !empty( $contact->portal_user_id )) $user->retrieve( $contact->portal_user_id );
    $isNewUser = empty( $user->id );

    $user->user_name = $postParams['username']; # todo: check, if available (checked only in ui)
    if ( $postParams['status'] ) $user->status = 'Active';
    else $user->status = 'Inactive';

    $user->first_name = $contact->first_name;
    $user->last_name = $contact->last_name;

    if ( $isNewUser and !isset( $postParams['password']{0} ) )
        throw new KREST\BadRequestException('Missing Password of New User');

    if ( isset( $postParams['password']{0} )) {
        if ( !preg_match( '/' . KRESTUserHandler::getPwdCheckRegex() . '/', $user->user_hash = User::getPasswordHash( $postParams['password'] ) ) )
            throw new KREST\BadRequestException('Password does not match the Guideline.');
        $user->user_hash = User::getPasswordHash( $postParams['password'] );
        $user->pwd_last_changed = TimeDate::getInstance()->nowDb();
    }

    if ( $isNewUser ) {
        $user->portal_only = 1;
        $user->is_admin = 0;
        $user->inbound_processing_allowed = 0;
    }

    $user->save();

    if ( $isNewUser ) {
        $contact->portal_user_id = $user->id;
        $contact->save();
    }

    // set the acl role
    $roles = $user->get_linked_beans('aclroles', 'ACLRole');
    foreach( $roles as $role ) {
        $user->aclroles->delete( $role->id );
        break;
    }
    if ( $postParams['aclrole'] ){
        $user->aclroles->add( $postParams['aclrole'] );
    }

    // set the portal role
    $db->query("DELETE FROM sysuiuserroles WHERE user_id = '$user->id'");
    if ( $postParams['portalrole'] ) {
        $db->query( sprintf('INSERT INTO sysuiuserroles ( id, user_id, sysuirole_id ) VALUES( "%s", "%s", "%s" )', create_guid(), $user->id, $db->quote( $postParams['portalrole'] )));
    }

    return $res->withJson( $retArray );
});

$app->get('/portal/{contactId}/testUsername', function( $req, $res, $args ) use ( $app ) {
    global $db;

    $contact = $db->fetchOne( sprintf('SELECT portal_user_id FROM contacts WHERE id = "%s" AND deleted = 0', $db->quote( $args['contactId'] )));
    if ( !$contact ) throw ( new KREST\NotFoundException( 'Contact Not Found' ))->setLookedFor( $args['contactId'] );

    $user = $db->fetchOne( sprintf('SELECT id FROM users WHERE user_name = "%s" AND id <> "%s" AND deleted = 0 LIMIT 1', $db->quote( $req->getParam('username')), $contact['portal_user_id'] ));

    return $res->withJson([ 'exists' => ( $user !== false ) ]);

});