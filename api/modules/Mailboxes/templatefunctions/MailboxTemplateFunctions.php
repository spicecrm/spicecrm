<?php

namespace SpiceCRM\modules\Mailboxes\templatefunctions;

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\CampaignLog\CampaignLog;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTrackingActions\EmailTracking;

class MailboxTemplateFunctions
{
    /**
     * parse unsubscribe url and generate an unsubscribe link
     * @param $compiler
     * @param Email | CampaignLog $beans
     * @param $inputString
     * @return string
     */
    public static function generateUnsubscribeLink($compiler, $beans, $inputString): string
    {
        if (empty($beans['bean'])) return '';

        [$parentType, $parentId] = $beans['bean']->getTrackingParentData();

        $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
        $unsubUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl'));
        return "<a href=\"{$unsubUrl}\" class=\"spice-marketing-unsubscribe-link\">$inputString</a>";
    }
}