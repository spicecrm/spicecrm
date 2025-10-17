<?php

namespace SpiceCRM\includes\SpiceGateway;

use Exception;
use SpiceCRM\extensions\modules\TextMessages\TextMessage;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;

class SpiceGatewayServerHandler
{
    /**
     * send email from the data received from a client system
     * @param array $payload
     * @return object
     * @throws Exception
     */
    public static function sendEmail(array $payload): object
    {
        /** @var Email $email */
        $email = BeanFactory::newBean('Emails');
        $email->name = $payload['subject'];
        $email->body = $payload['body'];

        foreach ($payload['recipients'] as $recipient) {
            $email->addEmailAddress($recipient['type'], $recipient['email']);
        }

        $email->mailbox_id = SpiceConfig::getInstance()->get('gateway_server.email_mailbox_id');

        if (!$email->mailbox_id) {
            throw new Exception('Gateway Server email mailbox id not configured');
        }

        $email->sendEmail();

        return (object)['id' => $email->id];
    }

    /**
     * send sms from the data received from a client system
     * @param string $phoneNumber
     * @param string $message
     * @return object
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public static function sendSMS(string $phoneNumber, string $message): object
    {

        /** @var TextMessage $sms */
        $sms = BeanFactory::newBean('TextMessages');
        $sms->description = $message;
        $sms->msisdn = $phoneNumber;
        $sms->mailbox_id = SpiceConfig::getInstance()->get('gateway_server.sms_mailbox_id');

        if (!$sms->mailbox_id) {
            throw new Exception('Gateway Server sms mailbox id not configured');
        }

        $sms->send();

        return (object)['id' => $sms->id];
    }

    /**
     * send sms from the data received from a client system
     * @param array $payload
     * @return object
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public static function sendTemplateTypeSMS(array $payload): object
    {
        $sms = BeanFactory::newBean('TextMessages');

        /** @var EmailTemplate $smsTemplate */
        $smsTemplate = BeanFactory::newBean('TextMessageTemplates');
        $smsTemplate->retrieve_by_string_fields(['type' => $payload['type'], 'language' => $payload['language']]);
        $compiledContent = $smsTemplate->parse($sms, $payload['data']);

        return self::sendSMS($payload['phoneNumber'], $compiledContent);
    }

    /**
     * send sms from the data received from a client system
     * @param array $payload
     * @return object
     * @throws Exception
     */
    public static function sendTemplateTypeEmail(array $payload): object
    {
        /** @var Email $email */
        $email = BeanFactory::newBean('Emails');

        /** @var EmailTemplate $emailTemplate */
        $emailTemplate = BeanFactory::newBean('EmailTemplates');
        $emailTemplate->retrieve_by_string_fields(['type' => $payload['type'], 'language' => $payload['language']]);

        if (!$emailTemplate->id) {
            $emailTemplate->retrieve_by_string_fields(['type' => $payload['type'], 'language' => 'en_us']);
        }

        $compiledContent = $emailTemplate->parse($email, $payload['data']);
        $payload['body'] = $compiledContent['body_html'];
        $payload['subject'] = $compiledContent['subject'];

        return self::sendEmail($payload);
    }
}