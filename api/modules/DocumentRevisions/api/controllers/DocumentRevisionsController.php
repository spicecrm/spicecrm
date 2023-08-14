<?php

namespace SpiceCRM\modules\DocumentRevisions\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class DocumentRevisionsController extends SpiceBean
{
    public function loadUnreadRevisions(Request $req, Response $res, array $args): Response
    {
        $result = [];
        $modHandler = new SpiceBeanHandler();
        $seed = BeanFactory::getBean('Users', $args['id']);
        $optional_where = 'users_documentrevisions.acceptance_status = 0';
        $list = $seed->get_linked_beans( 'documentrevisions', 'DocumentRevisions', [], 0, -1, 0, $optional_where);
        foreach ($list as $listEntry){
            $result [] =  $modHandler->mapBean($listEntry);
        }

        return $res->withJson($result);
    }

    public function setAcceptanceStatus(Request $req, Response $res, array $args){

        $userid = $req->getParsedBody();

        $insert_query = "UPDATE users_documentrevisions SET acceptance_status = 1 WHERE users_documentrevisions.document_revision_id = {$args['id']} AND users_documentrevisions.user_id = {$userid['userid']} ";
        DBManagerFactory::getInstance()->query($insert_query);

        return $res->withJson(['success' => true]);

    }
};