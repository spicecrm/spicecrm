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

namespace SpiceCRM\modules\Products;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;

class Product extends SugarBean {

    public $table_name = "products";
    public $object_name = "Product";
    public $module_dir = 'Products';
    public $unformated_numbers = true;

    public $left_node_id;
    public $right_node_id;


    public function __construct() {
        parent::__construct();
    }


    public function bean_implements($interface) {
        switch($interface) {
            case 'ACL': return true;
        }
        return false;
    }


    public function get_summary_text() {
        return $this->name;
    }

    public function getAttributeValues() {

        $this->load_relationship('productattributevalues');
        $productattributeValues = $this->productattributevalues->getBeans();
        return $productattributeValues;
    }

    /**
     * get the product groups for the product
     * @return array
     */
    public function getProductGroups(): array
    {
        if (empty($this->productgroup_id)) return [];

        $productGroup = BeanFactory::getBean('ProductGroups', $this->productgroup_id);
        if ($productGroup)
            return $productGroup->getParentGroupsV2();
        else
            return [];
    }

    public function add_fts_metadata()
    {
        return [
            'productgroups' => [
                'type' => 'keyword',
                'index' => false,
                'aggregate' => 'term',
                'search' => false
            ]
        ];
    }

    public function add_fts_fields()
    {
        $attribArray = [];

        // select the values
        $attribObj = $this->db->query("SELECT pav.pratvalue, pav.productattribute_id, pa.prat_datatype, pa.prat_length, pa.prat_precision FROM productattributevalues pav, productattributes pa WHERE pa.id=pav.productattribute_id AND pav.parent_id='$this->id' AND pav.deleted = 0 AND pa.deleted = 0");
        while ($attrib = $this->db->fetchByAssoc($attribObj)) {
            if (!empty($attrib['pratvalue'])) {
                switch (strtolower($attrib['prat_datatype'])) {
                    case 'n':
                        $precision = $attrib['prat_precision'] || $attrib['prat_precision'] === '0' ? $attrib['prat_precision'] : 2;
                        $length = $attrib['prat_length'] ?: $attrib['prat_precision'] + 5;

                        $attribValue = floatval($attrib['pratvalue']);
                        $attribValue = (string) round($attribValue * pow(10, $precision ));
                        while(strlen($attribValue) < $length)
                            $attribValue = '0' . $attribValue;

                        $attribArray['attrib->' . $attrib['productattribute_id']] = $attrib['pratvalue'];
                        break;
                    case 's':
                        $attribArray['attrib->' . $attrib['productattribute_id']] = explode(',', $attrib['pratvalue']);
                        break;
                    default:
                        $attribArray['attrib->' . $attrib['productattribute_id']] = $attrib['pratvalue'];
                        break;
                }
            }
        }

        $attribArray['productgroups'] = $this->getProductGroups();

        return $attribArray;
    }
}
