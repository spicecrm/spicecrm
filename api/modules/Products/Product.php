<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Products;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;

class Product extends SpiceBean {

//    public $unformated_numbers = true;

    public $left_node_id;
    public $right_node_id;

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
