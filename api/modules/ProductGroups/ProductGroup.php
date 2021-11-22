<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\modules\ProductGroups;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\KREST\handlers\ModuleHandler;

class ProductGroup extends SugarBean
{

    public $table_name = "productgroups";
    public $object_name = "ProductGroup";
    public $module_dir = 'ProductGroups';
    public $unformated_numbers = true;


    public function __construct()
    {
        parent::__construct();
    }

    function getSubProductGroups($groupid = '')
    {
        $productGroupsArray = [];

        if (empty($groupid)) $groupid = $this->id;

        $subGroups = $this->db->query("SELECT id FROM productgroups WHERE parent_productgroup_id = '$groupid'");
        while ($subGroup = $this->db->fetchByAssoc($subGroups)) {
            if (array_search($subGroup['id'], $productGroupsArray) === false) {
                $productGroupsArray[] = $subGroup['id'];

                $subProductGroups = $this->getSubProductGroups($subGroup['id']);
                if (count($subProductGroups) > 0) {
                    $productGroupsArray = array_merge($productGroupsArray, $subProductGroups);
                }
            }
        }

        return $productGroupsArray;
    }

    public function getParentGroupsV2()
    {

        $parentProductGroups = [$this->id];

        if (!empty($this->parent_productgroup_id)) {
            $parent = BeanFactory::getBean('ProductGroups', $this->parent_productgroup_id);
            if($parent)
                $parentProductGroups = array_merge($parentProductGroups, $parent->getParentGroupsV2());
        }

        return $parentProductGroups;
    }


    function fill_in_additional_list_fields()
    {
        parent::fill_in_additional_list_fields();
        $this->member_count = $this->get_member_count();
        $this->product_count = $this->get_product_count();
    }

    function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        $this->member_count = $this->get_member_count();
        $this->product_count = $this->get_product_count();
    }

    function get_member_count()
    {
        $members = $this->db->fetchByAssoc($this->db->query("SELECT count(id) membercount FROM productgroups WHERE parent_productgroup_id = '$this->id' AND deleted = 0"));
        return $members['membercount'];
    }

    function get_product_count()
    {
        $members = $this->db->fetchByAssoc($this->db->query("SELECT count(id) membercount FROM products WHERE productgroup_id = '$this->id' AND deleted = 0"));
        return $members['membercount'];
    }

    function getProductAttributes($attributes = [])
    {

        if ($this->parent_productgroup_id) {
            $parent_group = new ProductGroup();
            $parent_group->retrieve($this->parent_productgroup_id);
            $attributes = $parent_group->getProductAttributes($attributes);
        }

        # oder, besser, funkt aber grad/noch nicht:

        # $this->load_relationship('productgroups');
        # foreach ( $this->productgroups->getBeans() as $parent_group ) {
        #     $attributes = $parent_group->getAttributesFromProductgroup( $attributes );
        # }

        $this->load_relationship('productattributes');
        foreach ($this->productattributes->getBeans() as $attribute) {
            $attributes[] = $attribute;
        }

        return $attributes;

    }

    function getRelatedAttributesRecursively($searchEnabled = false, $attributes = [], &$attributeIds = [])
    {
        $moduleHandler = new ModuleHandler();

        if ($this->parent_productgroup_id) {
            $parent_group = new ProductGroup();
            $parent_group->retrieve($this->parent_productgroup_id);
            $attributes = $parent_group->getRelatedAttributesRecursively($searchEnabled, $attributes, $attributeIds);

        }

        $resultAttributes = $moduleHandler->get_related('ProductGroups', $this->id, 'productattributes', ['limit' => -1]);
        foreach ($resultAttributes as $attribute) {

            if(!in_array($attribute['id'], $attributeIds)) {
                $attributes[] = $attribute;
                $attributeIds[] = $attribute['id'];
            }
        }
        return $attributes;
    }

    function getSorParam(){
        if($this->sortparam){
            return $this->sortparam;
        } else if (!empty($this->parent_productgroup_id)){
            $parentGroup = BeanFactory::getBean('ProductGroups', $this->parent_productgroup_id);
            return $parentGroup->getSorParam();
        } else {
            return '';
        }
    }

}

