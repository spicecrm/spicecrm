<?php

$app->group('/AccountsHierachy/:id', function () use ($app) {
    $app->get('', function ($id) use ($app) {
        global $db;

        $hierarchy = array();

        $seed = BeanFactory::getBean('Accounts', $id);
        $seed->load_relationship('members');
        $memberAccounts = $seed->get_linked_beans('members', 'Account');
        foreach ($memberAccounts as $memberAccount) {
            $memberCount = $db->fetchByAssoc($db->query("SELECT count(id) membercount FROM accounts WHERE parent_id = '$memberAccount->id' AND deleted = 0"));
            $hierarchy[] = array(
                'id' => $memberAccount->id,
                'summary_text' => $memberAccount->get_summary_text(),
                'member_count' => $memberCount['membercount']
            );
        }

        echo json_encode($hierarchy);
    });
    $app->get('/:addfields', function ($id, $addfields) use ($app) {
        global $db;

        $hierarchy = array();

        $addfields = json_decode(html_entity_decode($addfields));

        $seed = BeanFactory::getBean('Accounts', $id);
        $seed->load_relationship('members');
        $memberAccounts = $seed->get_linked_beans('members', 'Accounts');
        foreach ($memberAccounts as $memberAccount) {
            $memberCount = $db->fetchByAssoc($db->query("SELECT count(id) membercount FROM accounts WHERE parent_id = '$memberAccount->id' AND deleted = 0"));

            $addData = array();
            foreach($addfields as $addfield)
                $addData[$addfield] = $memberAccount->$addfield;

            $aclActions = ['list', 'detail', 'edit', 'delete', 'export'];
            foreach ($aclActions as $aclAction) {
                $addData['acl'][$aclAction] = $memberAccount->ACLAccess($aclAction);
            }

            $hierarchy[] = array(
                'id' => $memberAccount->id,
                'summary_text' => $memberAccount->get_summary_text(),
                'member_count' => $memberCount['membercount'],
                'data' => $addData
            );
        }

        echo json_encode($hierarchy);
    });
});
