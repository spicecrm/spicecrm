<?php

namespace SpiceCRM\includes\SpiceBeanGuides\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceBeanGuidesKanbanMigrationController
{
    public function migrateKanban(Request $req, Response $res, $args): Response
    {
        return $res->withJson('tests');
    }
}