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
require_once 'modules/SystemUI/SpiceUILoader.php';

class SpiceLanguageLoader{

    public $loader;

    public function __construct(){
        $this->loader = new SpiceUILoader();
    }
    /**
     * Display load language form in SpiceCRM Backend Administration
     */
    public function displayDefaultConfForm($params){
        $sm = new Sugar_Smarty();
        //current config
        if(!empty($params['languages'])) $sm->assign('currentlanguages', $params['languages']);
        if(!empty($params['packages'])) $sm->assign('currentpackages', $params['packages']);
        if(!empty($params['versions'])) $sm->assign('currentversions', $params['versions']);

        //for settings
        $syslanguages = array();
        foreach($GLOBALS['sugar_config']['languages'] as $langkey => $lang)
            $syslanguages[$langkey] = $lang;
        $sm->assign("uilanguageconf_languages_options", $syslanguages);
        return $sm->display("modules/Administration/templates/UILanguage.tpl");
    }


    /**
     * load language labels and translations from reference database
     * @param $endpoint
     * @param $params
     */
    public function loadDefaultConf($endpoint, $params){
        global $sugar_config;
        $deletes = array();
        $truncates = array();
        $inserts = array();

        if(!$response = $this->loader->callMethod("GET", $endpoint)){
            die("REST Call error somewhere... Action aborted");
        }
//        echo '<pre>'. print_r($response, true);die();

        // reponse looks like
        //Array(
        //    [0] => {"id":"fc9701db-dacb-46b1-a10d-90e182783b39","name":"LBL_PRECONDITION","translation_default":"Voraussetzung","translation_short":"","translation_long":""}
        //    [1] => {"id":"f8ef0006-cea9-4c17-babe-38db5be5c99a","name":"MSG_INPUT_REQUIRED","translation_default":"Eingabe ist erforderlich","translation_short":"","translation_long":""}
        //)
        //id is label ID
        //name is label name
        //translation_default _short _long is tranlation for label

        //get tables information
        $tb_labels = $GLOBALS['dictionary']['syslanguagelabels']['table'];
//        $tb_labels_cols = array();
//        foreach($GLOBALS['dictionary']['syslanguagelabels']['fields'] as $id => $field){
//            if($field['type'] != 'link' && $field['type'] != 'relate'){
//                $tb_labels_cols[] = $field['name'];
//            }
//        }

        $tb_trans = $GLOBALS['dictionary']['syslanguagetranslations']['table'];
//        $tb_trans_cols = array();
//        foreach($GLOBALS['dictionary']['syslanguagelabels']['fields'] as $id => $field){
//            if($field['type'] != 'link' && $field['type'] != 'relate'){
//                $tb_trans_cols[] = $field['name'];
//            }
//        }

        //truncate syslanguagelabels
        $truncates[] = "DELETE FROM $tb_labels WHERE 1=1"; //$GLOBALS['db']->truncateTableSQL($tb_labels);
        //delete translations for selected language
        $deletes[] = "DELETE FROM $tb_trans WHERE syslanguage='".$params['language']."'";
        foreach($response as $index => $content) {
            $decodeData = json_decode($content, true);
            $tbColCheck = false;
            //insert command label
            $inserts[] = "INSERT INTO $tb_labels (id, name, version, package) ".
                "VALUES ( '".$decodeData['id']."', '".$decodeData['name']."', '".$decodeData['version']."', ".(!empty($decodeData['package']) && $decodeData['package'] != "*" ? "'".$decodeData['package']."'" : "NULL").")";

            //insert command translation
            $translabel_id = create_guid();
            $inserts[] = "INSERT INTO $tb_trans ".
                "(id, syslanguagelabel_id, syslanguage, translation_default, translation_short, translation_long) ".
                "VALUES ('".$translabel_id."', '".$decodeData['id']."', '".$params['language']."', ".
                (!empty($decodeData['translation_default'])  ? "'".$GLOBALS['db']->quote($decodeData['translation_default'])."'" : "NULL").", ".
                (!empty($decodeData['translation_short'])  ? "'".$GLOBALS['db']->quote($decodeData['translation_short'])."'" : "NULL").", ".
                (!empty($decodeData['translation_long'])  ? "'".$GLOBALS['db']->quote($decodeData['translation_long'])."'" : "NULL").")";
        }

        //if no inserts where created => abort
        if(count($inserts) < 1){
            die("No inserts found. Action aborted.");
        }

        $queries = array_merge($truncates, $deletes, $inserts);
//        echo '<pre>'. print_r(implode(";\n",$queries), true);

        //process queries
        if(count($queries) > 2) {
            $errors = array();
            foreach ($queries as $q) {
                if(!$GLOBALS['db']->query($q))
                    $errors[] = 'Error with query: '.$q." ".$GLOBALS['db']->last_error;
            }
        }

        if(count($errors) > 0){
            echo "Errors:\n";
            echo '<pre>'.implode("\n", $errors);
        }
        else {
            echo "<br>Loaded language labels for ".$params['language'];
            echo "<br>Success: Processed " . (count($queries) - count($errors)) . " queries out of " . (count($queries)) . "\n";
        }
    }


    /**
     * Get main information about current languages loaded in client
     * package, version....
     */
    public function getCurrentConf(){
        global $db;
        $q = "SELECT trans.syslanguage, lbl.package, lbl.version 
        FROM syslanguagelabels lbl
        INNER JOIN syslanguagetranslations trans ON trans.syslanguagelabel_id = lbl.id
        WHERE lbl.version is not null AND lbl.version <> ''        
        ORDER BY trans.syslanguage, lbl.package, lbl.version";
        $res = $db->query($q);
        $languages = array();
        $packages = array();
        $versions = array();

        while($row = $db->fetchByAssoc($res)){
            if(!empty($row['syslanguage']) && !in_array( $row['syslanguage'], $languages)) $languages[] = $row['syslanguage'];
            if(!empty($row['package'])  && !in_array( $row['package'], $packages)) $packages[] = $row['package'];
            if(!empty($row['version'])  && !in_array( $row['version'], $versions)) $versions[] = $row['version'];
        }
        return array('languages' => $languages, 'packages' => $packages, 'versions' => $versions);
    }
}