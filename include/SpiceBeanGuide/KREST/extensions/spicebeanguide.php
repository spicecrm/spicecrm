<?php

require_once('include/SpiceBeanGuide/SpiceBeanGuideRestHandler.php');

$spicebeanGuidemanager = new SpiceBeanGuideRestHandler();

$app->group('/spicebeanguide', function () use ($app, $spicebeanGuidemanager) {
    $app->group('/{module}', function() use ($app, $spicebeanGuidemanager) {
        $app->get('', function($req, $res, $args) use ($app, $spicebeanGuidemanager) {
            echo json_encode($spicebeanGuidemanager->getStages($args['module']));
        });
        $app->get('/{beanid}', function($req, $res, $args) use ($app, $spicebeanGuidemanager) {
            echo json_encode($spicebeanGuidemanager->getStages($args['module'], $args['beanid']));
        });
    });
});