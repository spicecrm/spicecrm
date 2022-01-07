<?php

namespace SpiceCRM\includes\SpiceAttachments\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceAttachmentsController
{
    const UPLOAD_DESTINATION = 'upload://';

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
    public function deleteAttachment(Request $req, Response $res, array $args): Response
    {
        // try to load the seed and check if we have access.
        // It might happen that seed does not yet exists when attachments are managed on new beans
        // so no explicit check if the bean exists
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']); //set encode to false to avoid things like ' being translated to &#039;
        if ($seed && !$seed->ACLAccess('edit')) {
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

        return $res->withJson(SpiceAttachments::getAttachment($args['attachmentId'], false));
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

        if (!empty($seed->{$args['fieldprefix'] . '_md5'})) {
            if (file_exists(self::UPLOAD_DESTINATION . $seed->{$args['fieldprefix'] . '_md5'})) {
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

        $clonedAttachments = SpiceAttachments::cloneAttachmentsForBean($args['beanName'], $args['beanId'], $args['fromBeanName'], $args['fromBeanId'], true, $params['categoryId']);
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
