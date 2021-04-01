<?php
namespace SpiceCRM\includes\SpiceUI\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\SpiceUI\SpiceUIRESTHandler;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIRepositoryController;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIComponentsetsController;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIActionsetsController;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIRoutesController;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIFieldsetsController;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUILoadtasksController;
use SpiceCRM\includes\SpiceUI\KREST\controllers\SpiceUIModelValidationsController;


class SystemUIController{


    #$uiRestHandler = new SpiceUIRESTHandler();

    /***
     * add a list type
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */

    public function SystemAddListType($req,$res,$args){
        $uiRestHandler = new SpiceUIRESTHandler();
        $postbody = $req->getParsedBody();
        return $res->withJson($uiRestHandler->addListType($args['module'], $postbody['list'], $postbody['global']));
    }

    /**
     * sets a list type
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetListType($req,$res,$args){
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

    public function SystemDeleteListType($req,$res,$args){
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

    public function SystemReturnListType($req,$res,$args){
        return $res->withJson([
            'modules'                 => SpiceUIRepositoryController::getModuleRepository(),
            'components'              => SpiceUIRepositoryController::getComponents(),
            'componentdefaultconfigs' => SpiceUIRepositoryController::getComponentDefaultConfigs(),
            'componentmoduleconfigs'  => SpiceUIRepositoryController::getComponentModuleConfigs(),
            'componentsets'           => SpiceUIComponentsetsController::getComponentSets(),
            'actionsets'              => SpiceUIActionsetsController::getActionSets(),
            'routes'                  => SpiceUIRoutesController::getRoutesDirect(),
            'scripts'                 => SpiceUIRepositoryController::getLibraries(),
        ]);
    }

    /**
     * get all roles of user ids
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemGetAllRoles($req,$res,$args){
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAllRoles($args['userid']));
    }

    /**
     * sets the system user role
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SystemSetUserRole($req,$res,$args){
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

    public function SystemDeleteUserRole($req,$res,$args){
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

    public function SystemCheckForExist($req,$res,$args){
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

    public function SystemCheckForDefault($req,$res,$args){
        $uiRestHandler = new SpiceUIRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($uiRestHandler->checkComponentDefaultAlreadyExists($getParams));
    }

    /**
     * sets the component sets
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemSetComponentSet($req,$res,$args){
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

    public function SystemGetFieldSet($req,$res,$args){
        return $res->withJson(['fieldsets' => SpiceUIFieldsetsController::getFieldSets()]);
    }

    /**
     * checks if an fieldset already exists
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SystemCheckForFieldSet($req,$res,$args){
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

    public function SystemGetFieldDefs($req,$res,$args){
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

    public function SystemGetServiceCategory($req,$res,$args){
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

    public function SystemGetServiceTree($req,$res,$args){
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

    public function SystemGetServiceTreeBody($req,$res,$args){
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

    public function SystemGetSelectTree($req,$res,$args){
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

    public function SystemGetSelectTreeListById($req,$res,$args){
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

    public function SystemGetSelectTreeById($req,$res,$args){
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

    public function SystemSetSelectTree($req,$res,$args){
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

    public function SystemSetTree($req,$res,$args){
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

    public function SystemGetModuleValidation($req,$res,$args){
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

    public function SystemSetModelValidation($req,$res,$args){
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

    public function SystemDeleteModelValidation($req,$res,$args){
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

    public function SystemGetAdminNav($req,$res,$args){
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

    public function SystemGetAllModules($req,$res,$args){
        $uiRestHandler = new SpiceUIRESTHandler();
        return $res->withJson($uiRestHandler->getAllModules());
    }

}