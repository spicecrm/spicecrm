<?php

$app->get('/portal/:id/portalaccess', function ($contactid) use ($app) {
    global $db;

    $retArray = array(
        'aclroles' => array(),
        'portalroles' => array(),
        'user' => array(),
    );

    $contact = BeanFactory::getBean('Contacts', $contactid);

    if(!$contact || !$contact->ACLAccess('edit')){
        http_response_code(403);
        exit;
    }

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

    if ($contact->portal_user_id) {
        $user = BeanFactory::getBean('Users', $contact->portal_user_id);
        $retArray['user']['id'] = $user->id;
        $retArray['user']['status'] = $user->status == 'Active' ? true : false;

        $roles = $user->get_linked_beans('aclroles', 'ACLRole');

        foreach($roles as $role){
            $retArray['user']['aclrole'] = $role->id;
            break;
        }

        // portalRole
        $portalRoles = $db->query("SELECT * FROM sysuiuserroles WHERE user_id='$user->id'");
        $portalRole = $db->fetchByAssoc($portalRoles);
        $retArray['user']['portalrole'] = $portalRole['sysuirole_id'];
    }

    echo json_encode($retArray);
});

$app->post('/portal/:id/portalaccess', function ($contactid) use ($app) {
    global $db;

    $contact = BeanFactory::getBean('Contacts', $contactid);

    if(!$contact || !$contact->ACLAccess('edit')){
        http_response_code(403);
        exit;
    }

    $postParams = json_decode($app->request->getBody(), true);

    $user = BeanFactory::getBean('Users');

    if ($contact->portal_user_id) {
        $user->retrieve($contact->portal_user_id);
        if ($postParams['status'])
            $user->status = 'Active';
        else
            $user->status = 'Inactive';

        $user->save();
    } else {
        $user->user_name = $contact->email1;
        $user->status = 'Active';
        $user->portal_only = 1;
        $user->first_name = $contact->first_name;
        $user->last_name = $contact->last_name;
        $user->is_admin = 0;
        $user->inbound_processing_allowed = 0;

        $user->user_hash = $user->getPasswordHash('geheim');

        $user->save();

        $contact->portal_user_id = $user->id;
        $contact->save();
    }

    // set the acl role
    if($postParams['aclrole']){
        $roles = $user->get_linked_beans('aclroles', 'ACLRole');
        foreach($roles as $role){
            $user->aclroles->delete($role->id);
            break;
        }
        $user->aclroles->add($postParams['aclrole']);
    }

    // set the portal role
    if($postParams['portalrole']){
        $db->query("DELETE FROM sysuiuserroles WHERE user_id = '$user->id'");
        $db->query("INSERT INTO sysuiuserroles (id, user_id, sysuirole_id) VALUES('".create_guid()."', '$user->id', '{$postParams['portalrole']}')");
    }

    echo json_encode(array());
});
