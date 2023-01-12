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
            throw new NotFoundException('No new DocumentRevisions to review');
        }

        return $res->withJson($result);
    }

    public function setAcceptanceStatus(Request $req, Response $res, array $args){

        $seed = BeanFactory::getBean('users_documentrevisions', $args['id']);

        $insert_query = "UPDATE users_documentrevisions SET acceptance_status = 1 WHERE users_documentrevisions.document_revision_id = '{$args['id']}' ";

        $this->db->query($insert_query);

//        $bean->db->query($insert_query);
//        $list = $seed->get_linked_beans( 'documentrevisions', 'DocumentRevisions' );

    }
};