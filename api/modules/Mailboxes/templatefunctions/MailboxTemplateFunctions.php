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
        if (empty($beans['Emails']) && empty($beans['bean']) && $beans['bean']->_module != 'Emails') return '';

        $emails = isset($beans['Emails']) ? $beans['Emails'] : $beans['bean'];

        [$parentType, $parentId] = $emails->getTrackingParentData();

        $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
        $unsubUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl'));
        return "<a href=\"{$unsubUrl}\" class=\"spice-marketing-unsubscribe-link\">$inputString</a>";
    }

    public static function generateDOILink($compiler, $beans, $inputString): string
    {
        if (empty($beans['Emails']) && empty($beans['bean']) && $beans['bean']->_module != 'Emails') return '';

        $emails = isset($beans['Emails']) ? $beans['Emails'] : $beans['bean'];

        [$parentType, $parentId] = $emails->getTrackingParentData();

        $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
        $doubleOptinUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.double_optin_url'));
        return "<a href=\"{$doubleOptinUrl}\" class=\"spice-marketing-double-optin-link\">$inputString</a>";
    }
}