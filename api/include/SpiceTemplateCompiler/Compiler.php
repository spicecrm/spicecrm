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

namespace SpiceCRM\includes\SpiceTemplateCompiler;

use DateInterval;
use DateTime;
use DateTimeZone;
use DOMDocument;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\includes\authentication\AuthenticationController;

// CR1000360

/*
 * a class to compile templates. used in EmailTemplates and OutputTemplates...
 *
 * this allows logic in html templates to be parsed.
 *
 * parse variables:
 *   <p>this is the account {bean.name} with contact {bean.contacts.first_name}</p>
 *   typical starting point is bean but can also be current_user or system for system functions
 *   on the bean the value can be an object value or a method to be called
 *
 * loop through arrays with data-spicefor
 *      <table style="height: 64px;" width="100%">
 *          <tbody>
 *              <tr data-spicefor="bean.contacts as contact">
 *                  <td style="width: 33%;">{contact.first_name}</td>
 *                  <td style="width: 33%;">{contact.last_name}</td>
 *                  <td style="width: 33%;">{contact.email1}</td>
 *              </tr>
 *          </tbody>
 *      </table>
 *
 *      add spoicefor as an attribute to add a loop
 *
 * add conditions with data-spiceif
 *      <p data-spiceif="bean.industry == 'Chemicals'">a chemicals customer</p>
 *
 */



class Compiler
{
    var $additionalValues;
    var $doc;
    var $root;
    var $lang;

    public function __construct()
    {
        $this->initialize();
    }

    private function initialize(){
        $this->doc = new DOMDocument('1.0');
        $this->root = $this->doc->appendChild( $this->doc->createElement('html') );
    }

    public function compile($txt, $bean = null, $lang = 'de_DE', array $additionalValues = null)
    {
        $this->additionalValues = $additionalValues;
        $this->lang = $lang;

        $dom = new DOMDocument();
        $html = preg_replace("/\n|\r|\t/", "", html_entity_decode($txt, ENT_QUOTES));
        $dom->loadHTML('<?xml encoding="utf-8"?>' . $html );

        $dummy = $dom->getElementsByTagName('html');
        foreach( $this->parseDom( $dummy[0], ['bean' => $bean] ) as $newElement ){
            $this->root->appendChild($newElement);
        };
        return $this->doc->saveHTML();
    }

    private function parseDom($thisNode, $beans = []){
        $elements = [];
        foreach ($thisNode->childNodes as $node)
        {
            switch(get_class($node)){
                case 'DOMDocumentType':
                    $this->parseDom($node, $beans);
                    break;

                case 'DOMCdataSection':
                    $newElement = $this->doc->createCDATASection($node->data);
                    $elements[] = $newElement;
                    break;
                case 'DOMText':
                    $elementcontent = $this->compileblock($node->textContent, $beans, $this->lang);
                    // check if we have embedded HTML that is returned from the replaceing functions
                    // ToDo: check if there is not a nice way to do this
                    if(strip_tags($elementcontent) != $elementcontent) {
                        $elementdom = new DOMDocument();
                        $elementhtml = preg_replace("/\n|\r|\t/", "", html_entity_decode($elementcontent, ENT_QUOTES));
                        $elementdom->loadHTML('<?xml encoding="utf-8"?><embedded>'.$elementhtml.'</embedded>');
                        $embeddednode = $elementdom->getElementsByTagName('embedded');
                        $elements[] = $this->createNewElement($embeddednode[0], $beans);
                    } else {
                        $newElement = $this->doc->createTextNode($elementcontent);
                        $elements[] = $newElement;
                    }
                    break;
                case 'DOMComment':
                    // no takeover of comments
                    break;
                case 'DOMElement':
//                    $newElement = $this->doc->createElement($node->tagName);

                    // check spiceif, spicefor
                    if($node->getAttribute('data-spiceif')){
                        $spiceif = $node->getAttribute('data-spiceif');
                        if ($this->processCondition($spiceif, $beans)) {
                            $elements[] = $this->createNewElement($node, $beans);
                        }
                    } else if($node->getAttribute('data-spicefor')){
                        $spicefor = $node->getAttribute('data-spicefor');

                        // CR1000360
                        // split looking for pipes
                        $attributeParts = preg_split("/(\|)/", $spicefor);
                        $countParts = count($attributeParts);
                        $params = [];

                        // scenario 1: we have 1 parts only. This means NO additional parameters
                        // $attributeParts[0] = bean.linkname as linkedbean (the full haystack returned when no match)
                        if($countParts == 1){
                            $forArray = explode(" as ", $attributeParts[0]);
                        }

                        // scenario 2: we have 3 parts. This means additional parameters
                        // CR1000360 check on params (like filter)
                        // $attributeParts[0] = bean.linkname
                        // $attributeParts[1] = some_urlencode_sring (the string between the pipes)
                        // $attributeParts[2] = as linkedbean
                        if($countParts == 3){
                            // string " as linkedbean" to "linkedbean"
                            $attributeParts[2] = substr($attributeParts[2], 4, strlen($attributeParts[2]));
                            $forArray = [$attributeParts[0], $attributeParts[2]];
                            $params = $this->parsePipeToArray($attributeParts[1]);
                        }

                        $linkedBeans = $this->getLinkedBeans($forArray[0], NULL, $beans, $params); // CR1000360 added $params
                        foreach ($linkedBeans as $linkedBean) {
                            $elements[] = $this->createNewElement($node, array_merge($beans, [$forArray[1] => $linkedBean]));
                            // $response .= $this->processBlocks($this->getBlocks($contentString), array_merge($beans, [$forArray[1] => $linkedBean]), $lang);
                        }
                        break;
                    } else {
                        $elements[] = $this->createNewElement($node, $beans);
                    }
                    break;
                default:
                    die(get_class($node));
            }
        }
        return $elements;
    }

    private function createNewElement($thisElement, $beans){
        $newElement = $this->doc->createElement($thisElement->tagName);
        if($thisElement->hasAttributes()){
            foreach($thisElement->attributes as $attribute){
                switch($attribute->nodeName){
                    case 'data-spicefor':
                    case 'data-spiceif':
                        break;
                    default:
                        $newAttribute = $this->doc->createAttribute($attribute->nodeName);
                        $newAttribute->value = $this->compileblock($attribute->nodeValue, $beans, $this->lang);
                        $newElement->appendChild($newAttribute);
                }
            }
        }
        foreach($this->parseDom($thisElement, $beans) as $newChild){
            $newElement->appendChild($newChild);
        }
        return $newElement;
    }

    /**
     * recursive function to explode a locator string and return an aray of beans following the path
     *
     * @param $locator the string to find the link e.g. bean.contacts.calls
     * @param $obj
     * @param $beans the current set of beans in teh scope of the locator string
     * @param $params Array additional parameters to pass to get_linked_beans()
     * @return array of beans
     */
    private function getLinkedBeans($locator, $obj = NULL, $beans = [], $params = [])
    {
        $parts = explode('.', $locator);

        // if we do not have an object we try to resolve it
        if (!$obj) {
            $obj = $this->getObject($parts[0], $beans);
        }
        // if we do not find it return an empty object
        if (!$obj) return [];

        // check that the field is a link
        if ($obj->field_defs[$parts[1]]['type'] != 'link') return [];

        $obj->load_relationship($parts[1]);
        $relModule = $obj->{$parts[1]}->getRelatedModuleName();

        // CR1000360 additional params for get_linked_beans
        $sort_array = [];
        if(isset($params['sort_array'])) {
            $sort_array = array_merge($sort_array, $params['sort_array']);
        }
        $begin_index = 0;
        if(isset($params['begin_index'])) {
            $begin_index = $params['begin_index'];
        }

        // end_index is deprecated. Keep for compatibility with older Templates
        $end_index = -1;
        $limit = -1;
        if(isset($params['end_index'])) {
            $limit = $params['end_index'];
        }
        if(isset($params['limit'])) {
            $limit = $params['limit'];
        }

        $deleted = 0;
        if(isset($params['deleted'])) {
            $deleted = $params['deleted'];
        }
        $optional_where = '';
        if(isset($params['filter']) && !empty($params['filter'])) {
            $filter = new SysModuleFilters();

            if(isset($params['filterparams']) && $params['filterparams'] > 0){
                $optional_where = $filter->generareWhereClauseForFilterId($params['filter'], '', $obj);
            }
            else{
                $optional_where = $filter->generareWhereClauseForFilterId($params['filter']);
            }
        }

        $linkedBeans = $obj->get_linked_beans($parts[1], $relModule, $sort_array, $begin_index, $limit, $deleted, $optional_where); // CR1000360 added optional_where

        if (count($parts) > 2) {
            $deepLinkedBeans = [];
            foreach ($linkedBeans as $linkedBean) {
                $deepLinkedBeans = array_merge($deepLinkedBeans, $this->getLinkedBeans(implode('.', array_shift($parts)), $linkedBean));
            }
            return $deepLinkedBeans;
        } else {
            return $linkedBeans;
        }
    }

    private function processCondition($condition, $beans)
    {

        // match regular operators
        // preg_match_all('/[\!<>=\/\*]+/', html_entity_decode($condition), $operators);

        // if we match none or more than one operator this cannot be true and return false
        //if(count($operators) != 1) return false;

        $conditionparts = explode(' ', $condition);
        switch ($conditionparts[1]) {
            case '>':
                return $this->getValue($conditionparts[0], $beans, true) > trim($conditionparts[2], "'");
                break;
            case '>=':
                return $this->getValue($conditionparts[0], $beans, true) >= trim($conditionparts[2], "'");
                break;
            case '<':
                return $this->getValue($conditionparts[0], $beans, true) < trim($conditionparts[2], "'");
                break;
            case '<=':
                return $this->getValue($conditionparts[0], $beans, true) <= trim($conditionparts[2], "'");
                break;
            case '===':
                return $this->getValue($conditionparts[0], $beans, true) === trim($conditionparts[2], "'");
                break;
            case '==':
                return $this->getValue($conditionparts[0], $beans, true) == trim($conditionparts[2], "'");
                break;
            case '!=':
                return $this->getValue($conditionparts[0], $beans, true) != trim($conditionparts[2], "'");
                break;
        }
        return false;

    }

    /**
     * @param $locator
     * @param $beans
     * @param bool $keepFetchedRowValue // parameter added for CR1000371: enum value shall remain raw value when used in a condition. See processCondition()
     * @return mixed|string
     */
    private function getValue($locator, $beans, $keepFetchedRowValue = false)
    {
        $parts = explode('.', $locator);
        $part = $parts[0];

        // get the object
        $obj = $this->getObject($part, $beans);
        if (!$obj) return '';

        /**
         * loop recursively through the parts to load relations and return the last part of it
         * {bean.product.publisher.name}
         *  bean ->
         *      product = link -> load product ->
         *          publisher = link -> load publisher ->
         *              name = attribute -> return value;
         */
        $loopThroughParts = function ($obj, $level = 0, $keepFetchedRowValue) use (&$parts, &$loopThroughParts) {
            global $app_list_strings;

            $part = $parts[$level];
            if (is_callable([$obj, $part])) {
                $value = $obj->{$part}();
            } else {
                $field = $obj->field_defs[$part];
                switch ($field['type']) {
                    case 'link':
                        $next_bean = $obj->get_linked_beans($field['name'], $field['bean_name'])[0];
                        if ($next_bean) {
                            $level++;
                            return $loopThroughParts($next_bean, $level, $keepFetchedRowValue);
                        } else {
                            $value = '';
                        }
                        break;
                    case 'relate':
                        $next_bean = BeanFactory::getBean($obj->field_defs[$part]['module'], $obj->{$obj->field_defs[$part]['id_name']});
                        if ($next_bean) {
                            $level++;
                            return $loopThroughParts($next_bean, $level);
                        } else {
                            $value = '';
                        }
                        break;
                    case 'enum':
                        $value = $obj->{$part};
                        if(!$keepFetchedRowValue) {
                            $value = $app_list_strings[$obj->field_defs[$part]['options']][$obj->{$part}];
                        }
                        break;
                    case 'multienum':
                        $value = $obj->{$part};
                        if(!$keepFetchedRowValue) {
                            $values = explode(',', $obj->{$part});
                            foreach ($values as &$value) {
                                $value = trim($value, '^');
                                $value = $app_list_strings[$obj->field_defs[$part]['options']][$value];
                            }
                            $value = implode(', ', $values);
                            // unencodeMultienum can't be used because of a different language...
                            //$value = implode(', ', unencodeMultienum($obj->{$parts[$level]}));
                        }
                        break;
                    default:
                        $value = $obj->{$part};
                        break;
                }
            }
            return $value;
        };

        return $loopThroughParts($obj, 1, $keepFetchedRowValue );
    }

    private function getObject($object, $beans)
    {

        switch ($object) {
            case 'current_user':
                $obj = AuthenticationController::getInstance()->getCurrentUser();
                break;
            case 'system':
                $obj = new System();
                break;
            case 'value':
                $obj = (object)$this->additionalValues;
                break;
            default:
                $obj = $beans[$object];
        }

        return $obj ?: false;
    }

    public function compileblock($txt, $beans = [], $lang = 'de_DE', array $additionalValues = null)
    {
        global $current_language, $app_list_strings;
$current_user = AuthenticationController::getInstance()->getCurrentUser();
        // overwrite the current app_list_strings to the language of the template...
        $app_list_strings = return_app_list_strings_language($lang);


        // if (preg_match_all("#\{([abcelmnrstuvy_]+[\.|])([^}]*)\}#", $txt, $matches)) {
        if (preg_match_all("#\{([a-zA-Z\.\_0-9]+)\}#", $txt, $matches)) {
            for ($i = 0; $i < count($matches[1]); $i++) {
                $m = $matches[1][$i];

                // match the pipes parameters by
                // (["'])((\\{2})*|(.*?[^\\](\\{2})*))\1

                $parts = explode('.', $m);
                $part = $parts[0];

                // get the object
                $obj = $this->getObject($part, $beans);
                if (!$obj) continue(1);

                /**
                 * loop recursively through the parts to load relations and return the last part of it
                 * {bean.product.publisher.name}
                 *  bean ->
                 *      product = link -> load product ->
                 *          publisher = link -> load publisher ->
                 *              name = attribute -> return value;
                 */
                $loopThroughParts = function ($obj, $level = 0) use (&$parts, &$loopThroughParts) {
                    global $app_list_strings;
                    $part = $parts[$level];
                    if (is_callable([$obj, $part])) {
                        $value = $obj->{$part}();
                    } else {
                        $field = $obj->field_defs[$part];
                        switch ($field['type']) {
                            case 'link':
                                $next_bean = $obj->get_linked_beans($field['name'], $field['bean_name'])[0];
                                if ($next_bean) {
                                    $level++;
                                    return $loopThroughParts($next_bean, $level);
                                } else {
                                    $value = '';
                                }
                                break;
                            case 'enum':
                                $value = $app_list_strings[$obj->field_defs[$part]['options']][$obj->{$part}];
                                break;
                            case 'multienum':
                                $values = explode(',', $obj->{$part});
                                foreach ($values as &$value) {
                                    $value = trim($value, '^');
                                    $value = $app_list_strings[$obj->field_defs[$part]['options']][$value];
                                }
                                $value = implode(', ', $values);
                                // unencodeMultienum can't be used because of a different language...
                                //$value = implode(', ', unencodeMultienum($obj->{$parts[$level]}));
                                break;
                            case 'date':
                                if(!empty($obj->{$part})){
                                    //set to user preferences format
                                    $userTimezone = new DateTimeZone(AuthenticationController::getInstance()->getCurrentUser()->getPreference("timezone"));
                                    $gmtTimezone = new DateTimeZone('GMT');
                                    $myDateTime = new DateTime($obj->{$part}, $gmtTimezone);
                                    $offset = $userTimezone->getOffset($myDateTime);
                                    $myInterval = DateInterval::createFromDateString((string)$offset . 'seconds');
                                    $myDateTime->add($myInterval);
                                    $value = $myDateTime->format(AuthenticationController::getInstance()->getCurrentUser()->getPreference("datef"));
                                } else {
                                    $value = '';
                                }
                                break;
                            case 'datetime':
                            case 'datetimecombo':
                                if(!empty($obj->{$part})){
                                    //set to user preferences format
                                    $userTimezone = new DateTimeZone(AuthenticationController::getInstance()->getCurrentUser()->getPreference("timezone"));
                                    $gmtTimezone = new DateTimeZone('GMT');
                                    $myDateTime = new DateTime($obj->{$part}, $gmtTimezone);
                                    $offset = $userTimezone->getOffset($myDateTime);
                                    $myInterval = DateInterval::createFromDateString((string)$offset . 'seconds');
                                    $myDateTime->add($myInterval);
                                    $value = $myDateTime->format(AuthenticationController::getInstance()->getCurrentUser()->getPreference("datef")." ". AuthenticationController::getInstance()->getCurrentUser()->getPreference("timef"));
                                } else {
                                    $value = '';
                                }
                                break;
                            case 'time':
                                if(!empty($obj->{$part})){
                                    //set to user preferences format
                                    $userTimezone = new DateTimeZone(AuthenticationController::getInstance()->getCurrentUser()->getPreference("timezone"));
                                    $gmtTimezone = new DateTimeZone('GMT');
                                    $myDateTime = new DateTime($obj->{$part}, $gmtTimezone);
                                    $offset = $userTimezone->getOffset($myDateTime);
                                    $myInterval = DateInterval::createFromDateString((string)$offset . 'seconds');
                                    $myDateTime->add($myInterval);
                                    $value = $myDateTime->format(AuthenticationController::getInstance()->getCurrentUser()->getPreference("timef"));
                                } else {
                                    $value = '';
                                }
                                break;
                            case 'currency':
                                // $currency = \SpiceCRM\data\BeanFactory::getBean('Currencies');
                                $value = currency_format_number($obj->{$part}, ['symbol_space' => true] );
                                break;
                            case 'html':
                                $value = html_entity_decode($obj->{$part});
                                break;
                            case 'image':
                                if ( !empty( $obj->{$part} )) {
                                    $value = '<img src="data:'.$obj->{$part}.'" style="max-width:100%;max-height:100%;margin:0">';
                                }
                                break;
                            default:
                                // moved nl2br to only be added when non specific fields are parsed
                                $value = nl2br(html_entity_decode($obj->{$part}, ENT_QUOTES));
                                break;
                        }
                    }
                    return $value;
                };

                $value = $loopThroughParts($obj, 1);
                $txt = str_replace($matches[0][$i], $value, $txt);
            }
        }
        // remove unresolved placeholders...
        //$txt = preg_replace("#\{([a-z\.\_0-9]+)\}#", "", $txt);
        $txt = preg_replace("#='(.*?)'#", '="$1"', $txt);
        // set the current app_list_strings back to the current language...
        $app_list_strings = return_app_list_strings_language($current_language);

        return $txt;
    }

    /**
     * CR1000360 parse additional parameters passed in attribute
     * Passed after pipe, using syntax key:value&key2:value2 ...
     * value2 may be an urlencoded string to be able to pass json string like for sort_array
     * example: data-spicefor="data-spicefor="account.salesdocs|filter:bddabddb-d13b-6594-90f6-a77af30be45f&limit:10&sort_array:%7B%22sortfield%22%3A%22salesdocnumber%22%2C%22sortdirection%22%3A%22desc%22%7D as salesdoc"
     * @param $str
     * @return array
     */
    private function parsePipeToArray($str) {
        $parsed = [];
        $pairs = explode("&", $str);
        foreach($pairs as $pair){
            $pairvalue = explode(":", $pair);
            $parsed[$pairvalue[0]] = urldecode($pairvalue[1]);
            if($json = json_decode($parsed[$pairvalue[0]], true)){
                $parsed[$pairvalue[0]] = $json;
            }
        }
        return $parsed;
    }
}
