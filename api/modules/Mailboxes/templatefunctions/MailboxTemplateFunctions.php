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

    /**
     * parse double opt in url and generate an double opt in link
     * @param $compiler
     * @param $beans
     * @param $inputString
     * @return string
     */
    public static function generateDOILink($compiler, $beans, $inputString): string
    {
        if (empty($beans['Emails']) && empty($beans['bean']) && $beans['bean']->_module != 'Emails') return '';

        $parentBean = isset($beans['Emails']) ? $beans['Emails'] : $beans['bean'];

        // [$parentType, $parentId] = $emails->getTrackingParentData();

        $trackData = EmailTracking::encodeTrackingID("ParentType::{$parentBean->_module}ParentId:{$parentBean->id}");
        $doubleOptinUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.double_optin_url'));
        return "<a href=\"{$doubleOptinUrl}\" class=\"spice-marketing-double-optin-link\">$inputString</a>";
    }

    /** opt out url and generate an opt out link
     * @param $compiler
     * @param $beans
     * @param $inputString
     * @return string
     */
    public static function generateOptOutLink($compiler, $beans, $inputString): string
    {
        if (empty($beans['Emails']) && empty($beans['bean']) && $beans['bean']->_module != 'Emails') return '';

        $emails = isset($beans['Emails']) ? $beans['Emails'] : $beans['bean'];

        [$parentType, $parentId] = $emails->getTrackingParentData();

        $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
        $optoutUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.optout_url'));
        return "<a href=\"{$optoutUrl}\" class=\"spice-marketing-optout-link\">$inputString</a>";
    }

    /** opt out url and generate an opt out link
     * @param $compiler
     * @param $beans
     * @param $inputString
     * @return string
     */
    public static function generateManagePreferencesLink($compiler, $beans, $inputString): string
    {
        if ($beans['bean'] === 'CampaignLog' || $beans['bean'] === 'NewsletterLogs') {
            $bean = $beans['bean'];
        } elseif (isset ($beans['NewsletterLogs'])) {
            $bean = $beans['NewsletterLogs'];
        } elseif (isset ($beans['CampaignLog'])){
            $bean = $beans['CampaignLog'];
        } else {
            $emails = isset($beans['Emails']) ? $beans['Emails'] : $beans['bean'];
        }

        $parentType = $bean->_module;
        $parentId = $bean->id;

        if(empty($parentId || $parentType)){
            [$parentType, $parentId] = $emails->getTrackingParentData();
        }

        $trackData = EmailTracking::encodeTrackingID("ParentType:$parentType:ParentId:$parentId");
        $preferencesUrl = str_replace('{refid}', $trackData, SpiceConfig::getInstance()->get('emailtracking.manage_preferences_url'));
        return "<a href=\"{$preferencesUrl}\" class=\"spice-marketing-optout-link\">$inputString</a>";
    }
}