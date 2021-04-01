<?php

namespace SpiceCRM\modules\EmailSchedules\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;

class EmailSchedulesKRESTController {

    /**
     * save emailschedule bean and return the id
     * @param $postBody
     * @return string
     */
    private function saveBean($postBody) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // create a new bean
        $emailschedule = BeanFactory::getBean('EmailSchedules');

        // if the id is in the body assign it
        if($postBody['id']) {
            $emailschedule->id = $postBody['id'];
            $emailschedule->new_with_id = true;
        }

        // pass over the data
        $emailschedule->email_subject = $postBody['data']['email_subject'];
        $emailschedule->name = $postBody['data']['email_subject'];
        $emailschedule->mailbox_id = $postBody['data']['mailbox_id'];
        $emailschedule->email_body = $postBody['data']['email_body'];
        $emailschedule->email_stylesheet_id = $postBody['data']['email_stylesheet_id'];
        $emailschedule->email_schedule_status = 'open';
        $emailschedule->assigned_user_id = $current_user->id;

        // save the schedule
        $emailschedule->save();

        return $emailschedule->id;
    }

    /**
     * save related beans in emailschedules_beans, return the boolean result of the query and the emailschedule id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function saveSchedule($req, $res, $args) {

        $db = DBManagerFactory::getInstance();
        $postBody = $req->getParsedBody();

        $emailscheduleId = $this->saveBean($postBody);

        if(!empty($emailscheduleId) && count($postBody['ids']) > 0) {
            $query="INSERT INTO emailschedules_beans (id, emailschedule_status, emailschedule_id, bean_module, bean_id, date_modified, deleted) VALUES ";
            foreach($postBody['ids'] as $beanid) {
                $query .= "(uuid(), 'queued', '$emailscheduleId', '{$postBody['module']}', '$beanid', now(), 0),";
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
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function checkRelated($req, $res, $args) {
        $beanid = $args['id'];
        $module = $args['module'];
        $linkedBeans = [];
        $params = $req->getQueryParams();
        $relatedModules = json_decode($params['modules']);

        $bean = BeanFactory::getBean($module, $beanid);
        $bean->load_relationships();
        if(!empty($relatedModules)) {
            foreach($relatedModules as $related) {
                $linkedBeans[] = ['module' => $related, 'link' => strtolower($related), 'count' => $bean->get_linked_beans_count(strtolower($related), $related)];
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
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function saveScheduleFromRelated($req, $res, $args) {
        $db = DBManagerFactory::getInstance();
        $postBody = $req->getParsedBody();
        $beanId = $postBody['beanId'];
        $module = $postBody['bean'];
        $links = $postBody['links'];
        $bean = BeanFactory::getBean($module, $beanId);
        $bean->load_relationships();
        if(count($links) > 0) {
          foreach($links as $module) {
             $relatedbeans[] = $bean->get_linked_beans(strtolower($module), $module);
          }
        }

        if(count($relatedbeans) > 0) {
            $emailscheduleId = $this->saveBean($postBody);
            $query = "INSERT INTO emailschedules_beans (id, emailschedule_status, emailschedule_id, bean_module, bean_id, date_modified, deleted) VALUES ";
            if(!empty($emailscheduleId)) {
                foreach($relatedbeans as $relatedbean) {
                    foreach($relatedbean as $relatedbeanentry) {
                        $query.= "(uuid(), 'queued', '$emailscheduleId', '$relatedbeanentry->module_dir', '$relatedbeanentry->id', now(), 0),";
                    }
                }
                if(!empty($query)) {
                $query = substr_replace($query, ";", -1);
                $db->query($query);
                }
            }
        }

        return $res->withJson([
            'status' => boolval($relatedbeans),
            'emailschedule' => $emailscheduleId,
        ]);
    }

    /**
     * get the open schedules for the requested id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getOwnOpenSchedules($req, $res, $args) {
        $db = DBManagerFactory::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $userid = $args['id'];
        $openSchedules = [];
        if($userid == $current_user->id || $current_user->is_admin) {
            $query = "SELECT id, email_subject, email_schedule_status from emailschedules WHERE assigned_user_id ='$userid' AND email_schedule_status = 'open' AND deleted = 0";
            $query = $db->query($query);
            while($row = $db->fetchByAssoc($query)) {
                $openSchedules[] = ['id' => $row['id'], 'subject' => $row['email_subject'], 'status' => $row['email_schedule_status']];
            }
        }

        return $res->withJson([
            'status' => boolval($query),
            'openschedules' => $openSchedules
        ]);
    }
}
