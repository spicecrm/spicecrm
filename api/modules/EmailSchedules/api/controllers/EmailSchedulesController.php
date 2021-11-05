<?php

namespace SpiceCRM\modules\EmailSchedules\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class EmailSchedulesController
{

    /**
     * save emailschedule bean and return the id
     * @param $postBody
     * @return string
     */
    private function saveBean($postBody, $id)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // create a new bean
        $emailschedule = BeanFactory::getBean('EmailSchedules');

        // if the id is in the body assign it
        if ($id) {
            $emailschedule->id = $id;
            $emailschedule->new_with_id = true;
        }

        // pass over the data
        $emailschedule->email_subject = $postBody['data']['email_subject'];
        $emailschedule->name = $postBody['data']['email_subject'];
        $emailschedule->mailbox_id = $postBody['data']['mailbox_id'];
        $emailschedule->email_body = $postBody['data']['email_body'];
        $emailschedule->email_stylesheet_id = $postBody['data']['email_stylesheet_id'];
        $emailschedule->parent_id = $postBody['data']['parent_id'];
        $emailschedule->parent_type = $postBody['data']['parent_type'];
        $emailschedule->email_schedule_status = 'open';
        $emailschedule->assigned_user_id = $current_user->id;

        // save the schedule
        $emailschedule->save();

        return $emailschedule->id;
    }

    /**
     * save related beans in emailschedules_beans, return the boolean result of the query and the emailschedule id
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function saveSchedule(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $postBody = $req->getParsedBody();

        $emailscheduleId = $this->saveBean($postBody, $args['id']);

        if (!empty($emailscheduleId) && count($postBody['ids']) > 0) {

            $query = "INSERT INTO emailschedules_beans (id, emailschedule_status, emailschedule_id, bean_module, bean_id, date_modified, deleted) VALUES ";
            foreach ($postBody['ids'] as $beanid) {
                $guid = SpiceUtils::createGuid();
                $query .= "('$guid', 'queued', '$emailscheduleId', '{$postBody['module']}', '$beanid', now(), 0),";
            }
            if(!empty($query)) {
                $query = substr_replace($query, ";", -1);
                $db->query($query);
            }
        }

        return $res->withJson([
            'status' => boolval($query),
            'emailscheduleid' => $emailscheduleId
        ]);
    }

    /**
     * make a count of each related bean
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function checkRelated(Request $req, Response $res, array $args): Response {
        $beanid = $args['parentid'];
        $module = $args['parentmodule'];
        $linkedBeans = [];
        $params = $req->getQueryParams();
        $relatedModules = json_decode($params['modules']);

        $bean = BeanFactory::getBean($module, $beanid);
        $bean->load_relationships();
        if (!empty($relatedModules)) {
            foreach ($relatedModules as $related) {
                if(!empty($related) && isset(SpiceModules::getInstance()->modules[$related])) {
                    $linkedBeans[] = ['module' => $related, 'link' => strtolower($related), 'count' => $bean->get_linked_beans_count(strtolower($related), $related)];
                }
            }
        }

        return $res->withJson([
            'status' => boolval($linkedBeans),
            'beanId' => $beanid,
            'linkedBeans' => $linkedBeans
        ]);
    }

    /**
     * save the emailschedule and insert all the related beans in the emailschedule_beans table
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function saveScheduleFromRelated(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $postBody = $req->getParsedBody();
        $beanId = $args['parentid'];
        $module = $args['parentmodule'];
        $links = $postBody['links'];
        $bean = BeanFactory::getBean($module, $beanId);
        $bean->load_relationships();
        if (count($links) > 0) {
            foreach ($links as $module) {
                $relatedbeans[] = $bean->get_linked_beans(strtolower($module), $module);
            }
        }

        // create the scheduleid
        if (count($relatedbeans) > 0 || count($postBody['linkedbeans']) > 0) {
            $emailscheduleId = $this->saveBean($postBody, $args['id']);
        }

        // post the related beans
        if (count($relatedbeans) > 0) {
            $query = "INSERT INTO emailschedules_beans (id, emailschedule_status, emailschedule_id, bean_module, bean_id, date_modified, deleted) VALUES ";
            if (!empty($emailscheduleId)) {
                foreach ($relatedbeans as $relatedbean) {
                    foreach ($relatedbean as $relatedbeanentry) {
                        $guid = SpiceUtils::createGuid();
                        $query .= "('$guid', 'queued', '$emailscheduleId', '$relatedbeanentry->module_dir', '$relatedbeanentry->id', now(), 0),";
                    }
                }
                if (!empty($query)) {
                $query = substr_replace($query, ";", -1);
                $db->query($query);
                }
            }
        }

        if(count($postBody['linkedbeans']) > 0){
            $query = "INSERT INTO emailschedules_beans (id, emailschedule_status, emailschedule_id, bean_module, bean_id, date_modified, deleted) VALUES ";
            if (!empty($emailscheduleId)) {
                foreach ($postBody['linkedbeans'] as $module => $ids) {
                    foreach ($ids as $id) {
                        $guid = SpiceUtils::createGuid();
                        $query .= "('$guid', 'queued', '$emailscheduleId', '{$module}', '{$id}', now(), 0),";
                    }
                }
                if (!empty($query)) {
                    $query = substr_replace($query, ";", -1);
                    $db->query($query);
                }
            }
        }

        // retun the status
        return $res->withJson([
            'status' => count($relatedbeans) > 0 || count($postBody['linkedbeans']) > 0,
            'emailschedule' => $emailscheduleId,
        ]);
    }

    /**
     * get the open schedules for the requested id
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getOwnOpenSchedules(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $userid = $args['userid'];
        $openSchedules = [];
        if ($userid == $current_user->id || $current_user->is_admin) {
            $query = "SELECT id, email_subject, email_schedule_status from emailschedules WHERE assigned_user_id ='$userid' AND email_schedule_status = 'open' AND deleted = 0";
            $query = $db->query($query);
            while ($row = $db->fetchByAssoc($query)) {
                $openSchedules[] = ['id' => $row['id'], 'subject' => $row['email_subject'], 'status' => $row['email_schedule_status']];
            }
        }

        return $res->withJson([
            'status' => boolval($query),
            'openschedules' => $openSchedules
        ]);
    }
}
