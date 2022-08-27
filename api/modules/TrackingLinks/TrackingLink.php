<?php

namespace SpiceCRM\modules\TrackingLinks;

use SpiceCRM\data\SpiceBean;

class TrackingLink extends SpiceBean
{
    public $module_dir = 'TrackingLinks';
    public $table_name = "trackinglinks";
    public $object_name = "TrackingLink";

    /**
     * transforms the basic link into a blowfish encrypted tracked link
     */
    static function transformTrackingLinks($emailId, $trackingId, $mailboxTrackingUrl)
    {
        $key = '2fs5uhnjcnpxcpg9';
        $method = 'blowfish';
        $data = 'Emails:'.$emailId.':TrackingLinks:'.$trackingId;

        $link = openssl_encrypt($data, $method, $key);
        return $mailboxTrackingUrl . 'link/' . base64_encode($link);
    }

    public function save($check_notify = false, $fts_index_bean = true)
    {

        parent::save($check_notify, $fts_index_bean);
    }


}
