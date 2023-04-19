<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/



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
                LoggerManager::getLogger()->fatal('sendgrid','handle Sendgrid event error: ' . $e->getMessage());
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
