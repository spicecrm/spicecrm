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
        $app->group('/{pageId}', function () use ($app) {
            $app->get('', function($req, $res, $args) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $SpiceThemeController = new SpiceThemeController();
                echo $SpiceThemeController->getPage($args['pageId']);
            });
            $app->post('', function($req, $res, $args) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $postBody = $req->getParsedBody();
                $postParams = $_GET;
                $data = array_merge($postBody, $postParams);
                $SpiceThemeController = new SpiceThemeController();
                echo $SpiceThemeController->setPage($args['pageId'],$data);
            });
            $app->delete('', function($req, $res, $args) use ($app) {
                require_once('modules/SpiceThemeController/SpiceThemeController.php');
                $postBody = $req->getParsedBody();
                $postParams = $_GET;
                $data = array_merge($postBody, $postParams);
                $SpiceThemeController = new SpiceThemeController();
                echo json_encode($SpiceThemeController->deletePage($args['pageId'],$data));
            });
        });
    });

    $app->get('/changeGroup/{currentModule}/{newGroup}', function($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->changeGroup($args['currentModule'], $args['newGroup']);
    });
    $app->get('/getMenu/{activeModule}/{currentModule}', function($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->getMenu($args['activeModule'], $args['currentModule']);
    });


    $app->post('/setToggleFooterline', function ($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $req->getParsedBody();
        $postParams = $_GET;
        $data = array_merge($postBody, $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->setToggleFooterline($data));
    });
    $app->get('/refresh/{currentModule}/{widget}', function($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->refresh($args['currentModule'], $args['widget']);
    });
    $app->get('/setToggle/{menu}/{collapsed}', function($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->setToggle($args['menu'],$args['collapsed']);
    });
    $app->post('/saveSort', function ($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $req->getParsedBody();
        $postParams = $_GET;
        $data = array_merge($postBody, $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->saveSort($data));
    });
    $app->get('/showConfigSideBar', function () use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $SpiceThemeController = new SpiceThemeController();
        echo $SpiceThemeController->showConfigSideBar();
    });
    $app->post('/setWidgetUserConfig', function ($req, $res, $args) use ($app) {
        require_once('modules/SpiceThemeController/SpiceThemeController.php');
        $postBody = $req->getParsedBody();
        $postParams = $_GET;
        $data = array_merge($postBody, $postParams);
        $SpiceThemeController = new SpiceThemeController();
        echo json_encode($SpiceThemeController->setWidgetUserConfig($data));
    });
    $app->get('/getLastViewed', function () use ($app) {
        global $current_user;
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $getParams = $_GET;
        $history = $tracker->get_recently_viewed($current_user->id, $getParams['module'] ? array($getParams['module']) : '', $getParams['limit'] ?: 10);
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
    $app->get('/getShortcuts/{currentModule}', function($req, $res, $args) use ($app) {
        require_once('include/MVC/View/SugarView.php');
        $view = new SugarView();
        $view->module = $args['currentModule'];
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
        $app->group('/{module}/{beanId}', function () use ($app) {
            $app->get('', function($req, $res, $args) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $isFavorite = SpiceFavorites::get_favorite($args['module'],$args['beanId']);
                echo json_encode(array('isFavorite' => $isFavorite));
            });
            $app->post('', function($req, $res, $args) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $favorite = SpiceFavorites::set_favorite($args['module'],$args['beanId']);
            });
            $app->delete('', function($req, $res, $args) use ($app) {
                require_once('include/SpiceFavorites/SpiceFavorites.php');
                $favorite = SpiceFavorites::delete_favorite($args['module'],$args['beanId']);
            });
        });
    });
    /* THEME FUNCTIONS END */
});