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
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\utils\SpiceUtils;
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
        $package = '*';
        $route = implode("/", [$this->routebase, $language, $package, '*']);
        return $this->loadDefaultConf($route, ['route' => $this->routebase, 'languages' => $language], false);;
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
        $warnings = [];
        $syslangs = [];
        $success = false;

        if($checkopen && $this->loader->hasOpenChangeRequest()){
//            throw new Exception("Open Change Requests found! Action aborted. They would be erased...");
            throw (new Exception("Open Change Requests found! Action aborted. They would be erased...", 'packageLoadFailed'));

        }

        if(!$response = $this->loader->callMethod("GET", $route)){
//            throw new Exception("REST Call error somewhere... Action aborted");
            throw (new Exception("Failed to load language package. No response from reference entity", 'packageLoadFailed'));
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
        $labelNames = [];
        $qL = "SELECT id, name FROM $tb_labels";
        if($resL = $db->query($qL)){
            while($rowL = $db->fetchByAssoc($resL)){
                $labelIDs[] = $rowL['id'];
                $labelNames[] = $rowL['name'];
            }
        }

        foreach($response as $index => $content) {
            $doUpdate = false;
            $decodeData = json_decode($content, true);
            //insert command label
            if(!in_array($decodeData['id'], $labelIDs)) {
                // catch if we have the label under another ID
                if(in_array($decodeData['name'], $labelNames)){
                    // update what we have to avoid duplicate entry error on label name
                    $doUpdate = true;
                    // update custom translation if any
                    $doUpdateActions = $this->remapLanguageLabelIdOnCustomTranslation( $decodeData);
                }

                $labelIDs[] = $decodeData['id'];
                //run insert
                $entryL = [
                    'id' => $decodeData['id'],
                    'name' => $decodeData['name'],
                ];

                if(!$doUpdate){
                    if($dbRes = $db->insertQuery($tb_labels, $entryL)){
                        $inserts[] = $dbRes;
                    } else{
                        $errors[] = $db->lastError();
                    }
                } else {
                    // update the ID of the label
                    if($dbRes = $db->updateQuery($tb_labels, ['name' =>  $decodeData['name']], $entryL)){
                        $inserts[] = $dbRes;
                        // update the custom translation records
                        if(!empty($doUpdateActions)){
                            if($db->query($doUpdateActions['updateCustomTranslation'])){
                                $warning[] = $doUpdateActions['warning'];
                            } else {
                                $errors[] = $db->lastError();
                            }
                        }
                    } else{
                        $errors[] = $db->lastError();
                    }
                }
            }

            //insert command translation
            $entryT = [
                'id' => $decodeData['translation_id'],
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
            throw (new Exception("Failed to load language package", 'packageLoadFailed'))->setDetails($errors);
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
                    $appForLang = SpiceUtils::returnAppListStringsLanguage($languages[$i]);
                    $lang = [
                        'id' => SpiceUtils::createGuid(),
                        'language_code' => $languages[$i],
                        'language_name' => (!empty($appForLang['language_pack_name']) ? $appForLang['language_pack_name'] : $languages[$i]),
                        'sort_sequence' => $i+1,
                        'is_default' => ($languages[$i] == SpiceLanguageManager::getInstance()->getSystemDefaultLanguage() ? 1 : 0),
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
        return ["success" => $success, "queries" => count($inserts), "languages" => $syslangs,  "errors" => $errors, "warnings" => $warnings];
    }

    /**
     * replace the old syslanguagelabel_id in a specific custom translation
     * @param $decodeData
     * @param $warnings
     * @return void
     * @throws \Exception
     */
    public function getLanguageLabelIdOnCustomTranslation($decodeData, &$warnings){
        $handler = new SpiceLanguagesRESTHandler();
        return $handler->getLabelIdByName($decodeData['name'], 'global');
    }

    /**
     * replace the old syslanguagelabel_id in a specific custom translation
     * @param $decodeData
     * @param $warnings
     * @return void
     * @throws \Exception
     */
    public function remapLanguageLabelIdOnCustomTranslation($decodeData){
        $db = DBManagerFactory::getInstance();
        $handler = new SpiceLanguagesRESTHandler();
        $oldId = $handler->getLabelIdByName($decodeData['name'], 'global');
        if($oldId){
            $customTranslation = $handler->retrieveLabelDataByName($decodeData['name'], $decodeData['syslanguage']);
            if(!empty($customTranslation['custom_translations'])){
                $warning = "ID for label ".$decodeData['name']. ' changed from ' .$customTranslation['custom_translations'][0]['syslanguagelabel_id'].' to '.$decodeData['id'].'. Label ID has been re-mapped in your custom translations. Please, check your corresponding custom translations.';
                // update the label ID in the custom translation entry
                $customRecordPk = ['id' => $customTranslation['custom_translations'][0]['id']];
                $updateCustomRecord = $customTranslation['custom_translations'][0];
                $updateCustomRecord['syslanguagelabel_id'] = $decodeData['id'];
                $q = $db->updateQuery('syslanguagecustomtranslations', $customRecordPk, $updateCustomRecord, false);
                return ['updateCustomTranslation' => $q, 'warning' => $warning];
            }
        }
        return [];
    }

}
