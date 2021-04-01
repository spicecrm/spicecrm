<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use DateTimeZone;
use SpiceCRM\data\BeanFactory;
use DateTime;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\includes\UploadFile;

class GmailMessage
{
    private $email;
    private $message;
    private $handler;
    private $contentTransferEncoding; // may remove it after multibyte support is present

    public function __construct(GmailHandler $handler, $message, $mailboxId) {
        $this->handler = $handler;
        $this->message = $message;
        $this->generateNewEmail($mailboxId);
    }

    public function mapGmailToBean() {
        $this->handleHeaders();
        if ($this->message->payload->parts) {
            $this->handleParts($this->message->payload->parts);
        } elseif ($this->message->payload->body->attachmentId != '') {
            $this->saveGmailAttachment($this->message->payload);
            $this->email->body = '';
        } else {
            $encoding = $this->extractEncoding($this->message->payload->headers);
            $this->email->body = $this->gmailBodyDecode($this->message->payload->body->data, $encoding);
        }


        return $this->email;
    }

    private function handleHeaders() {
        foreach ($this->message->payload->headers as $header) {
            switch ($header->name) {
                case 'Subject':
                    $this->email->name = $this->decodeSubject($header->value);
                    break;
                case 'To':
                    $items = explode(',', $header->value);
                    foreach ($items as $item) {
                        $this->email->addEmailAddress('to', $this->parseAddress($item));
                    }
                    break;
                case 'Cc':
                    $items = explode(',', $header->value);
                    foreach ($items as $item) {
                        $this->email->addEmailAddress('cc', $this->parseAddress($item));
                    }
                    break;
                case 'Bcc':
                    $items = explode(',', $header->value);
                    foreach ($items as $item) {
                        $this->email->addEmailAddress('bcc', $this->parseAddress($item));
                    }
                    break;
                case 'From':
                    $this->email->addEmailAddress('from', $this->parseAddress($header->value));
                    $this->email->from_addr = $this->parseAddress($header->value);
                    break;
                case 'Date':
                    $this->email->date_sent = $this->parseDate($header->value);
                    break;
                case 'Message-ID':
                    $this->email->message_id = $header->value;
                    break;
                case 'Content-Transfer-Encoding':
                    $this->contentTransferEncoding = $header->value;
                    break;
            }
        }
    }

    private function handleParts($parts) {
        foreach ($parts as $part) {
            switch ($part->mimeType) {
                case 'multipart/related':
                case 'multipart/alternative':
                    $this->handleParts($part->parts);
                    break;
                default:
                    if ($part->filename == '') {
                        $encoding = $this->extractEncoding($part->headers);
                        $this->email->body = $this->gmailBodyDecode($part->body->data, $encoding);
                    } else {
                        $this->saveGmailAttachment($part);
                    }
                    break;
            }
        }
    }

    private function generateNewEmail($mailboxId) {
        $this->email = BeanFactory::getBean('Emails');
        $this->email->id          = create_guid();
        $this->email->new_with_id = true;
        $this->email->mailbox_id  = $mailboxId;
        $this->email->external_id = $this->message->id;
        $this->email->type        = Email::TYPE_INBOUND;
        $this->email->status      = Email::STATUS_UNREAD;
        $this->email->openness    = Email::OPENNESS_OPEN;
    }

    /**
     * The base64 encoded data from Gmail is not really just base64 encoded and requires this magic to decode.
     *
     * @param $data
     * @return string
     */
    private function gmailBodyDecode($data, $encoding) {
        switch ($encoding) {
            case 'iso-8859-1':
            case 'windows-1252':
                $data = base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
                //from php.net/manual/es/function.base64-decode.php#118244
                $data = imap_qprint($data);
//                $data = mb_convert_encoding($data, 'Windows-1252', 'UTF-8');
//                $data = utf8_encode($data);
                break;
            default:
                $data = base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
                $data = imap_qprint($data);

                // todo remove the following part after we have multibyte support
                if ($this->detectMultibyte($data) && $this->contentTransferEncoding != '8bit') {
                    $data = utf8_decode($data);
                    $data = utf8_encode($data);
                }
                break;
        }

        return $data;
    }

    private function gmailAttachmentDecode($rawData) {
        $rawData = imap_qprint($rawData);
        $rawData = base64_decode(str_replace(['-', '_'], ['+', '/'], $rawData));
        return $rawData;
    }

    private function decodeSubject($subjectString) {
        // todo remove the utf8 encoding once there is multibyte support
//        if ($this->detectMultibyte($subjectString)) {
//            return utf8_encode($subjectString);
//        }
        return $subjectString;
    }

    private function parseDate($dateString) {
        $date = DateTime::createFromFormat('D, d M Y H:i:s O', $dateString);
        if (!$date) {
            $date = DateTime::createFromFormat('D, d M Y H:i:s O e', $dateString);
        }
        if(!$date){
            $date = DateTime::createFromFormat('d M y H:i:s O', $dateString);
        }
        if (!$date) {
            $date = DateTime::createFromFormat('d M Y H:i:s O', $dateString);
        }
        if(!$date){
            $date = new DateTime();
        }
        $date->setTimezone(new DateTimeZone('UTC'));
        return $date->format('Y-m-d H:i:s');
    }

    private function parseAddress($addressString) {
        preg_match('#\<([^\]]*)\>#', $addressString, $match);
        return $match[1] ?? $addressString;
    }

    private function extractEncoding($headers) {
        $encoding = null;
        foreach ($headers as $header) {
            if ($header->name == 'Content-Type') {
                $values = explode(';', $header->value);
                foreach ($values as $value) {
                    if (strpos($value, 'charset') != false) {
                        $items = explode('=', $value);
                        $encoding = str_replace('"', '', $items[1]);
                    }
                }
            }
        }
        return $encoding;
    }

    private function detectMultibyte($string) {
        if (mb_strlen($string, 'UTF-8') != strlen($string)) {
            return true;
        }

        return false;
    }

    private function saveGmailAttachment($part) {
        $attachment = new GmailAttachment();
        $uf         = new UploadFile();
        $attachment->fileName   = $part->filename;
        $attachment->fileSize   = $part->body->size;
        $attachment->mimeType   = $uf->getMimeSoap($part->filename);
        $attachment->externalId = $part->body->attachmentId;
        $attachment->emailId    = $this->email->id;

        $rawAttachment = $this->handler->fetchAttachment($this->message->id, $part->body->attachmentId);

        $attachment->content    = $this->gmailAttachmentDecode($rawAttachment->data);
        $attachment->fileMd5    = md5($attachment->content);
        $attachment->saveFile();
        $attachment->save();
    }
}
