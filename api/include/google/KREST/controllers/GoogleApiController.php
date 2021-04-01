<?php
namespace SpiceCRM\includes\google\KREST\controllers;

use SpiceCRM\includes\google\GoogleAPIRestHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use Slim\Routing\RouteCollectorProxy;

class GoogleApiController{

    /**
     * start a search
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GoogleApiSearch($req, $res, $args){
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson($googleAPIRestHandler->search(utf8_encode(base64_decode(urldecode($args['term']))), utf8_encode(base64_decode(urldecode($args['locationbias'])))));
    }

    /**
     * get the autocompletion
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GoogleApiAutocomplete($req, $res, $args){
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson($googleAPIRestHandler->autocomplete($args['term']));
    }

    /**
     * get the details of a place
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GoogleApiGetPlaceDetails($req, $res, $args){
        $googleAPIRestHandler = new GoogleAPIRestHandler();
        return $res->withJson($googleAPIRestHandler->getplacedetails($args['placeid']));
    }
}