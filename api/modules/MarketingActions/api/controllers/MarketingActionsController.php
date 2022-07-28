<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\MarketingActions\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class MarketingActionsController
{

    public function getAllMarketingActions(Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $records = $db->query("SELECT * FROM marketingactions"); #  ORDER BY ... ASC
        while ($record = $db->fetchByAssoc($records))
            $retArray['actions'][] = ['id' => $record['id'], 'name' => $record['name']];

        return $res->withJson( $retArray );
    }

}
