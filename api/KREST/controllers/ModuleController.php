<?php
namespace SpiceCRM\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class ModuleController
{
    public function uploadFile($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $params = $req->getParsedBody();

        if (!$params['file']) {
            throw new BadRequestException('missing file data');
        }

        return $res->withJson(['file_md5' => $moduleHandler->uploadFile($params)]);
    }

    public function getBeanList($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $searchParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_list($args['beanName'], $searchParams));
    }

    public function postBean($req, $res, $args) {
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

    public function exportBeanList($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $searchParams = $req->getParsedBody();
        $charset = $moduleHandler->export_bean_list($args['beanName'], $searchParams);
        return $res->withHeader('Content-Type', 'text/csv; charset=' . $charset);
    }

    public function checkBeanDuplicates($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->check_bean_duplicates($args['beanName'], $postBody));
    }

    public function deleteBeans($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        $response = [];
        foreach ($req->getParsedBody()['ids'] as $id) {
            $response[$id] = $moduleHandler->delete_bean($args['beanName'], $id);
        }
        return $res->withJson($response);
    }

    public function getBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $requestParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_detail($args['beanName'], $args['beanId'], $requestParams));
    }

    public function addBean($req, $res, $args) {
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

    public function deleteBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->delete_bean($args['beanName'], $args['beanId']));
    }

    public function getBeanDuplicates($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->get_bean_duplicates($args['beanName'], $args['beanId']));
    }

    public function getBeanAuditlog($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        $params = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_bean_auditlog($args['beanName'], $args['beanId'], $params));
    }

    public function getBeanAttachments($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->get_bean_attachment($args['beanName'], $args['beanId']));
    }

    public function downloadBeanAttachment($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        return $res->withJson($moduleHandler->download_bean_attachment($args['beanName'], $args['beanId']));
    }

    public function setBeanAttachment($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);

        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->set_bean_attachment($args['beanName'], $args['beanId'], $postBody));
    }

    public function postChecklist($req, $res, $args) {
        $fieldname = $args['fieldname'];
        $item = $args['item'];
        $bean = BeanFactory::getBean($args['beanName'], $args['beanId'], ['encode' => false]);
        if ($bean->id == $args['beanId']) {
            $values = json_decode($bean->$fieldname, true);
            if (!is_array($values)) {
                $values = [];
            }
            $values[$item] = true;
            $bean->{$fieldname} = json_encode($values);
            $bean->save();
            return $res->withJson(['status' => 'success']);
        }
        return $res->withJson(['status' => 'error']);
    }

    public function deleteChecklist($req, $res, $args) {
        $fieldname = $args['fieldname'];
        $item = $args['item'];
        $bean = BeanFactory::getBean($args['beanName'], $args['beanId'], ['encode' => false]);
        if ($bean->id == $args['beanId']) {
            $values = json_decode($bean->$fieldname, true);
            if (!is_array($values)) {
                $values = [];
            }
            unset($values[$item]);
            $bean->{$fieldname} = json_encode($values);
            $bean->save();
            return $res->withJson(['status' => 'success']);
        }
        return $res->withJson(['status' => 'error']);
    }

    public function getRelatedBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $getParams = $req->getQueryParams();
        return $res->withJson($moduleHandler->get_related($args['beanName'], $args['beanId'], $args['linkname'], $getParams));
    }

    public function addRelatedBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->add_related($args['beanName'], $args['beanId'], $args['linkname'], $postBody));
    }

    public function setRelatedBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $req->getParsedBody();
        return $res->withJson($moduleHandler->set_related($args['beanName'], $args['beanId'], $args['linkname'], $postBody));
    }

    public function deleteRelatedBean($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $params = $req->getQueryParams();
        return $res->withJson($moduleHandler->delete_related($args['beanName'], $args['beanId'], $args['linkname'], $params));
    }

    public function mergeBeans($req, $res, $args) {
        $moduleHandler = new ModuleHandler(RESTManager::getInstance()->app);
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $actionData = $moduleHandler->merge_bean($args['beanName'], $args['beanId'], array_merge($postBody, $postParams));
        if ($actionData === false) {
            return $res->withStatus(501);
        } else {
            return $res->withJson($actionData);
        }
    }
}
