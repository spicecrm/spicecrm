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

use DOMDocument;
use DOMElement;
use DOMXPath;
use Swift_Image;
use Swift_Message;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;

/**
 * Trait SwiftInlineImagesTrait
 *
 * Contains function to handle inline base64 images in connection with the SwiftMailer library.
 * Used e.g. by the IMAP and Gmail handlers.
 *
 * @package SpiceCRM\modules\Mailboxes\Handlers
 */
trait SwiftInlineImagesTrait
{
    /**
     * Checks if the email body contains inline base64 images.
     * If it does an attachment is created for them and they are replaced by references in the body.
     *
     * @param Swift_Message $message
     * @param Email $email
     * @return Swift_Message
     */
    private function handleInlineImages(Swift_Message &$message, Email $email): Swift_Message {
        $images = $email->findInlineImages();

        foreach ($images as $image) {
            $cid = $this->generateInlineImage($message, $image);
            $this->replaceInlineImage($message, $cid);
        }

        return $message;
    }

    /**
     * Generates an inline image object and returns its CID.
     *
     * @param Swift_Message $message
     * @param DOMElement $image
     * @return string
     */
    private function generateInlineImage(Swift_Message &$message, DOMElement $image): string {
        $imageData = $image->getAttribute('src');

        // check if the image src has charset param and set the proper data start position
        $stringPos = strpos('charset=utf-8' , $imageData) == 14 ? 35 : 21;

        $decodedImageData = base64_decode(substr($imageData, $stringPos));
        $imageName = SpiceUtils::createGuid() . '.png';
        $inlineImage = Swift_Image::newInstance($decodedImageData, $imageName, 'image/png')
            ->setDisposition('inline');
        return $message->embed($inlineImage);
    }

    /**
     * Replaces an inline base64 image with a reference to an attachment.
     *
     * @param Swift_Message $message
     * @param string $cid
     */
    private function replaceInlineImage(Swift_Message &$message, string $cid): void {
        $doc = new DOMDocument();
        // load html and use utf-8 encoding
        $doc->loadHTML('<?xml encoding="utf-8"?>' . $message->getBody());
        $selector = new DOMXPath($doc);

        // query all inline images. some images include charset utf-8 in the src
        $inlineImages = $selector->query("//img[contains(@src, 'data:image/png;base64,') or contains(@src, 'data:image/png;charset=utf-8;base64,')]");

        // replace the first one
        $inlineImage = $inlineImages->item(0);
        $inlineImage->setAttribute('src', $cid);

        $message->setBody($doc->saveXML(), 'text/html');
    }
}