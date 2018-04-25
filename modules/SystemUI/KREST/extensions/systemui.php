<?php

require_once 'modules/SystemUI/SystemUIRESTHandler.php';
$uiRestHandler = new SystemUIRESTHandler();

$app->group('/spiceui', function() use ($app, $uiRestHandler)
{
    $app->group('/core', function() use ($app, $uiRestHandler)
    {
        $app->group('/modules', function() use ($app, $uiRestHandler)
        {
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                echo json_encode(array(
                    'modules' => $uiRestHandler->getModules(),
                    'roles' => $uiRestHandler->getSysRoles(),
                    'rolemodules' => $uiRestHandler->getSysRoleModules(),
                    'copyrules' => $uiRestHandler->getSysCopyRules()
                ));
            });
            $app->group('/{module}/listtypes', function() use ($app, $uiRestHandler) {
                $app->post('', function($req, $res, $args) use ($app, $uiRestHandler) {
                    $postbody = $req->getParsedBody();
                    echo json_encode($uiRestHandler->addListType($args['module'], $postbody['list'], $postbody['global']));
                });
                $app->post('/{id}', function($req, $res, $args) use ($app, $uiRestHandler) {
                    $postbody = $req->getParsedBody();
                    echo $uiRestHandler->setListType($args['id'], $postbody);
                });
                $app->delete('/{id}', function($req, $res, $args) use ($app, $uiRestHandler) {
                    echo $uiRestHandler->deleteListType($args['id']);
                });
            });
        });
        $app->get('/components', function($req, $res, $args) use ($app, $uiRestHandler) {
            echo json_encode(array(
                'modules' => $uiRestHandler->getModuleRepository(),
                'components' => $uiRestHandler->getComponents(),
                'componentdefaultconfigs' => $uiRestHandler->getComponentDefaultConfigs(),
                'componentmoduleconfigs' => $uiRestHandler->getComponentModuleConfigs(),
                'componentsets' => $uiRestHandler->getComponentSets(),
                'actionsets' => $uiRestHandler->getActionSets(),
                'routes' => $uiRestHandler->getRoutes(),
                'scripts' => $uiRestHandler->getLibraries(),
            ));
        });
        $app->post('/componentsets', function($req, $res, $args) use ($app, $uiRestHandler) {
            $postbody = $req->getParsedBody();
            echo json_encode($uiRestHandler->setComponentSets($postbody));
        });
        $app->get('/fieldsets', function($req, $res, $args) use ($app, $uiRestHandler) {
            echo json_encode($uiRestHandler->getFieldSets());
        });
        $app->post('/fieldsets', function($req, $res, $args) use ($app, $uiRestHandler) {
            $postbody = $req->getParsedBody();
            echo json_encode($uiRestHandler->setFieldSets($postbody));
        });
        $app->get('/fielddefs', function($req, $res, $args) use ($app, $uiRestHandler) {
            $getParams = $req->getParams();
            echo json_encode($uiRestHandler->getFieldDefs(json_decode($getParams['modules'])));
        });
        $app->get('/routes', function($req, $res, $args) use ($app, $uiRestHandler) {
            echo $uiRestHandler->getRoutes();
        });
        $app->get('/recent', function($req, $res, $args) use ($app, $uiRestHandler) {
            $getParams = $req->getParams();
            echo json_encode($uiRestHandler->getRecent($getParams['module'], $getParams['limit']));
        });
        $app->group('/favorites', function() use ($app, $uiRestHandler) {
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler) {
                echo json_encode($uiRestHandler->getFavorites());
            });
            $app->post('/{module}/{id}', function($req, $res, $args) use ($app, $uiRestHandler) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                SpiceFavorites::set_favorite($args['module'],$args['id']);
                $bean = BeanFactory::getBean($args['module'], $args['id']);
                echo json_encode(array(
                    'module' => $args['module'],
                    'id' => $args['id'],
                    'summary_text' => $bean->get_summary_text()
                ));
            });
            $app->delete('/{module}/{id}', function($req, $res, $args) use ($app, $uiRestHandler) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                SpiceFavorites::delete_favorite($args['module'],$args['id']);
                echo json_encode(array('status' => 'success'));
            });

        });
        $app->group('/reminders', function() use ($app, $uiRestHandler) {
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler) {
                $getParams = $req->getParams();
                echo json_encode($uiRestHandler->getReminders());
            });
            $app->post('/{module}/{id}/{date}', function($req, $res, $args) use ($app, $uiRestHandler) {
                require_once('include/SpiceReminders/SpiceReminders.php');
                SpiceReminders::setReminderRaw($args['id'], $args['module'], $args['date']);
                echo json_encode(array('status' => 'success'));
            });
            $app->delete('/{module}/{id}', function($req, $res, $args) use ($app, $uiRestHandler) {
                require_once('include/SpiceReminders/SpiceReminders.php');
                SpiceReminders::removeReminder($args['id']);
                echo json_encode(array('status' => 'success'));
            });
        });

        $app->group('/modelvalidations', function() use ($app, $uiRestHandler)
        {
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                //var_dump($uiRestHandler->getAllModelValidations());
                echo json_encode($uiRestHandler->getAllModelValidations());
            });
            $app->get('/{module}', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                echo json_encode($uiRestHandler->getModuleModelValidations($args['module']),JSON_HEX_TAG);
            });
            $app->post('', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                //$postbody = json_decode($req->getParsedBody(), true);var_dump($req->getParsedBody(), $postbody, $req->getParams());
                $postbody = $req->getParsedBody();
                echo json_encode($uiRestHandler->setModelValidation($postbody));
            });
            $app->delete('/{id}', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                echo json_encode($uiRestHandler->deleteModelValidation($args['id']));
            });
        });

        $app->group('/libraries', function() use($app, $uiRestHandler){
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                echo json_encode($uiRestHandler->getLibraries());
            });
        });

        $app->group('/servicecategories', function() use($app, $uiRestHandler){
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                $result = $uiRestHandler->getServiceCategories();
                //var_dump($result);
                echo json_encode($result);
            });
            $app->get('/tree', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                $result = $uiRestHandler->getServiceCategoryTree();
                //var_dump($result);
                echo json_encode($result);
            });
            $app->post('/tree', function($req, $res, $args) use ($app, $uiRestHandler)
            {
                $result = $uiRestHandler->setServiceCategoryTree($req->getParsedBody());
                //var_dump($result);
                echo json_encode($result);
            });
        });

    });
    $app->group('/admin', function() use ($app, $uiRestHandler) {
        $app->get('/navigation', function($req, $res, $args) use ($app, $uiRestHandler) {
            $getParams = $req->getParams();
            echo json_encode($uiRestHandler->getAdminNavigation());
        });
        $app->group('/modules', function() use ($app, $uiRestHandler) {
            $app->get('', function($req, $res, $args) use ($app, $uiRestHandler) {
                echo json_encode($uiRestHandler->getAllModules());
            });
        });
    });
    /*
    $app->group('/workbench', function($req, $res, $args) use ($app, $uiRestHandler) {

    });
    */
});