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

namespace SpiceCRM\modules\Products\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use stdClass;

class ProductController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function productMapValidation(Request $req, Response $res, array $args): Response {
        $resthandler = new ModuleHandler();

        $product = BeanFactory::getBean('Products', $args['id']);
        $group = BeanFactory::getBean('ProductGroups', $product->productgroup_id);

        $attributes = $group->getProductAttributes();
        $attributes_mapped = [];
        foreach ($attributes as $attribute) {

            $attribute_mapped = $resthandler->mapBeanToArray('ProductAttribute', $attribute);
            if ($validations = $attribute->get_linked_beans('productattributevaluevalidations', 'ProductAttributeValueValidation')) {
                $attribute_mapped['validations'] = [];
                foreach ($validations as $validation) {
                    $attribute_mapped['validations'][] = ['value' => $validation->value, 'value_from' => $validation->value_from, 'value_to' => $validation->value_to];
                }
            }
            $attributes_mapped[] = $attribute_mapped;
        }

        return $res->withJson($attributes_mapped);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function productGetValue(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $getParams = $req->getQueryParams();

        $product = BeanFactory::getBean('Products', $args['id']);
        $group = BeanFactory::getBean('ProductGroups', $product->productgroup_id);

        $attributes = $group->getRelatedAttributesRecursively($getParams['searchparams'] == 'true' ? true : false);
        if ($getParams['validations'] !== false) {
            $objectAttributeValues = [];
            $attributeValues = $product->get_linked_beans('productattributevalues', 'ProductAttributeValue');
            foreach ($attributeValues as $attributeValue)
                $objectAttributeValues[$attributeValue->productattribute_id] = $attributeValue->pratvalue;
            foreach ($attributes as &$attribute) {
                $validations = $db->query("SELECT value, value_from, value_to FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '" . $attribute['id'] . "'");
                while ($validation = $db->fetchByAssoc($validations)) {
                    $attribute['validations'][] = $validation;
                }
                $attribute['value'] = $objectAttributeValues[$attribute['id']];
            }
        }

        return $res->withJson($attributes);
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function productCleanValue(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $product = BeanFactory::getBean('Products', $args['id']);
        $group = BeanFactory::getBean('ProductGroups', $product->productgroup_id);
        $groups = $product->getProductGroups();

        $attributes = [];
        $productnames = [];

        $attributesObj = $db->query("SELECT productattributes.id, productattributes.name, productattributes.prat_datatype , contentcode, contentcode2, contentprefix  FROM trptgcontentcodeassignments, productattributes WHERE trptgcontentcodeassignments.productattribute_id = productattributes.id AND productgroup_id IN ('" . implode("','", $groups) . "')");
        while ($attribute = $db->fetchByAssoc($attributesObj)) {
            if ($attribute['prat_datatype'] == 'S' || $attribute['prat_datatype'] == 'D') {
                $attribute['values'] = new stdClass();
                $attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '{$attribute['id']}' AND valueshort IS NOT NULL");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $attribute['values']->{$attributesValue['value']} = $attributesValue['valueshort'];
                }
            }

            // get the values for content code N
            if($attribute['contentcode'] == 'N'){
                $attributesValues = $db->query("SELECT value FROM productattributevaluevalidations WHERE productattribute_id = '{$attribute['id']}'");
                //$attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE productattribute_id = '{$attribute['id']}'");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $productnames[] = $attributesValue['value'];
                }
            }

            $attributes[$attribute['id']] = $attribute;

        }

        $ltattributes = [];
        $attributesObj = $db->query("SELECT productattributes.id, productattributes.name, productattributes.prat_datatype , contentcode, contentcode2, textpattern, sequence  FROM trptglongtextcodeassignments, productattributes WHERE trptglongtextcodeassignments.productattribute_id = productattributes.id AND productgroup_id IN ('" . implode("','", $groups) . "')");
        while ($attribute = $db->fetchByAssoc($attributesObj)) {
            if ($attribute['prat_datatype'] == 'S' || $attribute['prat_datatype'] == 'D') {
                $attribute['values'] = new stdClass();
                $attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '{$attribute['id']}' AND valueshort IS NOT NULL");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $attribute['values']->{$attributesValue['value']} = $attributesValue['valueshort'];
                }
            }

            // get the values for content code N
            if($attribute['contentcode'] == 'N'){
                $attributesValues = $db->query("SELECT value FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '{$attribute['id']}'");
                //$attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE productattribute_id = '{$attribute['id']}'");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $productnames[] = $attributesValue['value'];
                }
            }

            $ltattributes[] = $attribute;

        }

        usort($ltattributes, function($a, $b){return $a['sequence'] > $b['sequence'] ? 1 : -1;});

        return $res->withJson([
            'attributes' => $attributes,
            'ltattributes' => $ltattributes,
            'template' => SpiceConfig::getInstance()->config['EpimIntegration']['shortTextTemplate'],
            'shorttext' => $group->getSorParam(),
            'productnames' => $productnames
        ]);
    }

}
