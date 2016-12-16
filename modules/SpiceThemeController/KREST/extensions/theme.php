<?php

$KRESTManager->registerExtension('theme', '1.0');

$app->group('/theme', function () use ($app) {
    /* THEME FUNCTIONS */
    $app->group('/Page', function () use ($app) {
        $app->get('', function () use ($app) {
            require_once('modules/SpiceThemeController/SpiceThemeController.php');
            $SpiceThemeController = new SpiceThemeController();
            echo $SpiceThemeController->getPage(0);
        });
        $app->post('/reset', function () use ($app) {
            require_once('modules/SpiceThemeController/SpiceThemeController.php');
            $SpiceThemeController = new SpiceThemeController();
            echo $SpiceThemeController->resetPages();
        });
        $app->group('/:pageId', function ($pageId) use ($app) {
            $app->get('', function ($pageId) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $SpiceThemeController = new SpiceThemeController();
                echo $SpiceThemeController->getPage($pageId);
            });
            $app->post('', function ($pageId) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $postBody = $body = $app->request->getBody();
                $postParams = $app->request->get();
                $data = array_merge(json_decode($postBody, true), $postParams);
                $SpiceThemeController = new SpiceThemeController();
                echo $SpiceThemeController->setPage($pageId,$data);
            });
            $app->delete('', function ($pageId) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $postBody = $body = $app->request->getBody();
                $postParams = $app->request->get();
                $data = array_merge(json_decode($postBody, true), $postParams);
                $SpiceThemeController = new SpiceThemeController();
                echo json_encode($SpiceThemeController->deletePage($pageId,$data));
            });
        });
    });

    $app->get('/changeGroup/:currentModule/:newGroup', function ($currentModule, $newGroup) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->changeGroup($currentModule, $newGroup);
    });
    $app->get('/getMenu/:activeModule/:currentModule', function ($activeModule, $currentModule) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->getMenu($activeModule, $currentModule);
    });


    $app->post('/setToggleFooterline', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->setToggleFooterline($data));
    });
    $app->get('/refresh/:currentModule/:widget', function ($currentModule, $widget) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->refresh($currentModule, $widget);
    });
    $app->get('/setToggle/:menu/:collapsed', function ($menu,$collapsed) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->setToggle($menu,$collapsed);
    });
    $app->post('/saveSort', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->saveSort($data));
    });
    $app->get('/showConfigSideBar', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->showConfigSideBar();
    });
    $app->post('/setWidgetUserConfig', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->setWidgetUserConfig($data));
    });
    $app->get('/getLastViewed', function () use ($app) {
        global $current_user;
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $history = $tracker->get_recently_viewed($current_user->id);
        foreach ($history as $key => $row) {
            if(empty($history[$key]['module_name'])) {
                unset($history[$key]);
                continue;
            }
            $history[$key]['item_summary_short'] = to_html(getTrackerSubstring($history[$key]['item_summary'])); //bug 56373 - need to re-HTML-encode
        }
        $recentRecords = $history;
        echo json_encode($recentRecords);
    });
    $app->get('/getConfig', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeSideBarManager.php');
        $SideBarManager = new SpiceThemeSideBarManager();
        $return_array = array(
            'SpiceThemeSideBarConfig' => explode(',',$SideBarManager->getWidgetUserConfig('SpiceThemeSideBarConfig')),
            'footerLineCollapsed' => $SideBarManager->getWidgetUserConfig('footerLineCollapsed'),
            'SideBar_collapsed' => $SideBarManager->getWidgetUserConfig('SideBar_collapsed'),
        );
        foreach($return_array['SpiceThemeSideBarConfig'] as $key => $val){
            $return_array[$val."_collapsed"] = $SideBarManager->getToggle($val);
        }
        echo json_encode($return_array);
    });
    $app->get('/getShortcuts/:currentModule', function ($currentModule) use ($app) {
        require_once('include/MVC/View/SugarView.php');
        $view = new SugarView();
        $view->module = $currentModule;
        // build the shortcut menu
        $shortcut_menu = array();
        foreach ( $view->getMenu() as $key => $menu_item ) {
            $shortcut_menu[$key] = array(
                "URL" => $menu_item[0],
                "LABEL" => $menu_item[1],
                "MODULE_NAME" => $menu_item[2],
                "IMAGE" => SugarThemeRegistry::current()->getImage($menu_item[2], "border='0' align='absmiddle'", null, null, '.gif', $menu_item[1]),
            );
        }
        echo json_encode($shortcut_menu);
    });
    $app->group('/Favorites', function () use ($app) {
        $app->get('', function () use ($app) {
            require_once('include/SpiceFavorites/SpiceFavorites.php');
            $favorites = SpiceFavorites::getFavoritesRaw();
            echo json_encode($favorites);
        });
        $app->group('/:module/:beanId', function ($module,$beanId) use ($app) {
            $app->get('', function ($module,$beanId) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $isFavorite = SpiceFavorites::get_favorite($module,$beanId);
                echo json_encode(array('isFavorite' => $isFavorite));
            });
            $app->post('', function ($module,$beanId) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $favorite = SpiceFavorites::set_favorite($module,$beanId);
            });
            $app->delete('', function ($module,$beanId) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $favorite = SpiceFavorites::delete_favorite($module,$beanId);
            });
        });
    });
    /* THEME FUNCTIONS END */
});