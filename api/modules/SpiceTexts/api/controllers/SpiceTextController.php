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

        // check custom first
        if ($db->tableExists('spicebeancustomguides')) {

            $customQ = $db->query("
            SELECT spicetexts.*, syscustomtextids.label, spicebeancustomguides.id as spiceBeanGuideId, 'custom' as scope FROM spicetexts 
            INNER JOIN syscustomtextids ON spicetexts.text_id = syscustomtextids.text_id 
            INNER JOIN spicebeancustomguides ON spicebeancustomguides.systextid = spicetexts.text_id 
            WHERE parent_type = '{$args['parentType']}' and deleted = 0");

            while ($custom = $db->fetchByAssoc($customQ)) {
                $spiceTexts[] = $custom;
            }
        }

        $query = $db->query("
            SELECT spicetexts.*, systextids.label, spicebeanguides.id as spiceBeanGuideId, 'global' as scope FROM spicetexts 
            INNER JOIN systextids ON spicetexts.text_id = systextids.text_id 
            INNER JOIN spicebeanguides ON spicebeanguides.systextid = spicetexts.text_id 
            WHERE parent_type = '{$args['parentType']}' and deleted = 0");

        while ($row = $db->fetchByAssoc($query)) {
            $spiceTexts[] = $row;
        }

        return $res->withJson($spiceTexts);
    }
}
