<?php
namespace SpiceCRM\includes\SpiceAttachments\templatefunctions;

use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;

class SpiceAttachmentsTemplateFunctions {

    /**
     * returns the list of attachments related to the bean
     * @param $compiler
     * @param Bean $beans['bean']
     * @param $inputString
     * @return string
     */
    public static function getSpiceAttachments($compiler, $beans, $inputString = null): array
    {
        $list = [];
        $attachments = SpiceAttachments::getAttachmentsForBean($beans['bean']->_module, $beans['bean']->id, 50, false);
        foreach($attachments as $attachment){
            if(empty($attachment['display_name'])) {
                $attachment['display_name'] = $attachment['filename'];
            }
            $list[] = (object)$attachment;
        }
        return $list;
    }
}