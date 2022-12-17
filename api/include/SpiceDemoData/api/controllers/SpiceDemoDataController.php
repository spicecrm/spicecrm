<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDemoData\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceDemoData\SpiceDemoDataGenerator;

/**
 * Class SpiceDemoDataController
 *
 * this class supports generation of demo data using mockaroo.com as a service
 *
 * @package SpiceCRM\includes\SpiceDemoData
 */
class SpiceDemoDataController
{

    /**
     * generate all demo data possible
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function generateB2B(Request $req, Response $res, array $args): Response {
        $demoGenerator = new SpiceDemoDataGenerator();
        $demoGenerator->generateAccounts();
        $demoGenerator->generateContacts();
        $demoGenerator->generateLeads();
        $demoGenerator->generateOpportunities();
        return $res->withJson(['status' => 'success']);
    }


    /**
     * generate demo data for specified module
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function generateForModule(Request $req, Response $res, array $args): Response {
        $demoGenerator = new SpiceDemoDataGenerator();
        $methodName = 'generate'.$args['module'];
        if(method_exists($demoGenerator, $methodName)){
            $demoGenerator->$methodName();
            return $res->withJson(['status' => 'success'], 200);
        }
        return $res->withJson(['status' => 'error', 'msg' => 'method '.$methodName.' not found'], 404);
    }

}
