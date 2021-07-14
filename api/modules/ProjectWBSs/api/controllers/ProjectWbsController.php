<?php
namespace SpiceCRM\modules\ProjectWBSs\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class ProjectWbsController
{
    /**
     * gets the WBS of a user
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUserWBS(Request $req, Response $res, array $args): Response {
        $wbs = BeanFactory::getBean('ProjectWBSs');
        return $res->withJson($wbs->getMyWBSs());
    }

    /**
     * gets the wbs from the database depending on the id
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getWBSList(Request $req, Response $res, array $args): Response {
        $wbs = BeanFactory::getBean('ProjectWBSs');
        $list = $wbs->getList($args['id']);
        return $res->withJson($list);
    }

    /**
     * saves the wbs
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function saveWBS(Request $req, Response $res, array $args): Response {
        $wbs = BeanFactory::getBean('ProjectWBSs');
        $postBody = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $params = array_merge($postBody, $postParams);
        $res = $wbs->saveWBS($params);
        return $res->withJson($res);
    }

    /**
     * deletes the wbs
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function deleteWBS(Request $req, Response $res, array $args): Response {
        $wbs = BeanFactory::getBean('ProjectWBSs');
        $list = $wbs->delete_recursive($args['id']);
        return $res->withJson(['status' => 'DELETED ' . $args['id']]);
    }

    /**
     * gets the linkes wbs and maps them to an array
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function linkWBS(Request $req, Response $res, array $args): Response {
        $hierarchy = [];
        $seed = BeanFactory::getBean('Projects', $args['projectid']);
        $moduleHandler = new ModuleHandler();
        $memberProjectWBSs = $seed->get_linked_beans('projectwbss', 'ProjectWBS', [], 0, 999);

        foreach ($memberProjectWBSs as $memberProjectWBS) {

            $hierarchy[] = [
                'id' => $memberProjectWBS->id,
                'project_id' => $memberProjectWBS->project_id,
                'parent_id' =>  $memberProjectWBS->parent_id,
                'summary_text' => $memberProjectWBS->get_summary_text(),
                'member_count' => $memberProjectWBS->member_count,
                'planned_effort' => $memberProjectWBS->planned_effort,
                'data' => $moduleHandler->mapBeanToArray('ProjectWBSs', $memberProjectWBS)
            ];
        }

        return $res->withJson($hierarchy);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function wbsGetSummaryText(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        //file_put_contents("sugarcrm.log", print_r("p+id+addfields", true)."\n", FILE_APPEND);

        $hierarchy = [];

        $args['addfields'] = json_decode(html_entity_decode($args['addfields']));
        $seed = BeanFactory::getBean('Projects', $args['projectid']);
        $seed->load_relationship('projectwbss');
        $optional_where = "project_id='".$args['projectid']."'";

        $memberProjectWBSs = $seed->get_linked_beans('projectwbss', 'ProjectWBS', [], 0,-1,0, $optional_where);

        foreach ($memberProjectWBSs as $memberProjectWBS) {
            $q = "SELECT count(id) membercount FROM projectwbss 
            WHERE parent_id = '".$memberProjectWBS->id."' AND deleted = 0";
            $memberCount = $db->fetchByAssoc($db->query($q));
            $addData = [];
            foreach($args['addfields'] as $addfield)
                $addData[$addfield] = $memberProjectWBS->$addfield;

            $aclActions = ['list', 'detail', 'edit', 'delete', 'export'];
            foreach ($aclActions as $aclAction) {
                $addData['acl'][$aclAction] = $memberProjectWBS->ACLAccess($aclAction);
            }

            $hierarchy[] = [
                'id' => $memberProjectWBS->id,
                'project_id' => $memberProjectWBS->project_id,
                'parent_id' =>  $memberProjectWBS->parent_id,
                'summary_text' => $memberProjectWBS->get_summary_text(),
                'member_count' => $memberCount['membercount'],
                'data' => $addData
            ];
        }
        //file_put_contents("sugarcrm.log", print_r($hierarchy, true)."\n", FILE_APPEND);

        return $res->withJson($hierarchy);
    }

    /**
     * delivers an array of ProjectActivityTypes related to the current project
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getActivityTypes(Request $req, Response $res, array $args): Response {
        $projectWBS = BeanFactory::getBean("ProjectWBSs", $args['id']);
        $project = BeanFactory::getBean("Projects", $projectWBS->project_id);
        $projectActivityTypes = $project->get_linked_beans("projectactivitytypes", "ProjectActivityTypes");
        $activityTypes = [];
        foreach ($projectActivityTypes as $activityType) {
            $activityTypes[] = ["id" => $activityType->id, "name" => $activityType->name];
        }
        return $res->withJson(["activitytypes" => $activityTypes]);
    }

}