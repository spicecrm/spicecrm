<?php

namespace SpiceCRM\includes\SpiceAttachments\KREST\controllers;

use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;

class SpiceAttachmentsKRESTController
{
    const UPLOAD_DESTINATION = 'upload://';

    /**
     * returns the list of attachments
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function getAttachments($req, $res, $args)
    {
        file_put_contents('spicecrm.log', __FUNCTION__.' line '.__LINE__."\n", FILE_APPEND);
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(SpiceAttachments::getAttachmentsForBean($args['beanName'], $args['beanId'], 100, false));
    }

    /**
     * returns the list of attachments
     *
     * @param $req
     * @param $res
     * @param $args
     */
    public function getAttachmentsCount($req, $res, $args)
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(['count' => SpiceAttachments::getAttachmentsCount($args['beanName'], $args['beanId'])]);
    }

    /**
     * saves an attachment
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function saveAttachment($req, $res, $args)
    {

        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::saveAttachmentHashFiles($args['beanName'], $args['beanId'], array_merge($postBody, $postParams)));
    }


    /**
     * saves attachments
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function saveAttachments($req, $res, $args)
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::saveAttachmentHashFiles($args['beanName'], $args['beanId'], array_merge($postBody, $postParams)));
    }


    /**
     * deletes an attachment
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteAttachment($req, $res, $args)
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(SpiceAttachments::deleteAttachment($args['attachmentId']));
    }


    /**
     * retrievs an attachment
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getAttachment($req, $res, $args)
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(SpiceAttachments::getAttachment($args['attachmentId'], false));
    }

    /**
     * retrievs an attachment based ona  bean and a fieldname
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getAttachmentForField($req, $res, $args)
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when atatchments are managed on new beans
        // so no exlicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        if (!empty($seed->{$args['fieldprefix'] . '_md5'})) {
            if(file_exists(self::UPLOAD_DESTINATION . $seed->{$args['fieldprefix'] . '_md5'})) {
                $file = base64_encode(file_get_contents(self::UPLOAD_DESTINATION . $seed->{$args['fieldprefix'] . '_md5'}));
            } else {
                throw new NotFoundException('attachment not found');
            }
        } else if (file_exists(self::UPLOAD_DESTINATION . $args['beanId'])) {
            $file = base64_encode(file_get_contents(self::UPLOAD_DESTINATION . $args['beanId']));
        } else {
            throw new NotFoundException('attachment not found');
        }
        $attachment = [
            'filename' => $seed->{$args['fieldprefix'] . '_name'} ?: $seed->filename,
            'filesize' => $seed->{$args['fieldprefix'] . '_size'},
            'file_mime_type' => $seed->{$args['fieldprefix'] . '_mime_type'},
            'file' => $file,
            'filemd5' => $seed->{$args['fieldprefix'] . '_md5'}
        ];

        return $res->withJson($attachment);
    }

    /**
     * clones the attachments from one bean to another one
     *
     * @param $req
     * @param $res
     * @param $args
     */
    public function cloneAttachments($req, $res, $args)
    {
        $seed = BeanFactory::getBean($args['fromBeanName'], $args['fromBeanId']); //set encode to false to avoid things like ' being translated to &#039;
        if (!$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        $clonedAttachments = SpiceAttachments::cloneAtatchmentsForBean($args['beanName'], $args['beanId'], $args['fromBeanName'], $args['fromBeanId']);
        return $res->withJson($clonedAttachments);
    }

    /**
     * analyses the entreis
     *
     * @param $req
     * @param $res
     * @param $args
     */
    public function getAnalysis($req, $res, $args)
    {
        return $res->withJson(SpiceAttachments::getAnalysis());
    }

    /**
     * analyses the entreis
     *
     * @param $req
     * @param $res
     * @param $args
     */

    public function cleanErroneous($req, $res, $args)
    {
        return $res->withJson(['success' => SpiceAttachments::cleanErroneous()]);
    }

    /**
     * saves an attachment as a hash file
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceSaveAttachmentHash($req, $res, $args){
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::saveAttachmentHashFiles($args['beanName'], $args['beanId'], array_merge($postBody, $postParams)));
    }

    /**
     * get an attachment as a bean hash file
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceGetAttachmentHash($req, $res, $args){
        return $res->withJson(SpiceAttachments::getAttachmentsForBeanHashFiles($args['beanName'], $args['beanId']));
    }

    /**
     * counts the number off attachments
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceCountAttachments($req, $res, $args){
        return $res->withJson(['count' => SpiceAttachments::getAttachmentsCount($args['beanName'], $args['beanId'])]);
    }

    /**
     * deletes an attachment
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     * @throws NotFoundException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */

    public function SpiceDeleteAttachment($req, $res, $args){
        return $res->withJson(SpiceAttachments::deleteAttachment($args['attachmentId']));
    }

    /**
     * saves and uploads an attachment
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceSaveAttachment($req, $res, $args){
        /* for fielupload over $_FILE. used by theme */
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        return $res->withJson(SpiceAttachments::saveAttachment($args['beanName'], $args['beanId'], array_merge($postBody, $postParams)));
    }

    /**
     * get the attachments from a bean
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceGetBeanAttachment($req, $res, $args){
        /* for get file url for theme, not file in base64 */
        return $res->withJson(SpiceAttachments::getAttachmentsForBean($args['beanName'], $args['beanId']));
    }

    /**
     * get an attachment by id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceGetAttachment($req, $res, $args){
        /* for get file url for theme, not file in base64 */
        return $res->withJson(SpiceAttachments::getAttachment($args['attachmentId']));
    }

    /**
     * downloads an attachment by id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceDownloadAttachment($req, $res, $args){
        /* for get file url for theme, not file in base64 */
        return $res->withJson(SpiceAttachments::downloadAttachment($args['attachmentId']));
    }

    /**
     * get the attachment categories
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceGetAttachmentCategory($req, $res, $args){
        return $res->withJson(SpiceAttachments::getAttachmentCategories($args['module']));
    }

    /**
     * update the attachment data
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SpiceUpdateAttachmentData($req, $res, $args){
        return $res->withJson(SpiceAttachments::updateAttachmentData($args['id'], $req->getParsedBody()));
    }

}
