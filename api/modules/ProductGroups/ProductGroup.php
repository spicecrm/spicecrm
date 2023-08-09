<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\ProductGroups;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

class ProductGroup extends SpiceBean
{
//    public $unformated_numbers = true;

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

    /**
     * collect counts when details are displayed
     *
     * @return void
     */
    function retrieveViewDetails()
    {
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
        $moduleHandler = new SpiceBeanHandler();

        if ($this->parent_productgroup_id) {
            $parent_group = BeanFactory::getBean('ProductGroups');
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

