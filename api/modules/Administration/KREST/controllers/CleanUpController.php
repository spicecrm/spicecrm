<?php
namespace SpiceCRM\modules\Administration\KREST\controllers;
use SpiceCRM\modules\Administration\KREST\CleanUpHandler;

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
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getIncompleteRecords($req, $res, $args)
    {
        if($args['scope']) {
            $this->cleanUpHandler->scope = $args['scope'];
        }
        return $res->withJson($this->cleanUpHandler ->getIncompleteRecords());
    }

    /**
     * get incomplete records
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getUnusedRecords($req, $res, $args)
    {
        if($args['scope']) {
            $this->cleanUpHandler->scope = $args['scope'];
        }
        return $res->withJson($this->cleanUpHandler->getUnusedRecords());
    }

    /**
     * delete dompdf cache
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function cleanDompdfStyleCacheFile($req, $res, $args)
    {
        return $res->withJson($this->cleanUpHandler->cleanDompdfStyleCacheFile());
    }



}