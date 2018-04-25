<?php
namespace SpiceCRM\modules\Mailboxes;

use SpiceCRM\modules\Mailboxes\Attachment;

require_once 'modules/Mailboxes/Attachment.php';

class IMAPStructure
{
    private $stream;
    private $item;
    private $raw_structure;
    private $email_body;
    private $attachments = [];

    const TYPE_TEXT        = 0;
    const TYPE_MULTIPART   = 1;
    const TYPE_MESSAGE     = 2;
    const TYPE_APPLICATION = 3;
    const TYPE_AUDIO       = 4;
    const TYPE_IMAGE       = 5;
    const TYPE_VIDEO       = 6;
    const TYPE_OTHER       = 7;

    const ENC_7BIT             = 0;
    const ENC_8BIT             = 1;
    const ENC_BINARY           = 2;
    const ENC_BASE64           = 3;
    const ENC_QUOTED_PRINTABLE = 4;

    public function __construct($stream, $item)
    {
        $this->stream        = $stream;
        $this->item          = $item;
        $this->raw_structure = imap_fetchstructure($this->stream, $item);
    }

    /**
     * getEmailBody
     *
     * Retrieves the email body
     *
     * @return string
     */
    public function getEmailBody()
    {
        return $this->email_body;
    }

    /**
     * getAttachments
     *
     * Retrieves the attachments
     *
     * @return array
     */
    public function getAttachments()
    {
        return $this->attachments;
    }

    /**
     * parseStructure
     *
     * Parses the structure of the email and saves the email body and email attachments.
     */
    public function parseStructure()
    {
        if (!empty($this->raw_structure->parts)) {
            $this->iterateParts($this->raw_structure->parts);
        } else {
            $this->email_body = imap_body($this->stream, $this->item);
        }
    }

    /**
     * iterateParts
     *
     * Iterates over the email parts and handles them according to their type
     *
     * @param $parts
     * @param string $parent_section
     */
    private function iterateParts($parts, $parent_section = '')
    {
        $section = 1;

        foreach ($parts as $part) {
            switch ($part->type) {
                case self::TYPE_TEXT:
                    $this->fetchBody($part, $parent_section . $section);
                    break;
                case self::TYPE_MULTIPART:
                    $this->iterateParts($part->parts, $section . '.');
                    break;
                case self::TYPE_APPLICATION:
                case self::TYPE_IMAGE:
                    $attachment = new Attachment($part);

                    $file_body = $this->fetchFileBody($part, $parent_section . $section);

                    $attachment->saveFile($file_body);

                    if ($part->ifdisposition == 0) { // inline images
                        $this->email_body = str_replace('cid:' . $attachment->filename, '/upload/' . $attachment->filemd5, $this->email_body);
                    }

                    array_push($this->attachments, $attachment);
                    break;
                default:
                    break;
            }

            ++$section;
        }
    }

    /**
     * fetchFileBody
     *
     * Fetches the body of a file attachment
     *
     * @param $part
     * @param $section
     * @return bool|string
     */
    private function fetchFileBody($part, $section)
    {
        switch ($part->encoding) {
            case self::ENC_7BIT:
            case self::ENC_8BIT:
            case self::ENC_BINARY:
                $file_body = imap_fetchbody($this->stream, $this->item, $section);
                break;
            case self::ENC_BASE64:
                $file_body = base64_decode(imap_fetchbody($this->stream, $this->item, $section));
                break;
            case self::ENC_QUOTED_PRINTABLE:
                $file_body = imap_qprint(imap_fetchbody($this->stream, $this->item, $section));
                break;
            default:
                $file_body = imap_fetchbody($this->stream, $this->item, $section);
                break;
        }

        return $file_body;
    }

    /**
     * fetchBody
     *
     * Fetches the email body and tries to encode it correctly
     *
     * @param $part
     * @param $section
     */
    private function fetchBody($part, $section)
    {
        switch ($part->encoding) {
            case self::ENC_QUOTED_PRINTABLE:
                $email_body = imap_qprint(imap_fetchbody($this->stream, $this->item, $section));
                break;
            case self::ENC_BASE64:
                $email_body = imap_base64(imap_fetchbody($this->stream, $this->item, $section));
                break;
            default:
                $email_body = imap_fetchbody($this->stream, $this->item, $section);
                break;
        }

        // check if a part with subtype HTML actually contains HTML
        if (($email_body == strip_tags($email_body)) && $part->subtype == 'HTML') {
            return;
        }

        // Calendar appointments
        if ($part->subtype == 'CALENDAR') {
            return; // todo might be useful to add them to the CRM using email processors
        }

        // try to get the character encoding
        $encoding = self::extractEncoding($part->parameters);
        switch ($encoding) {
            case 'iso-8859-1':
                $this->email_body = utf8_encode($email_body);
                break;
            case 'utf-8':
            default:
                $this->email_body = $email_body;
                break;
        }

        if ($part->subtype == 'PLAIN') {
            $this->email_body = str_replace("\r\n", "<br>", $this->email_body);
        }
    }

    /**
     * extractEncoding
     *
     * Extracts encoding from imap email part parameters
     * If possible
     *
     * @param array $parameters
     * @return null|string
     */
    private static function extractEncoding(array $parameters)
    {
        if (!empty($parameters)) {
            foreach ($parameters as $parameter) {
                if($parameter->attribute == 'CHARSET') {
                    return $parameter->value;
                }
            }
        }

        return null;
    }
}