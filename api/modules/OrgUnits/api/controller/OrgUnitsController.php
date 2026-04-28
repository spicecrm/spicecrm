<?php

namespace SpiceCRM\modules\OrgUnits\api\controller;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceBeans\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class OrgUnitsController
{

    /**
     * returns the org units
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function getEmployees(Request $req, Response $res, array $args): Response {

        $seed = BeanFactory::getBean('OrgUnits', $args['id']);

        if(!$seed){
            throw new NotFoundException('Org Unit with the given ID not found');
        }

        $employees = $seed->getAllEmployees();

        return $res->withJson(['count' => count($employees), 'list' => $employees]);
    }

}