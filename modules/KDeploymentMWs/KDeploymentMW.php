<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/**
 * twentyreasons KDeploymentMW
 * @author Stefan Wölflinger (twentyreasons)
 */
require_once('include/SugarObjects/templates/basic/Basic.php');
require_once('include/utils.php');

class KDeploymentMW extends SugarBean
{
    //Sugar vars
    var $table_name = "kdeploymentmws";
    var $object_name = "KDeploymentMW";
    var $new_schema = true;
    var $module_dir = "KDeploymentMWs";
    var $id;
    var $date_entered;
    var $date_modified;
    var $assigned_user_id;
    var $modified_user_id;
    var $created_by;
    var $created_by_name;
    var $modified_by_name;
    var $description;
    var $name;

    function __construct()
    {
        parent::__construct();
    }

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function get_summary_text()
    {
        return $this->name;
    }

    public static function checkMW(){
        global $db, $timedate, $sugar_config;
        // SpiceCRM Deployment Maintenance Windows Check
        $date = new DateTime('now',new DateTimeZone('UTC'));
        $row = $db->fetchByAssoc($db->limitQuery("SELECT * FROM kdeploymentmws WHERE deleted = 0 AND to_date > '".date_format($date, $timedate->get_db_date_time_format())."' ORDER BY from_date ASC",0,1));
        if(!empty($row['id'])) {
            $from_date = DateTime::createFromFormat($timedate->get_db_date_time_format(),$row['from_date'],new DateTimeZone('UTC'));
            if($from_date <= $date){
                if($_REQUEST['action'] == 'Authenticate'){
                    $logged_in_user = new User();
                    $logged_in_user->retrieve_by_string_fields(array('user_name' => $_POST['user_name']));
                }else {
                    $logged_in_user = new User();
                    $logged_in_user->retrieve($_SESSION['authenticated_user_id']);
                }
                if (!$logged_in_user->is_admin) {
                    unset($_GET[session_name()]); //PHPSESSID
                    session_destroy();
                }
                $GLOBALS['kdeploymentmw_now'] = $row;
            }else{
                //check if we have Maintenance Windows in n minutes
                $date_near = new DateTime('now',new DateTimeZone('UTC'));
                $date_near->add(new DateInterval('PT'.$sugar_config['kdeploymentmw_near_interval'].'M'));
                if($from_date <= $date_near){
                    $GLOBALS['kdeploymentmw_near'] = $row;
                }else{
                    //check if we have Maintenance Windows ending in X minutes
                    $date_upcoming = new DateTime('now',new DateTimeZone('UTC'));
                    if(!empty($sugar_config['kdeploymentmw_upcoming_minutes'])){
                        $interval = "PT".$sugar_config['kdeploymentmw_upcoming_minutes']."M";
                    }else{
                        $interval = "PT12H";
                    }
                    $date_upcoming->add(new DateInterval($interval));
                    if($from_date <= $date_upcoming){
                        $GLOBALS['kdeploymentmw_upcoming'] = $row;
                    }
                }
            }
        }
    }
}