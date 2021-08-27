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

/**
 * Class SpiceLanguageLoader
 * Utility class for SpiceCRM backend
 * get language labels and translations from reference database
 * Database credentials are located in config.php
 */

namespace SpiceCRM\includes\SpiceLanguages;
use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Configurator\Configurator;
use SpiceCRM\includes\SpiceUI\SpiceUILoader;

class SpiceLanguageLoader{

    public $loader;
    public $routebase = 'config/language'; // the common part in endpoint after domain url itself

    public function __construct($endpoint = null){
        $this->loader = new SpiceUILoader($endpoint);
    }

    /**
     * load language from referenced database
     * @param $language
     * @return array
     * @throws Exception
     */
    public function loadLanguage($language){
        // $route = "referencelanguage";
        $package = '*';

        $route = implode("/", [$this->routebase, $language, $package, '*']);

        $results = $this->loadDefaultConf($route, ['route' => $this->routebase, 'languages' => $language], false);
        //BEGIN CR1000150: set \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['syslanguages']['spiceuisource'] to 'db'
        if($results['success']){
            if(!class_exists('Configurator', false)){
                require_once 'modules/Configurator/Configurator.php';
            }
            $configurator = new Configurator();
            $configurator->loadConfig();
            $configurator->config['syslanguages']['spiceuisource'] = 'db';
            $configurator->saveConfig();
        }
        //END
        return $results;
    }

    /**
     * delete language translations and system_language flag
     * for a given language
     * @param $language
     * @return bool
     */
    public function deleteLanguage($language){
        $db = DBManagerFactory::getInstance();

        // remove Translations
        $delWhere = ['syslanguage' => $language];
        $db->deleteQuery('syslanguagetranslations', $delWhere);

        // set as non system language
        $updateWhere = ['language_code' => $language];
        $updateFields = ['system_language' => 0, 'is_default' => 0];
        $db->updateQuery('syslangs', $updateWhere, $updateFields);

        return true;
    }

    /**
     * load language labels and translations from reference database
     * @param $route
     * @param $params
     */
    public function loadDefaultConf($route, $params, $checkopen = true){
        $db = DBManagerFactory::getInstance();
        $inserts = [];
        $errors = [];
        $syslangs = [];
        $success = false;

        if($checkopen && $this->loader->hasOpenChangeRequest())
            throw new Exception("Open Change Requests found! Action aborted. They would be erased...");

        if(!$response = $this->loader->callMethod("GET", $route)){
            //die("REST Call error somewhere... Action aborted");
            throw new Exception("REST Call error somewhere... Action aborted");
        }

        // reponse looks like
        //Array(
        //    [0] => {"id":"fc9701db-dacb-46b1-a10d-90e182783b39","name":"LBL_PRECONDITION","translation_default":"Voraussetzung","translation_short":"","translation_long":""}
        //    [1] => {"id":"f8ef0006-cea9-4c17-babe-38db5be5c99a","name":"MSG_INPUT_REQUIRED","translation_default":"Eingabe ist erforderlich","translation_short":"","translation_long":""}
        //)
        //id is label ID
        //name is label name
        //translation_default _short _long is tranlation for label
        //get tables information
        $tb_labels = 'syslanguagelabels';
        $tb_trans = 'syslanguagetranslations';

        //delete old translations for selected language: translations without the label since delete above
        $languages = explode(',', $params['languages']);
        // ORACLE COMPATIBILITY -
        $delQ = "DELETE FROM $tb_trans WHERE $tb_trans.syslanguage IN ('".implode("','", $languages)."')";
        $db->query($delQ);

        // get labels that are already loaded
        $labelIDs = [];
        $qL = "SELECT id FROM $tb_labels";
        if($resL = $db->query($qL)){
            while($rowL = $db->fetchByAssoc($resL)){
                $labelIDs[] = $rowL['id'];
            }
        }

        foreach($response as $index => $content) {
            $decodeData = json_decode($content, true);
            //insert command label
            if(!in_array($decodeData['id'], $labelIDs)) {
                $labelIDs[] = $decodeData['id'];
                //run insert
                $entryL = [
                    'id' => $decodeData['id'],
                    'name' => $decodeData['name'],
                ];

                if($dbRes = $db->insertQuery($tb_labels, $entryL)){
                    $inserts[] = $dbRes;
                } else{
                    $errors[] = $db->lastError();
                }
            }
            //insert command translation
            $entryT = [
                'id' => create_guid(),
                'syslanguagelabel_id' => $decodeData['id'],
                'syslanguage' => $decodeData['syslanguage'],
                'translation_default' => $decodeData['translation_default'],
                'translation_short' => $decodeData['translation_short'],
                'translation_long' => $decodeData['translation_long']
            ];

            //run insert
            if($dbRes = $db->insertQuery($tb_trans, $entryT)){
                $inserts[] = $dbRes;
            } else{
                $errors[] = $db->lastError();
            }
        }

        //if no inserts where created => abort
        if(count($inserts) < 1){
            //die("No inserts found. Action aborted.");
            throw new Exception("REST Call error somewhere... Action aborted");
        }

        if(count($errors) > 1){
            LoggerManager::getLogger()->fatal(__CLASS__."::".__FUNCTION__."() Errors:".print_r($errors, true));
        }
        else {
            $success = true;
            //check if language is available
            $syslangstatus = DBManagerFactory::getInstance()->query("SELECT * from syslangs 
                  WHERE language_code IN ('".implode("','", $languages)."') 
                  ORDER BY sort_sequence ASC");
            while($syslangrow = DBManagerFactory::getInstance()->fetchByAssoc($syslangstatus)){
                $syslangs[$syslangrow['language_code']] = $syslangrow;
            }
            for($i = 0; $i < count($languages); $i++){
                if(in_array($languages[$i], array_keys($syslangs))){
                    $updateWhere = ['language_code' => $languages[$i]];
                    $updateFields = ['system_language' => 1];
                    $db->updateQuery('syslangs', $updateWhere, $updateFields);
                    $syslangs[$languages[$i]]['system_language'] = 1;
                } else{
                    //try to find a language name
                    $appForLang = return_app_list_strings_language($languages[$i]);
                    $lang = [
                        'id' => create_guid(),
                        'language_code' => $languages[$i],
                        'language_name' => (!empty($appForLang['language_pack_name']) ? $appForLang['language_pack_name'] : $languages[$i]),
                        'sort_sequence' => $i+1,
                        'is_default' => ($languages[$i] == SpiceConfig::getInstance()->config['default_language'] ? 1 : 0),
                        'system_language' => 1,
                        'communication_language' => 1
                    ];

                    if(!$db->insertQuery('syslangs', $lang)){
                        $errors[] = $db->lastError();
                    }
                    // add to syslangs array to return from the call
                    $syslangs[$languages[$i]] = $lang;
                }
            }
        }
        return ["success" => $success, "queries" => count($inserts), "languages" => $syslangs,  "errors" => $errors];
    }

}
