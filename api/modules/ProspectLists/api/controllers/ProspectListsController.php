<?php
namespace SpiceCRM\modules\ProspectLists\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\ProspectLists\ProspectList;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;


class ProspectListsController
{

    public static function createFromListId(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $requestParams = $req->getQueryParams();

        $KRESTModuleHandler = new SpiceBeanHandler();

        $pl = BeanFactory::getBean('ProspectLists');
        $pl->name = $requestParams['targetlistname'];
        $pl->list_type = 'default';
        $pl->assigned_user_id = $current_user->id;
        $pl->assigned_user_name = $current_user->get_summary_text();
        $pl->save();

        $addJoins = [];
        $listid = $args['listid'];
        $listDef = $db->fetchByAssoc($db->query("SELECT * FROM sysmodulelists WHERE id = '$listid'"));
        $seed = BeanFactory::getBean($listDef['module']);
        $filterdefs = json_decode(html_entity_decode(base64_decode($listDef['filterdefs'])), true);
        if ($filterdefs) {
            $listWhereClause = $KRESTModuleHandler->buildFilerdefsWhereClause($seed, $filterdefs, $addJoins);
        }
        if ($listDef['basefilter'] == 'own') {
            if ($listWhereClause != '') {
                $listWhereClause .= ' AND ';
            }
            $listWhereClause .= $seed->_tablename . ".assigned_user_id='" . $current_user->id . "'";
        }

        $queryArray = $seed->create_new_list_query('', $listWhereClause, [], [], false, '', true, $seed, true);
        $query = "INSERT INTO prospect_lists_prospects (SELECT DISTINCT uuid(), '$pl->id' prospectlistid, {$seed->_tablename}.id, '{$listDef['module']}' module, '".TimeDate::getInstance()->nowDb()."', 0 {$queryArray['from']} {$queryArray['where']})";
        $db->query($query);

        return $res->withJson([
            'status' => 'success',
            'id' => $pl->id
        ]);
    }

    public static function exportFromList(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $postBody = $req->getParsedBody();

        $beanModule = $postBody['module'];

        if (!SpiceACL::getInstance()->checkAccess($postBody['module'], 'export', true))
            return false;

        $pl = BeanFactory::getBean('ProspectLists');
        $pl->name = $postBody['targetlistname'];
        $pl->list_type = 'default';
        $pl->assigned_user_id = $current_user->id;
        $pl->assigned_user_name = $current_user->get_summary_text();
        $pl->save();

        $seed = BeanFactory::getBean($postBody['module']);

        $moduleHandler = new SpiceBeanHandler();
        if (!empty($postBody['listid']) && $postBody['listid'] != 'owner' && $postBody['listid'] != 'all') {
            // get the list defs
            $listDef = $db->fetchByAssoc($db->query("SELECT * FROM sysmodulelists WHERE id = '{$postBody['listid']}'"));
        }

        $idList = [];
        if($postBody['ids'] && is_array($postBody['ids']) && count($postBody['ids']) > 0){
            // ToDo: sanitize IDs before insert -- check that it is really a GUID
            foreach($postBody['ids']as $addID){
                if(!preg_match('/[^A-Za-z\-0-9]/', $addID)){
                    $idList[] = $addID;
                }
            }
        } else {
            // check if we have an ft config
            if ( SpiceFTSHandler::getInstance()->checkModule($beanModule, true) and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($listDef['filterdefs']))) and SpiceFTSHandler::getInstance()->checkFilterDefs($beanModule, json_decode(html_entity_decode($postBody['filter'])))) {
                //  $results = $ftsHandler->getGlobalSearchResults([$beanModule], $searchParams['searchterm'])
                $postBody['records'] = SpiceConfig::getInstance()->config['getAllLimit'] ?: 10000;
                $result = SpiceFTSHandler::getInstance()->getModuleSearchResults($beanModule, $postBody['searchterm'], json_decode($postBody['searchtags']), $postBody, json_decode(html_entity_decode($postBody['aggregates']), true), json_decode($postBody['sortfields'], true) ?: []);

                foreach ($result['hits'] as $hit) {
                    $idList[] = $hit['_id'];
                }

            } else {

                $queryResult = $moduleHandler->prepareBeanDBListQuery($beanModule, $seed, $listDef, $postBody);
                $query = $queryResult['query'];
                $addJoins = $queryResult['addjoins'];
                $beanList = $seed->process_list_query($query, 0, -99);
                foreach ($beanList['list'] as $thisBean) {
                    // retrieve the bean to get the full fields
                    $idList[] = $thisBean->id;
                }
            }
        }

        // check if we have a list of ids to add
        if(count($idList) > 0){
            $query = "INSERT INTO prospect_lists_prospects (id, prospect_list_id, related_id, related_type, date_modified, deleted) (SELECT DISTINCT uuid(), '$pl->id' prospectlistid, {$seed->_tablename}.id, '{$postBody['module']}' module, '".TimeDate::getInstance()->nowDb()."', 0 FROM {$seed->_tablename} WHERE id IN ('" . join("','", $idList) . "'))";
            $db->query($query);
        }

        return $res->withJson([
            'status' => 'success',
            'id' => $pl->id
        ]);
    }

    /**
     * searching for related beans that are relevant
     *
     */
    public static function getRelatedModules(Request $req, Response $res, array $args): Response {
        if(!$args){
            throw new NotFoundException('record not found');
        }

        // retrieve the module names from the ui configuration
        $r = $req->getQueryParams();
        $moduleNames = explode(",", $r['modules']);

        // get the module and the bean id
        $bean = BeanFactory::getBean($args['beanName'], $args['beanId']);

        // get field definitions of this bean
        $fields = $bean->getFieldDefinitions();

        // if the type is link retrieve the related bean
        foreach($fields as $field) {
            if(in_array($field['module'], $moduleNames)) {
                $link = $field['name'];
                $relatedBeanList = $bean->get_linked_beans($link);

                $modulesList[$field['module']]['module'] = $field['module'];
                $modulesList[$field['module']]['bean_count'] += count($relatedBeanList);
                $modulesList[$field['module']]['link_names'][] = $link;
            }
        }
        return $res->withJson( [
            'modules' => $modulesList
        ]);
    }

    public static function saveTargetList(Request $req, Response $res, array $args): Response {
        $items = $req->getParsedBody();

        if (!is_array($items) || empty($items)) {
            throw new NotFoundException('No array found');
        }

        // create new target group
        $newTargetGroup = BeanFactory::newBean('ProspectLists');
        $newTargetGroup->name = $items['prospectListName'];
        $newTargetGroup->list_type = 'default';
        $newTargetGroup->assigned_user_id = AuthenticationController::getInstance()->getCurrentUser()->id;
        $newTargetGroup->save();

        foreach ($items['data'] as $item) {
            // get bean the target group was created from
            $parentBean = BeanFactory::getBean($items['parentModule'], $items['parentBeanId']);

            $links = $item['link_names'];
            foreach ($links as $link) {
                if($newTargetGroup->load_relationship($link)){

                    // retrieve all beans related to the parentBean
                    $relatedBeans = $parentBean->get_linked_beans($link);
                    foreach ($relatedBeans as $bean) {
                        $gdpr = $bean->gdpr_marketing_agreement;
                        $beanInactive = $bean->is_inactive;
                        $relatedBeanId = $bean->id;
                        $relatedBeanModule = $bean->module_dir;

                        // get active beans with granted or empty gdpr
                        if(!$item['inclRejGDPR'] && !$item['inclInactive']) {
                            if($gdpr == 'g' && $beanInactive == 0) {
                                $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                            } else if(empty($gdpr) && $beanInactive == 0) {
                                $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                            } else if($gdpr == 'g' && empty($beanInactive)) {
                                $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                            }
                        }
                        // add active beans with rejected or granted gdpr
                        else if($item['inclRejGDPR'] && !$item['inclInactive']) {
                            if($beanInactive == 0 || empty($beanInactive)) {
                                $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                            }
                        }
                        // add inactive beans with granted gdpr
                        else if(!$item['inclRejGDPR'] && $item['inclInactive']) {
                            if($gdpr == 'g' || empty($gdpr)) {
                                $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                            }
                        }
                        // get all beans
                        else if($item['inclRejGDPR'] && $item['inclInactive']) {
                            $newTargetGroup->{$link}->add($relatedBeanId, ['related_type' => $relatedBeanModule]);
                        }
                    }
                }
            }
        }
        return $res->withJson(['success' => true, 'prospectlistid' => $newTargetGroup->id]);
    }

    /**
     * get list entries count
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getEntriesCount(Request $req, Response $res, array $args): Response
    {
        /** @var ProspectList $list */
        $list = BeanFactory::getBean('ProspectLists', $args['id']);
        return $res->withJson($list->get_entry_count());
    }
}

