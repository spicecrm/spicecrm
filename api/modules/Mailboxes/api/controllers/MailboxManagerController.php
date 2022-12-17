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

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\Mailboxes\processors\MailboxProcessor;

class MailboxManagerController
{
    const TYPE_SMS   = 'sms';
    const TYPE_EMAIL = 'email';

    /**
     * testConnection
     *
     * Tests connection to mail servers
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function testConnection(Request $req, Response $res, array $args): Response {
        $controller = new MailboxesController();

        $params = $req->getParsedBody();

        $mailbox = BeanFactory::getBean('Mailboxes');
        foreach ($params['data'] as $name => $value) {
            if (isset($mailbox->field_defs[$name])) {
                $mailbox->$name = $value;
            }
        }

        $mailbox->initializeSettings();

        if (($mailbox->outbound_comm == 'single' || $mailbox->outbound_comm == 'mass') && empty($params['test_email'])) {
            return $res->withJson([
                'result' => false,
                'errors' => 'No test email selected',
            ]);
        }

        $result = false;

        if ($mailbox->initTransportHandler()) {
            $result = $mailbox->transport_handler->testConnection($params['test_email']);
        }

        return $res->withJson($result);
    }

    /**
     * getMailboxTransports
     *
     * Returns a list of all Mailbox Transport Processors
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getMailboxTransports(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $transports = [];
        $transportsObj = $db->query("SELECT name, label, component FROM sysmailboxtransports UNION SELECT name, label, component FROM syscustommailboxtransports");
        while($transport = $db->fetchByAssoc($transportsObj)){
            $transports[] = $transport;
        }

        return $res->withJson($transports);
    }

    /**
     * getMailboxProcessors
     *
     * Returns a list of all Mailbox Processors
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getMailboxProcessors(Request $req, Response $res, array $args): Response {
        return $res->withJson([
            'result' => true,
            'processors' => MailboxProcessor::all(),
        ]);
    }

    /**
     * getMailboxes
     *
     * Gets all mailboxes that are allowed for outbound communication
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getMailboxes(Request $req, Response $res, array $args): Response {
        $result = [];
        $params = $req->getQueryParams();

        $where = 'hidden=0 AND active=1';
        switch ($params['scope']) {
            case 'inbound':
                $where .= ' AND inbound_comm=1';
                break;
            case 'outbound':
                $where .= ' AND (outbound_comm="single" OR outbound_comm="mass")';
                break;
            case 'outboundsingle':
                $where .= ' AND outbound_comm="single"';
                break;
            case 'outboundmass':
                $where .= ' AND outbound_comm="mass"';
                break;
            case 'inbound_sms':
                $where .= ' AND (outbound_comm="single_sms" OR outbound_comm="mass_sms")';
                break;
            case 'outboundsingle_sms':
                $where .= ' AND outbound_comm="single_sms"';
                break;
            case 'outboundmass_sms':
                $where .= ' AND outbound_comm="mass_sms"';
                break;
        }

        $mailboxes = BeanFactory::getBean('Mailboxes')
            ->get_full_list(
                'mailboxes.name',
                $where
            );

        foreach ($mailboxes as $mailbox) {
            $type = self::TYPE_EMAIL;
            if ($mailbox->outbound_comm == 'mass_sms' || $mailbox->outbound_comm == 'single_sms') {
                $type = self::TYPE_SMS;
            }

            try {
                if ($mailbox->isConnected()) {
                    $result[] = [
                        'value' => $mailbox->id,
                        'display' => $mailbox->name,
                        'actionset' => $mailbox->actionset,
                        'type' => $type,
                    ];
                }
            } catch (\Exception $exception) {
                continue;
            }
        }

        return $res->withJson($result);
    }

    /**
     * setDefaultMailbox
     *
     * Sets the given Mailbox as the system default Mailbox.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function setDefaultMailbox(Request $req, Response $res, array $args): Response {
        $params = $req->getParsedBody();

        try {
            $mailbox = BeanFactory::getBean('Mailboxes', $params['mailbox_id']);
            return $res->withJson($mailbox->setAsDefault());
        } catch (Exception $e) {
            return $res->withJson($e);
        }
    }
}