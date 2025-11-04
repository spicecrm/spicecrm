<?php
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

namespace SpiceCRM\includes\SugarObjects;

use FilesystemIterator;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\utils\FileUtils;
use SpiceCRM\includes\utils\SpiceFileUtils;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * @deprecated
 *
 * Vardefs management
 * @api
 */
class VardefManager{

    /**
     * @deprecated
     *
     * this method is called within a vardefs.php file which extends from a SugarObject.
     * It is meant to load the vardefs from the SugarObject.
     */
    static function createVardef($module, $object, $templates = ['default'])
    {
        $handler = SpiceDictionaryHandler::getInstance();
        $vardefs = ['fields' => [], 'relationships' => [], 'indices' => []];

        foreach ($templates as $template) {

            $templateVardefs = self::getTemplateVardefs($module, $object, $template);

            $vardefs['fields'] = array_merge($vardefs['fields'], $templateVardefs['fields']);
            $vardefs['relationships'] = array_merge($vardefs['relationships'], $templateVardefs['relationships']);
            $vardefs['indices'] = SpiceDictionaryVardefs::mergeIndices($vardefs['indices'], $templateVardefs['indices']);

            # maintain a record of this objects inheritance from the SugarObject templates
            $handler->dictionary[$object]['templates'][$template] = $template;
        }

        self::updateDictionaryVardefs($vardefs, $object);
    }

    /**
     * update dictionary vardefs from the passed vardefs e.g. template vardefs
     * @param $vardefs
     * @param $object
     * @return void
     */
    static public function updateDictionaryVardefs($vardefs, $object)
    {
        $handler = SpiceDictionaryHandler::getInstance();

        $handler->dictionary[$object]['fields'] = array_merge($vardefs['fields'], $handler->dictionary[$object]['fields'] ?? []);
        $handler->dictionary[$object]['relationships'] = array_merge($vardefs['relationships'], $handler->dictionary[$object]['relationships'] ?? []);
        $handler->dictionary[$object]['indices'] = SpiceDictionaryVardefs::mergeIndices($vardefs['indices'], $handler->dictionary[$object]['indices'] ?? []);
    }

    /**
     * get template vardefs
     * @param $module
     * @param $object
     * @param $template
     * @return array|array[]
     */
    static function getTemplateVardefs($module, $object, $template): array
    {
        global $vardefs;

        if ($template == 'default') $template = 'basic';

        $fields = [];

        $object_name = strtolower($object);
        $table_name = SpiceDictionaryHandler::getInstance()->dictionary[$object]['table'] ?? strtolower($module);

        $path = SpiceUtils::getCustomFileIfExists("include/SugarObjects/templates/$template/vardefs.php");

        if (file_exists($path)) {
            require($path);
            $templateVardefs = $vardefs;
        } else {
            $path = SpiceUtils::getCustomFileIfExists("include/SugarObjects/implements/$template/vardefs.php");

            if (file_exists($path)) {
                require($path);
                $templateVardefs = $vardefs;
            }
        }

        if (empty($templateVardefs)) {
            return ['fields' => [], 'relationships' => [], 'indices' => []];
        }

        return [
            'fields' => $templateVardefs['fields'] ?? [],
            'relationships' => $templateVardefs['relationships'] ?? [],
            'indices' => $templateVardefs['indices'] ?? [],
        ];
    }

    /**
     * legacy code
     * 
     * add template directly to dictionary
     * @param $module
     * @param $object
     * @param $template
     * @return void
     */
    static public function addTemplate($module, $object, $template)
    {
        $vardefs = self::getTemplateVardefs($module, $object, $template);
        self::updateDictionaryVardefs($vardefs, $object);
    }

    /**
     * add template directly to dictionary
     * @param $module
     * @param $object
     * @param $template
     * @return array[]
     */
    static public function getTemplateForDictionary($module, $object, $template): array
    {
        return self::getTemplateVardefs($module, $object, $template);
    }
}
