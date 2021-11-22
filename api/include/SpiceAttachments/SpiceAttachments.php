<?php

namespace SpiceCRM\includes\SpiceAttachments;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\UploadFile;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\extensions\modules\Mailboxes\Handlers\GSuiteAttachment;
use SpiceCRM\modules\Mailboxes\Handlers\OutlookAttachment;

class SpiceAttachments
{
    const UPLOAD_DESTINATION = 'upload://';

    /**
     * get attachments for a bean
     * @param $beanName
     * @param $beanId
     * @param int $lastN
     * @param bool $json_encode
     * @param null $categoryId
     * @return array|false|string
     */
    public static function getAttachmentsForBean($beanName, $beanId, $lastN = 25, $json_encode = true, $categoryId = null)
    {
        $db = DBManagerFactory::getInstance();

        $attachments = [];
        $categoryWhere = $categoryId ? " AND qn.category_ids LIKE '%$categoryId%'" : '';

        $attachmentsRes = $db->limitQuery("SELECT qn.*,u.user_name FROM spiceattachments AS qn
            LEFT JOIN users AS u ON u.id=qn.user_id WHERE qn.bean_id='{$beanId}' AND qn.bean_type='{$beanName}'
            AND qn.deleted = 0 $categoryWhere ORDER BY qn.trdate DESC", 0, $lastN);

        while ($thisAttachment = $db->fetchByAssoc($attachmentsRes)) {
            $attachments[] = [
                'id' => $thisAttachment['id'],
                'user_id' => $thisAttachment['user_id'],
                'user_name' => $thisAttachment['user_name'],
                'date' => $thisAttachment['trdate'],
                'text' => nl2br($thisAttachment['text']),
                'filename' => $thisAttachment['filename'],
                'filesize' => $thisAttachment['filesize'],
                'filemd5' => $thisAttachment['filemd5'],
                'file_mime_type' => $thisAttachment['file_mime_type'],
                'thumbnail' => $thisAttachment['thumbnail'],
                'display_name' => $thisAttachment['display_name'],
                'category_ids' => $thisAttachment['category_ids'],
                'external_id' => $thisAttachment['external_id']
            ];
        }

        if ($json_encode)
            return json_encode($attachments);
        else
            return $attachments;
    }

    /**
     * clones the attachments form one bean to another one
     *
     * @param $beanName
     * @param $beanId
     * @param $fromBeanName
     * @param $fromBeanId
     * @param bool $save
     * @param null $categoryId
     * @return array
     * @throws Exception
     */
    static function cloneAttachmentsForBean($beanName, $beanId, $fromBeanName, $fromBeanId, bool $save = true, $categoryId = null): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $attachments = self::getAttachmentsForBean($fromBeanName, $fromBeanId, 100, false, $categoryId);

        $colQuery = "INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, filesize, filemd5, text, thumbnail, deleted, file_mime_type, category_ids) ";
        $clonedAttachments = [];

        foreach ($attachments as $attachment) {

            $attachment['id'] = SpiceUtils::createGuid();
            $attachment['bean_type'] = $beanName;
            $attachment['bean_id'] = $beanId;
            $attachment['user_id'] = $current_user->id;
            $clonedAttachments[] = $attachment;

            if (!$save) continue;

            $timeDate = TimeDate::getInstance()->nowDbDate();
            $q = "$colQuery VALUES ('{$attachment['id']}', '{$attachment['bean_type']}', '{$attachment['bean_id']}', '{$attachment['user_id']}', '$timeDate', ";
            $q .= "'{$attachment['filename']}', '{$attachment['filesize']}', '{$attachment['filemd5']}', '{$_POST['text']}', '{$attachment['thumbnail']}', 0, ";
            $q .= "'{$attachment['file_mime_type']}', '{$attachment['category_ids']}')";
            $db->query($q);
        }
        return $clonedAttachments;
    }

    /**
     * Returns the number of attachments linked to a bean.
     *
     * @param string $beanName
     * @param string $beanId
     * @param null $categoryId
     * @return int
     * @throws Exception
     */
    public static function getAttachmentsCount(string $beanName, string $beanId, $categoryId = null): int
    {
        $categoryWhere = $categoryId ? " AND category_ids LIKE '%$categoryId%'" : '';
        $db = DBManagerFactory::getInstance();
        $res = $db->fetchByAssoc($db->query("SELECT count(id) attachmentcount FROM spiceattachments WHERE bean_id='{$beanId}' $categoryWhere AND bean_type='{$beanName}' AND deleted = 0"));
        return (int)$res['attachmentcount'];
    }

    /**
     * saves the attachments
     *
     * @param $beanName
     * @param $beanId
     * @param $post
     * @return mixed
     * @throws Exception
     */
    public static function saveAttachmentHashFiles($beanName, $beanId, $file): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $guid = SpiceUtils::createGuid();

        $upload_file = new UploadFile('file');

        $decodedFile = base64_decode($file['file']);
        $upload_file->set_for_soap($file['filename'], $decodedFile);

        $ext_pos = strrpos($upload_file->stored_file_name, ".");
        $upload_file->file_ext = substr($upload_file->stored_file_name, $ext_pos + 1);
        if (in_array($upload_file->file_ext, isset(SpiceConfig::getInstance()->config['upload_badext']) ?: [])) {
            $upload_file->stored_file_name .= ".txt";
            $upload_file->file_ext = "txt";
        }

        $filename = $upload_file->get_stored_file_name();
        $file_mime_type = $file['filemimetype'] ?: $upload_file->getMimeSoap($filename);
        $filesize = strlen($decodedFile);
        $filemd5 = md5($decodedFile);

        $upload_file->final_move($filemd5);

        if ($beanName && $beanId) {
            // if we have an image create a thumbnail
            $thumbnail = self::createThumbnail($filemd5, $file_mime_type);

            // add the attachment
            $db->query("INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, filesize, filemd5, text, thumbnail, deleted, file_mime_type, category_ids) VALUES ('{$guid}', '{$beanName}', '{$beanId}', '" . $current_user->id . "', '" . gmdate('Y-m-d H:i:s') . "', '{$filename}', '{$filesize}', '{$filemd5}', '{$file['text']}', '$thumbnail', 0, '{$file_mime_type}', '{$file['category_ids']}')");
        }

        $attachments[] = [
            'id' => $guid,
            'user_id' => $current_user->id,
            'user_name' => $current_user->user_name,
            'date' => $GLOBALS['timedate']->nowDb(),
            'text' => nl2br($file['text']),
            'filename' => $filename,
            'filesize' => $filesize,
            'file_mime_type' => $file_mime_type,
            'thumbnail' => $thumbnail,
            'filemd5' => $filemd5,
        ];
        return $attachments;
    }

    /**
     * saveAttachmentLocalFile
     *
     * Adds an attachment that is already a local file to a bean.
     *
     * @param $module_name {string} the name of the module
     * @param $bean_id {string} the id of the bean
     * @param array $file = [name, path, mime_type, file_size, file_md5]
     * @return array
     * @throws Exception
     */
    public static function saveAttachmentLocalFile($module_name, $bean_id, array $file): array
    {

        $fileArray = [
            'filename' => $file['name'],
            'file' => base64_encode(file_get_contents($file['path'] . $file['name'])),
            'filemimetype' => $file['mime_type'] ?: mime_content_type($file['path'] . $file['name'])
        ];

        return self::saveAttachmentHashFiles($module_name, $bean_id, $fileArray);

    }

    /**
     * save an email attachment
     * @param $beanName
     * @param $beanId
     * @param $payload
     * @return bool
     * @throws Exception
     */
    public static function saveEmailAttachment($beanName, $beanId, $payload): bool
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $guid = create_guid();

        // if we have an image create a thumbnail
        $thumbnail = self::createThumbnail($payload->filemd5, $payload->mime_type);

        $db->query("INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, filesize, filemd5, text, thumbnail, deleted, file_mime_type)
                        VALUES ('{$guid}', '{$beanName}', '{$beanId}', '" . $current_user->id . "', '" . gmdate('Y-m-d H:i:s') . "',
                        '{$payload->filename}', '{$payload->filesize}', '{$payload->filemd5}', '{$_POST['text']}', '{$thumbnail}', 0, '{$payload->mime_type}')");

        return true;
    }


    /**
     * save an email attachment for Outlook
     * @param \Email $email
     * @param OutlookAttachment $attachment
     */
    public static function saveEmailAttachmentFromOutlook(Email $email, OutlookAttachment $attachment) {
        $filepath = 'upload://' . $attachment->fileMd5;
        touch($filepath);

        $byteContent = base64_decode($attachment->content);
        file_put_contents($filepath, $byteContent);

        // if we have an image create a thumbnail
        $attachment->thumbnail = self::createThumbnail($attachment->fileMd5, $attachment->fileMimeType);


        return $attachment->save();
    }


    /**
     * save an email attachment for GSuite
     * @param Email $email
     * @param GSuiteAttachment $attachment
     */
    public static function saveEmailAttachmentFromGSuite(Email $email, GSuiteAttachment $attachment)
    {
        $filepath = 'upload://' . $attachment->fileMd5;
        touch($filepath);

        file_put_contents($filepath, $attachment->content);
        $attachment->fileMimeType = mime_content_type($filepath);
        // if we have an image create a thumbnail
        $attachment->thumbnail = self::createThumbnail($attachment->fileMd5, $attachment->fileMimeType);


        return $attachment->save();
    }

    public static function saveMailgunAttachment(Email $email, $payload): bool
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $guid = SpiceUtils::createGuid();

        // if we have an image create a thumbnail
        $thumbnail = self::createThumbnail($payload['md5'], $payload['content-type']);

        $db->query("INSERT INTO spiceattachments (id, bean_type, bean_id, user_id, trdate, filename, filesize, filemd5, text, thumbnail, deleted, file_mime_type)
                        VALUES ('{$guid}', 'Emails', '{$email->id}', '" . $current_user->id . "', '" . gmdate('Y-m-d H:i:s') . "',
                        '{$payload['name']}', '{$payload['size']}', '{$payload['md5']}', '', '{$thumbnail}', 0, '{$payload['content-type']}')");

        return true;
    }

    public static function saveBase64File(string $fileContent): string {
        $md5 = md5($fileContent);
        $filepath = 'upload://' . $md5;
        touch($filepath);

        file_put_contents($filepath, $fileContent);

        return $md5;
    }

    /**
     * Deletes an attachment
     *
     * @param $attachmentId
     * @return bool[]
     * @throws ForbiddenException
     * @throws NotFoundException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public static function deleteAttachment($attachmentId): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $result = $db->query("UPDATE spiceattachments SET deleted = 1 WHERE id='{$attachmentId}'" . (!$current_user->is_admin ? " AND user_id='" . $current_user->id . "'" : ""));

        if ($db->getAffectedRowCount($result)) return ['success' => true];
        else {
            $attachment = $db->fetchOne($sql = sprintf('SELECT * FROM spiceattachments WHERE deleted = 0 AND id = "%s"', $db->quote($attachmentId)));
            if ($attachment === false) {
                throw (new NotFoundException('Attachment not found.'))->setLookedFor(['id' => $attachmentId])->setErrorCode('notFound');
            } elseif (($current_user->id !== $attachment['user_id']) and !$current_user->is_admin) {
                throw (new ForbiddenException('Forbidden to delete the attachment. Belongs to user with ID ' . $attachment['user_id'] . '.'))->setErrorCode('noDelete');
            } else {
                throw new \SpiceCRM\includes\ErrorHandlers\Exception('Unknown error deleting the attachment.');
            }
        }

        // todo: delete also file if MD5 is no longer used anywhere
    }

    /**
     * update attachment display name, text and category
     * @param $attachmentId
     * @param $data
     * @return array
     * @throws Exception
     */
    public static function updateAttachmentData($attachmentId, $data): array
    {
        $db = DBManagerFactory::getInstance();
        $text = $db->quote($data['text']);
        $displayName = $db->quote($data['display_name']);
        $category_ids = $db->quote($data['category_ids']);

        $res = $db->query("UPDATE spiceattachments SET text = '$text', category_ids = '$category_ids', display_name = '$displayName' WHERE id = '$attachmentId'");
        return ['success' => $res];
    }

    /**
     * get attachment categories from the database
     * @param $module
     * @param bool $systemOnly
     * @return array
     * @throws Exception
     */
    public static function getAttachmentCategories($module, $systemOnly = false): array
    {
        $db = DBManagerFactory::getInstance();
        $module = $db->quote($module);

        $systemWhere = $systemOnly ? "is_system = 1" : 'is_system <> 1';

        $res = $db->query("SELECT * FROM spiceattachments_categories WHERE (module = '$module' OR module = '*') AND $systemWhere ORDER BY name");
        $categories = [];
        while ($row = $db->fetchByAssoc($res)) $categories[] = $row;
        return $categories;
    }

    /**
     * Returns a json encoded array with attachment data for a given attachment ID.
     *
     * @param $attachmentId
     * @param bool $json_encode
     * @return false|string
     * @throws NotFoundException
     */
    public static function getAttachment($attachmentId, bool $json_encode = true)
    {
        $db = DBManagerFactory::getInstance();

        $thisAttachment = $db->fetchByAssoc($db->query("SELECT * FROM spiceattachments WHERE id = '$attachmentId'"));

        // check if we found the attachment oand the file is here
        if (!$thisAttachment || !file_exists(self::UPLOAD_DESTINATION . ($thisAttachment['filemd5'] ?: $thisAttachment['id']))) {
            throw new NotFoundException('attachment not found');
        }

        $file = base64_encode(file_get_contents(self::UPLOAD_DESTINATION . ($thisAttachment['filemd5'] ?: $thisAttachment['id'])));
        $attachment = [
            'id' => $thisAttachment['id'],
            'user_id' => $thisAttachment['user_id'],
            'user_name' => $thisAttachment['user_name'],
            'date' => $thisAttachment['trdate'],
            'text' => nl2br($thisAttachment['text']),
            'filename' => $thisAttachment['filename'],
            'filesize' => $thisAttachment['filesize'],
            'file_mime_type' => $thisAttachment['file_mime_type'],
            'file' => $file,
            'filemd5' => $thisAttachment['filemd5'],
        ];

        return $json_encode ? json_encode($attachment) : $attachment;
    }

    /**
     * create an attachment thumbnail
     * @param $filename
     * @param $mime_type
     * @param int $thumbSize
     * @return string
     */
    public static function createThumbnail($filename, $mime_type, int $thumbSize = 300): string
    {
        $supportedimagetypes = ['jpeg', 'png', 'gif'];
        $filetypearray = explode('/', $mime_type);

        // fix for jpg files
        if ($filetypearray[1] == 'jpg') $filetypearray[1] = 'jpeg';

        if (count($filetypearray) == 2
            && strtolower($filetypearray[0]) == 'image'
            && array_search(strtolower($filetypearray[1]), $supportedimagetypes) !== false) {
            if (list($width, $height) = getimagesize(self::UPLOAD_DESTINATION . $filename)) {

                $limitingDim = $height > $width ? $width : $height;

                $thumb = imagecreatetruecolor($thumbSize, $thumbSize);

                // create
                $createfunction = 'imagecreatefrom' . strtolower($filetypearray[1]);
                $source = $createfunction(self::UPLOAD_DESTINATION . $filename);

                if ($source) {
                    imagecopyresized($thumb, $source, 0, 0, ($width - $limitingDim) / 2, ($height - $limitingDim) / 2, $thumbSize, $thumbSize, $limitingDim, $limitingDim);
                    ob_start();
                    imagejpeg($thumb);
                    $thumbnail = base64_encode(ob_get_contents());
                    ob_end_clean();
                    imagedestroy($thumb);

                    return $thumbnail;
                } else {
                    LoggerManager::getLogger()->fatal('Cannot create attachment image for: ' . $filename);
                }
            }
        }

        return '';
    }

    /**
     * returns analysis for the attachments finding erroneous that have been stored but do not have a bean
     *
     * @return array
     * @throws Exception
     */
    public static function getAnalysis(): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $analysis = [];
        if ($current_user->is_admin) {
            $modules = $db->query("SELECT DISTINCT bean_type module FROM spiceattachments WHERE deleted = 0");
            while ($module = $db->fetchByAssoc($modules)) {
                if (!empty($module['module'])) {
                    $seed = BeanFactory::getBean($module['module']);
                    if ($seed) {
                        $count = $db->fetchByAssoc($db->query("SELECT count(a.id) attachmentcount FROM spiceattachments a WHERE a.bean_type='{$module['module']}' AND a.deleted = 0 AND NOT EXISTS (SELECT id FROM {$seed->table_name} s where s.deleted = 0 and a.bean_id = s.id)"));
                        $analysis[$module['module']] = $count['attachmentcount'] ?: 0;
                    } else {
                        $count = $db->fetchByAssoc($db->query("SELECT count(a.id) attachmentcount FROM spiceattachments a WHERE a.bean_type='{$module['module']}' AND a.deleted = 0"));
                        $analysis[$module['module']] = $count['attachmentcount'] ?: 0;
                    }
                } else {
                    $count = $db->fetchByAssoc($db->query("SELECT count(a.id) attachmentcount FROM spiceattachments a WHERE a.bean_type='' AND a.deleted = 0"));
                    $analysis[$module['module']] = $count['attachmentcount'] ?: 0;
                }
            }
        }
        return $analysis;
    }

    /**
     * cleans erroneous records
     *
     * @return bool
     * @throws Exception
     */
    public static function cleanErroneous(): bool
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        if ($current_user->is_admin) {
            $modules = $db->query("SELECT DISTINCT bean_type module FROM spiceattachments WHERE deleted = 0");
            while ($module = $db->fetchByAssoc($modules)) {
                if (!empty($module['module'])) {
                    $seed = BeanFactory::getBean($module['module']);
                    if ($seed) {
                        $db->query("UPDATE spiceattachments SET deleted = 1 WHERE bean_type = '{$module['module']}' AND id IN (SELECT id FROM spiceattachments a WHERE a.bean_type='{$module['module']}' AND a.deleted = 0 AND NOT EXISTS (SELECT id FROM {$seed->table_name} s where s.deleted = 0 and a.bean_id = s.id))");
                    } else {
                        $db->query("UPDATE spiceattachments SET deleted = 1 WHERE bean_type='{$module['module']}' AND a.deleted = 0");
                    }
                } else {
                    $db->query("DELETE FROM spiceattachments WHERE bean_type='' AND deleted = 0");
                }
            }
            return true;
        }
        return false;
    }
}
