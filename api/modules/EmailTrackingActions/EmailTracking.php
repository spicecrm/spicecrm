<?php

namespace SpiceCRM\modules\EmailTrackingActions;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\modules\NewsletterLogs\NewsletterLog;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\CampaignLog\CampaignLog;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\Emails\Email;

class EmailTracking
{

    /**
     * attach an element to the email body
     * @param string $element
     * @param string $body
     * @return string
     */
    public static function attachElementToBody(string $element, string $body): string
    {
        if (strpos($body, '</body>')) {
            return str_replace('</body>', "$element</body>", $body);
        } else {
            return $body . $element;
        }
    }

    /**
     * encodes the tracking ID
     *
     * @param $trackingData string must have the following syntax "ParentType:$parentType:ParentId:$parentId"
     * @return string
     * @throws Exception
     */
    static function encodeTrackingID(string $trackingData): string
    {
        $key = SpiceConfig::getInstance()->get('emailtracking.encryptionkey') ?? throw (new Exception("misconfiguration encryptionkey missing"));

        if ($key) {
            return urlencode(base64_encode(openssl_encrypt($trackingData, 'DES-EDE3-CBC', $key)));
        } else {
            return urlencode(base64_encode($trackingData));
        }

    }

    /**
     * decodes the tracking ID
     *
     * @param $trackingData
     * @return array
     * @throws Exception
     */
    static function decodeTrackingID($trackingData): ?array
    {
        $key = SpiceConfig::getInstance()->get('emailtracking.encryptionkey') ?? throw new Exception("misconfiguration encryptionkey missing");

        if (!$key) {
            $decrypted = base64_decode(urldecode($trackingData));
        } else {
            $decrypted = openssl_decrypt(base64_decode(urldecode($trackingData)), 'DES-EDE3-CBC', $key);;
        }

        if (!$decrypted) return null;

        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        return array_combine(array_column($chunks, 0), array_column($chunks, 1));
    }


    /**
     * generates the source URL for the tracking Image
     *
     * @param $trackingData
     * @return array|mixed|string|string[]|null
     */
    static function getTrackingPixelSrc($trackingData)
    {
        $url = SpiceConfig::getInstance()->get('emailtracking.tracking_pixel_url');
        if ($url) {
            $url = str_replace('{refid}', self::encodeTrackingID($trackingData), $url);
        }
        return $url;
    }

    /**
     * generates the tracking pixel image
     *
     * @param $trackingData
     * @return string
     */
    static function getTrackingPixel($trackingData)
    {
        return '<img style="visibility: hidden" src="' . self::getTrackingPixelSrc($trackingData) . '" alt="emailrefid_' . self::encodeTrackingID($trackingData) . '_" height="1" width="1">';
    }


    /**
     * generates the tracking pixel image
     *
     * @param Email $email
     * @return string
     */
    static function getUnsubscribeURL(Email $email)
    {
        $url = SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl') ?: SpiceConfig::getInstance()->config['site_url'] . '/email/u/{refid}';

        [$parentType, $parentId] = $email->getTrackingParentData();

        if ($url) {
            return str_replace('{refid}', self::encodeTrackingID("ParentType:$parentType:ParentId:$parentId"), $url);
        }
        return false;
    }

    /**
     * @param Email $email
     * @return string
     */
    static function getDoubleOptinUrl(Email $email)
    {
        $url = SpiceConfig::getInstance()->get('emailtracking.double_optin_url') ?: SpiceConfig::getInstance()->config['site_url'] . '/email/doi/{refid}';

        [$parentType, $parentId] = $email->getTrackingParentData();

        if ($url) {
            return str_replace('{refid}', self::encodeTrackingID("ParentType:$parentType:ParentId:$parentId"), $url);
        }
        return false;
    }

    /**
     * @param Email $email
     * @return string
     */
    static function getManagePreferencesUrl(Email $email)
    {
        $url = SpiceConfig::getInstance()->get('emailtracking.manage_preferences_url') ?: SpiceConfig::getInstance()->config['site_url'] . '/email/m/{refid}';

        [$parentType, $parentId] = $email->getTrackingParentData();

        if ($url) {
            return str_replace('{refid}', self::encodeTrackingID("ParentType:$parentType:ParentId:$parentId"), $url);
        }
        return false;
    }

    static function sendDOIEmail($bean, $mailboxId, $additionalValues = null, $additionalBeans = [])
    {
        $emailtemplate_id = SpiceConfig::getInstance()->get('emailtracking.double_optin_emailtemplate_id');
        if (empty($emailtemplate_id)) {
            throw new Exception('DOI Template ID not defined');
        }

        /** @var Email $email */
        $email = BeanFactory::newBean('Emails');

        # set the initial fields on the email
        $email->mailbox_id = $mailboxId;

        $email->parent_type = $bean->_module;
        $email->parent_id = $bean->id;
        $email->to_be_sent = true;

        // emailaddresses for multiemailhandling come from additional values
        if (!empty($additionalValues)) {
            $recipientAddresses = $additionalValues['emailAddresses'];
        } else {
            $recipientAddresses = $bean->email1;
        }

        // add the recipients to the email
        if (!is_array($recipientAddresses))
            $email->addEmailAddress('to', $recipientAddresses);
        else {
            foreach ($recipientAddresses as $thisAddress) {
                $email->addEmailAddress('to', $thisAddress);
            }
        }

        $additionalBeans = array_merge($additionalBeans, [$bean->_objectname => $bean]);
        $email->generateFromTemplate($emailtemplate_id, $email, $additionalValues, $additionalBeans);

        // clean up for imap
        if (strpos($email->body, "\n")) {
            $email->body = str_replace("\n", "", $email->body);
        }

        $email->save();

        return $email;
    }

    static function getPreferences($data)
    {
        /** @var Email | CampaignLog | NewsletterLog $bean */
        $bean = BeanFactory::getBean($data['ParentType'], $data['ParentId']);
        if(!$bean){
            throw new Exception('Bean module ' .  $data['ParentType'] .', id ' . $data['ParentId']. ' not found');
        }
        $target = BeanFactory::getBean($bean->target_type, $bean->target_id);

        if ($bean->_module === 'Emails') {
            $target = BeanFactory::getBean($bean->parent_type, $bean->parent_id);
        }
        if(!$target){
            throw new Exception('Target not found');
        }
        $emailAddress = self::getEmailAddress($bean->email_addr_bean_rel_id, $target);
        $targetData = [
            'parentType' => $target->_module,
            'parentId' => $target->id,
            'salutation' =>$target->salutation,
            'firstName' => $target->first_name,
            'lastName' => $target->last_name,
            'newsletter_account_name' => $target->newsletter_account_name,
            'emailAddress' => $emailAddress->email_address,
            'optInStatus' => $emailAddress->opt_in_status,
        ];
        $newsletter = BeanFactory::getBean('Newsletters');
        $newsletters = $newsletter->getNewsletterSubscriptionWithRelated($target->_module, $target->id, $bean->email_addr_bean_rel_id);
        $targetData['newsletters'] = $newsletters;

        return $targetData;
    }

    static function handlePreferences($data, $preferences)
    {
        /** @var Email | CampaignLog | NewsletterLog $bean */
        $bean = BeanFactory::getBean($data['ParentType'], $data['ParentId']);
        if(!$bean){
            throw new Exception('Bean module ' .  $data['ParentType'] .', id ' . $data['ParentId']. ' not found');
        }
        $target = BeanFactory::getBean($bean->target_type, $bean->target_id);

        if ($bean->_module === 'Emails') {
            $target = BeanFactory::getBean($bean->parent_type, $bean->parent_id);
        }

        if(!$target){
            throw new Exception('Target not found');
        }

        if(isset($preferences['optInStatus'])){
            if($preferences['optInStatus'] === 'opted_in' || $preferences['optInStatus'] =='opted_out'){
                $target->load_relationship('email_addresses');
                $emailAddress = self::getEmailAddress($bean->email_addr_bean_rel_id, $target);
                EmailAddress::setOptInStatus($target, $emailAddress, $preferences['optInStatus']);
            }
            else{
                throw new Exception('Opt In Status not found');
            }
        }

        if ($bean->_module === 'NewsletterLogs'||isset($preferences['newsletters'])) {
            $newsletter = BeanFactory::getBean('Newsletters');
            $newsletters = $newsletter->handlePreferences($bean, $target, $preferences);
        } else {
            $emailAddress = self::getEmailAddress($bean->email_addr_bean_rel_id, $target);
            return  $emailAddress->opt_in_status;
        }
        $emailAddress = self::getEmailAddress($bean->email_addr_bean_rel_id, $target);
        $targetData = [
            'parentType' => $target->_module,
            'parentId' => $target->id,
            'salutation' =>$target->salutation,
            'firstName' => $target->first_name,
            'lastName' => $target->last_name,
            'newsletter_account_name' => $target->newsletter_account_name,
            'emailAddress' => $emailAddress->email_address,
            'optInStatus' => $emailAddress->opt_in_status,
        ];
        $targetData['newsletters'] = $newsletters;
        return $targetData;
    }

    static function getEmailAddress($emailAddrBeanRelId, $target)
    {
        $db = DBManagerFactory::getInstance();
        // fallback
        if (empty($emailAddrBeanRelId)) {
            return !$target->email1 ? null : BeanFactory::newBean('EmailAddresses')->retrieve_by_string_fields(['email_address' => $target->email1]);
        }

        $q = "SELECT eabr.* FROM email_addr_bean_rel eabr where eabr.id ='{$emailAddrBeanRelId}' and eabr.bean_id ='$target->id' and eabr.deleted = 0";
        $row = $db->fetchOne($q);
        $email = BeanFactory::getBean('EmailAddresses', $row['email_address_id']);
        $email->opt_in_status = $row['opt_in_status'];
        return $email;
    }

}