<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\Soap;


class SoapError{
	var $name;
	var $number;
	var $description;

	function __construct(){
        global $error_defs;

        $number = 0;
        foreach ($error_defs as $key => $error) {
            if ($error['number'] > $number) {
                $number = $error['number'];
            }
        }
        $this_error_defs = [
            'no_error'=> ['number'=>++$number , 'name'=>'No Error', 'description'=>'No Error'],
            'invalid_login'=> ['number'=>++$number , 'name'=>'Invalid Login', 'description'=>'Login attempt failed please check the username and password'],
            'invalid_session'=> ['number'=>++$number , 'name'=>'Invalid Session ID', 'description'=>'The session ID is invalid'],
            'user_not_configure'=> ['number'=>++$number , 'name'=>'User Not Configured', 'description'=>'Please log into your instance of SugarCRM to configure your user. '],
            'no_portal'=> ['number'=>++$number , 'name'=>'Invalid Portal Client', 'description'=>'Portal Client does not have authorized access'],
            'no_module'=> ['number'=>++$number , 'name'=>'Module Does Not Exist', 'description'=>'This module is not available on this server'],
            'no_file'=> ['number'=>++$number , 'name'=>'File Does Not Exist', 'description'=>'The desired file does not exist on the server'],
            'no_module_support'=> ['number'=>++$number , 'name'=>'Module Not Supported', 'description'=>'This module does not support this feature'],
            'no_relationship_support'=> ['number'=>++$number , 'name'=>'Relationship Not Supported', 'description'=>'This module does not support this relationship'],
            'no_access'=> ['number'=>++$number , 'name'=>'Access Denied', 'description'=>'You do not have access'],
            'duplicates'=> ['number'=>++$number , 'name'=>'Duplicate Records', 'description'=>'Duplicate records have been found. Please be more specific.'],
            'no_records'=> ['number'=>++$number , 'name'=>'No Records', 'description'=>'No records were found.'],
            'cannot_add_client'=> ['number'=>++$number , 'name'=>'Cannot Add Offline Client', 'description'=>'Unable to add Offline Client.'],
            'client_deactivated'=> ['number'=>++$number , 'name'=>'Client Deactivated', 'description'=>'Your Offline Client instance has been deactivated.  Please contact your Administrator in order to resolve.'],
            'sessions_exceeded'=> ['number'=>++$number , 'name'=>'Number of sessions exceeded.'],
            'upgrade_client'=> ['number'=>++$number , 'name'=>'Upgrade Client', 'description'=>'Please contact your Administrator in order to upgrade your Offline Client'],
            'no_admin' => ['number' => ++$number, 'name' => 'Admin credentials are required', 'description' => 'The logged-in user is not an administrator'],
            'custom_field_type_not_supported' => ['number' => ++$number, 'name' => 'Custom field type not supported', 'description' => 'The custom field type you supplied is not currently supported'],
            'custom_field_property_not_supplied' => ['number' => ++$number, 'name' => 'Custom field property not supplied', 'description' => 'You are missing one or more properties for the supplied custom field type'],
            'resource_management_error' => ['number'=>++$number, 'name'=>'Resource Management Error', 'description'=>'The resource query limit specified in config.php has been exceeded during execution of the SOAP method'],
            'invalid_call_error' => ['number'=>++$number, 'name'=>'Invalid call for this module', 'description'=>'This is an invalid call for this module. Please look at WSDL file for details'],
            'invalid_data_format' => ['number'=>++$number, 'name'=>'Invalid data sent', 'description'=>'The data sent for this function is invalid. Please look at WSDL file for details'],
            'invalid_set_campaign_merge_data' => ['number'=>++$number, 'name'=>'Invalid set_campaign_merge data', 'description'=>'set_campaign_merge: Merge action status will not be updated, because, campaign_id is null or no targets were selected'],
            'password_expired'     => ['number'=>++$number, 'name'=> 'Password Expired', 'description'=>'Your password has expired. Please provide a new password.'],
            'lockout_reached'     => ['number'=>++$number, 'name'=> 'Password Expired', 'description'=>'You have been locked out of the Sugar application and cannot log in using existing password. Please contact your Administrator.'],
            'ldap_error' => ['number'=>++$number, 'name'=> 'LDAP Authentication Failed', 'description'=>'LDAP Authentication failed but supplied password was already encrypted.'],
        ];

        $error_defs = array_merge($error_defs ?? [], $this_error_defs) ?? [];

		$this->set_error('no_error');
	}

	function set_error($error_name){
		global $error_defs;
		if(!isset($error_defs[$error_name])){
			$this->name = 'An Undefined Error - ' . $error_name . ' occurred';
			$this->number = '-1';
			$this->description = 'There is no error definition for ' . 	$error_name;
		}else{
			$this->name = $error_defs[$error_name]['name'];
			$this->number = $error_defs[$error_name]['number'];
			$this->description = $error_defs[$error_name]['description'];
		}
	}

	function get_soap_array(){
		return ['number'=>$this->number,
					 'name'=>$this->name,
					 'description'=>$this->description];

	}

	function getName() {
		return $this->name;
	}

	function getFaultCode() {
		return $this->number;
	}

	function getDescription() {
		return $this->description;
	}
}