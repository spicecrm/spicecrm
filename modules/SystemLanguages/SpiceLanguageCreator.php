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
 * Class SpiceLanguageCreator
 * this class is for development purpose only
 */
class SpiceLanguageCreator{
    public $languages = array('en_us', 'de_DE');
    public $labels = array();
    public $excludeModules = array('Home', 'ModuleBuilder', 'ACL', 'ACLActions', 'ACLRoles', 'Administration', 'Charts', 'iCals');


    //=> Developement => generating queries for labels
    public function getLabelsFromFiles(){
        //mod_strings
        foreach (new DirectoryIterator('cache/modules/') as $fileInfo) {
            if ($fileInfo->isDot() || $fileInfo->isFile()) continue;
            if(!in_array($fileInfo->getFilename(), $this->excludeModules)) {
                foreach (new DirectoryIterator('cache/modules/' . $fileInfo->getFilename()) as $subfolder) {
                    if ($subfolder == 'language') {
                        foreach (new DirectoryIterator('cache/modules/' . $fileInfo->getFilename() . '/language') as $languageFile) {
                            if ($languageFile->isFile()) {
                                //                      if(preg_match("/en_us/", $languageFile->getFilename())){
                                //                          global $mod_strings;
                                //                          include 'cache/modules/'.$fileInfo->getFilename().'/language/'.$languageFile->getFilename();
                                //                          $labels['en_us'][]
                                //
                                //                      }
                                include 'cache/modules/' . $fileInfo->getFilename() . '/language/' . $languageFile->getFilename();
                                $lang = substr($languageFile->getFilename(), 0, 5);
                                global $mod_strings;
                                foreach ($mod_strings as $lbl => $value) {
                                    $this->labels[$lbl][$lang] = $value;
                                }
                            }
                        }
                    }
                }
            }
        }

        //app_strings
        foreach (new DirectoryIterator('include/language') as $languageFile) {
            if ($languageFile->isFile() && in_array($languageFile->getFilename(), array('en_us.lang.php', 'de_DE.lang.php'))) {
                include 'include/language/' . $languageFile->getFilename();
                global $app_strings, $app_list_strings, $beanList;
                $lang = substr($languageFile->getFilename(),0,5);
//                foreach($app_strings as $lbl => $value) {
//                    $this->labels[$lbl][$lang] = $value;
//                }
//                foreach($app_list_strings['moduleList'] as $lbl => $value) {
//                    $this->labels['MOD_'.strtoupper($lbl)][$lang] = $value;
//                }
                foreach($app_list_strings['moduleListSingular'] as $lbl => $value) {
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl])][$lang] = $value;
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl]).'_NAME'][$lang] = $value.' Name';
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl]).'_ID'][$lang] = $value.' ID';
                    $this->labels['LBL_NEW_FORM_TITLE_'.strtoupper($lbl)][$lang] = $value;
                }
            }
        }

    }



    public function getLabelsFromFilesAppStrings(){
        //app_strings
        foreach (new DirectoryIterator('include/language') as $languageFile) {
            if ($languageFile->isFile() && in_array($languageFile->getFilename(), array('en_us.lang.php', 'de_DE.lang.php'))) {
                include 'include/language/' . $languageFile->getFilename();
                global $app_strings, $app_list_strings, $beanList;
                $lang = substr($languageFile->getFilename(),0,5);
                foreach($app_strings as $lbl => $value) {
                    $this->labels[$lbl][$lang] = $value;
                }
                //app_list_strings exception: leave it for now (January 2018)
//                foreach($app_list_strings['moduleList'] as $lbl => $value) {
//                    $this->labels['MOD_'.strtoupper($lbl)][$lang] = $value;
//                }
                //create generic labels for each module
//                foreach($app_list_strings['moduleListSingular'] as $lbl => $value) {
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl])][$lang] = $value;
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl]).'_NAME'][$lang] = $value.' Name';
//                    $this->labels['MOD_'.strtoupper($beanList[$lbl]).'_ID'][$lang] = $value.' ID';
//                    $this->labels['LBL_NEW_FORM_TITLE_'.strtoupper($lbl)][$lang] = $value;
//                }
            }
        }
    }

    public function createLabelsForModules($modules){
        global $app_list_strings;
        $q = array();
        foreach($modules as $module) {
            $mod_strings_en = return_module_language('en_us', $module);
            $mod_strings_de = return_app_list_strings_language('de_DE');
            foreach ($mod_strings_en as $lbl => $value) {
                $syslabelid = create_guid();
                $q[] = "REPLACE INTO syslanguagelabels (id, label) VALUES('" . $syslabelid . "', '" . strtoupper($lbl) . "');";
                $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '" . $syslabelid . "', 'en_us', '" . $mod_strings_en[$lbl] . "');";
                $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '" . $syslabelid . "', 'de_de', ' " . $mod_strings_de[$lbl] . "');";
            }
        }
        return $q;
    }

    public function createModuleLabels(){
        global $app_list_strings;
        $q = array();
        $app_strings_en = return_app_list_strings_language('en_us');
        $app_strings_de = return_app_list_strings_language('de_DE');
        foreach($app_strings_en['moduleListSingular'] as $lbl => $value ){
            $syslabelid = create_guid();
            $q[] = "REPLACE INTO syslanguagelabels (id, label) VALUES('".$syslabelid."', 'LBL_NEW_FORM_TITLE_".strtoupper($lbl)."');";
            $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '".$syslabelid."', 'en_us', 'New ".$app_strings_en['moduleListSingular'][$lbl]."');";
            $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '".$syslabelid."', 'de_de', 'Neu ".$app_strings_de['moduleListSingular'][$lbl]."');";
        }

        return $q;
    }

    public function getLabels(){
        $this->getLabelsFromFiles();
        return $this->labels;
    }

    public function createDbLabels(){
        $q = array();
        //exclude labels
        $excludeLabels = array("billing_address", "shipping_address");
        //general labels
        $regularLabels = array(
//            'LBL_ID', 'LBL_DATE_ENTERED', 'LBL_DATE_MODIFIED', 'LBL_MODIFIED_BY', 'LBL_MODIFIED_BY_ID', 'LBL_CREATED_BY',
//            'LBL_CREATED_BY_ID', 'LBL_DELETED', 'LBL_NAME', 'LBL_CREATED_USER', 'LBL_MODIFIED_USER', 'LBL_ASSIGNED_TO',
//            'LBL_ASSIGNED_TO_ID', 'LBL_MAINDATA', 'LBL_OTHER', 'LBL_PANEL_ASSIGNMENT',
//            'LBL_NEW', 'LBL_EDIT', 'LBL_VIEW', 'LBL_LIST', 'LBL_IMPORT', 'LBL_EXPORT', 'LBL_SAVE', 'LBL_CANCEL', 'LBL_ADD',
//            'LBL_CITY', 'LBL_STREET', 'LBL_STREET2', 'LBL_STREET3', 'LBL_STREET4', 'LBL_POSTALCODE', 'LBL_COUNTRY', 'LBL_STATE', 'LBL_POBOX', 'LBL_HSNB', 'LBL_BILLING_ADDRESS', 'LBL_SHIPPING_ADDRESS', 'LBL_LONGITUDE', 'LBL_LATITUDE',
//            'LBL_EMAIL', 'LBL_EMAIL_PRIMARY', 'LBL_TYPE', 'LBL_MAIN',
//            'LBL_DATE', 'LBL_DATE_TIME', 'LBL_HOURS_MINUTES', 'LBL_START', 'LBL_STARTDATE', 'LBL_ENDDATE', 'LBL_STARTTIME', 'LBL_ENDTIME',
//            'LBL_SHOW_TOOLS','LBL_CLOSE','LBL_OK', 'LBL_IMGUPLOADED_INPUTDATA', 'LBL_DELETE_RECORD', 'MSG_DELETE_CONFIRM',
//            'LBL_SERVICEORDER_SIGNING', 'LBL_VALUE', 'LBL_MY', 'LBL_ALL', 'LBL_REMOVE','LBL_SPEECH_RECOGNITION',
//            'LBL_WAITING_START_SPEAKING', 'LBL_PAUSE', 'LBL_CONTINUE', 'LBL_ACCEPT', 'LBL_NEW_FORM_TITLE', 'LBL_MARK_CLOSED',
//            'LBL_UNREAD_ONLY', 'LBL_BLOCKED', 'LBL_DENIED', 'LBL_DUPLICATES_FOUND', 'LBL_LEADCONVERT_CREATEACCOUNT',
//            'LBL_LEADCONVERT_CREATECONTACT', 'LBL_LEADCONVERT_CREATEOPPORTUNITY', 'LBL_LEADCONVERT_CONVERTLEAD',
//            'LBL_EQUALS', 'LBL_STARTS', 'LBL_CONTAINS', 'LBL_NCONTAINS', 'LBL_GREATER', 'LBL_GEQUAL', 'LBL_SMALLER', 'LBL_SEQUAL',
//            'LBL_WEEKDAY', 'LBL_CATEGORIES', 'LBL_SEARCH', 'LBL_SEARCH_SPICE', 'LBL_LOGGED_CHANGES',
//            'LBL_BEFOREVALUE', 'LBL_USER', 'LBL_AFTERVALUE', 'LBL_RECENT_ITEMS',
//            'LBL_PAST', 'LBL_FUTURE', 'LBL_THIS_MONTH', 'LBL_THIS_QUARTER', 'LBL_THIS_YEAR', 'LBL_NEXT_MONTH', 'LBL_NEXT_QUARTER', 'LBL_NEXT_YEAR',
//            'LBL_PRINT', 'LBL_NEXT', 'LBL_PREVIOUS', 'LBL_CLEAR', 'LBL_CLEARALL', 'LBL_VIEW_CHANGES', 'LBL_DISPLAY',
//            'LBL_ALL', 'LBL_OWN', 'LBL_SELECT', 'LBL_DONE', 'LBL_OF', 'LBL_NO_TAGS_ASSIGNED',
//            'LBL_DETAIL', 'LBL_RELATED', 'LBL_ACTIVITIES', 'LBL_QUICKNOTES', 'LBL_NEXT_STEPS', 'LBL_PAST_ACTIVITIES', 'LBL_DUPLICATES',
//            'LBL_MANAGE:SUBSCRIPTIONS', 'LBL_AUDITLOG', 'LBL_VIEWALL', 'LBL_SORTEDBY', 'LBL_LASTUPDATE', 'LBL_FIND_CONFMODULE',
//            'LBL_ALL_MODULES', 'LBL_APP_LAUNCHER','LBL_MAP', 'LBL_ANALYTICS','LBL_SUBSIDIARIES', 'LBL_TABLE', 'LBL_KANBAN', 'LBL_DISPLAYAS',
//            'LBL_SETFIELDS', 'LBL_LISTVIEWSETTINGS','LBL_ITEMS','LBL_NO_ENTRIES','LBL_SUMMARY','LBL_SELECT_LANGUAGE', 'LBL_LOGOFF', 'LBL_DETAILS',


        );
        $regularLabelsKeys = array_keys($regularLabels);
        $app_strings_en = return_application_language('en_us');
        $app_strings_de = return_application_language('de_DE');
        foreach($regularLabels as $lbl){
            $syslabelid = create_guid();
            $q[] = "REPLACE INTO syslanguagelabels (id, label) VALUES('".$syslabelid."', '".$lbl."');";
            $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '".$syslabelid."', 'en_us', '".$app_strings_en[$lbl]."');";
            $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '".$syslabelid."', 'de_de', '".$app_strings_de[$lbl]."');";
        }

        // from exitings labels if not set already
        foreach($this->labels as $lbl => $translations){
            if(!in_array($lbl, $regularLabels) && !preg_match("/billing_address/i", $lbl) && !preg_match("/shipping_address/i", $lbl)) {
                $syslabelid = create_guid();
                $q[] = "REPLACE INTO syslanguagelabels (id, label) VALUES('" . $syslabelid . "', '" . $lbl . "');";
                foreach ($translations as $lang => $translation) {
                    $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '" . $syslabelid . "', '" . strtolower($lang) . "', '" . $GLOBALS['db']->quote(str_replace(array("&#39;"), array("'"), $translation)) . "');";
                }
            }
        }
        return $q;
    }

    public function createDbLabel($labelconf){
        $q = array();

        foreach($labelconf as $lbl => $translations){
            $syslabelid = create_guid();
            $q[] = "REPLACE INTO syslanguagelabels (id, label) VALUES('" . $syslabelid . "', '" . $lbl . "');";
            foreach ($translations as $lang => $translation) {
                $q[] = "REPLACE INTO syslanguagetranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '" . $syslabelid . "', '" . strtolower($lang) . "', '" . $GLOBALS['db']->quote(str_replace(array("&#39;"), array("'"), $translation)) . "');";
            }
        }
        return $q;
    }

    public function getDuplicateTranslations(){
        $duplicateTranslations = array();
        $duplicateLabels = array();
        foreach($this->labels as $lbl => $translations){
            foreach($translations as $lang => $translation){
                if(in_array($translation, $duplicateTranslations[$lang], true)){
                    $duplicateLabels[$lang][$translation][] = $lbl;
                }else{
                    $duplicateLabels[$lang][$translation][] = $lbl;
                    $duplicateTranslations[$lang][] = $translation;
                }
            }
        }
        return $duplicateLabels;
    }

    public function getDuplicateTranslationsAssignedInVardefs(){
        $duplicateTranslations = array();
        $duplicateLabels = array();
        foreach($this->labels as $lbl => $translations){
            $syslabelid = create_guid();
            foreach($translations as $lang => $translation){
                if(in_array($translation, $duplicateTranslations[$lang])){
                    $duplicateLabels[$lang][$translation][] = $lbl;
                }else{
                    $duplicateTranslations[$lang][] = $translation;
                }
            }
        }
        return $duplicateLabels;
    }

}


$syslang = new SpiceLanguageCreator();
echo '<br>'.print_r(implode("<br>", $syslang->createLabelsForModules(array('WorkflowDefinitions'))));
////echo '<pre>'.print_r( implode("\n", $syslang->createModuleLabels()), true);
//$syslang->getLabelsFromFilesAppStrings();
////echo '<pre>'.print_r(count($labels), true);
//foreach($syslang->labels as $lbl => $lblconf){
//    if(count($lblconf) < 2)
//        echo '<pre>'.print_r($lbl." ".$syslang->labels[$lbl], true);
//}
////compare current db with app_strings
//$q = "select label from syslanguagelabels ORDER BY label";
//$res = $GLOBALS['db']->query($q);
//$currentdb = array();
//while($row = $GLOBALS['db']->fetchByAssoc($res)){
//    $currentdb[] = $row['label'];
//}
////echo '<pre>'.print_r($currentdb, true);
//
//$q = array();
//foreach($syslang->labels as $lbl => $lblconf){
//    if(!in_array($lbl, $currentdb)){
//        //$q = array_merge($q, $syslang->createDbLabel(array($lbl => $lblconf)));
//        echo '<pre>'.$lbl."\n" .print_r(implode("\n", $syslang->createDbLabel(array($lbl => $lblconf))), true);
//    }
//}
//echo '<pre>'.print_r($q, true);die();

//$duplicates = $syslang->getDuplicateTranslations();
//echo '<pre>'.print_r(count($duplicates), true);
//echo '<pre>'.print_r($duplicates, true);
//echo '<pre>'.print_r( implode("\n", $syslang->createDbLabels()), true);
