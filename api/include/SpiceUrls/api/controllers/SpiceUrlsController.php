<?php

namespace SpiceCRM\includes\SpiceUrls\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUrls\SpiceUrls;

class SpiceUrlsController
{

    /**
     * returns the list of urls for a specific bean
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getUrls(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        $params = $req->getQueryParams();
        return $res->withJson(SpiceUrls::getUrlsForBean($args['beanName'], $args['beanId'], 100, false));
    }

    /**
     * returns the count of urls
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getUrlsCount(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this record"))->setErrorCode('noModuleView');
        }

        return $res->withJson(['count' => SpiceUrls::getUrlsCount($args['beanName'], $args['beanId'])]);
    }

    /**
     * returns a single url
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function getUrl(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        // check if we have access
        if ($seed && !$seed->ACLAccess('view')) {
            throw (new ForbiddenException("not allowed to view this url"))->setErrorCode('noModuleView');
        }

        return $res->withJson(SpiceUrls::getUrl($args['urlId'], false));
    }

    /**
     * saves an url
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException|Exception
     */
    public function saveUrl(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        // check if we have access
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("not allowed to edit this record"))->setErrorCode('noModuleView');
        }

        $postBody = $req->getParsedBody();
        return $res->withJson(SpiceUrls::saveUrl($postBody, $args));
    }

    /**
     * deletes an url
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws Exception
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function deleteUrl(Request $req, Response $res, array $args): Response
    {
        $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);

        // check if we have access
        if ($seed && !$seed->ACLAccess('edit')) {
            throw (new ForbiddenException("Forbidden to delete the url."))->setErrorCode('noModuleDelete');
        }

        return $res->withJson(SpiceUrls::deleteUrl($args['urlId']));
    }

    /**
     * update the data of a single url
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function updateUrlData(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceUrls::updateUrlData($args['id'], $req->getParsedBody()));
    }
}
