<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\AccountKPIs;

use SpiceCRM\data\SugarBean;


class AccountKPI extends SugarBean
{
    //Sugar vars
    var $table_name = "accountkpis";
    var $object_name = "AccountKPI";
    var $new_schema = true;
    var $module_dir = "AccountKPIs";
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
}
