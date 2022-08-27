<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Products\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
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
        $resthandler = new SpiceBeanHandler();

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
