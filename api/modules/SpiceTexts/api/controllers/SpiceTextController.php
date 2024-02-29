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

        $spiceTexts = [];

        $query = $db->query("select id, name, parent_id, parent_type, text_id, text_language, deleted from spicetexts t where t.parent_type = '{$args['parentType']}' and deleted != 1");

        while ($row = $db->fetchByAssoc($query)) {
            $spiceTexts[] = $row;
        }

        return $res->withJson($spiceTexts);
    }
}
