<?php

require_once 'modules/SystemUI/SystemUIRESTHandler.php';
$uiRestHandler = new SystemUIRESTHandler();

$app->group('/spiceui', function () use ($app, $uiRestHandler)
{
    $app->group('/core', function () use ($app, $uiRestHandler)
    {
        $app->group('/modules', function () use ($app, $uiRestHandler)
        {
            $app->get('', function () use ($app, $uiRestHandler)
            {
                echo json_encode(array(
                    'modules' => $uiRestHandler->getModules(),
                    'roles' => $uiRestHandler->getSysRoles(),
                    'rolemodules' => $uiRestHandler->getSysRoleModules(),
                    'copyrules' => $uiRestHandler->getSysCopyRules()
                ));
            });
            $app->group('/:module/listtypes', function () use ($app, $uiRestHandler) {
                $app->post('', function ($module) use ($app, $uiRestHandler) {
                    $postbody = json_decode($app->request->getBody(), true);
                    echo json_encode($uiRestHandler->addListType($module, $postbody['list'], $postbody['global']));
                });
                $app->post('/:id', function ($module, $id) use ($app, $uiRestHandler) {
                    $postbody = json_decode($app->request->getBody(), true);
                    echo $uiRestHandler->setListType($id, $postbody);
                });
                $app->delete('/:id', function ($module, $id) use ($app, $uiRestHandler) {
                    echo $uiRestHandler->deleteListType($id);
                });
            });
        });
        $app->get('/components', function () use ($app, $uiRestHandler) {
            echo json_encode(array(
                'modules' => $uiRestHandler->getModuleRepository(),
                'components' => $uiRestHandler->getComponents(),
                'componentdefaultconfigs' => $uiRestHandler->getComponentDefaultConfigs(),
                'componentmoduleconfigs' => $uiRestHandler->getComponentModuleConfigs(),
                'componentsets' => $uiRestHandler->getComponentSets(),
                'actionsets' => $uiRestHandler->getActionSets(),
                'routes' => $uiRestHandler->getRoutes()
            ));
        });
        $app->post('/componentsets', function () use ($app, $uiRestHandler) {
            $postbody = json_decode($app->request->getBody(), true);
            echo json_encode($uiRestHandler->setComponentSets($postbody));
        });
        $app->get('/fieldsets', function () use ($app, $uiRestHandler) {
            echo json_encode($uiRestHandler->getFieldSets());
        });
        $app->post('/fieldsets', function () use ($app, $uiRestHandler) {
            $postbody = json_decode($app->request->getBody(), true);
            echo json_encode($uiRestHandler->setFieldSets($postbody));
        });
        $app->get('/fielddefs', function () use ($app, $uiRestHandler) {
            $getParams = $app->request->get();
            $modules = json_decode($getParams['modules']);
            echo json_encode($uiRestHandler->getFieldDefs($modules));
        });
        $app->get('/routes', function () use ($app, $uiRestHandler) {
            echo $uiRestHandler->getRoutes();
        });
        $app->get('/recent', function () use ($app, $uiRestHandler) {
            $getParams = $app->request->get();
            echo json_encode($uiRestHandler->getRecent($getParams['module'], $getParams['limit']));
        });
        $app->group('/favorites', function () use ($app, $uiRestHandler) {
            $app->get('', function () use ($app, $uiRestHandler) {
                $getParams = $app->request->get();
                echo json_encode($uiRestHandler->getFavorites());
            });
            $app->post('/:module/:id', function ($module, $id) use ($app, $uiRestHandler) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                SpiceFavorites::set_favorite($module,$id);
                $bean = BeanFactory::getBean($module, $id);
                echo json_encode(array(
                    'module' => $module,
                    'id' => $id,
                    'summary_text' => $bean->get_summary_text()
                ));
            });
            $app->delete('/:module/:id', function ($module, $id) use ($app, $uiRestHandler) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                SpiceFavorites::delete_favorite($module,$id);
                echo json_encode(array('status' => 'success'));
            });

        });
        $app->group('/reminders', function () use ($app, $uiRestHandler) {
            $app->get('', function () use ($app, $uiRestHandler) {
                $getParams = $app->request->get();
                echo json_encode($uiRestHandler->getReminders());
            });
            $app->post('/:module/:id/:date', function ($module, $id, $date) use ($app, $uiRestHandler) {
                require_once('include/SpiceReminders/SpiceReminders.php');
                SpiceReminders::setReminderRaw($id, $module, $date);
                echo json_encode(array('status' => 'success'));
            });
            $app->delete('/:module/:id', function ($module, $id) use ($app, $uiRestHandler) {
                require_once('include/SpiceReminders/SpiceReminders.php');
                SpiceReminders::removeReminder($id);
                echo json_encode(array('status' => 'success'));
            });
        });

        $app->group('/modelvalidations', function () use ($app, $uiRestHandler)
        {
            $app->get('', function () use ($app, $uiRestHandler)
            {
                //var_dump($uiRestHandler->getAllModelValidations());
                echo json_encode($uiRestHandler->getAllModelValidations());
            });
            $app->get('/:module', function ($module) use ($app, $uiRestHandler)
            {
                echo json_encode($uiRestHandler->getModuleModelValidations($module),JSON_HEX_TAG);
            });
            $app->post('', function () use ($app, $uiRestHandler)
            {
                $postbody = json_decode($app->request->getBody(), true);
                echo json_encode($uiRestHandler->setModelValidation($postbody));
            });
            $app->delete('/:id', function ($id) use ($app, $uiRestHandler)
            {
                echo json_encode($uiRestHandler->deleteModelValidation($id));
            });
        });
    });
    $app->group('/admin', function () use ($app, $uiRestHandler) {
        $app->get('/navigation', function () use ($app, $uiRestHandler) {
            $getParams = $app->request->get();
            echo json_encode($uiRestHandler->getAdminNavigation());
        });
        $app->group('/modules', function () use ($app, $uiRestHandler) {
            $app->get('', function () use ($app, $uiRestHandler) {
                echo json_encode($uiRestHandler->getAllModules());
            });
        });
    });
    $app->group('/workbench', function () use ($app, $uiRestHandler) {

    });
});