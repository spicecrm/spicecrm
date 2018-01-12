<?php

$app->group('/EmailManager', function () use ($app) {
    $app->get('/outbound', function ($module) use ($app) {
        global $db, $current_user;

        $outbound_list = array();
        $allow_sysmail = reset($db->fetchByAssoc($db->query("SELECT value FROM config WHERE name = 'allow_default_outbound' AND category = 'notify'")));
        $from_sysmail = reset($db->fetchByAssoc($db->query("SELECT value FROM config WHERE name = 'fromaddress' AND category = 'notify'")));
        $user_address = reset($db->fetchByAssoc($db->query("Select ea.email_address FROM email_addresses ea INNER JOIN email_addr_bean_rel rel ON rel.bean_id = '".$current_user->id."' AND rel.bean_module = 'Users' AND ea.id = rel.email_address_id WHERE ea.deleted = 0 AND rel.deleted = 0 AND rel.primary_address = 1")));
        $outboxes = $db->query("SELECT * FROM outbound_email WHERE type = 'system' OR (type = 'system-override' AND user_id = '".$current_user->id."')");
        while($row = $db->fetchByAssoc($outboxes)) {
            if(($row['type'] == 'system' && $allow_sysmail != 0) || $row['type'] == 'system-override') {
                switch($row['type']){
                    case 'system':
                        $row['from_address'] = $from_sysmail;
                        break;
                    case 'system-override':
                        $row['from_address'] = $user_address;
                        break;
                }
                $outbound_list[] = array(
                    'id' => $row['id']."/outbound",
                    'from_address' => $row['from_address']
                );
            }
        }

        $inbound = $db->query("SELECT * FROM inbound_email WHERE deleted = 0 AND status = 'Active'");
        while($row = $db->fetchByAssoc($inbound)){
            $options = unserialize(base64_decode($row['stored_options']));
            if(isset($options['from_addr']) && !empty($options['from_addr']) && isset($options['allow_outbound_group_usage']) && $options['allow_outbound_group_usage'] === true){
                $outbound_list[] = array(
                    'id' => $row['id']."/inbound",
                    'from_address' => $options['from_addr']
                );
            }
        }

        echo json_encode($outbound_list);
    });
});
