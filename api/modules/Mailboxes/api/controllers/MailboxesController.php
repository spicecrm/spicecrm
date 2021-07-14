<?php
namespace SpiceCRM\modules\Mailboxes\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\modules\Emails\Email;
use Exception;
use SpiceCRM\modules\Mailboxes\processors\MailboxProcessor;
use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class MailboxesController
{
    /**
     * fetchEmails
     *
     * Fetches emails from a particular mailbox
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function fetchEmails(Request $req, Response $res, array $args): Response {
        $id = $args['id'];

        set_time_limit(300);

        $mailbox = BeanFactory::getBean('Mailboxes', $id, ['encode' => false]);

        if ($mailbox->active == false) {
            return $res->write(json_encode([
                'result' => 'true',
                'message' => 'Emails were not fetched. Mailbox inactive.',
            ]));
        }

        $mailbox->initTransportHandler();

        $result = $mailbox->transport_handler->fetchEmails();

        return $res->withJson($result);
    }

    /**
     * Returns and array of Mailboxes with the number of read, unread and closed emails
     * to be used in the Mailboxes Dashlet in the UI.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getMailboxesForDashlet(Request $req, Response $res, array $args): Response {
        $mailboxes = [];

        $type = $args['type'];

        $mboxes = BeanFactory::getBean('Mailboxes');

        foreach ($mboxes->get_full_list("", "inbound_comm = 1 AND active = 1
        AND hidden <> 1") as $mbox) {
            if ($type != '' && $mbox->getType() != $type) {
                continue;
            }

            $mailboxes[] = [
                'id'           => $mbox->id,
                'name'         => $mbox->name,
                'emailsunread' => $mbox->getUnreadEmailsCount(),
                'emailsread'   => $mbox->getReadEmailsCount(),
                'emailsclosed' => $mbox->getClosedEmailsCount(),
            ];
        }

        return $res->withJson($mailboxes);
    }

    public function handleSendgridEvents($req, $res, $args) {
        $data = file_get_contents("php://input");
        $events = json_decode($data, true);

        foreach ($events as $event) {
            try {
                $email = Email::findByMessageId($event['smtp-id']);
                $email->status = $event['event'];
                $email->save();
            } catch (Exception $e) {
                LoggerManager::getLogger()->info($e->getMessage());
            }

            /*switch ($event['event']) {
                case 'delivered':
                    break;
                case 'processed':
                    break;
                case 'dropped':
                    break;
                case 'bounce':
                    break;
                case 'deferred':
                    break;
                case 'open':
                    break;
                case 'click':
                    break;
                case 'unsubscribe':
                    break;
                case 'spamreport':
                    break;
            }*/
        }
    }
}
