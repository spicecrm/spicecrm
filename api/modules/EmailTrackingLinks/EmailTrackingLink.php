<?php

namespace SpiceCRM\modules\EmailTrackingLinks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class EmailTrackingLink extends SpiceBean
{
    public $module_dir = 'EmailTrackingLinks';
    public $table_name = "emailtrackinglinks";
    public $object_name = "EmailTrackingLink";

    /**
     * transforms the basic link into a blowfish encrypted tracked link
     */
    static function transformEmailTrackingLinks($parentType, $parentId, $trackingId, string $handlingLink)
    {
        $key = SpiceConfig::getInstance()->get('emailtracking.blowfishkey') ?? "2fs5uhnjcnpxcpg9";
        $method = 'blowfish';
        $data = "ParentType:$parentType:ParentId:$parentId:EmailTrackingLinks:$trackingId";

        $link = openssl_encrypt($data, $method, $key);
        return str_replace('{refid}', base64_encode($link), $handlingLink);
    }

    public function save($check_notify = false, $fts_index_bean = true)
    {
        parent::save($check_notify, $fts_index_bean);
    }

    /**
     * retrieve tracking link by url or create a new one and return the bean
     * @param string $href
     * @param string|null $text
     * @param string $parentId
     * @param string $parentType
     * @return string
     * @throws \Exception
     */
    public static function getTrackingLinkId(string $href, ?string $text, string $parentId, string $parentType): string
    {
        $href = trim($href, '/ ');

        /** @var EmailTrackingLink $newTrackingLink */
        $newTrackingLink = BeanFactory::getBean('EmailTrackingLinks');
        $newTrackingLink->retrieve_by_string_fields(['url' => $href]);

        if (!empty($newTrackingLink->id)) {
            return $newTrackingLink->id;
        }

        $newTrackingLink->name = $text ?: $href;
        $newTrackingLink->url = $href;
        $newTrackingLink->parent_type = $parentType;
        $newTrackingLink->parent_id = $parentId;
        $newTrackingLink->save();
        return $newTrackingLink->id;
    }
}
