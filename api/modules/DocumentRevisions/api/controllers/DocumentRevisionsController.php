<?php

namespace SpiceCRM\modules\DocumentRevisions\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class DocumentRevisionsController
{
    public function loadUnreadRevisions(Request $req, Response $res, array $args): Response
    {
        $result = [];
        $modHandler = new SpiceBeanHandler();
        $seed = BeanFactory::getBean('Users', $args['id']);
        $list = $seed->get_linked_beans( 'documentrevisions', 'DocumentRevisions' );
        foreach ($list as $listEntry){
            $result [] =  $modHandler->mapBean($listEntry);
        }



        if(!$result){
            throw new NotFoundException('Beep boop, boop beep');
        }

        return $res->withJson($result);
    }
};