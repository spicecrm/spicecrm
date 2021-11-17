<?php

namespace SpiceCRM\modules\AccountKPIs\api\controllers;

use DateInterval;
use DateTime;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class AccountKpiController{

    /**
     * get sales account details
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    public function getAccountKpi (Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        //todo .. load account to see if user has access rights
        $seed = BeanFactory::getBean('Accounts', $args['id']);

        $date = new DateTime();
        $yearTo = $req->getQueryParams()['yearto'] ?: $date->format('Y');

        $date->sub(new DateInterval('P4Y'));
        $yearFrom = $req->getQueryParams()['yearfrom'] ?: $date->format('Y');

        $retArray = [
            'companycodes' => [],
            'accountkpis' => [],
        ];

        $companyCodes = $db->query("SELECT * FROM companycodes WHERE deleted = 0");
        while($companyCode = $db->fetchByAssoc($companyCodes)){
            $retArray['companycodes'][] = $companyCode;
        }

        if($seed) {
            $results = $db->query("SELECT year, companycode_id, SUM(revenue) AS revenue FROM accountkpis WHERE account_id='{$args['id']}' AND year BETWEEN '$yearFrom' AND '$yearTo' GROUP BY year, companycode_id");
            while ($result = $db->fetchByAssoc($results)) {
                $retArray['accountkpis'][$result['companycode_id']][$result['year']] = $result['revenue'];
            }
        }
        return $res->withJson($retArray);
    }
}