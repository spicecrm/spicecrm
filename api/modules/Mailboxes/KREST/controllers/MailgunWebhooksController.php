<?php
namespace SpiceCRM\modules\Mailboxes\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;

class MailgunWebhooksController
{
    /**
     * Logs inbound Mailgun messages.
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function inbound($req, $res, $args) {
        $body = $req->getParsedBody();
        LoggerManager::getLogger()->fatal(print_r($body, true));
    }

    /**
     * Handles inbound Mailgun messages.
     *
     * @param $req
     * @param $res
     * @param $args
     * @throws \Exception
     */
    public function handle($req, $res, $args) {
        $body = $req->getParsedBody();

        global $timedate;
        $db = DBManagerFactory::getInstance();

        $emails = $db->query("SELECT id FROM emails WHERE message_id='<{$body['event-data']['message']['headers']['message-id']}>'");
        while ($email = $db->fetchByAssoc($emails)) {

            // set the email status
            $seed = BeanFactory::getBean('Emails', $email['id']);
            switch ($body['event-data']['event']) {
                case 'failed':
                    if($body['event-data']['severity'] == 'permanent') {
                        $seed->status = 'bounced';
                    } else {
                        $seed->status = 'deferred';
                    }
                    break;
                default:
                    $seed->status = $body['event-data']['event'];
                    break;
            }
            // save the email
            $seed->save(false);

            // update the campaign log
            $campaignLogs = $db->query("SELECT id FROM campaign_log WHERE related_id = '{$email['id']}' AND related_type = 'Emails'");
            while ($campaignLog = $db->fetchByAssoc($campaignLogs)) {
                $campaignLogBean = BeanFactory::getBean('CampaignLog', $campaignLog['id']);
                switch ($body['event-data']['event']) {
                    case 'failed':
                        if($body['event-data']['severity'] == 'permanent') {
                            $emailAddress = BeanFactory::getBean('EmailAddresses');
                            $emailAddress->markEmailAddressInvalid($body['event-data']['recipient']);
                            $campaignLogBean->activity_type = 'bounced';
                        } else {
                            $campaignLogBean->activity_type = 'deferred';
                        }
                        break;
                    default:
                        $campaignLogBean->activity_type = $body['event-data']['event'];
                        break;
                }
                $campaignLog->activity_date = $timedate->nowDb();
                $campaignLogBean->save();;
            }
        }
    }
}