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

namespace SpiceCRM\modules\Mailboxes\Handlers;

class ImapStructure
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
            $this->fetchBody($this->raw_structure, '1');

            if (empty($this->email_body)) {
                $this->email_body = imap_body($this->stream, $this->item);
            }
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
                    // WARNING! DANGER! Update for Schiedel. The plain text email body was overwritten by a garbage HTML email body. It works now in that particular case but might cause problems in others.
                    // disabled for now
                    //if (empty($this->email_body)) {
                        $this->fetchBody($part, $parent_section . $section);
                    //}
                    break;
                case self::TYPE_MULTIPART:
                    $this->iterateParts($part->parts, $section . '.');
                    break;
                case self::TYPE_APPLICATION:
                case self::TYPE_IMAGE:
                    $attachment = new Attachment($part);
                    $attachment->content = $this->fetchFileBody($part, $parent_section . $section);
                    $attachment->saveFile();
                    $attachment->initMimeType();

                    // todo make sure it always works

                    /* removed since this is handled properly in teh retirve of the email replacing the files by filename from teh attachments as src tag
                    if ($part->ifid) { // inline images
                        $image_id = str_replace('<', '', str_replace('>', '', $part->id));
                        $this->email_body = str_replace(
                            'cid:' . $image_id,
                            '/upload/' . $attachment->filemd5,
                            $this->email_body
                        );
                    }
                    */

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
                $this->email_body = imap_qprint(imap_fetchbody($this->stream, $this->item, $section));
                break;
            case self::ENC_BASE64:
                $this->email_body = imap_base64(imap_fetchbody($this->stream, $this->item, $section));
                break;
            default:
                $this->email_body = imap_fetchbody($this->stream, $this->item, $section);
                break;
        }

        // check if a part with subtype HTML actually contains HTML
        if (($this->email_body != strip_tags($this->email_body)) && $part->subtype == 'HTML') {
            return;
        }

        // Calendar appointments
        if ($part->subtype == 'CALENDAR') {
            return; // todo might be useful to add them to the CRM using email processors
        }

        // try to get the character encoding
        $encoding = self::extractEncoding($part->parameters);
        switch (strtolower($encoding)) {
            case 'utf-8':
                $this->email_body = $this->email_body;
                break;
            case 'iso-8859-1':
                $this->email_body = utf8_encode($this->email_body);
                break;
            default:
                $this->email_body = $this->email_body;
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
    private static function extractEncoding($parameters)
    {
        if (!empty($parameters)) {
            foreach ($parameters as $parameter) {
                if (strtoupper($parameter->attribute) == 'CHARSET') {
                    return $parameter->value;
                }
            }
        }

        return null;
    }
}
