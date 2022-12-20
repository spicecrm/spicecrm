<?php

namespace SpiceCRM\modules\DocumentRevisions\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class DocumentRevisionsController
{
    public function loadUnreadRevisions(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean('Users', $args['id']);
        $list = $seed->get_linked_beans( 'date_entered', "users_documentrevisions.user_id = {$seed->id} AND users_documentrevisions.acceptance_status = 0" );


        if(!$seed){
            throw new NotFoundException('Beep boop, boop beep');
        }

        return $res->withJson($seed);
    }
};