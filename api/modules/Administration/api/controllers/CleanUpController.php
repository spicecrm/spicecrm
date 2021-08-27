<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use SpiceCRM\modules\Administration\api\CleanUpHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class CleanUpController {

    /** @var CleanUpHandler|null */
    public $cleanUpHandler = null;

    /**
     * SpiceFTSRESTController constructor.
     * initialize cleanUpHandler
     */
    public function __construct()
    {
        $this->cleanUpHandler = new CleanUpHandler;
    }

    /**
     * get incomplete records
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getIncompleteRecords(Request $req, Response $res, array $args): Response {
        if($args['scope']) {
            $this->cleanUpHandler->scope = $args['scope'];
        }
        return $res->withJson($this->cleanUpHandler ->getIncompleteRecords());
    }

    /**
     * get incomplete records
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUnusedRecords(Request $req, Response $res, array $args): Response {
        if($args['scope']) {
            $this->cleanUpHandler->scope = $args['scope'];
        }
        return $res->withJson($this->cleanUpHandler->getUnusedRecords());
    }

    /**
     * delete dompdf cache
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function cleanDompdfStyleCacheFile(Request $req, Response $res, array $args): Response {
        return $res->withJson($this->cleanUpHandler->cleanDompdfStyleCacheFile());
    }



}