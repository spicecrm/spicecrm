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

namespace SpiceCRM\modules\Inquiries\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;

class InquiriesController
{

    /**
     * @param $req
     * @param $res
     * @param $args
     */
    public function getCatalogs(Request $req, Response $res, array $args): Response {
        

        if(!SpiceConfig::getInstance()->config['catalogorders']['productgroup_id']) return [];

        $group = BeanFactory::getBean('ProductGroups', SpiceConfig::getInstance()->config['catalogorders']['productgroup_id']);

        $products = [];
        $group->load_relationship('products');
        $relatedProducts = $group->get_linked_beans('products', 'Products', [], 0, 100, 0, "product_status = 'active'");
        foreach ($relatedProducts as $relatedProduct) {
            $products[] = [
                'id' => $relatedProduct->id,
                'name' => html_entity_decode($relatedProduct->name, ENT_QUOTES),
                'external_id' => $relatedProduct->ext_id
            ];
        }
        return $res->withJson($products);
    }

    /**
     * create from avada Form in wordpress
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function createFromAvada(Request $req, Response $res, array $args): Response {

        // get the body and parse the params
        $req->getBody()->rewind();
        $params = $req->getBody()->getContents();

        $queryArray = [];
        parse_str($params,$queryArray);

        if(empty($queryArray['form_id'])){
            throw new BadRequestException('missing data');
        }

        if($queryArray['recaptcha_challenge_field'] == 'explicit' && $queryArray['recaptcha_response_field']){
            throw new BadRequestException('missing data');
        }

        $seed = BeanFactory::getBean($args['module']);
        foreach($seed->field_defs as $fieldname => $fielddata){
            if(isset($queryArray[$fieldname])){
                $seed->{$fieldname} = $queryArray[$fieldname];
            }
        }

        $seed->requested_date = TimeDate::getInstance()->nowDb();
        $seed->inquiry_source = 'web';
        $seed->inquiry_type = 'normal';
        $seed->status = 'new';
        $seed->inquiry_source_url = $queryArray['source_url'];

        $seed->save();

        return $res->withJson(['status' => 'OK']);

    }
}
