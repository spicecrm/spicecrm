<?php

namespace SpiceCRM\includes\SpiceAttachments\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\DataStreams\wrappers\UploadStream;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;
use ZipArchive;

class SpiceAttachmentsController
{
    /**
     * returns the list of attachments
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getAttachments(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }
        $params = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::getAttachmentsForBean($args['beanName'], $args['beanId'], 100, false, $params['categoryId']));
    }

    /**
     * downloads the attachments and preserves the folder structure
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws \Exception
     */
    public function downloadAttachments(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $body = $req->getParsedBody();

        $ids = '"' . implode('", "', $body['selectedAttachments']) . '"';

        $sql = "SELECT * FROM spiceattachments WHERE id IN ($ids)";

        $attachments = DBManagerFactory::getInstance()->fetchAll($sql);

        $folders = array_filter($attachments, fn($a) => $a['file_mime_type'] == 'folder');

        if ($folders) {
            $attachments = array_merge($attachments, SpiceAttachments::getFilesInFolders($folders));
        }

        if (!$attachments) {
            return $res->withJson(['error' => 'Attachments not found']);
        }

        $zipFilename = 'attachments-' . date('Ymd-His') . '.zip';
        $tmpDir = sys_get_temp_dir();
        $zipPath = @tempnam($tmpDir, 'spicezip_');

        if ($zipPath === false) {
            $fallbackDir = rtrim(StreamFactory::getPathPrefix('upload'), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'tmp' . DIRECTORY_SEPARATOR;
            if (!is_dir($fallbackDir)) {
                if (!@mkdir($fallbackDir, 0775, true) && !is_dir($fallbackDir)) {
                    return $res->withJson(['error' => 'Cannot create temporary directory for ZIP']);
                }
            }
            $zipPath = $fallbackDir . 'attachments-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.zip';
        }

        $zip = new ZipArchive();
        $openRes = $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        if ($openRes !== true) {
            return $res->withJson(['error' => 'Cannot create ZIP archive (check Zip extension/permissions)']);
        }

        $uploadPrefix = StreamFactory::getPathPrefix('upload');

        $added = 0;

        foreach ($attachments as $attachment) {
            $storageName = $attachment['filemd5'] ?: $attachment['id'];
            $streamPath = $uploadPrefix . $storageName;
            $fsPath = UploadStream::path($streamPath);
            if (($attachment['file_mime_type'] != 'folder' && (!$fsPath || !is_file($fsPath))) || (($attachment['file_mime_type'] == 'folder' && $attachment['folder_path']))) {
                continue;
            }

            if ($attachment['file_mime_type'] == 'folder') {
                $zip->addEmptyDir($attachment['filename']);
                $added++;
                continue;
            }

            $filePath = ($attachment['folder_path'] ? $attachment['folder_path'] . '/' : '') . $attachment['filename'];

            if ($zip->addFile($fsPath, $filePath)) {
                $added++;
            }
        }

        $zip->close();

        if ($added === 0) {
            @unlink($zipPath);
            return $res->withJson(['error' => 'No attachment files found on disk']);
        }

        $streamRes = RESTManager::getInstance()->app->getResponseFactory()->createResponse();
        $fh = @fopen($zipPath, 'rb');

        if ($fh === false) {
            @unlink($zipPath);
            return $res->withJson(['error' => 'Cannot read generated ZIP']);
        }

        try {
            while (!feof($fh)) {
                $streamRes->getBody()->write(fread($fh, 1048576));
            }
        } finally {
            fclose($fh);
            @unlink($zipPath);
        }

        return $streamRes
            ->withHeader('Content-Type', 'application/zip')
            ->withHeader('Content-Disposition', 'attachment; filename="' . $zipFilename . '"');
    }

    /**
     * @throws ForbiddenException
     * @throws \Exception
     */
    public function deleteAttachments(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $params = $req->getQueryParams();

        $ids = "'" . implode("','", explode(',', $params['selectedAttachments'])) . "'";

        $sql = "SELECT * FROM spiceattachments WHERE id IN ($ids)";

        $attachments = DBManagerFactory::getInstance()->fetchAll($sql);

        $folderIds = array_filter($attachments, fn($a) => $a['file_mime_type'] == 'folder');

        if ($folderIds) {
            $attachments = array_merge($attachments, SpiceAttachments::getFilesInFolders($folderIds));
        }

        $attachmentIds = '"' . implode('", "', array_column($attachments, 'id')) . '"';

        $deleteSQL = "UPDATE spiceattachments set deleted = '1' WHERE id IN ($attachmentIds)";

        DBManagerFactory::getInstance()->query($deleteSQL);

        return $res->withJson(['success' => true]);
    }

    /**
     * returns the list of attachments
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getAttachmentsCount(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $params = $req->getParsedBody();

        return $res->withJson(['count' => SpiceAttachments::getAttachmentsCount($args['beanName'], $args['beanId'], $params['categoryId'])]);
    }
    /**
     * returns the list of attachments for given bean ids
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getAttachmentsCountPerBean(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();

        return $res->withJson(SpiceAttachments::getAttachmentsCountPerBean($args['beanName'], $params['beanIds'], $params['returnFiles']));
    }

    /**
     * saves an attachment
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function saveAttachment(Request $req, Response $res, array $args): Response
    {
        $postBody = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::saveAttachmentHashFiles($args['beanName'], $args['beanId'], array_merge($postBody, $postParams)));
    }


    /**
     * saves attachments
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function saveAttachments(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        $postBody = $req->getParsedBody();
        $postParams = $req->getQueryParams();

        $savedAttachments = SpiceAttachments::saveAttachmentHashFiles($args['beanName'], $args['beanId'], array_merge($postBody, $postParams));

        if($seed)
        {
            $seed->call_custom_logic('attachment_added');
        }

        return $res->withJson($savedAttachments);
    }

    /**
     * adds a folder
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function saveFolder(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        $postBody = $req->getParsedBody();
        return $res->withJson(SpiceAttachments::saveFolder($args['beanName'], $args['beanId'], $postBody));
    }


    /**
     * deletes an attachment
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteAttachment(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit') && !$seed->ACLAccess('manageattachments')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(SpiceAttachments::deleteAttachment($args['attachmentId']));
    }


    /**
     * retrievs an attachment
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function getAttachment(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $attachment = SpiceAttachments::getAttachment($args['attachmentId'], false);

        if ($attachment['file_mime_type'] == 'message/rfc822') {
            $attachment = SpiceAttachments::convertEmlFile4display($attachment);
        }

        return $res->withJson($attachment);
    }

    /**
     * retrieve an attachment based ona  bean and a field name
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function getAttachmentForField(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $prefix = StreamFactory::getPathPrefix('upload');

        if(!empty($args['fieldmd5'])){
            if (file_exists($prefix . $args['fieldmd5'])) {
                $file = base64_encode(file_get_contents($prefix . $args['fieldmd5']));
            } else {
                throw new NotFoundException('attachment not found');
            }
        } else if (!empty($seed->{$args['fieldprefix'] . '_md5'})) {
            if (file_exists($prefix . $seed->{$args['fieldprefix'] . '_md5'})) {
                $file = base64_encode(file_get_contents($prefix . $seed->{$args['fieldprefix'] . '_md5'}));
            } else {
                throw new NotFoundException('attachment not found');
            }
        } else if (file_exists($prefix . $args['beanId'])) {
            $file = base64_encode(file_get_contents($prefix . $args['beanId']));
        } else {
            throw new NotFoundException('attachment not found');
        }
        $attachment = [
            'filename' => $seed->{$args['fieldprefix'] . '_name'} ?: $seed->filename,
            'filesize' => filesize($prefix . $seed->{$args['fieldprefix'] . '_md5'}),
            'file_mime_type' => $seed->{$args['fieldprefix'] . '_mime_type'},
            'file' => $file,
            'filemd5' => $seed->{$args['fieldprefix'] . '_md5'},
        ];

        $modifiedTimestamp = filemtime($prefix . $seed->{$args['fieldprefix'] . '_md5'});
        $dateModified = !$modifiedTimestamp ? '' : TimeDate::getInstance()->fromTimestamp($modifiedTimestamp)->format(TimeDate::DB_DATETIME_FORMAT);

        $attachment['date_modified'] = $dateModified;

        return $res->withJson($attachment);
    }

    /**
     * update/create attachment file content
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function saveAttachmentContentByField(Request $req, Response $res, array $args): Response
    {
        $postBody = $req->getParsedBody();

        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleEdit');
        }

        # if file does not exist set the name and mime type
        if (!$seed->{$args['fieldprefix'] . '_md5'}) {
            $seed->{$args['fieldprefix'] . '_mime_type'} = $postBody['file_mime_type'];
            $seed->{$args['fieldprefix'] . '_name'} = $postBody['file_name'];
        }

        $seed->{$args['fieldprefix'] . '_md5'} = md5(base64_decode($postBody['file']));

        $seed->save();

        $postBody['filemd5'] = $seed->{$args['fieldprefix'] . '_md5'};

        $response = SpiceAttachments::saveAttachmentFile($postBody);

        return $res->withJson($response);
    }

    /**
     * update attachment file content by id
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function updateAttachmentContentById(Request $req, Response $res, array $args): Response
    {
        $postBody = $req->getParsedBody();

        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleEdit');
        }

        $attachment = DBManagerFactory::getInstance()->fetchOne("SELECT * FROM spiceattachments WHERE id = '{$args['attachmentId']}'");

        if (!$attachment) {
            throw new NotFoundException('attachment not found');
        }

        $md5 = md5(base64_decode($postBody['file']));

        $response = SpiceAttachments::saveAttachmentFile([
            'filemd5' => $md5,
            'file' => $postBody['file'],
        ]);

        DBManagerFactory::getInstance()->updateQuery('spiceattachments', ['id' => $args['attachmentId']], ['filemd5' => $md5]);

        return $res->withJson($response);
    }


    /**
     * clones the attachments from one bean to another one
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function cloneAttachments(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['fromBeanName'], $args['fromBeanId']); //set encode to false to avoid things like ' being translated to &#039;
        if (!$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }
        $params = $req->getParsedBody();

        $clonedAttachments = SpiceAttachments::cloneAttachmentsForBean($args['beanName'], $args['beanId'], $args['fromBeanName'], $args['fromBeanId'], true, $params['categoryId'], $params['selectedFiles'], $params['excludedFileIds']);
        return $res->withJson($clonedAttachments);
    }

    /**
     * analyses the entreis
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getAnalysis(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceAttachments::getAnalysis());
    }

    public function getMissingFiles(Request $req, Response $res, array $args): Response
    {
        $files = SpiceAttachments::getMissingFiles();
        $files['attachments']['label'] = 'LBL_ATTACHMENTS';
        $files['emails']['label'] = 'LBL_EMAILS';
        $files['notes']['label'] = 'LBL_NOTES';
        return $res->withJson( $files );
    }

    /**
     * analyses the entreis
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function cleanErroneous(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => SpiceAttachments::cleanErroneous()]);
    }

    /**
     * get the attachment categories
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getModuleCategories(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceAttachments::getAttachmentCategories($args['module']));
    }

    /**
     * update the attachment data
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function SpiceUpdateAttachmentData(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceAttachments::updateAttachmentData($args['id'], $req->getParsedBody()));
    }
}
