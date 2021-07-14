<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\includes\Logger\APILogEntryHandler;
use Swift_Attachment;
use Swift_Message;
use Swift_TransportException;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\includes\Logger\LoggerManager;

trait GmailApiTrait
{
    use SwiftInlineImagesTrait;

    /**
     * @inheritdoc
     */
    public function testConnection($testEmail) {
        $status = $this->checkConfiguration($this->outgoing_settings);
        if (!$status['result']) {
            $response = [
                'result' => false,
                'errors' => 'No Gmail API connection set up. Missing values for: '
                    . implode(', ', $status['missing']),
            ];
            return $response;
        }

        try {
            $this->sendMail(Email::getTestEmail($this->mailbox, $testEmail));
            $response['result'] = true;
        } catch (Swift_TransportException $e) {
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        } catch (\Exception $e) { //todo-uebelmar clarify which exception
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        }

        return $response;
    }

    /**
     * @inheritdoc
     */
    protected function composeEmail($email) {
        $this->checkEmailClass($email);

        $message = (new Swift_Message($email->name))
            ->setFrom([$this->userName => $this->mailbox->gmail_email_address])
            ->setBody($email->body, 'text/html')
        ;

        if ($this->mailbox->catch_all_address == '') {
            $toAddressess = [];
            foreach ($email->to() as $address) {
                array_push($toAddressess, $address['email']);
            }
            $message->setTo($toAddressess);
        } else { // send everything to the catch all address
            $message->setTo([$this->mailbox->catch_all_address]);

            // add a message for whom this was intended for
            $intendedReciepients = [];
            foreach ($email->to() as $recipient) {
                $intendedReciepients[] = $recipient['email'];
            }
            $email->name .= ' [intended for ' . join(', ', $intendedReciepients) . ']';
            $message->setSubject($email->name);
        }

        if (!empty($email->cc_addrs)) {
            $ccAddressess = [];
            foreach ($email->cc() as $address) {
                array_push($ccAddressess, $address['email']);
            }
            $message->setCc($ccAddressess);
        }

        if (!empty($email->bcc_addrs)) {
            $bccAddressess = [];
            foreach ($email->bcc() as $address) {
                array_push($bccAddressess, $address['email']);
            }
            $message->setBcc($bccAddressess);
        }

        if ($this->mailbox->reply_to != '') {
            $message->setReplyTo($this->mailbox->reply_to);
        }

        if ($email->id) {
            foreach ($email->attachments as $att) {
                $message->attach(
                    Swift_Attachment::fromPath('upload://' . $att->filemd5)->setFilename($att->filename)
                );
            }

            $this->handleInlineImages($message, $email);
        }

        return $message;
    }

    /**
     * @inheritdoc
     */
    protected function dispatch($message) {
        $msg = $this->base64url_encode($message);

        $payload = json_encode([
            'raw' => $msg,
        ]);

        $url = self::API_URL . "/gmail/v1/users/{$this->userName}/messages/send";

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => [
                'Content-Type:message/rfc822',
                'Authorization: Bearer ' . $this->accessToken['access_token'],
            ],
        ];
        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'gmail_dispatch');
        $logEntryHandler->writeOutogingLogEntry();
        $response = curl_exec($curl);
        $logEntryHandler->updateOutgoingLogEntry($curl, $response);

        $responseObject = json_decode($response);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        if ($info['http_code'] >= 200 && $info['http_code'] < 300) {
            $result = [
                'result'     => true,
                'message_id' => $responseObject->id,
            ];
        } else {
            $result = [
                'result' => false,
                'errors' => $responseObject->error->message,
            ];
        }

        return $result;
    }
}
