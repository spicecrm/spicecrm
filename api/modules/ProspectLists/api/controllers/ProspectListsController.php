<?php
namespace SpiceCRM\modules\ProspectLists\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class ProspectListsController
{

    public static function createFromListId(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $requestParams = $req->getQueryParams();

        $KRESTModuleHandler = new ModuleHandler();

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
            $listWhereClause .= $seed->table_name . ".assigned_user_id='" . $current_user->id . "'";
        }

        $queryArray = $seed->create_new_list_query('', $listWhereClause, [], [], false, '', true, $seed, true);
        $query = "INSERT INTO prospect_lists_prospects (SELECT DISTINCT uuid(), '$pl->id' prospectlistid, {$seed->table_name}.id, '{$listDef['module']}' module, now(), 0 {$queryArray['from']} {$queryArray['where']})";
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

        $moduleHandler = new ModuleHandler();
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
            $query = "INSERT INTO prospect_lists_prospects (id, prospect_list_id, related_id, related_type, date_modified, deleted) (SELECT DISTINCT uuid(), '$pl->id' prospectlistid, {$seed->table_name}.id, '{$postBody['module']}' module, now(), 0 FROM {$seed->table_name} WHERE id IN ('" . join("','", $idList) . "'))";
            $db->query($query);
        }

        return $res->withJson([
            'status' => 'success',
            'id' => $pl->id
        ]);
    }
}

