<?php

namespace SpiceCRM\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class ModuleController
{
    public function uploadFile(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $params = $req->getParsedBody();

        if (!$params['file']) {
            throw new BadRequestException('missing file data');
        }

        return $res->withJson(['file_md5' => $moduleHandler->uploadFile($params)]);
    }

    public function getBeanList(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $searchParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_list($args['beanName'], $searchParams));
    }

    public function postBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $requestParams = $req->getQueryParams();
        $retArray = [];

        if (!SpiceACL::getInstance()->checkAccess($args['beanName'], 'edit', true)
            && !SpiceACL::getInstance()->checkAccess($args['beanName'], 'create', true)) {
            throw (new ForbiddenException('Forbidden to edit in module ' . $args['beanName'] . '.'))
                ->setErrorCode('noModuleEdit');
        }

        $items = $req->getParsedBody();

        if (!is_array($items) || !is_array($items[0])) {
            throw new BadRequestException('Reading Body failed. An Array with at least one Object is expected: [{object1},{object2},...]');
        }

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $args['beanId'] = $moduleHandler->add_bean($args['beanName'], $item['id'], array_merge($item, $requestParams));
            $item['data'] = $args['beanId'];
            $retArray[] = $item;
        }

        return $res->withJson($retArray);
    }

    public function exportBeanList(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $searchParams = $req->getParsedBody();
        $csv = $moduleHandler->export_bean_list($args['beanName'], $searchParams);
        $res->getBody()->write($csv['csv']);
        return $res->withHeader('Content-Type', 'text/csv; charset=' . $csv['charset']);
    }

    public function checkBeanDuplicates(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->check_bean_duplicates($args['beanName'], $postBody));
    }

    /**
     * action to mass patch beans
     * used for mass delete and mass update
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function patchBeans(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();
        foreach ($body['ids'] as $id) {
            switch ($body['action']) {
                case 'DELETE':
                    $seed = BeanFactory::getBean($args['beanName'], $id);

                    if(!$seed){
                        throw new NotFoundException("bean with id $id not found");
                    }

                    if(!$seed->ACLAccess('delete')){
                        throw new ForbiddenException("no rights to delete Bean $id");
                    }

                    $seed->mark_deleted($id);
                    break;
            }
        }
        return $res->withJson(['success' => true]);
    }

    public function getBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $requestParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_detail($args['beanName'], $args['beanId'], $requestParams));
    }

    public function addBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $params = $req->getParsedBody();

        $req->getBody()->rewind();
        if ($req->getBody()->getContents() === '') { # and $req->getContentType() === 'application/json'
            throw (new BadRequestException('Request has empty content. Retry?! Or contact the administrator!'))
                ->setFatal(true);
        }

        $bean = $moduleHandler->add_bean($args['beanName'], $args['beanId'], $params, $req->getQueryParams());
        return $res->withJson($bean);
    }

    public function deleteBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->delete_bean($args['beanName'], $args['beanId']));
    }

    public function getBeanDuplicates(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->get_bean_duplicates($args['beanName'], $args['beanId']));
    }

    public function getBeanAuditlog(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        $params = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_auditlog($args['beanName'], $args['beanId'], $params));
    }

    public function getBeanAttachments(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->get_bean_attachment($args['beanName'], $args['beanId']));
    }

    public function downloadBeanAttachment(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->download_bean_attachment($args['beanName'], $args['beanId']));
    }

    public function setBeanAttachment(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->set_bean_attachment($args['beanName'], $args['beanId'], $postBody));
    }

    public function postChecklist(Request $req, Response $res, array $args): Response
    {
        $fieldName = $args['fieldName'];
        $item = $args['item'];
        $bean = BeanFactory::getBean($args['beanName'], $args['beanId'], ['encode' => false]);
        if ($bean->id == $args['beanId']) {
            $values = json_decode($bean->$fieldName, true);
            if (!is_array($values)) {
                $values = [];
            }
            $values[$item] = true;
            $bean->{$fieldName} = json_encode($values);
            $bean->save();
            return $res->withJson(['status' => 'success']);
        }
        return $res->withJson(['status' => 'error']);
    }

    public function deleteChecklist(Request $req, Response $res, array $args): Response
    {
        $fieldName = $args['fieldName'];
        $item = $args['item'];
        $bean = BeanFactory::getBean($args['beanName'], $args['beanId'], ['encode' => false]);
        if ($bean->id == $args['beanId']) {
            $values = json_decode($bean->$fieldName, true);
            if (!is_array($values)) {
                $values = [];
            }
            unset($values[$item]);
            $bean->{$fieldName} = json_encode($values);
            $bean->save();
            return $res->withJson(['status' => 'success']);
        }
        return $res->withJson(['status' => 'error']);
    }

    public function getRelatedBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $getParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_related($args['beanName'], $args['beanId'], $args['linkName'], $getParams));
    }

    public function addRelatedBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->add_related($args['beanName'], $args['beanId'], $args['linkName'], $postBody));
    }

    public function setRelatedBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->set_related($args['beanName'], $args['beanId'], $args['linkName'], $postBody));
    }

    public function deleteRelatedBean(Request $req, Response $res, array $args): Response
    {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $params = $req->getQueryParams();
        return $res->withJson($moduleHandler->delete_related($args['beanName'], $args['beanId'], $args['linkName'], $params));
    }

    public function mergeBeans(Request $req, Response $res, array $args): Response
    {


        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $actionData = $moduleHandler->merge_bean($args['beanName'], $args['beanId'], array_merge($postBody, $postParams));
        if ($actionData === false) {
            return $res->withStatus(501);
        } else {
            $seed = BeanFactory::getBean($args['beanName'], $args['beanId']);
            return $res->withJson(['success' => $actionData, 'data' => $moduleHandler->mapBeanToArray($args['beanName'], $seed)]);
        }
    }

    /**
     * handles teh mass udpate of beans
     *
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function massUpdate(Request $req, Response $res, array $args): Response
    {
        $postBody = $req->getParsedBody();

        switch ($args['action']) {
            case 'assign':
                $beanData = [];
                $handler = new ModuleHandler();
                foreach ($postBody['ids'] as $id) {
                    $seed = BeanFactory::getBean($args['beanName'], $id);
                    if ($seed && $seed->ACLAccess('edit')) {
                        $seed->assigned_user_id = $postBody['assigned_user_id'];
                        $seed->save(true);

                        // repopulate the assigned user name
                        $seed->assigned_user_name = null;
                        $seed->fill_in_relationship_fields();

                        // add the seed data to the response
                        $beanData[] = $handler->mapBeanToArray($args['beanName'], $seed, false);
                    } else {
                        // thros an error if something die not happen .. this will also trigger a rollback
                        if (!$seed) {
                            throw new NotFoundException();
                        } else {
                            throw new ForbiddenException();
                        }
                    }
                }
                return $res->withJson(['success' => true, 'data' => $beanData]);
                break;
        }

        return $res->withJson(['success' => false]);
    }
}
