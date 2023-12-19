<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SpiceTexts\api\controllers;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceTextController
{

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getSpiceTexts(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $query = $db->query("SELECT spicetexts.*, systextids.label FROM spicetexts INNER JOIN systextids ON spicetexts.text_id = systextids.text_id WHERE parent_type = '{$args['parentType']}' and deleted = 0");

        $spiceTexts = [];

        while ($row = $db->fetchByAssoc($query)) {
            $spiceTexts[] = $row;
        }

        return $res->withJson($spiceTexts);
    }
}
