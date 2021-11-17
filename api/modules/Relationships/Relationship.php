<?php
namespace SpiceCRM\modules\Relationships;

use SpiceCRM\data\SugarBean;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\Relationships\SugarRelationshipFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

/*********************************************************************************

 * Description:  TODO: To be written.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/


class Relationship extends SugarBean {

	public $object_name='Relationship';
    public $module_dir = 'Relationships';
    public $new_schema = true;
    public $table_name = 'relationships';

    public $id;
    public $relationship_name;
    public $lhs_module;
    public $lhs_table;
    public $lhs_key;
    public $rhs_module;
    public $rhs_table;
    public $rhs_key;
    public $join_table;
    public $join_key_lhs;
    public $join_key_rhs;
    public $relationship_type;
    public $relationship_role_column;
    public $relationship_role_column_value;
    public $reverse;

    public $_self_referencing;


	/**
     * returns true if the relationship is self referencing. equality check is performed for both table and
	 * key names.
     * @return boolean
	 */
	public function is_self_referencing() {
		if (empty($this->_self_referencing)) {
			$this->_self_referencing=false;

			// is self referencing, both table and key name from lhs and rhs should  be equal.
			if ($this->lhs_table == $this->rhs_table && $this->lhs_key == $this->rhs_key) {
				$this->_self_referencing=true;
			}
		}
		return $this->_self_referencing;
	}

	/**
     * returns true if a relationship with provided name exists
     * @return boolean
     */
	static function exists($relationship_name,&$db) {
		$query = "SELECT relationship_name FROM relationships WHERE deleted=0 AND relationship_name = '".$relationship_name."'";
		$result = $db->query($query,true," Error searching relationships table..");
		$row  =  $db->fetchByAssoc($result);
		if ($row != null) {
			return true;
		}
		return false;
	}

    /**
     * @param $relationship_name
     * @param $db
     * @return void
     */
	public function delete($relationship_name,&$db) {
		$query = "UPDATE relationships SET deleted=1 WHERE deleted=0 AND relationship_name = '".$relationship_name."'";
		$result = $db->query($query,true," Error updating relationships table for ".$relationship_name);
	}

    /**
     * give it the relationship_name and base module
     * it will return the module name on the other side of the relationship
     * @param $relationship_name
     * @param $base_module
     * @param $db
     * @return false
     */
//    public function get_other_module($relationship_name, $base_module, &$db){
//		$query = "SELECT relationship_name, rhs_module, lhs_module FROM relationships WHERE deleted=0 AND relationship_name = '".$relationship_name."'";
//		$result = $db->query($query,true," Error searching relationships table..");
//		$row  =  $db->fetchByAssoc($result);
//		if ($row != null) {
//
//			if($row['rhs_module']==$base_module){
//				return $row['lhs_module'];
//			}
//			if($row['lhs_module']==$base_module){
//				return $row['rhs_module'];
//			}
//		}
//		return false;
//	}

    /**
     * give it the relationship_name and base module
     * it will return the module name on the other side of the relationship
     * @param $lhs_module
     * @param $rhs_module
     * @param $db
     * @return null|array
     */
//	public function retrieve_by_sides($lhs_module, $rhs_module, &$db){
//		$query = "SELECT * FROM relationships WHERE deleted=0 AND lhs_module = '".$lhs_module."' AND rhs_module = '".$rhs_module."'";
//		$result = $db->query($query,true," Error searching relationships table..");
//		$row  =  $db->fetchByAssoc($result);
//		if ($row != null) {
//			return $row;
//		}
//		return null;
//	}

    /**
     * give it the relationship_name and base module
     * /it will return the module name on the other side of the relationship
     * @param $lhs_module
     * @param $rhs_module
     * @param $db
     * @param string $type
     * @return null|array
     */
	public function retrieve_by_modules($lhs_module, $rhs_module, $db, $type =''){
		$query = "	SELECT * FROM relationships
					WHERE deleted=0
					AND (
					(lhs_module = '".$lhs_module."' AND rhs_module = '".$rhs_module."')
					OR
					(lhs_module = '".$rhs_module."' AND rhs_module = '".$lhs_module."')
					)
					";
		if(!empty($type)){
			$query .= " AND relationship_type='$type'";
		}
		$result = $db->query($query,true," Error searching relationships table..");
		$row  =  $db->fetchByAssoc($result);
		if ($row != null) {
			return $row['relationship_name'];
		}
		return null;
	}

	/**
	 * rebuild relationship table
     * @return void
	 */
	public function build_relationship_cache() {
        SpiceDictionaryVardefs::deleteAllRelationshipsCacheFromDb();
        $relationships = SpiceDictionaryVardefs::loadRelationshipsFromDictionary();
        SpiceDictionaryVardefs::saveRelationshipsCacheToDb($relationships);
        $_SESSION['relationships'] = $relationships;
	}

}
