<?php

namespace SpiceCRM\includes\DataStreams\wrappers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceFileUtils;

class MediaStream extends UploadStream
{
    public static function getDir()
    {
        if (empty(self::$upload_dir)) {
            // if we have a tenantid add the tenant to the file
            $tenantid = AuthenticationController::getInstance()->systemtenantid;
            self::$upload_dir = rtrim(SpiceConfig::getInstance()->config['media_files_dir'] . ($tenantid ? "/{$tenantid}" : ''), '/\\');
            if (empty(self::$upload_dir)) {
                self::$upload_dir = "media";
            }
            if (!file_exists(self::$upload_dir)) {
                SpiceFileUtils::spiceMkdir(self::$upload_dir, 0755, true);
            }
        }
        return self::$upload_dir;
    }
}