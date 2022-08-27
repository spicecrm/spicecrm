<?php

namespace SpiceCRM\modules\OrgCharts\api\controller;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

class OrgChartsController
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
    public function getOrgUnits(Request $req, Response $res, array $args): Response {

        $seed = BeanFactory::getBean('OrgCharts', $args['id']);

        if(!$seed){
            throw new NotFoundException('Org Chart with the given ID not found');
        }

        return $res->withJson($this->getOrgUnitDetails($seed));
    }

    /**
     * gets the complete orgunit data
     *
     * @param $seed
     * @return array|array[]
     */
    private function getOrgUnitDetails($seed){
        // get the related units and load the reponse
        $result = [
            'orgunits' => [],
            'orgcharts' => []
        ];

        $modHandler = new SpiceBeanHandler();
        $units = $seed->get_linked_beans('orgunits', 'OrgUnit', [], 0, -99);
        foreach($units as $unit){
            $result['orgunits'][] = $modHandler->mapBean($unit);
        }

        $charts = $seed->get_linked_beans('orgcharts', 'OrgChart', [], 0, -99);
        foreach($charts as $chart){
            $result['orgcharts'][] = $modHandler->mapBean($chart);
        }
        return $result;
    }

    /**
     * returns the org units
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function addExistingOrgUnit(Request $req, Response $res, array $args): Response {

        $seed = BeanFactory::getBean('OrgCharts', $args['id']);

        if(!$seed){
            throw new NotFoundException('Org Chart with the given ID not found');
        }

        $unit = BeanFactory::getBean('OrgUnits', $args['suborgunit']);
        $unit->parent_id = $args['orgunitid'];
        $unit->orgchart_id = $seed->id;
        $unit->save();

        return $res->withJson($this->getOrgUnitDetails($seed));
    }
}