<?php
namespace SpiceCRM\modules\Mailboxes\KREST\controllers;

use SpiceCRM\data\BeanFactory;

class ImapController
{

    /**
     * getMailboxFolders
     *
     * Returns the mailbox folders
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getMailboxFolders($req, $res, $args) {
        $params = $req->getParsedBody();

        $mailbox = BeanFactory::getBean('Mailboxes');
        foreach($params['data'] as $name => $value){
            if(isset($mailbox->field_name_map[$name])){
                $mailbox->$name = $value;
            }
        }

        $mailbox->initTransportHandler();

        $result = $mailbox->transport_handler->getMailboxes();

        return $res->withJson($result);
    }
}
