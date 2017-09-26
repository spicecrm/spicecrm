<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$dictionary['EventRegistration'] = array(
    'table' => 'eventregistrations',
    'comment' => 'EventRegistrations Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,
	
	'fields' => array(
	    'name' => array(
	        'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => false
        ),
	    'registration_status' => array(
	        'name' => 'registration_status',
            'vname' => 'LBL_REGISTRATION_STATUS',
            'type' => 'enum',
            'options' => 'eventregistration_status_dom',
            'len' => 16,
            'comment' => 'registration state: registered|canceled|attended|notattended'
        ),
        'campaign_id' => array (
            'name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN_ID',
            'type' => 'id',
            'comment' => 'Campaign identifier',
            'reportable' => false,
        ),
        'campaign_name' => array (
            'name' => 'campaign_name',
            'rname' => 'name',
            'id_name' => 'campaign_id',
            'vname' => 'LBL_CAMPAIGN_NAME',
            'type' => 'relate',
            'table' => 'campaigns',
            'isnull' => 'true',
            'module' => 'Campaigns',
            'dbType' => 'varchar',
            'link' => 'campaign_link',
            'len' => '255',
            'source'=>'non-db',
        ),
        'campaign_link' => array(
            'name' => 'campaign_link',
            'vname' => 'LBL_CAMPAIGN_LINK',
            'type' => 'link',
            'relationship' => 'eventregistration_campaign_rel',
            'source'=>'non-db',
        ),

        'contact_id' => array (
            'name' => 'contact_id',
            'vname' => 'LBL_CONTACT_ID',
            'type' => 'id',
            'comment' => 'Contact identifier',
            'reportable' => false,
        ),
        'contact_name' => array (
            'name' => 'contact_name',
            'rname' => 'name',
            'id_name' => 'contact_id',
            'vname' => 'LBL_CONTACT_NAME',
            'type' => 'relate',
            'table' => 'contacts',
            'isnull' => 'true',
            'module' => 'Contacts',
            'dbType' => 'varchar',
            'link' => 'contact_link',
            'len' => '255',
            'source'=>'non-db',
        ),
        'contact_link' => array(
            'name' => 'contact_link',
            'vname' => 'LBL_CONTACT_LINK',
            'type' => 'link',
            'relationship' => 'eventregistration_contact_rel',
            'source'=>'non-db',
        )
	
	),
	'relationships' => array(
	    'eventregistration_campaign_rel' => array(
	        'lhs_module'=> 'Campaigns', 'lhs_table'=> 'campaigns', 'lhs_key' => 'id',
            'rhs_module'=> 'EventRegistrations', 'rhs_table'=> 'eventregistrations', 'rhs_key' => 'campaign_id',
            'relationship_type'=>'one-to-many'
        ),
        'eventregistration_contact_rel' => array(
            'lhs_module'=> 'Contacts', 'lhs_table'=> 'contacts', 'lhs_key' => 'id',
            'rhs_module'=> 'EventRegistrations', 'rhs_table'=> 'eventregistrations', 'rhs_key' => 'contact_id',
            'relationship_type'=>'one-to-many'
        ),
	),
	'indices' => array(
        array ('name' =>'idx_regcamp_id', 'type' =>'index', 'fields'=>array('campaign_id')),
        array ('name' =>'idx_regctid', 'type' =>'index', 'fields'=>array('contact_id')),
        array ('name' =>'idx_regcampctid', 'type' =>'index', 'fields'=>array('campaign_id', 'contact_id', 'deleted')),
    )
);
if ($GLOBALS['sugar_flavor'] != 'CE')
    VardefManager::createVardef('EventRegistrations', 'EventRegistration', array('default', 'assignable', 'team_security'));
else
    VardefManager::createVardef('EventRegistrations', 'EventRegistration', array('default', 'assignable'));
