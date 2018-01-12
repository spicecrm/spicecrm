<?php
require_once('KREST/handlers/module.php');

$KRESTModuleHandler = new KRESTModuleHandler($app);

$app->get('module/Users/:id/signature', function ($userid) use ($app, $KRESTModuleHandler) {
    global $db, $current_user;

    $signature = $db->fetchByAssoc($db->query("SELECT * FROM users_signatures WHERE user_id='$userid'"));

    echo json_encode(array(
            'signature' => $signature['signature'],
            'signature_html' => $signature['signature_html']
        )
    );
});

$app->post('module/Users/:id/signature', function ($userid) use ($app, $KRESTModuleHandler) {
    global $db, $current_user;

    $signatures = json_decode($app->request->getBody(), true);

    $signature = $db->fetchByAssoc($db->query("SELECT id FROM users_signatures WHERE user_id='$userid'"));
    if ($signature)
        $db->query("UPDATE users_signatures SET signature = '{$signatures['signature']}', signature_html = '{$signatures['signature_html']}' WHERE user_id='{$signature['id']}'");
    else
        $db->query("INSER INTO users_signatures (id, deleted, user_id, signature, signatire_html) VALUES('" . create_guid() . "', 0, '$userid', '{$signatures['signature']}', '{$signatures['signature_html']}')");

    echo json_encode(
        array(
            'status' => 'success'
        )
    );
});
