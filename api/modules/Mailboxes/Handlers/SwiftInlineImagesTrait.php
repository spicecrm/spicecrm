<?php
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
        $decodedImageData = base64_decode(substr($imageData, 21));
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
        $doc->loadHTML($message->getBody());
        $selector = new DOMXPath($doc);

        $inlineImages = $selector->query("//img[contains(@src, 'data:image/png;base64,')]");

        // replace the first one
        $inlineImage = $inlineImages->item(0);
        $inlineImage->setAttribute('src', $cid);

        $message->setBody($doc->saveXML(), 'text/html');
    }
}