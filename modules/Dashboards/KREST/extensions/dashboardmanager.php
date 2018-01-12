<?php
$app->group('/dashboards', function () use ($app) {
    $app->get('', function () use ($app) {
        global $db;
        $dashBoards = array();
        $dashBoardsObj = $db->query("SELECT * FROM dashboards");
        while ($dashBoard = $db->fetchByAssoc($dashBoardsObj))
            $dashBoards[] = $dashBoard;
        echo json_encode($dashBoards);
    });
    $app->get('/dashlets', function () use ($app) {
        global $db;
        $dashBoardDashlets = array();
        $dashBoardDashletsObj = $db->query("SELECT * FROM sysuidashboarddashlets UNION SELECT * FROM sysuicustomdashboarddashlets");
        while ($dashBoardDashlet = $db->fetchByAssoc($dashBoardDashletsObj))
            $dashBoardDashlets[] = $dashBoardDashlet;
        echo json_encode($dashBoardDashlets);
    });
    $app->get('/:id', function ($id) use ($app) {
        global $db;
        $dashBoard = $db->fetchByAssoc($db->query("SELECT * FROM dashboards WHERE id = '$id'"));
        $dashBoard['components'] = array();
        $dashBoardComponents = $db->query("SELECT * FROM dashboardcomponents WHERE dashboard_id = '$id'");
        while ($dashBoardComponent = $db->fetchByAssoc($dashBoardComponents)) {
            $dashBoardComponent['position'] = json_decode(html_entity_decode($dashBoardComponent['position']), true);
            $dashBoardComponent['componentconfig'] = json_decode(html_entity_decode($dashBoardComponent['componentconfig']), true);

            if ($dashBoardComponent['componentconfig']['dashletid']) {
                $dashletconfig = $db->fetchByAssoc($db->query("SELECT componentconfig FROM sysuidashboarddashlets WHERE id = '{$dashBoardComponent['componentconfig']['dashletid']}' UNION SELECT componentconfig FROM sysuicustomdashboarddashlets WHERE id = '{$dashBoardComponent['componentconfig']['dashletid']}'"));
                $dashBoardComponent['componentconfig'] = json_decode(html_entity_decode($dashletconfig['componentconfig'], ENT_QUOTES), true);
            }

            $dashBoard['components'][] = $dashBoardComponent;
        }

        echo json_encode($dashBoard);
    });
    $app->post('/:id', function ($id) use ($app) {
        global $db;
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $postbodyitems = json_decode($postBody, true);

        // todo: check if this is right to delete and reinsert all records .. might be nices to check what exists and update ...
        $db->query("DELETE FROM dashboardcomponents WHERE dashboard_id = '$id'");
        foreach ($postbodyitems as $postbodyitem) {
            // $db->query("UPDATE sysuidashboardcomponents SET position='".json_encode($postbodyitem['position'])."', name='".$postbodyitem['name']."', component='".$postbodyitem['component']."' WHERE id = '".$postbodyitem['id']."'");
            $db->query("INSERT INTO dashboardcomponents (id, dashboard_id, name, component, componentconfig, position) values('" . $postbodyitem['id'] . "', '$id', '" . $postbodyitem['name'] . "', '" . $postbodyitem['component'] . "', '" . json_encode($postbodyitem['componentconfig']) . "', '" . json_encode($postbodyitem['position']) . "')");
        }
        echo json_encode(array('status' => true));
    });
});