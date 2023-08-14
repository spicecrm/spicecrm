<?php
namespace SpiceCRM\includes\SpiceUI\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;


class SystemUIController{

    #$uiRestHandler = new SpiceUIRESTHandler();

    /***
     * gets the UI Assets
     *
     * @param $req Request
     * @param $res Response
     * @param $args
     */

    public function SystemGetAssets(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAssets());
    }

    /***
     * sets the UI assets
     *
     * @param $req Request
     * @param $res Response
     * @param $args
     */

    public function SystemSetAssets(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->setAssets($postbody));
    }

    /***
     * add a list type
     * @param $req Request
     * @param $res Response
     * @param $args
     */

    public function SystemAddListType(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->addListType($args['module'], $postbody));
    }

    /**
     * sets a list type
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetListType(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->setListType($args['id'], $postbody));
    }

    /**
     * delete a list type
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemDeleteListType(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->deleteListType($args['id']));
    }

    /**
     * returns list types
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemReturnListType(Request $req, Response $res, $args): Response
    {
        return $res->withJson([
            'modules' => SpiceUIRepositoryController::getModuleRepository(),
            'components' => SpiceUIRepositoryController::getComponents(),
            'componentdefaultconfigs' => SpiceUIRepositoryController::getComponentDefaultConfigs(),
            'componentmoduleconfigs' => SpiceUIRepositoryController::getComponentModuleConfigs(),
            'componentsets' => SpiceUIComponentsetsController::getComponentSets(),
            'actionsets' => SpiceUIActionsetsController::getActionSets(),
            'routes' => SpiceUIRoutesController::getRoutesDirect(),
            'scripts' => SpiceUIRepositoryController::getLibraries(),
        ]);
    }

    /**
     * get all roles of user ids
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetAllRoles(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAllRoles($args['userid']));
    }

    /**
     * get all system roles
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getSystemRoles(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $roles = [];
        $query = $db->query("SELECT *, 'global' scope FROM sysuiroles UNION SELECT *, 'custom' scope FROM sysuicustomroles order by name");
        while( $row = $db->fetchByAssoc($query) ){
            $roles[] = $row;
        }
        return $res->withJson($roles);
    }

    /**
     * get role modules for the given role
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getRoleModules(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $roleModules = [];
        $query = $db->query("SELECT *, 'global' scope FROM sysuirolemodules WHERE sysuirole_id = '{$args['role_id']}' UNION SELECT *, 'custom' scope FROM sysuicustomrolemodules WHERE sysuirole_id = '{$args['role_id']}' order by module");
        while( $row = $db->fetchByAssoc($query) ){
            $roleModules[] = $row;
        }
        return $res->withJson($roleModules);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getDashboardSets(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $dashboardSets = [];
        $query = $db->query("SELECT * FROM dashboardsets");
        while( $row = $db->fetchByAssoc($query) ){
            $dashboardSets[] = $row;
        }
        return $res->withJson($dashboardSets);
    }
    /**
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getDashboards(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $dashboards = [];
        $query = $db->query("SELECT * FROM dashboards");
        while( $row = $db->fetchByAssoc($query) ){
            $dashboards[] = $row;
        }
        return $res->withJson($dashboards);
    }
    /**
     * get system and custom logic hooks
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getAllHooks(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $hooks = [];
        $query = $db->query("SELECT *, 'global' scope FROM syshooks UNION SELECT *, 'custom' scope FROM syscustomhooks");
        while( $row = $db->fetchByAssoc($query) ){
            $row['type'] = $row ['scope'];
            unset($row['scope']);
            $hooks[] = $row;
        }
        return $res->withJson($hooks);
    }
    /**
     * get system and custom logic hooks
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getAllWebHooks(Request $req, Response $res, $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $webhooks = [];
        $query = $db->query("SELECT * FROM syswebhooks");
        while( $row = $db->fetchByAssoc($query) ){
            $webhooks[] = $row;
        }
        return $res->withJson($webhooks);
    }

    /**
     * sets the system user role
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SystemSetUserRole(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        return $res->withJson($uiRestHandler->setUserRole($args));
    }

    /**
     * deletes the roles of an user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemDeleteUserRole(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        return $res->withJson($uiRestHandler->deleteUserRole($args));
    }

    /**
     * checks if an module module allready exists
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemCheckForExist(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($uiRestHandler->checkComponentModuleAlreadyExists($getParams));
    }

    /**
     * checks if an default component allready exists
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemCheckForDefault(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($uiRestHandler->checkComponentDefaultAlreadyExists($getParams));
    }

    /**
     * sets the component sets
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SystemSetComponentSet(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->setComponentSets($postbody));

    }

    /**
     * gets the fieldsets
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetFieldSet(Request $req, Response $res, $args): Response
    {
        return $res->withJson(['fieldsets' => SpiceUIFieldsetsController::getFieldSets()]);
    }

    /**
     * checks if an fieldset already exists
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemCheckForFieldSet(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($uiRestHandler->checkFieldSetAlreadyExists($getParams));
    }

    /**
     * gets the definition of a fieldset
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetFieldDefs(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($uiRestHandler->getFieldDefs(json_decode($getParams['modules'])));
    }

    /**
     * gets the service category
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetServiceCategory(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->getServiceCategories();
        return $res->withJson($result);
    }

    /**
     * gets the service category tree
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetServiceTree(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->getServiceCategoryTree();
        return $res->withJson($result);
    }

    /**
     * gets the service category tree with a parsed body
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetServiceTreeBody(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->setServiceCategoryTree($req->getParsedBody());
        return $res->withJson($result);
    }

    /**
     * selects a tree without param
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetSelectTree(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->getSelectTrees();
        return $res->withJson($result);
    }

    /**
     * selects a tree list by id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetSelectTreeListById(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->getSelectTreeList($args['id']);
        return $res->withJson($result);
    }

    /**
     * selects a tree by id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetSelectTreeById(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->getSelectTree($args['id']);
        return $res->withJson($result);
    }

    /**
     * writes a tree in the database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetSelectTree(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->setSelectTree($req->getParsedBody());
        return $res->withJson($result);
    }

    /**
     * creates a new tree with from a parsed body
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetTree(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        $result = $uiRestHandler->setTree($req->getParsedBody());
        return $res->withJson($result);
    }

    /**
     * gets a module validation
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetModuleValidation(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getModuleModelValidations($args['module']), JSON_HEX_TAG);
    }

    /**
     * sets a model validation
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetModelValidation(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        //$postbody = json_decode($req->getParsedBody(), true);var_dump($req->getParsedBody(), $postbody, $req->getQueryParams());
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->setModelValidation($postbody));
    }

    /**
     * deletes a model validation
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemDeleteModelValidation(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->deleteModelValidation($args['id']));
    }

    /**
     * get the admin navigation
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetAdminNav(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAdminNavigation());
    }

    /**
     * gets all modells from the database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetAllModules(Request $req, Response $res, $args): Response
    {
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAllModules());
    }

}