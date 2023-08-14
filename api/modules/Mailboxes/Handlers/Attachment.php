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

class Attachment extends AbstractAttachment
{
    public $path;
    private $part;

    const TYPE_TEXT        = 0;
    const TYPE_MULTIPART   = 1;
    const TYPE_MESSAGE     = 2;
    const TYPE_APPLICATION = 3;
    const TYPE_AUDIO       = 4;
    const TYPE_IMAGE       = 5;
    const TYPE_VIDEO       = 6;
    const TYPE_OTHER       = 7;

    public function __construct($part) {
        $this->part     = $part;

        if ($this->part->ifdparameters) { // attachments
            $this->filename = $this->part->dparameters[0]->value;
        } elseif ($this->part->ifparameters) { // inline images
            $this->filename = str_replace('>', '', str_replace('<', '', $this->part->id));
        }
    }

    /**
     * initMimeType
     *
     * Initializes the mime type attribute
     */
    public function initMimeType() {
        switch ($this->part->type) {
            case self::TYPE_TEXT:
                $mime_type = 'TEXT';
                break;
            case self::TYPE_MULTIPART:
                $mime_type = 'MULTIPART';
                break;
            case self::TYPE_MESSAGE:
                $mime_type = 'MESSAGE';
                break;
            case self::TYPE_APPLICATION:
                $mime_type = 'APPLICATION';
                break;
            case self::TYPE_AUDIO:
                $mime_type = 'AUDIO';
                break;
            case self::TYPE_IMAGE:
                $mime_type = 'IMAGE';
                break;
            case self::TYPE_VIDEO:
                $mime_type = 'VIDEO';
                break;
            case self::TYPE_OTHER:
            default:
                $mime_type = 'OTHER';
                break;
        }

        $this->mime_type = $mime_type . '/' . $this->part->subtype;
    }
}
