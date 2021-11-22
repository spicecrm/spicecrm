<?php

namespace SpiceCRM\modules\Administration\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\modules\ACLActions\ACLAction;
use SpiceCRM\modules\Relationships\Relationship;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\modules\Configurator\Configurator;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class AdminController
{
    public function systemstats(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $statsArray = [];

        if (!$current_user->is_admin) {
            throw new ForbiddenException();
        }

        $dbSize = 0;
        $dbCount = 0;
        $stats = $db->query("SHOW TABLE STATUS");
        while ($stat = $db->fetchByAssoc($stats)) {

            $recordCount = $db->fetchByAssoc($db->query("SELECT count(*) records FROM {$stat['Name']}"));

            $statsArray['database'][] = [
                'name' => $stat['Name'],
                'records' => (int)$recordCount['records'],
                'size' => $stat['Data_length'] + $stat['Index_length']
            ];
            $dbCount += (int)$recordCount['records'];
            $dbSize += (int)$stat['Data_length'] + (int)$stat['Index_length'];
        }

        // get the fts stats
        $statsArray['elastic'] = SpiceFTSHandler::getInstance()->getStats();

        $statsArray['uploadfiles'] = $this->getDirectorySize(UploadStream::getDir());

        $params = $req->getQueryParams();
        if ($params['summary']) {
            return $res->withJson([
                'database' => ['size' => $dbSize, 'count' => $dbCount],
                'uploadfiles' => $statsArray['uploadfiles'],
                'elastic' => ['size' => $statsArray['elastic']['_all']['total']['store']['size_in_bytes'], 'count' => $statsArray['elastic']['_all']['total']['docs']['count']],
                'users' => $db->fetchByAssoc($db->fetchByAssoc("SELECT count(id) usercount FROM users WHERE status='Active'"))['usercount']
            ]);
        }
        return $res->withJson($statsArray);
    }

    /**
     * @param $directory
     * @return array
     */
    private function getDirectorySize($directory)
    {
        $size = 0;
        $count = 0;
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file) {
            $size += $file->getSize();
            $count++;
        }
        return ['size' => $size, 'count' => $count];
    }

    /**
     * get function to read the contents of system default locales in config table
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws ForbiddenException
     */
    public function getGeneralSettings(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        }

        return $res->withJson([
            'system' => [
                'name' => SpiceConfig::getInstance()->config['system']['name'],
                'site_url' => SpiceConfig::getInstance()->config['site_url'],
                'unique_key' => SpiceConfig::getInstance()->config['unique_key'],
            ],
            'advanced' => [
                'developerMode' => SpiceConfig::getInstance()->config['developerMode'],
                'stack_trace_errors' => SpiceConfig::getInstance()->config['stack_trace_errors'],
                'dump_slow_queries' => SpiceConfig::getInstance()->config['dump_slow_queries'],
                'log_memory_usage' => SpiceConfig::getInstance()->config['log_memory_usage'],
                'slow_query_time_msec' => SpiceConfig::getInstance()->config['slow_query_time_msec'],
                'upload_maxsize' => SpiceConfig::getInstance()->config['upload_maxsize'],
                'upload_dir' => SpiceConfig::getInstance()->config['upload_dir']
            ],
            'logger' => SpiceConfig::getInstance()->config['logger']
        ]);

    }

    /**
     * writes the values of system default settings in the config table
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws ForbiddenException
     */
    public function writeGeneralSettings(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        }

        $diffArray = [];

        $postBody = $req->getParsedBody();

        if (!empty($postBody)) {
            // handle sytem settings
            foreach ($postBody['system'] as $itemname => $itemvalue) {
                switch ($itemname) {
                    case 'name':
                        SpiceConfig::getInstance()->config['system']['name'] = $itemvalue;
                        $query = "UPDATE config SET value = '$itemvalue' WHERE categroy = 'system' AND name = '$itemname'";
                        $db->query($query);
                        break;
                    default:
                        SpiceConfig::getInstance()->config[$itemname] = $itemvalue;
                        $diffArray[$itemname] = $itemvalue;
                }

            }

            // handle advanced settings
            foreach ($postBody['advanced'] as $itemname => $itemvalue) {
                SpiceConfig::getInstance()->config[$itemname] = $itemvalue;
                $diffArray[$itemname] = $itemvalue;
            }

            // handle logger settings
            SpiceConfig::getInstance()->config['logger'] = $postBody['logger'];
            $diffArray['logger'] = $postBody['logger'];
        }

        $configurator = new Configurator();
        $configurator->handleOverrideFromArray($diffArray);

        return $res->withJson([
            'status' => boolval($query)
        ]);
    }

    /**
     * building the query for a relationship repair
     */
    public function buildSQLforRepair()
    {
        global $dictionary;
        $db = DBManagerFactory::getInstance();
        $execute = false;
        VardefManager::clearVardef();
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            SpiceDictionaryVardefs::loadDictionaries();
            // save cache to DB
            foreach ($dictionary as $dict) {
                SpiceDictionaryVardefs::saveDictionaryCacheToDb($dict);
            }
        }

        $repairedTables = [];
        $sql = '';
        foreach (SpiceModules::getInstance()->getModuleList() as $module) {
            $focus = BeanFactory::getBean($module);
            if (($focus instanceof SugarBean) && !isset($repairedTables[$focus->table_name])) {
                $sql .= $db->repairTable($focus, $execute);
                $repairedTables[$focus->table_name] = true;
            }
            // check on audit tables
            if (($focus instanceof SugarBean) && $focus->is_AuditEnabled() && !isset($repairedTables[$focus->table_name . '_audit'])) {
                $sql .= $focus->update_audit_table(false);
                $repairedTables[$focus->table_name . '_audit'] = true;
            }
        }

        foreach ($dictionary as $meta) {
            if (!isset($meta['table']) || isset($repairedTables[$meta['table']]))
                continue;
            $tablename = $meta['table'];
            $fielddefs = $meta['fields'];
            $indices = $meta['indices'];
            $engine = isset($meta['engine']) ? $meta['engine'] : null;
            $sql .= $db->repairTableParams($tablename, $fielddefs, $indices, $execute, $engine);
            $repairedTables[$tablename] = true;
        }

        // rebuild relationships
        $this->rebuildRelationships();
        return $sql;

    }

    /**
     * compares vardefs and columns, indexes in database,  for each difference found: delivers an array with a commentary, an sql statement and the hash of the sql statement
     *
     * @param Request $req
     * @param Response $res
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function buildSQLArray(Request $req, Response $res, array $args): Response {
        global $dictionary;
        $db = DBManagerFactory::getInstance();
        $execute = false;
        VardefManager::clearVardef();
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            SpiceDictionaryVardefs::loadDictionaries();
            // save cache to DB
            foreach ($dictionary as $dict) {
                SpiceDictionaryVardefs::saveDictionaryCacheToDb($dict);
            }
        }

        $repairedTables = [];
        $sql = '';

        foreach (SpiceModules::getInstance()->getModuleList() as $module) {
            $focus = BeanFactory::getBean($module);
            if (($focus instanceof SugarBean) && !isset($repairedTables[$focus->table_name])) {
                $sql .= $db->repairTable($focus, $execute);
                $repairedTables[$focus->table_name] = true;
            }
            // check on audit tables
            if (($focus instanceof SugarBean) && $focus->is_AuditEnabled() && !isset($repairedTables[$focus->table_name . '_audit'])) {
                $sql .= $focus->update_audit_table(false);
                $repairedTables[$focus->table_name . '_audit'] = true;
            }
        }

        foreach ($dictionary as $meta) {
            if (!isset($meta['table']) || isset($repairedTables[$meta['table']]))
                continue;
            $tablename = $meta['table'];
            $fielddefs = $meta['fields'];
            $indices = $meta['indices'];
            $engine = isset($meta['engine']) ? $meta['engine'] : null;
            $sql .= $db->repairTableParams($tablename, $fielddefs, $indices, $execute, $engine);
            $repairedTables[$tablename] = true;
        }
        foreach (explode("\n", $sql) as $line) {
            // not completely right, cant think of something better right now
            if (strpos($line, "Table")) {
                $comment = $line;
            }
            if (strpos($line, ';')) {
                $sqlArray[] = ["comment" => $comment, "statement" => $line, "md5" => md5($line), "selected" => false];
            }

        }
        // rebuild relationships
        $this->rebuildRelationships();

        // send an empty string for sql if $sqlArray is null
        return $res->withJson(["sql" => (empty($sqlArray) ? "" : $sqlArray), "wholeSQL" => $sql]);

    }

    /**
     * repairs and rebuilds the database
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function repairAndRebuild(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $errors = [];
        $postBody = $req->getParsedBody();
        if (SpiceUtils::isAdmin($current_user) && !empty($postBody)) {
            $synced = false;
            foreach ($postBody["selectedqueries"] as $query) {
                if ($query["md5"] == md5($query["statement"])) {
                    $stmt = str_replace(';', '', $query["statement"]);
                    if (!$db->query($stmt, true)) {
                        $errors[] = $db->lastError();
                    }
                } else {
                    $errors[] = "md5 hash does not match";
                }

            }

            if (!empty($errors)) {
                $response = false;
            } else {
                $response = true;
            }

        } else {
            $synced = true;
        }
        if ($res) {
            return $res->withJson(['response' => $response,
                'synced' => $synced,
                'error' => $errors]);
        } else {
            return json_encode(['response' => $response,
                'synced' => $synced,
                'error' => $errors]);
        }
    }

    /**
     * repair and rebuild function to call in the installer, since you cant select any queries
     * @return false|string
     * @throws \Exception
     */
    public function repairAndRebuildforInstaller()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $errors = [];
        if (SpiceUtils::isAdmin($current_user)) {
            $sql = $this->buildSQLforRepair();
            if (!empty($sql)) {
                $synced = false;
                foreach (explode("\n", $sql) as $line) {
                    if (!strpos($line, '*') && !empty($line)) {
                        $queries[] = $line;
                    }
                }
                foreach ($queries as $query) {
                    $db->query($query, true);
                }
            } else {
                $synced = true;
            }


            if (!empty($errors)) {
                $response = false;
            } else {
                $response = true;
            }

            // rebuild relationships
            // $this->rebuildRelationships();

        }

        return json_encode(['response' => $response,
                'synced' => $synced,
                'sql' => $sql,
                'error' => $errors]);

    }

    /**
     * rebuilds relationships from dictionary definitions
     *
     * ToDo: remove the need to have this
     */
    public function rebuildRelationships()
    {
//        global $dictionary;
        $db = DBManagerFactory::getInstance();

        $this->rebuildDictionaryRelationships();

        // using sysdictionary
//        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
//            $this->rebuildDictionaryRelationships();
//        } else { // old fashioned way
//            foreach ($GLOBALS['moduleList'] as $module) {
//                $focus = BeanFactory::getBean($module);
//                if (!$focus) continue;
//                SugarBean::createRelationshipMeta($focus->getObjectName(), $db, $focus->table_name, [$focus->object_name => $dictionary[$focus->object_name]], $focus->module_dir);
//            }
//
//            // rebuild the metadata relationships as well
//            $this->rebuildMetadataRelationships();
//
//            // rebuild relationship cache
//            $rel = new Relationship();
//            $rel->build_relationship_cache();
//        }
    }

    /**
     * rebuilds cache for relationships dictionary
     *
     * ToDo: remove the need to have this
     */
    public function rebuildDictionaryRelationships()
    {
        unset($_SESSION['relationships']);
        // rebuild relationship cache
        $rel = new Relationship();
        $rel->build_relationship_cache();
    }

    /**
     * rebuilds the metadata relationships
     *
     * TODo: remove this in the next version with the vardef manager
     */
    private function rebuildMetadataRelationships()
    {
        global $dictionary;
        $db = DBManagerFactory::getInstance();

        $rel_dictionary = $dictionary;
        foreach ($rel_dictionary as $rel_name => $rel_data) {
            $table = isset($rel_data ['table']) ? $rel_data ['table'] : "";
            SugarBean::createRelationshipMeta($rel_name, $db, $table, $rel_dictionary, '');
        }
    }

    /**
     * clears language cache and repairs the language extensions
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function repairLanguage(Request $req, Response $res, array $args): Response {
        $appListStrings = [];
        $appLang = [];
        $langs = LanguageManager::getLanguages();

        foreach ($langs['available'] as $lang) {
            if($lang['system_language']){
                $language = $lang['language_code'];
                $this->merge_files('Ext/Language/', $language . '.lang.ext.php', $language);
                $appListStrings[$language][] = return_app_list_strings_language($language);
                $appLang[$language][] = $this->loadLanguage($language);
            }
        }

        if (!empty($appListStrings) && !empty($appLang)) {
            $response = 'ok';
        } else {
            $response = 'e';
        }

        return $res->withJson(['response' => $response,
            'appList' => $appListStrings,
            'appLang' => $appLang,
            'languages' => $langs]);
    }

    /**
     * loads the applang labels for a language
     * @param $lang
     * @return array
     */
    private function loadLanguage($lang)
    {
        $syslanguagelabels = LanguageManager::loadDatabaseLanguage($lang);
        $syslanguages = [];
        if (is_array($syslanguagelabels)) {
            foreach ($syslanguagelabels as $syslanguagelbl => $syslanguagelblcfg) {
                $syslanguages[$syslanguagelbl] = [
                    'default' => $syslanguagelblcfg['default'],
                    'short' => $syslanguagelblcfg['short'],
                    'long' => $syslanguagelblcfg['long'],
                ];
            }
        }

        return $syslanguages;
    }

    /**
     * merges the extension files and generates the contents in the cache folder
     * (sugar code)
     * @param $path
     * @param $name
     * @param string $filter
     */
    private function merge_files($path, $name, $filter = '')
    {
        foreach (SpiceModules::getInstance()->getModuleList() as $module) {
            $extension = "<?php \n //WARNING: The contents of this file are auto-generated\n";
            $extpath = "modules/$module/$path";
            $module_install = 'custom/Extension/' . $extpath;
            $shouldSave = false;
            if (is_dir($module_install)) {
                $dir = dir($module_install);
                $shouldSave = true;
                $override = [];
                while ($entry = $dir->read()) {
                    if ((empty($filter) || substr_count($entry, $filter) > 0) && is_file($module_install . '/' . $entry)
                        && $entry != '.' && $entry != '..' && strtolower(substr($entry, -4)) == ".php") {
                        if (substr($entry, 0, 9) == '_override') {
                            $override[] = $entry;
                        } else {
                            $file = file_get_contents($module_install . '/' . $entry);
                            LoggerManager::getLogger()->debug(get_class($this) . "->merge_files(): found {$module_install}{$entry}");
                            $extension .= "\n" . str_replace(['<?php', '?>', '<?PHP', '<?'], ['', '', '', ''], $file);
                        }
                    }
                }
                foreach ($override as $entry) {
                    $file = file_get_contents($module_install . '/' . $entry);
                    $extension .= "\n" . str_replace(['<?php', '?>', '<?PHP', '<?'], ['', '', '', ''], $file);
                }
            }
            $extension .= "\n?>";

            if ($shouldSave) {
                if (!file_exists("custom/$extpath")) {
                    mkdir_recursive("custom/$extpath", true);
                }
                $out = sugar_fopen("custom/$extpath/$name", 'w');
                fwrite($out, $extension);
                fclose($out);
            } else {
                if (file_exists("custom/$extpath/$name")) {
                    unlink("custom/$extpath/$name");
                }
            }
        }


        LoggerManager::getLogger()->debug("Merging application files for $name in $path");
        //Now the application stuff
        $extension = "<?php \n //WARNING: The contents of this file are auto-generated\n";
        $extpath = "application/$path";
        $module_install = 'custom/Extension/' . $extpath;
        $shouldSave = false;
        if (is_dir($module_install)) {
            $dir = dir($module_install);
            while ($entry = $dir->read()) {
                $shouldSave = true;
                if ((empty($filter) || substr_count($entry, $filter) > 0) && is_file($module_install . '/' . $entry)
                    && $entry != '.' && $entry != '..' && strtolower(substr($entry, -4)) == ".php") {
                    $file = file_get_contents($module_install . '/' . $entry);
                    $extension .= "\n" . str_replace(['<?php', '?>', '<?PHP', '<?'], ['', '', '', ''], $file);
                }
            }
        }
        $extension .= "\n?>";
        if ($shouldSave) {
            if (!file_exists("custom/$extpath")) {
                mkdir_recursive("custom/$extpath", true);
            }
            $out = sugar_fopen("custom/$extpath/$name", 'w');
            fwrite($out, $extension);
            fclose($out);
        } else {
            if (file_exists("custom/$extpath/$name")) {
                unlink("custom/$extpath/$name");
            }
        }

    }

    /**
     * repairs ACL Roles
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return false|Response|string
     */
    public function repairACLRoles(Request $req, Response $res, array $args) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $repairedACLs = [];
        $ACLActions = ACLAction::getDefaultActions();
        if (SpiceUtils::isAdmin($current_user)) {
            if (!empty($ACLActions)) {
                foreach ($ACLActions as $action) {
                    if (empty(SpiceModules::getInstance()->getBeanName($action->category))) {
                        ACLAction::removeActions($action->category);
                    }

                }
            } else {
                foreach (SpiceModules::getInstance()->getBeanClasses() as $module => $beanClass) {
                    $beanName = SpiceModules::getInstance()->getBeanName($module);
                    if (empty($repairedACLs[$beanName]) && class_exists($beanClass)) {
                        $currentModule = BeanFactory::getBean($module);
                        if ($currentModule->bean_implements('ACL') && empty($currentModule->acl_display_only)) {
                            if (!empty($currentModule->acltype)) {
                                ACLAction::addActions($currentModule->getACLCategory(), $currentModule->acltype);
                            } else {
                                ACLAction::addActions($currentModule->getACLCategory());
                            }

                            $repairedACLs[$beanName] = true;
                        }
                    }
                }
            }
        }
        if ($res) {
            return $res->withJson(['installed_classes' => $repairedACLs]);
        } else {
            return json_encode(['installed_classes' => $repairedACLs]);
        }

    }

    /**
     * rebuilds vardefs extensions
     */
    private function rebuildExtensions()
    {
        $extensions = [];

        if (is_dir('custom/Extension/modules')) {
            $handle = opendir('custom/Extension/modules');
            while (false !== ($entry = readdir($handle)))
                if ($entry != "." && $entry != "..") {
                    $extensions[$entry] = "";
                    $subHandle = opendir("custom/Extension/modules/{$entry}/Ext/Vardefs");
                    while ($subEntry = readdir(($subHandle))) {
                        if ($subEntry != "." && $subEntry != "..") {
                            $extensions[$entry] = $subEntry;
                        }
                    }
                }

        }

        if (!empty($extensions) && !empty(array_values($extensions))) {
            foreach ($extensions as $extDir => $extFile) {
                $this->merge_files("Ext/Vardefs", 'vardefs.ext.php');
            }
        }

        if (is_dir('custom/Extension/modules/Jobs/Ext/ScheduledTasks')) {
            $this->merge_files("Ext/ScheduledTasks", 'scheduledtasks.ext.php');
        }
    }

    /**
     * clears the vardef cache, executes rebuilding of vardefs extensions and rebuild relationships
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function repairCache(Request $req, Response $res, array $args): Response {

        return $this->repairCacheFromDb($req, $res, $args);

//        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
//            return $this->repairCacheFromDb($req, $res, $args);
//        } else {
//            return $this->repairCacheFromFiles($req, $res, $args);
//        }
    }

    /**
     * repair cache based on dictionary manager
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    private function repairCacheFromDb(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {
//            \SpiceCRM\includes\SugarObjects\VardefManager::clearVardef();
            $this->rebuildExtensions();
            $this->merge_files("Ext/TableDictionary/", 'tabledictionary.ext.php');
            $this->rebuildDictionaryRelationships();
        }
        return $res->withJson(['status' => 'ok']);
    }

    /**
     * repair cache the old fashioned way
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    private function repairCacheFromFiles(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {
            VardefManager::clearVardef();
            $this->rebuildExtensions();
            $this->merge_files("Ext/TableDictionary/", 'tabledictionary.ext.php');
            $this->rebuildRelationships();
        }
        return $res->withJson(['status' => 'ok']);
    }


    /**
     * get all columns from the module-table in the database
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDBColumns(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {
            $db = DBManagerFactory::getInstance();
            $nodeModule = BeanFactory::getBean($args['module']);
            return $res->withJson($db->get_columns($nodeModule->table_name));
        }
    }

    /**
     * delete all the given columns in the database (with all data!) be carefully
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function repairDBColumns(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {

            $db = DBManagerFactory::getInstance();
            $postBody = $req->getParsedBody();
            $nodeModule = BeanFactory::getBean($postBody['module']);

            // build sql to drop table-column
            $deleteQuery = 'ALTER TABLE ' . $nodeModule->table_name . ' ';
            foreach ($postBody['dbcolumns'] as $column) {
                $deleteQuery .= 'DROP COLUMN ' . $column['name'] . ', ';
            }
            $deleteQuery = substr($deleteQuery, 0, -2);
            $deleteQuery .= ';';

            //execute query
            $result = $db->query($deleteQuery);

            return $res->withJson($result);
        }
    }

    /**
     * repairs the database and loads the core package
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws UnauthorizedException
     */
    public function repairAndReloadCore(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (SpiceUtils::isAdmin($current_user)) {
            $confLoader = new SpiceUIConfLoader();
            $db = DBManagerFactory::getInstance();
            if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
                $this->rebuildExtensions();
                $this->merge_files("Ext/TableDictionary/", 'tabledictionary.ext.php');
                $this->rebuildDictionaryRelationships();
            } else {
                VardefManager::clearVardef();
                $this->rebuildExtensions();
                $this->merge_files("Ext/TableDictionary/", 'tabledictionary.ext.php');
                $this->rebuildRelationships();
            }

            $sql = $this->buildSQLforRepair();
            if (!empty($sql)) {
                foreach (explode("\n", $sql) as $line) {
                    if (!strpos($line, '*') && !empty($line)) {
                        $queries[] = $line;
                    }
                }
                foreach ($queries as $query) {
                    $exec = $db->query($query, true, '', false, true);
                }
            } else {
                $exec = true;
            }

            $resConf = $confLoader->loadPackage('core');
            return $res->withJson(['repair' => $exec, 'core' => $resConf['success']]);
        }
        throw new UnauthorizedException();

    }

    /**
     * Converts the DB charset and collation
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function convertDatabase(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $body = $req->getParsedBody();
        $result = $db->convertDBCharset($body['charset'], $this->getCollation($body['charset']));

        return $res->withJson($result);
    }

    /**
     * Convert the charset and collation of the given tables
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function convertTables(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();

        foreach ($body['tables'] as $table) {
            $db->convertTableCharset($table, $body['charset'], $this->getCollation($body['charset']));
        }

        return $res->withJson(true);
    }

    /**
     * Returns the charset and collation info for the database and its tables
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getDatabaseCharsetInfo(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $result = $db->getDatabaseCharsetInfo();

        return $res->withJson($result);
    }

    private function getCollation(string $charset): string {
        switch ($charset) {
            case 'utf8mb4':
                return 'utf8mb4_general_ci';
            case 'utf8':
            default:
                return 'utf8_general_ci';
        }
    }
}
