<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Employees;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\templates\person\Person;

class Employee extends Person {

	function __construct() {
		parent::__construct();
		$this->emailAddress = BeanFactory::getBean('EmailAddresses');
	}

    /**
     * create_new_list_query
     *
     * Return the list query used by the list views and export button. Next generation of create_new_list_query function.
     *
     * We overrode this function in the Employees module to add the additional filter check so that we do not retrieve portal users for the Employees list view queries
     *
     * @param string $order_by custom order by clause
     * @param string $where custom where clause
     * @param array $filter Optioanal
     * @param array $params Optional     *
     * @param int $show_deleted Optional, default 0, show deleted records is set to 1.
     * @param string $join_type
     * @param boolean $return_array Optional, default false, response as array
     * @param object $parentbean creating a subquery for this bean.
     * @param boolean $singleSelect Optional, default false.
     * @return String select query string, optionally an array value will be returned if $return_array= true.
     */
    public function create_new_list_query($order_by, $where, $filter = [], $params = [], $show_deleted = 0,
										  $join_type = '', $return_array = false, $parentbean = null,
										  $singleSelect = false, $ifListForExport = false) {
        //create the filter for portal only users, as they should not be showing up in query results
        if(empty($where)){
            $where = ' users.portal_only = 0 ';
        }else{
            $where .= ' and users.portal_only = 0 ';
        }

        //return parent method, specifying for array to be returned
        return parent::create_new_list_query($order_by, $where, $filter,$params, $show_deleted, $join_type,
			$return_array, $parentbean, $singleSelect, $ifListForExport);
    }

}
