<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

require_once('soap/SoapRelationshipHelper.php');
set_time_limit(360);

$server->register(
    'sync_get_modified_relationships',
    ['session'=>'xsd:string', 'module_name'=>'xsd:string','related_module'=>'xsd:string', 'from_date'=>'xsd:string', 'to_date'=>'xsd:string','offset'=>'xsd:int', 'max_results'=>'xsd:int','deleted'=>'xsd:int', 'module_id'=>'xsd:string', 'select_fields'=>'tns:select_fields', 'ids'=>'tns:select_fields', 'relationship_name'=>'xsd:string', 'deletion_date'=>'xsd:string', 'php_serialize'=>'xsd:int'],
    ['return'=>'tns:get_entry_list_result_encoded'],
    $NAMESPACE);



/**
 * Get a list of the relationship records that have been modified within a
 * specified date range.  This is used to perform a sync with a mobile client.
 * The results are paged.
 *
 * @param xsd:string $session
 * @param xsd:string $module_name
 * @param xsd:string $related_module
 * @param xsd:string $from_date
 * @param xsd:string $to_date
 * @param xsd:int $offset
 * @param xsd:int $max_results
 * @param xsd:int $deleted
 * @param xsd:int $module_id
 * @param tns:select_fields $select_fields
 * @param tns:select_fields $ids
 * @param xsd:string $relationship_name
 * @param xsd:string $deletion_date
 * @param xsd:int $php_serialize
 * @return
 */
function sync_get_modified_relationships($session, $module_name, $related_module,$from_date,$to_date,$offset, $max_results, $deleted, $module_id = '', $select_fields = [], $ids = [], $relationship_name = '', $deletion_date = '', $php_serialize = 1){
	global $beanList, $beanFiles;
	$error = new SoapError();
	$output_list = [];
	if(!validate_authenticated($session)){
		$error->set_error('invalid_login');
		return ['result_count'=>-1, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	if(empty($beanList[$module_name]) || empty($beanList[$related_module])){
		$error->set_error('no_module');
		return ['result_count'=>-1, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	$current_user = AuthenticationController::getInstance()->getCurrentUser();
	if(!check_modules_access($current_user, $module_name, 'read') || !check_modules_access($current_user, $related_module, 'read')){
		$error->set_error('no_access');
		return ['result_count'=>-1, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
    // Cast to integer
    $deleted = (int)$deleted;
	if($max_results > 0 || $max_results == '-99'){

		SpiceConfig::getInstance()->config['list_max_entries_per_page'] = $max_results;
	}

	$date_query = "(m1.date_modified > " . DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($from_date)."'", 'datetime'). " AND m1.date_modified <= ". DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($to_date)."'", 'datetime')." AND {0}.deleted = $deleted)";
	if(isset($deletion_date) && !empty($deletion_date)){
		$date_query .= " OR ({0}.date_modified > " . DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($deletion_date)."'", 'datetime'). " AND {0}.date_modified <= ". DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($to_date)."'", 'datetime')." AND {0}.deleted = 1)";
	}

	$in = '';
	if(isset($ids) && !empty($ids)){
		foreach($ids as $value){
			if(empty($in))
			{
				$in .= "('" . DBManagerFactory::getInstance()->quote($value) . "'";
			}
			else
			{
				$in .= ",'" . DBManagerFactory::getInstance()->quote($value) . "'";
			}
		}
		$in .=')';
	}
	$query = '';
	if(isset($in) && !empty($in)){
		$query .= "( $date_query AND m1.id IN $in) OR (m1.id NOT IN $in AND {0}.deleted = 0)";
	}
	else{
		$query .= "( {0}.deleted = 0)";
	}
	if(isset($module_id) && !empty($module_id)){
		//if(isset($in) && !empty($in)){
			$query .= " AND";
		//}
        $query .= " m2.id = '". DBManagerFactory::getInstance()->quote($module_id)."'";
	}
	if($related_module == 'Meetings' || $related_module == 'Calls'){
		$query = string_format($query, ['m1']);
	}
	$results = retrieve_modified_relationships($module_name,  $related_module, $query, $deleted, $offset, $max_results, $select_fields, $relationship_name);

	$list = $results['result'];

	$xml = '<?xml version="1.0" encoding="utf-8"?><items>';
	foreach($list as $value)
	{
		$val = array_get_return_value($value, $results['table_name']);
		if($php_serialize == 0){
			$xml .= get_name_value_xml($val, $module_name);
		}
		$output_list[] = $val;
	}
	$xml .= '</items>';
	$next_offset = $offset + sizeof($output_list);

	if($php_serialize == 0){
		$myoutput = base64_encode($xml);
	}
	else{
		$myoutput = get_encoded($output_list);
	}

	return ['result_count'=>sizeof($output_list),'next_offset'=>0, 'total_count'=>sizeof($output_list), 'field_list'=>[], 'entry_list'=>$myoutput , 'error'=>$error->get_soap_array()];
}


$server->register(
    'get_modified_entries',
    ['session'=>'xsd:string', 'module_name'=>'xsd:string', 'ids'=>'tns:select_fields', 'select_fields'=>'tns:select_fields'],
    ['return'=>'tns:get_sync_result_encoded'],
    $NAMESPACE);

function get_modified_entries($session, $module_name, $ids, $select_fields ){
	global $beanList, $beanFiles;
	$error = new SoapError();
	$field_list = [];
	$output_list = [];
	if(!validate_authenticated($session)){
		$error->set_error('invalid_login');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	if(empty($beanList[$module_name])){
		$error->set_error('no_module');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	$current_user = AuthenticationController::getInstance()->getCurrentUser();
	if(!check_modules_access($current_user, $module_name, 'read')){
		$error->set_error('no_access');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}

	$class_name = $beanList[$module_name];
	require_once($beanFiles[$class_name]);
	$seed = new $class_name();
	//rsmith
	$in = '';
	$field_select ='';

	$table_name = $seed->table_name;
	if(isset($ids)){
		foreach($ids as $value){
			if(empty($in))
			{
				$in .= "('" . DBManagerFactory::getInstance()->quote($value) . "'";
			}
			else
			{
				$in .= ",'" . DBManagerFactory::getInstance()->quote($value) . "'";
			}
		}//end foreach
	}
	$index = 0;
	foreach($select_fields as $field){
            if ( !isset($seed->field_defs[$field]) ) {
                continue;
            }
			$field_select .= $table_name.".".$field;

			if($index < (count($select_fields) - 1))
			{
				$field_select .= ",";
				$index++;
			}
		}//end foreach

		$ids = [];

	//end rsmith
	if(!empty($in)){
			$in .=')';
	}

	$ret_array = $seed->create_new_list_query('', "$table_name.id IN $in", $select_fields, [], -2, '', true, $seed, true);
    if(!is_array($params)) $params = [];
    if(!isset($params['custom_select'])) $params['custom_select'] = '';
    if(!isset($params['custom_from'])) $params['custom_from'] = '';
    if(!isset($params['custom_where'])) $params['custom_where'] = '';
    if(!isset($params['custom_order_by'])) $params['custom_order_by'] = '';
	$main_query = $ret_array['select'] . $params['custom_select'] . $ret_array['from'] . $params['custom_from'] . $ret_array['where'] . $params['custom_where'] . $ret_array['order_by'] . $params['custom_order_by'];
	$result = $seed->db->query($main_query);

	$xml = '<?xml version="1.0" encoding="utf-8"?><items>';
	while($row = $seed->db->fetchByAssoc($result))
	{
		if (version_compare(phpversion(), '5.0') < 0) {
        	$temp = $seed;
        } else {
        	$temp = @clone($seed);
        }
// CR1000452
//        $temp->setupCustomFields($temp->module_dir);
		$temp->loadFromRow($row);
		$temp->fill_in_additional_detail_fields();
		if(isset($temp->emailAddress)){
			$temp->emailAddress->handleLegacyRetrieve($temp);
		}
		$val = get_return_value($temp, $table_name);
		$xml .= get_name_value_xml($val, $module_name);
	}
	$xml .= "</items>";

	$xml = base64_encode($xml);

	return ['result'=>$xml, 'error'=>$error->get_soap_array()];
}

$server->register(
    'get_attendee_list',
    ['session'=>'xsd:string', 'module_name'=>'xsd:string', 'id'=>'xsd:string'],
    ['return'=>'tns:get_sync_result_encoded'],
    $NAMESPACE);

function get_attendee_list($session, $module_name, $id){
	global $beanList, $beanFiles;
	$error = new SoapError();
	$field_list = [];
	$output_list = [];
	if(!validate_authenticated($session)){
		$error->set_error('invalid_login');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	if(empty($beanList[$module_name])){
		$error->set_error('no_module');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}
	$current_user = AuthenticationController::getInstance()->getCurrentUser();
	if(!check_modules_access($current_user, $module_name, 'read')){
		$error->set_error('no_access');
		return ['field_list'=>$field_list, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
	}


	$class_name = $beanList[$module_name];
	require_once($beanFiles[$class_name]);
	$seed = new $class_name();


			//rsmith
			$xml = '<?xml version="1.0" encoding="utf-8"?>';
			if($module_name == 'Meetings' || $module_name == 'Calls'){
				//if we find a meeting or call we want to send back the attendees
				$l_module_name = strtolower($module_name);
				$table_name = $l_module_name."_users";
				if($module_name == 'Meetings')
					$join_field = "meeting";
				else
					$join_field = "call";
				$xml .= '<attendees>';
				$result = $seed->db->query("SELECT users.id, $table_name.date_modified, first_name, last_name FROM users INNER JOIN $table_name ON $table_name.user_id = users.id WHERE ".$table_name.".".$join_field."_id = '". DBManagerFactory::getInstance()->quote($id)."' AND $table_name.deleted = 0");
				$user = BeanFactory::getBean('Users');
				while($row = $seed->db->fetchByAssoc($result));
				{
					$user->id = $row['id'];
					$email = $user->email1;
					$xml .= '<attendee>';
					$xml .= '<id>'.$user->id.'</id>';
					$xml .= '<first_name>'.$row['first_name'].'</first_name>';
					$xml .= '<last_name>'.$row['last_name'].'</last_name>';
					$xml .= '<email1>'.$email.'</email1>';
					$xml .= '</attendee>';
				}
				//now get contacts
				$table_name = $l_module_name."_contacts";
				$result = $seed->db->query("SELECT contacts.id, $table_name.date_modified, first_name, last_name FROM contacts INNER JOIN $table_name ON $table_name.contact_id = contacts.id INNER JOIN $seed->table_name ON ".$seed->table_name.".id = ".$table_name.".".$join_field."_id WHERE ".$table_name.".".$join_field."_id = '". DBManagerFactory::getInstance()->quote($id)."' AND ".$table_name.".deleted = 0 AND (contacts.id != ".$seed->table_name.".parent_id OR ".$seed->table_name.".parent_id IS NULL)");
				$contact = BeanFactory::getBean('Contacts');
				while($row = $seed->db->fetchByAssoc($result))
				{
					$contact->id = $row['id'];
					$email = $contact->email1;
					$xml .= '<attendee>';
					$xml .= '<id>'.$contact->id.'</id>';
					$xml .= '<first_name>'.$row['first_name'].'</first_name>';
					$xml .= '<last_name>'.$row['last_name'].'</last_name>';
					$xml .= '<email1>'.$email.'</email1>';
					$xml .= '</attendee>';
				}
				$xml .= '</attendees>';
			}
	$xml = base64_encode($xml);
	return ['result'=>$xml, 'error'=>$error->get_soap_array()];
}
?>
