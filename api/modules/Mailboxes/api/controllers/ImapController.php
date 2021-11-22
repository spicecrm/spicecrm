<?php
namespace SpiceCRM\modules\Mailboxes\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

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
    public function getMailboxFolders(Request $req, Response $res, array $args): Response {
        $params = $req->getParsedBody();

        $mailbox = BeanFactory::getBean('Mailboxes');
        foreach ($params['data'] as $name => $value) {
            if (isset($mailbox->field_name_map[$name])) {
                $mailbox->$name = $value;
            }
        }

        $mailbox->initTransportHandler();

        $result = $mailbox->transport_handler->getMailboxes();

        return $res->withJson($result);
    }
}
