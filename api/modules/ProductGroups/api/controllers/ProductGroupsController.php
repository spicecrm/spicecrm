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

namespace SpiceCRM\modules\ProductGroups\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use stdClass;

class ProductGroupsController
{
    /**
     * Returns the products belonging to the product group
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getProducts(Request $req, Response $res, array $args): Response {
        $group = BeanFactory::getBean('ProductGroups');
        $group->retrieve($args['id']);

        $products = $group->get_linked_beans('products', 'Product');

        $retArray = [];
        $handler = new ModuleHandler();
        foreach($products as $product){
            $retArray[] = $handler->mapBeanToArray('Products', $product);
        }

        return $res->withJson(['list' => $retArray]);

    }


    public function getTreeNodes(Request $req, Response $res, array $args): Response {
        $list = [];

        // get an instance of the module handler
        $moduleHandler = new ModuleHandler();

        // a seed bean for the list
        $seed = BeanFactory::getBean('ProductGroups');

        // build the where clause
        $whereClause = '';
        if($args['nodeid']){
            $whereClause = "productgroups.parent_productgroup_id = '{$args['nodeid']}'";
        } else {
            $whereClause = "(productgroups.parent_productgroup_id = '' OR productgroups.parent_productgroup_id IS NULL)";
        }

        // process the seed list
        $seedList = $seed->get_full_list('name', $whereClause);
        foreach ($seedList as $seeditem){
            $list[] = $moduleHandler->mapBeanToArray('ProductGroups', $seeditem);
        }

        return $res->withJson($list);
    }

    /**
     * links validation values to a product
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     * @throws NotFoundException
     */

    public function ProductWriteValidation(Request $req, Response $res, array $args): Response{
        $resthandler = new ModuleHandler();

        $group = BeanFactory::getBean('ProductGroups');
        $group->retrieve($args['id']);

        $attributes = $group->getProductAttributes();
        $attributes_mapped = [];
        foreach ($attributes as $v) {

            $dummy = $resthandler->mapBeanToArray('ProductAttribute', $v);
            if ($validations = $v->get_linked_beans('productattributevaluevalidations', 'ProductAttributeValueValidation')) {
                $dummy['validations'] = [];
                foreach ($validations as $v2) {
                    $dummy['validations'][] = ['value' => $v2->value, 'value_from' => $v2->value_from, 'value_to' => $v2->value_to];
                }
            }
            $attributes_mapped[] = $dummy;

        }

        return $res->withJson($attributes_mapped);

    }

    /**
     * get the related attributes of a product
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     * @throws NotFoundException
     */

    public function ProductGetRelatedAttributes(Request $req, Response $res, array $args): Response{
        $db = DBManagerFactory::getInstance();

        $getParams = $req->getQueryParams();

        $group = BeanFactory::getBean('ProductGroups');
        $group->retrieve($args['id']);

        $attributes = $group->getRelatedAttributesRecursively($getParams['searchparams'] == 'true' ? true : false);
        if ($getParams['validations'] !== false) {
            foreach ($attributes as &$attribute) {
                $validations = $db->query("SELECT value, value_from, value_to FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '" . $attribute['id'] . "'");
                while ($validation = $db->fetchByAssoc($validations)) {
                    $attribute['validations'][] = $validation;
                }
            }
        }

        return $res->withJson($attributes);
    }

    /**
     * changes text datatypes to another
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function productParseTextDataType(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess('ProductGroups', 'view', true)) {
            throw ( new ForbiddenException('Forbidden to view in module ProductGroups'))
                ->setErrorCode('noModuleView');
        }

        $group = BeanFactory::getBean('ProductGroups', $args['id']);
        if (!isset($group->id)) {
            throw ( new NotFoundException('ProductGroup not found.'))
                ->setLookedFor(['id'=>$args['id'],'module'=>'ProductGroups']);
        }

        $groups = $group->getParentGroupsV2();

        $attributes = [];

        $attributesObj = $db->query("SELECT productattributes.id, productattributes.name, productattributes.prat_datatype , contentcode, contentcode2, contentprefix, trptgcontentcodeassignments.productgroup_id  FROM trptgcontentcodeassignments, productattributes WHERE trptgcontentcodeassignments.productattribute_id = productattributes.id AND productgroup_id IN ('" . implode("','", $groups) . "')");
        while ($attribute = $db->fetchByAssoc($attributesObj)) {
            if ($attribute['prat_datatype'] == 'S' || $attribute['prat_datatype'] == 'D') {
                $attribute['values'] = new stdClass();
                $attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '{$attribute['id']}' AND valueshort IS NOT NULL");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $attribute['values']->{$attributesValue['value']} = $attributesValue['valueshort'];
                }
            }
            $attributes[$attribute['id']] = $attribute;
        }

        return $res->withJson([
            'assignedattributes' => $attributes,
            'allattributes'      => $group->getRelatedAttributesRecursively(false),
            'template'           => SpiceConfig::getInstance()->config['EpimIntegration']['shortTextTemplate'],
            'shorttext'          => $group->getSorParam()
        ]);
    }

    /**
     * writes a textbody in the database
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function productWriteTextProductBody(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess('ProductGroups', 'view', true)) {
            throw ( new ForbiddenException('Forbidden to view in module ProductGroups.'))
                ->setErrorCode('noModuleView');
        }

        $seed = BeanFactory::getBean('ProductGroups', $args['id']);
        if (!isset($seed->id)) {
            throw ( new NotFoundException('ProductGroup not found.'))
                ->setLookedFor(['id'=>$args['id'],'module'=>'ProductGroups']);
        }

        $postBody = $req->getParsedBody();

        if ($postBody) {
            $db->query("DELETE FROM trptgcontentcodeassignments WHERE productgroup_id='{$args['id']}'");
            foreach ($postBody as $record) {
                $db->query("INSERT INTO trptgcontentcodeassignments (id, productgroup_id, productattribute_id, contentcode, contentcode2, contentprefix ) VALUES('".SpiceUtils::createGuid()."', '{$args['id']}', '{$record['id']}', '{$record['contentcode']}', '{$record['contentcode2']}', '{$record['contentprefix']}')");
            }
        }

        return $res->withJson(['status' => 'success']);
    }

    /**
     * changes longtext datatypes to another
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function productParseLongTextDataType(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess('ProductGroups', 'view', true))
            throw ( new ForbiddenException('Forbidden to view in module ProductGroups.'))->setErrorCode('noModuleView');

        $group = BeanFactory::getBean('ProductGroups', $args['id']);
        if (!isset($group->id)) throw ( new NotFoundException('ProductGroup not found.'))->setLookedFor(['id'=>$args['id'],'module'=>'ProductGroups']);

        $groups = $group->getParentGroupsV2();

        $attributes = [];

        $attributesObj = $db->query("SELECT productattributes.id, productattributes.name, productattributes.prat_datatype , contentcode, contentcode2, textpattern, sequence, trptglongtextcodeassignments.productgroup_id  FROM trptglongtextcodeassignments, productattributes WHERE trptglongtextcodeassignments.productattribute_id = productattributes.id AND productgroup_id IN ('" . implode("','", $groups) . "')");
        while ($attribute = $db->fetchByAssoc($attributesObj)) {
            if ($attribute['prat_datatype'] == 'S' || $attribute['prat_datatype'] == 'D') {
                $attribute['values'] = new stdClass();
                $attributesValues = $db->query("SELECT value, valueshort FROM productattributevaluevalidations WHERE deleted != 1 AND productattribute_id = '{$attribute['id']}' AND valueshort IS NOT NULL");
                while ($attributesValue = $db->fetchByAssoc($attributesValues)) {
                    $attribute['values']->{$attributesValue['value']} = $attributesValue['valueshort'];
                }
            }
            $attributes[$attribute['id']] = $attribute;

        }

        return $res->withJson([
            'assignedattributes' => $attributes,
            'allattributes' => $group->getRelatedAttributesRecursively(false),
            'template' => SpiceConfig::getInstance()->config['EpimIntegration']['shortTextTemplate'],
            'shorttext' => $group->getSorParam()
        ]);
    }

    /**
     * inserts a new longtext body in the database
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function productWriteLongTextProductBody(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        // acl check if user can get the detail
        if (!SpiceACL::getInstance()->checkAccess('ProductGroups', 'view', true)) {
            throw ( new ForbiddenException('Forbidden to view in module ProductGroups.'))->setErrorCode('noModuleView');
        }

        $seed = BeanFactory::getBean('ProductGroups', $args['id']);
        if (!isset($seed->id)) {
            throw ( new NotFoundException('ProductGroup not found.'))->setLookedFor(['id'=>$args['id'],'module'=>'ProductGroups']);
        }

        $postBody = $req->getParsedBody();

        if ($postBody) {
            $db->query("DELETE FROM trptglongtextcodeassignments WHERE productgroup_id='{$args['id']}'");
            foreach ($postBody as $record) {
                $db->query("INSERT INTO trptglongtextcodeassignments (id, productgroup_id, productattribute_id, contentcode, contentcode2, textpattern, sequence ) VALUES('".SpiceUtils::createGuid()."', '{$args['id']}', '{$record['id']}', '{$record['contentcode']}', '{$record['contentcode2']}', '{$record['textpattern']}', '{$record['sequence']}')");
            }
        }

        return $res->withJson(['status' => 'success']);
    }

}


