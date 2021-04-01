<?php

namespace SpiceCRM\modules\AccountKPIs\KREST\controllers;

use DateInterval;
use DateTime;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;

class AccountKpiKRESTController{

    /**
     * get sales account details
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    public function getAccountKpi($req,$res,$args){
        $db = DBManagerFactory::getInstance();

        //todo .. load account to see if user has access rights
        $seed = BeanFactory::getBean('Accounts', $args['accountid']);

        $date = new DateTime();
        $yearTo = $req->getParams()['yearto'] ?: $date->format('Y');

        $date->sub(new DateInterval('P4Y'));
        $yearFrom = $req->getParams()['yearfrom'] ?: $date->format('Y');

        $retArray = [
            'companycodes' => [],
            'accountkpis' => [],
        ];

        $companyCodes = $db->query("SELECT * FROM companycodes WHERE deleted = 0");
        while($companyCode = $db->fetchByAssoc($companyCodes)){
            $retArray['companycodes'][] = $companyCode;
        }

        if($seed) {
            $results = $db->query("SELECT year, companycode_id, SUM(revenue) AS revenue FROM accountkpis WHERE account_id='{$args['accountid']}' AND year BETWEEN '$yearFrom' AND '$yearTo' GROUP BY year, companycode_id");
            while ($result = $db->fetchByAssoc($results)) {
                $retArray['accountkpis'][$result['companycode_id']][$result['year']] = $result['revenue'];
            }
        }
        return $res->withJson($retArray);
    }
}