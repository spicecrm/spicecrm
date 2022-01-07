<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/

namespace SpiceCRM\includes;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/*********************************************************************************
 * Description:
 ********************************************************************************/

/**
 * @api
 * Manage uploaded files
 */
class UploadFile
{
    var $field_name;
    var $stored_file_name;
    var $uploaded_file_name;
    var $uploaded_file_size;
    var $original_file_name;
    var $uploaded_file_md5;
    var $temp_file_location;
    var $use_soap = false;
    var $use_proxy = false;
    var $file;
    var $file_ext;
    protected static $url = "upload/";

    /**
     * Upload errors
     * @var array
     */
    protected static $filesError = [
        UPLOAD_ERR_OK => 'UPLOAD_ERR_OK - There is no error, the file uploaded with success.',
        UPLOAD_ERR_INI_SIZE => 'UPLOAD_ERR_INI_SIZE - The uploaded file exceeds the upload_max_filesize directive in php.ini.',
        UPLOAD_ERR_FORM_SIZE => 'UPLOAD_ERR_FORM_SIZE - The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.',
        UPLOAD_ERR_PARTIAL => 'UPLOAD_ERR_PARTIAL - The uploaded file was only partially uploaded.',
        UPLOAD_ERR_NO_FILE => 'UPLOAD_ERR_NO_FILE - No file was uploaded.',
        5 => 'UNKNOWN ERROR',
        UPLOAD_ERR_NO_TMP_DIR => 'UPLOAD_ERR_NO_TMP_DIR - Missing a temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'UPLOAD_ERR_CANT_WRITE - Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION => 'UPLOAD_ERR_EXTENSION - A PHP extension stopped the file upload.',
    ];

    /**
     * Create upload file handler
     * @param string $field_name Form field name
     */
    function __construct($field_name = '')
    {
        // $field_name is the name of your passed file selector field in your form
        // i.e., for Emails, it is "email_attachmentX" where X is 0-9
        $this->field_name = $field_name;
    }

    /**
     * Setup for SOAP upload
     * @param string $filename Name for the file
     * @param string $file
     */
    function set_for_soap($filename, $file)
    {
        $this->stored_file_name = $filename;
        $this->use_soap = true;
        $this->file = $file;
    }



    /**
     * Try renaming a file to bean_id name
     * @param string $filename
     * @param string $bean_id
     */
    protected static function tryRename($filename, $bean_id)
    {
        $fullname = "upload://$bean_id.$filename";
        if (file_exists($fullname)) {
            if (!rename($fullname, "upload://$bean_id")) {
                LoggerManager::getLogger()->fatal("unable to rename file: $fullname => $bean_id");
            }
            return true;
        }
        return false;
    }


    /**
     * Guess MIME type for file
     * @param string $filename
     * @return string MIME type
     */
    function getMimeSoap($filename)
    {
        $mime_types = [

            'txt' => 'text/plain',
            'htm' => 'text/html',
            'html' => 'text/html',
            'php' => 'text/html',
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'xml' => 'application/xml',
            'swf' => 'application/x-shockwave-flash',
            'flv' => 'video/x-flv',

            // images
            'png' => 'image/png',
            'jpe' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'gif' => 'image/gif',
            'bmp' => 'image/bmp',
            'ico' => 'image/vnd.microsoft.icon',
            'tiff' => 'image/tiff',
            'tif' => 'image/tiff',
            'svg' => 'image/svg+xml',
            'svgz' => 'image/svg+xml',

            // archives
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'exe' => 'application/x-msdownload',
            'msi' => 'application/x-msdownload',
            'cab' => 'application/vnd.ms-cab-compressed',

            // audio/video
            'mp3' => 'audio/mpeg',
            'qt' => 'video/quicktime',
            'mov' => 'video/quicktime',

            // adobe
            'pdf' => 'application/pdf',
            'psd' => 'image/vnd.adobe.photoshop',
            'ai' => 'application/postscript',
            'eps' => 'application/postscript',
            'ps' => 'application/postscript',

            // ms office
            'doc' => 'application/msword',
            'rtf' => 'application/rtf',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',

            // open office
            'odt' => 'application/vnd.oasis.opendocument.text',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
        ];

        $nameArray = explode('.', $filename);
        $ext = strtolower(array_pop($nameArray));
        if (array_key_exists($ext, $mime_types)) {
            $mime = $mime_types[$ext];
        } else if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME);
            $mime = finfo_file($finfo, $filename);
            finfo_close($finfo);
        } else if (function_exists('mime_content_type')) {
            $mime = mime_content_type($filename);
        } else {
            $mime = ' application/octet-stream';
        }
        return $mime;
    }

    /**
     * gets note's filename
     * @return string
     */
    function get_stored_file_name()
    {
        return $this->stored_file_name;
    }

    function get_uploaded_file_size()
    {
        return $this->uploaded_file_size;
    }

    function get_uploaded_file_md5()
    {
        return $this->uploaded_file_md5;
    }


    /**
     * moves uploaded temp file to permanent save location
     * @param string bean_id ID of parent bean
     * @return bool True on success
     */
    function final_move($bean_id, $replace = true)
    {
        $destination = $bean_id;
        if (substr($destination, 0, 9) != "upload://") {
            $destination = "upload://$bean_id";
        }

        if (!$replace && file_exists($destination)) {
            return true;
        }

        if ($this->use_soap) {
            if (!file_put_contents($destination, $this->file)) {
                LoggerManager::getLogger()->fatal("ERROR: can't save file to $destination");
                return false;
            } else {
                return true;
            }
        }

        return true;
    }


    /**
     * returns the path with file name to save an uploaded file
     * @param string bean_id ID of the parent bean
     * @return string
     */
    function get_upload_path($bean_id)
    {
        $file_name = $bean_id;

        // cn: bug 8056 - mbcs filename in urlencoding > 212 chars in Windows fails
        $end = (strlen($file_name) > 212) ? 212 : strlen($file_name);
        $ret_file_name = substr($file_name, 0, $end);

        return "upload://$ret_file_name";
    }

    /**
     * deletes a file
     * @param string bean_id ID of the parent bean
     * @param string file_name File's name
     */
    static public function unlink_file($bean_id, $file_name = '')
    {
        if (file_exists("upload://$bean_id$file_name")) {
            return unlink("upload://$bean_id$file_name");
        }
    }

    /**
     * Get upload file location prefix
     * @return string prefix
     */
    public function get_upload_dir()
    {
        return "upload://";
    }

}
