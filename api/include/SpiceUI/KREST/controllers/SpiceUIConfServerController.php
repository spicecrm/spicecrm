<?php

namespace SpiceCRM\includes\SpiceUI\KREST\controllers;


use SpiceCRM\includes\database\DBManagerFactory;

class SpiceUIConfServerController
{

    static function getAvailable($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $refData = [
            'versions' => [],
            'packages' => [],
            'languages' => [],
        ];

        $records = $db->query("SELECT * FROM systemdeploymentpackages");
        while ($record = $db->fetchByAssoc($records)) {
            $refData['packages'][] = [
                'package' => $record['package'],
                'type' => $record['rptype'],
                'name' => $record['name'],
                'description' => $record['description'],
                'extensions' => $record['extensions'],
                'packages' => $record['packages']
            ];
        }

        $records = $db->query("SELECT name FROM systemdeploymentreleases WHERE deleted = 0");
        while ($record = $db->fetchByAssoc($records)) {
            $refData['versions'][] = [
                'version' => $record['name']
            ];
        }

        $records = $db->query("SELECT language_code, language_name FROM syslangs WHERE system_language = '1'");
        while ($record = $db->fetchByAssoc($records)) {
            $refData['languages'][] = [
                'language_code' => $record['language_code'],
                'language_name' => $record['language_name']
            ];
        }

        return $res->withJson($refData);
    }

    /**
     * retrieves the repository items for the build process
     *
     * @param $req
     * @param $res
     * @param $args
     */
    static function getRepositoryItems($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $repitems = [];
        $records = $db->query("SELECT item FROM (SELECT component item FROM sysuiobjectrepository  UNION SELECT module item FROM sysuimodulerepository) objects ORDER BY item");
        while ($record = $db->fetchByAssoc($records)) {
            $repitems[] = $record['item'];
        }
        return $res->withJson($repitems);
    }

    /**
     * retrieves the repository modules for the build process
     *
     * @param $req
     * @param $res
     * @param $args
     */
    static function getRepositoryModules($req, $res, $args){
        $db = DBManagerFactory::getInstance();
        $repitems = [];
        $records = $db->query("SELECT module, path FROM sysuimodulerepository ORDER BY module");
        while ($record = $db->fetchByAssoc($records)) {
            $repitems[] = $record;
        }
        return $res->withJson($repitems);
    }


    static function getConfig($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $tables = [
            'sysmodules',
            'sysuimodulerepository',
            'sysuiobjectrepository',
            'sysuiroutes',
            'sysuicomponentsets',
            'sysuicomponentsetscomponents',
            'sysuifieldsets',
            'sysuifieldsetsitems',
            'sysuiactionsets',
            'sysuiactionsetitems',
            'sysuiadmingroups',
            'sysuiadmincomponents',
            'sysuicomponentdefaultconf',
            'sysuicomponentmoduleconf',
            'sysuicopyrules',
            'sysuifieldtypemapping',
            'sysuilibs',
            'sysuirolemodules',
            'sysuiroles',
            'sysuidashboarddashlets',
            'syshooks',
            'sysuiloadtasks',
            'sysuiloadtaskitems',
            'sysmailboxtransports',
            'spiceaclstandardactions',
        ];

        $tableArray = [];

        $packageWhere = " package IN ('".implode("','", explode(',', $args['packages']))."')";


        // handle version is sent as *
        if($args['version'] == '*'){
            $versionRecord = $db->query("SELECT max(name) version FROM systemdeploymentreleases");
            $versionRecord = $db->fetchByAssoc($versionRecord);
            $version = $versionRecord['version'];
        }

        foreach ($tables as $table) {
            //$records = $db->query("SELECT * FROM $table WHERE version='$version'");
            $records = $db->query("SELECT * FROM $table WHERE $packageWhere AND version <= '$version'");

            if (!$records)
                continue;

            while ($record = $db->fetchByAssoc($records)) {
                $tmpRec = [];
                foreach ($record as $field => $value) {
                    $tmpRec[$field] = html_entity_decode(utf8_encode($value));
                }
                $tableArray[$table][$record['id']] = base64_encode(json_encode($tmpRec));
            }
        }

        // load the additonal entries
        $refRecords = $db->query("SELECT tablename, tablekey FROM systemdeploymentrpdbentrys, systemdeploymentpackages WHERE systemdeploymentrpdbentrys.systemdeploymentrp_id = systemdeploymentpackages.id AND version<='$version' AND $packageWhere");
        while ($refRecord = $db->fetchByAssoc($refRecords)) {

            $refRecordEntry = $db->query("SELECT * FROM {$refRecord['tablename']} WHERE id='{$refRecord['tablekey']}'");
            $refRecordEntry = $refRecordEntry->fetch_assoc();
            if($refRecordEntry) {
                $tmpRec = [];
                foreach ($refRecordEntry as $field => $value) {
                    $tmpRec[$field] = html_entity_decode(utf8_encode($value));
                }
                $tableArray[$refRecord['tablename']][$refRecord['tablekey']] = base64_encode(json_encode($tmpRec));
            }
        }

        return $res->withJson($tableArray);
    }

    /**
     * retirves the language labels
     *
     * @param $req
     * @param $res
     * @param $args
     */
    static function getLanguageLabels($req, $res, $args){
        $db = DBManagerFactory::getInstance();

        $langArray = [];
        $tableArray = [];

        // handle multiple languages passed in
        $langs = explode(',', $args['language']);

        //$records = $db->query("SELECT * FROM $table WHERE version='$version'");
        $records = $db->query("SELECT ll.id, ll.name, lt.syslanguage, lt.translation_default, lt.translation_short, lt.translation_long FROM syslanguagelabels ll, syslanguagetranslations lt WHERE ll.id = lt.syslanguagelabel_id AND lt.syslanguage in ('".implode("','", $langs)."')");
        if (!$records) {
            return $langArray;
        }

        //$records = $db->query("SELECT * FROM $table");
        while ($record = $db->fetchByAssoc($records)) {
            $tmpRec = [];
            foreach ($record as $field => $value) {
                $tmpRec[$field] = html_entity_decode(($value));
            }
            $json = json_encode($tmpRec, JSON_UNESCAPED_UNICODE);
            $tableArray[] = $json;
        }

        return $res->withJson($tableArray);
    }

}
