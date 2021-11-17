<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\RESTManager;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class MetadataController {

    /** @var ModuleHandler|null */
    public $moduleHandler = null;

    /**
     * MetadataController constructor.
     * initialize moduleHandler
     */
    public function __construct()
    {
        $RESTManager = RESTManager::getInstance();
        $this->moduleHandler = new ModuleHandler($RESTManager);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @deprecated does not seem to be used anywhere
     */
    public function getModules(Request $req, Response $res, array $args): Response {
        return $res->withJson($this->moduleHandler->get_modules());
    }

    /**
     * get variable definitions for a specific module
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @deprecated does not seem to be used anywhere
     */
    public function getVarDefsForModule(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean($args['module']);
        return $res->withJson($bean->field_name_map);
    }

}