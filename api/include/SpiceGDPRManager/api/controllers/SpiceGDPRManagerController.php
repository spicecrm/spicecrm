<?php

namespace SpiceCRM\includes\SpiceGDPRManager\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\KREST\handlers\ModuleHandler;

class SpiceGDPRManagerController
{

    /**
     * loads the retention policies
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    public function getRetentionPolicies($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $retentions = $db->query("SELECT * FROM sysgdprretentions WHERE deleted = 0");
        while($retention = $db->fetchByAssoc($retentions)){
            $retArray[] = $retention;
        }

        return $res->withJson($retArray);
    }

    /**
     * changes the active state
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    public function setActive($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $db->query("UPDATE sysgdprretentions SET active='{$args['active']}' WHERE id='{$args['id']}'");

        return $res->withJson(['sstatus' => 'success']);
    }

    /**
     * changes the active state
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \Exception
     */
    public function saveRetentionPolicy($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        // get the body
        $body = $req->getParsedBody();

        // update the record
        $db->upsertQuery('sysgdprretentions', ['id' => $args['id']], ['id' => $args['id'], 'retention_type' => $body['retention_type'], 'delete_related' => $body['delete_related'], 'name' => $body['name'], 'description' => $body['description'], 'sysmodulefilter_id' => $body['sysmodulefilter_id']]);

        return $res->withJson(['sstatus' => 'success']);
    }

    /**
     * deletes the retentiaon policy with the given ID
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteRetentionPolicy($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        // update the record and mark deleted
        $db->updateQuery('sysgdprretentions', ['id' => $args['id']], ['deleted' => 1]);

        return $res->withJson(['sstatus' => 'success']);
    }
    /**
     * gets the query Results
     *
     * @param $req
     * @param $res
     * @param $args
     * @throws \Exception
     */
    public function getResults($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $getParams = $req->getQueryParams();

        $retention = $db->fetchByAssoc($db->query("SELECT * FROM sysgdprretentions WHERE deleted = 0 AND id = '{$args['id']}'"));

        $moduleFilter = new SysModuleFilters();
        $filterWhere = $moduleFilter->generateWhereClauseForFilterId($retention['sysmodulefilter_id']);

        $seed = BeanFactory::getBean($moduleFilter->filtermodule);
        $query = "SELECT count(id) totalcount FROM {$seed->table_name} WHERE {$filterWhere} AND {$seed->table_name}.deleted = 0";
        $countRes = $db->fetchByAssoc($db->query($query));

        $list = [];
        if($countRes['totalcount'] > 0) {
            $modHandler = new ModuleHandler();
            $query = "SELECT id FROM {$seed->table_name} WHERE {$filterWhere} AND {$seed->table_name}.deleted = 0";
            $ids = $db->limitQuery($query, $getParams['start'] ?: 0, 50);
            while($id = $db->fetchByAssoc($ids)){
                $seed = BeanFactory::getBean($moduleFilter->filtermodule, $id['id']);
                $list[] = $modHandler->mapBeanToArray($moduleFilter->filtermodule, $seed);
            }
        }

        return $res->withJson(['module' => $moduleFilter->filtermodule, 'list' => $list, 'total' => (int) $countRes['totalcount']]);
    }

}