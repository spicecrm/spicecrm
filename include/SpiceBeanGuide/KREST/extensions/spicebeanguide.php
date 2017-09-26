<?php

require_once('include/SpiceBeanGuide/SpiceBeanGuideRestHandler.php');

$spicebeanGuidemanager = new SpiceBeanGuideRestHandler();

$app->group('/spicebeanguide', function () use ($app, $spicebeanGuidemanager) {
    $app->group('/:module', function () use ($app, $spicebeanGuidemanager) {
        $app->get('', function ($module) use ($app, $spicebeanGuidemanager) {
            echo json_encode($spicebeanGuidemanager->getStages($module));
        });
        $app->get('/:beanid', function ($module, $beanid) use ($app, $spicebeanGuidemanager) {
            echo json_encode($spicebeanGuidemanager->getStages($module, $beanid));
        });
    });
});