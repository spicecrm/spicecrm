<?php

require_once('data/SugarBean.php');
require_once('include/utils.php');

class KReleasePackage extends SugarBean {

    var $new_schema = true;
    var $module_dir = 'KReleasePackages';
    var $object_name = 'KReleasePackage';
    var $table_name = 'kreleasepackages';
    var $importable = false;

    function KReleasePackage() {
        parent::SugarBean();
    }

    function get_summary_text() {
        return $this->name;
    }

    function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':return true;
        }
        return false;
    }

    function getPrintOut() {
        global $db;
        $ss = new Sugar_Smarty();

        $ss->assign('KReleasePackage', $this);

        $linkedPackages = $this->get_linked_beans('kchangerequests', 'KDeploymentCR');
        foreach ($linkedPackages as $linkedPackageIndex => $thisLinkedPackage) {
            $dbentriesArray = array();
            foreach ($thisLinkedPackage->dbentriesArray as $dbEntryIndex => $thisDBEntry) {

                // make sure we only process one record once
                if (isset($dbentriesArray[md5($thisDBEntry['table_name'] . $thisDBEntry['id'])]))
                    continue;
                // get the data
                $dbRecord = $db->fetchByAssoc($db->query("SELECT * FROM " . $thisDBEntry['table_name'] . " WHERE id = '" . $thisDBEntry['id'] . "'"));
                if ($dbRecord) {
                    $thisLinkedPackage->dbentriesArray[$dbEntryIndex]['data'] = $dbRecord;
                    $dbentriesArray[md5($thisDBEntry['table_name'] . $thisDBEntry['id'])] = md5($thisDBEntry['table_name'] . $thisDBEntry['id']);
                }
            }
            if (count($dbentriesArray) > 0)
                $linkedPackages[$linkedPackageIndex] = $thisLinkedPackage;
        }
        $ss->assign('KChangeRequests', $linkedPackages);
        return $ss->fetch('modules/KReleasePackages/tpls/releasedocument.tpl');
    }

    function create_package() {
        global $sugar_config, $db;

        // remove the dircetoy if it exists 
        if (is_dir($sugar_config['upload_dir'] . $this->id))
            $this->removedir($sugar_config['upload_dir'] . $this->id);

        $linkedPackages = $this->get_linked_beans('kchangerequests', 'KDeploymentCR');

        mkdir($sugar_config['upload_dir'] . $this->id);
        mkdir($sugar_config['upload_dir'] . $this->id . '/files');
        $fileArray = array();
        $dbDefinitions = array();
        $dbentriesArray = array();
        foreach ($linkedPackages as $thisLinkedPackage) {
            foreach ($thisLinkedPackage->fileArray as $thisFile) {
                $thisGuid = create_guid();
                //$this->smartCopy(str_replace('*', '', $thisFile['name']), $sugar_config['upload_dir'] . $this->id . '/files/' . $thisGuid);
                $this->smartCopy(str_replace('*', '', $thisFile['name']), $sugar_config['upload_dir'] . $this->id . '/files/' . substr(str_replace('*', '', $thisFile['name']), 2));
                $fileArray[] = array(
                    'type' => $thisFile['type'],
                    'name' => str_replace('/*', '', $thisFile['name']),
                    'alias' => $thisGuid
                );
            }

            foreach ($thisLinkedPackage->dbentriesArray as $thisDBEntry) {

                // process the data definition
                if (!isset($dbDefinitions[$thisDBEntry['table_name']])) {
                    $metaData = $this->getMetadata($thisDBEntry['table_name']);
                    if ($metaData !== false) {
                        $dbDefinitions[$thisDBEntry['table_name']] = $metaData;
                    }
                }

                // make sure we only process one record once
                if (isset($dbentriesArray[md5($thisDBEntry['table_name'] . $thisDBEntry['id'])]))
                    continue;
                // get the data
                $dbRecord = $db->fetchByAssoc($db->query("SELECT * FROM " . $thisDBEntry['table_name'] . " WHERE id = '" . $thisDBEntry['id'] . "'"));
                if ($dbRecord) {
                    $dbentriesArray[md5($thisDBEntry['table_name'] . $thisDBEntry['id'])] = array(
                        'table_name' => $thisDBEntry['table_name'],
                        'id' => $thisDBEntry['id'],
                        'data' => $dbRecord
                    );
                }
            }
        }

        $fp = fopen($sugar_config['upload_dir'] . $this->id . '/manifest.php', 'w+');
        fwrite($fp, $this->write_patch_manifest($fileArray));
        fclose($fp);

        // add the releasepackager version
        if (!empty($this->release_version)) {
            mkdir($sugar_config['upload_dir'] . $this->id . '/files/custom/Extension/application/Ext/Include', '0755', true);
            $fp = fopen($sugar_config['upload_dir'] . $this->id . '/files/custom/Extension/application/Ext/Include/KReleaseManagerVersion.php', 'w+');
            fwrite($fp, $this->write_versionfile($fileArray));
            fclose($fp);
        }
        // handle SQLs
        if (count($dbentriesArray) > 0) {
            mkdir($sugar_config['upload_dir'] . $this->id . '/scripts');

            write_array_to_file('dbrecords', $dbentriesArray, $sugar_config['upload_dir'] . $this->id . '/scripts/dbrecords.php');
            write_array_to_file('dbdefinitions', $dbDefinitions, $sugar_config['upload_dir'] . $this->id . '/scripts/dbdefinitions.php');

            $this->smartCopy('modules/KReleasePackages/templates/post_install.php', $sugar_config['upload_dir'] . $this->id . '/scripts/post_install.php');
        }

        // create the archive
        require_once('include/utils/php_zip_utils.php');
        zip_dir($sugar_config['upload_dir'] . $this->id, $sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip');


        $filename = str_replace(' ', '_', $this->name) . '_' . date('Ymd_His') . '.zip';
        header('Content-type: application/zip');
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: " . filesize($sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip'));
        header('Content-Disposition: attachment; filename=' . $filename);

        readfile($sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip');
    }

    private function removedir($dir) {
        if (!is_dir($dir) || is_link($dir))
            return unlink($dir);
        foreach (scandir($dir) as $file) {
            if ($file == '.' || $file == '..')
                continue;
            if (!$this->removedir($dir . DIRECTORY_SEPARATOR . $file)) {
                return false;
            };
        }
        return rmdir($dir);
    }

    function smartCopy($source, $dest, $options = array('folderPermission' => 0755, 'filePermission' => 0755)) {
        $result = false;

        // make sure the directory we are copying to exists 
        $dirString = explode('/', $dest);
        array_pop($dirString);
        $fullDir = implode('/', $dirString);
        if (!is_dir($fullDir))
            mkdir($fullDir, $options['folderPermission'], true);

        if (is_file($source)) {
            if ($dest[strlen($dest) - 1] == '/') {
                if (!file_exists($dest)) {
                    cmfcDirectory::makeAll($dest, $options['folderPermission'], true);
                }
                $__dest = $dest . "/" . basename($source);
            } else {
                $__dest = $dest;
            }
            $result = copy($source, $__dest);
            chmod($__dest, $options['filePermission']);
        } elseif (is_dir($source)) {
            if ($dest[strlen($dest) - 1] == '/') {
                if ($source[strlen($source) - 1] == '/') {
                    //Copy only contents
                } else {
                    //Change parent itself and its contents
                    $dest = $dest . basename($source);
                    @mkdir($dest);
                    chmod($dest, $options['filePermission']);
                }
            } else {
                if ($source[strlen($source) - 1] == '/') {
                    //Copy parent directory with new name and all its content
                    @mkdir($dest, $options['folderPermission']);
                    chmod($dest, $options['filePermission']);
                } else {
                    //Copy parent directory with new name and all its content
                    @mkdir($dest, $options['folderPermission']);
                    chmod($dest, $options['filePermission']);
                }
            }

            $dirHandle = opendir($source);
            while ($file = readdir($dirHandle)) {
                if ($file != "." && $file != "..") {
                    if (!is_dir($source . "/" . $file)) {
                        $__dest = $dest . "/" . $file;
                    } else {
                        $__dest = $dest . "/" . $file;
                    }
                    $result = $this->smartCopy($source . "/" . $file, $__dest, $options);
                }
            }
            closedir($dirHandle);
        } else {
            $result = false;
        }
        return $result;
    }

    function getMetadata($tableName)
    {
        global $beanFiles, $beanList;

        $tablesList = array();

        foreach ($beanFiles as $bean => $file) {
            if (file_exists($file)) {
                require_once($file);
                $focus = new $bean ();
                if (($focus instanceOf SugarBean) && isset($focus->table_name) && $focus->table_name == $tableName) {
                    return array(
                        'type' => 'bean',
                        'bean' => array_search($bean, $beanList)
                    );
                }
            }
        }

        include('modules/TableDictionary.php');

        foreach ($dictionary as $meta) {

            if (!isset($meta['table']) || in_array($meta['table'], $tablesList))
                continue;

            if ($meta['table'] == $tableName) {
                return array(
                    'type' => 'meta',
                    'fields' => $meta['fields'],
                    'indices' => $meta['indices']
                );
            }
        }

        return false;
    }

    function write_patch_manifest($copyArray)
    {
        $template = new Sugar_Smarty();
        $template->assign('publishdate', date('Y/m/d'));
        $template->assign('version', $this->release_version);
        $template->assign('name', $this->name);
        $template->assign('regexmatches', $this->required_release_regex);
        $template->assign('copyArray', $copyArray);

        return $template->fetch('modules/KReleasePackages/templates/patch_manifest.php');
    }

    function write_versionfile()
    {
        $template = new Sugar_Smarty();
        $template->assign('version', $this->release_version);
        return $template->fetch('modules/KReleasePackages/templates/KReleaseManagerVersion.php');
    }

    function getFileChanges($source = '') {
        global $sugar_config;
        if (empty($source)) {
            $source = $sugar_config['upload_dir'] . $this->id . '/files';
            unlink($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html');
            file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', "<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'><style>body {font-family: 'Open Sans', sans-serif; padding: 10px;} </style>" . PHP_EOL, FILE_APPEND);
            file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', "<h1>Changelog Package ".$this->name."</h1>" . PHP_EOL, FILE_APPEND);
        }
        if (is_file($source)) {
            $this->trackFileChanges($source);
        } else {
            $dirHandle = opendir($source);
            while ($file = readdir($dirHandle)) {
                if ($file != "." && $file != ".." && $file != $this->id . '.zip') {
                    $this->getFileChanges($source . '/' . $file);
                }
            }
        }
    }

    function trackFileChanges($srcFile) {
        global $sugar_config;
        if (!empty($sugar_config['KReleaseManager']['reference'])) {

            file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', '<h2>File: ' . str_replace($sugar_config['upload_dir'] . $this->id . '/files/', '', $srcFile) . '</h2>' . PHP_EOL . PHP_EOL, FILE_APPEND);

            $refFile = str_replace($sugar_config['upload_dir'] . $this->id . '/files', $sugar_config['KReleaseManager']['reference'], $srcFile);

            if (file_exists($refFile)) {
                xdiff_file_diff($refFile, $srcFile, $sugar_config['upload_dir'] . $this->id . '/tmp.dif', 3, true);
                /*
                  ob_start();
                  readfile($sugar_config['upload_dir'] . $this->id . '/tmp.dif');
                  $change =  ob_get_contents();
                  ob_end_clean();
                 */
                if (filesize($sugar_config['upload_dir'] . $this->id . '/tmp.dif') == 0)
                    file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', 'files are identical<br>' . PHP_EOL, FILE_APPEND);
                else {
                    $file = fopen($sugar_config['upload_dir'] . $this->id . '/tmp.dif', "r");
                    while (!feof($file)) {
                        $line = fgets($file);
                        $line = str_replace(array('>', '<'), array('&gt;', '&lt;'),$line);
                        switch(substr($line, 0, 1)){
                            case '-':
                                $line = '<code style="background-color:#FFBB99">' . $line .'</code>';
                                break;
                            case '+':
                                $line = '<code style="background-color:#99FFAA">' . $line .'</code>';
                                break;
                            default:
                                $line = '<code>' . $line .'</code>';
                                break;
                        }
                        $line .= '<br>';
                        file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', $line . PHP_EOL, FILE_APPEND);
                    }
                    fclose($file);
                }
            } else {
                file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', 'file added<br>' . PHP_EOL, FILE_APPEND);
            }

            file_put_contents($sugar_config['upload_dir'] . $this->id . '/package_dif_'.$this->id.'.html', PHP_EOL . '-----' . PHP_EOL, FILE_APPEND);
        }
    }

    function write_manifest($copyArray) {
        $manifestString = "<?php
            \$manifest = array(
                'acceptable_sugar_flavors' => array(
                    'CE'
                ),
                'acceptable_sugar_versions' => array(
                    '6.*.*'
                ),
                'is_uninstallable' => false,
                'name' => '" . $this->name . "',
                'author' => '20reasons Business Solutions',
                'published_date' => '" . date('Y/m/d') . "',
                'version' => '" . $this->release_version . "',
                'type' => 'module'
            );";

        $manifestString .="
            \$installdefs = array(
            'id' => 'vippackage',
            'copy' => array(";

        foreach ($copyArray as $thisFile) {
            $manifestString .="array(
                    'from' => '<basepath>/files/" . $thisFile['alias'] . "',
                    'to' => '" . $thisFile['name'] . "',
                ),";
        }

        $manifestString .=")
        );";

        return $manifestString;
    }

    function retrieve($id = -1, $encode = true, $deleted = true) {
        $thisResult = parent::retrieve($id, $encode, $deleted);

        if ($thisResult == false)
            return $thisResult;
        $linkedIds = array();
        $conflictingIDs = array();
        $linkedChangeRequests = $this->get_linked_beans('kchangerequests', 'KDeploymentCR');
        foreach ($linkedChangeRequests as $linkedChangeRequest) {
            $linkedIds[] = $linkedChangeRequest->id;
            foreach ($linkedChangeRequest->conflictArray as $conflictId => $conflictBean) {
                if (!isset($conflictingIDs[$conflictId]))
                    $conflictingIDs[$conflictId] = $conflictBean;
            }
        }

        foreach ($linkedIds as $thisLinkedId) {
            unset($conflictingIDs[$thisLinkedId]);
        }

        foreach ($conflictingIDs as $conflictId => $conflictBean) {
            if (!empty($this->conflict_with))
                $this->conflict_with .= ', ';
            $this->conflict_with .= $conflictBean->name;
        }

        // see if we have a file id


        return $thisResult;
    }

    function release_package($id)
    {
        global $sugar_config, $db;
        if(empty($this->id)) $this->retrieve($id);
        $linkedPackages = $this->get_linked_beans('kchangerequests', 'KDeploymentCR');

        $fileArray = array();
        $dbDefinitions = array();
        $dbentriesArray = array();
        $modules_array = array();
        $repair_array = array();
        foreach ($linkedPackages as $thisLinkedPackage) {
            $parts_modules = explode('^,^', substr($thisLinkedPackage->repair_modules, 1, -1));
            foreach ($parts_modules as $mod) {
                if (!array_search($mod, $modules_array)) {
                    $modules_array[] = $mod;
                }
            }
            $parts_repair = explode('^,^', substr($thisLinkedPackage->repairs, 1, -1));
            foreach ($parts_repair as $rep) {
                if (!array_search($rep, $repair_array)) {
                    $repair_array[] = $rep;
                }
            }
            $fileres = $db->query("SELECT name FROM kdeploymentcrfiles WHERE deleted = 0 AND kdeploymentcr_id = '".$thisLinkedPackage->id."'");
            while ($thisFile = $db->fetchByAssoc($fileres)) {
                $this->smartCopyDb(str_replace('*', '', $thisFile['name']), $sugar_config['upload_dir'] . $this->id . '/files/' . substr(str_replace('*', '', $thisFile['name']), 2));
            }

            $dbres = $db->query("SELECT tablename, tablekey FROM kdeploymentcrdbentrys WHERE deleted = 0 AND kdeploymentcr_id = '".$thisLinkedPackage->id."'");
            while ($thisDBEntry = $db->fetchByAssoc($dbres)) {

                // process the data definition
                if (!isset($dbDefinitions[$thisDBEntry['tablename']])) {
                    $metaData = $this->getMetadata($thisDBEntry['tablename']);
                    if ($metaData !== false) {
                        $dbDefinitions[$thisDBEntry['tablename']] = $metaData;
                    }
                }

                // make sure we only process one record once
                if (isset($dbentriesArray[md5($thisDBEntry['tablename'] . $thisDBEntry['tablekey'])]))
                    continue;
                // get the data
                $dbRecord = $db->fetchByAssoc($db->query("SELECT * FROM " . $thisDBEntry['tablename'] . " WHERE id = '" . $thisDBEntry['tablekey'] . "'"));
                if ($dbRecord) {
                    $item_id = create_guid();
                    $content_id = create_guid();
                    $db->query("INSERT INTO kdeploypack_items (id,kreleasepackage_id,ckey,ctype,date_modified) VALUES ('$item_id','$this->id','" . $thisDBEntry['tablename'] . "/" . $thisDBEntry['tablekey'] . "','db', sysdate())");
                    $dbContent = base64_encode(json_encode($dbRecord));
                    $db->query("INSERT INTO kdeploypack_contents (id,kdeploypack_item_id,content,ctype) VALUES ('$content_id','$item_id','$dbContent','P')");
                    $dbentriesArray[md5($thisDBEntry['tablename'] . $thisDBEntry['tablekey'])] = array(
                        'table_name' => $thisDBEntry['tablename'],
                        'id' => $thisDBEntry['tablekey'],
                        'data' => $dbRecord
                    );
                }
            }
        }
        if (count($repair_array) > 0) {
            $this->repairs = "^" . implode("^,^", $repair_array) . "^";
        }
        if (count($modules_array) > 0) {
            $this->repair_modules = "^" . implode("^,^", $modules_array) . "^";
        }
        $this->rpstatus = '7';
        $td = new TimeDate();
        if(empty($this->release_date)) $this->release_date = $td->asUser($td->getNow());
        if(empty($this->source_release_date)) $this->source_release_date = $td->asUser($td->getNow());
        $this->save();

        // handle SQLs
        /*
        if (count($dbentriesArray) > 0) {
            mkdir($sugar_config['upload_dir'] . $this->id . '/scripts');

            write_array_to_file('dbrecords', $dbentriesArray, $sugar_config['upload_dir'] . $this->id . '/scripts/dbrecords.php');
            write_array_to_file('dbdefinitions', $dbDefinitions, $sugar_config['upload_dir'] . $this->id . '/scripts/dbdefinitions.php');

            $this->smartCopy('modules/KReleasePackages/templates/post_install.php', $sugar_config['upload_dir'] . $this->id . '/scripts/post_install.php');
        }

        // create the archive
        require_once('include/utils/php_zip_utils.php');
        zip_dir($sugar_config['upload_dir'] . $this->id, $sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip');


        $filename = str_replace(' ', '_', $this->name) . '_' . date('Ymd_His') . '.zip';
        header('Content-type: application/zip');
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: " . filesize($sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip'));
        header('Content-Disposition: attachment; filename=' . $filename);

        readfile($sugar_config['upload_dir'] . $this->id . '/' . $this->id . '.zip');
        */
    }

    function smartCopyDb($source, $dest, $options = array('folderPermission' => 0755, 'filePermission' => 0755))
    {
        global $db;
        $result = false;

        // make sure the directory we are copying to exists
        $dirString = explode('/', $dest);
        array_pop($dirString);
        $fullDir = implode('/', $dirString);
        if (!is_dir($fullDir))
            mkdir($fullDir, $options['folderPermission'], true);

        if (is_file($source)) {
            $item_id = create_guid();
            $content_id = create_guid();
            $db->query("INSERT INTO kdeploypack_items (id,kreleasepackage_id,ckey,ctype,date_modified) VALUES ('$item_id','$this->id','$source','file', sysdate())");
            $fileContent = base64_encode(file_get_contents($source));
            $db->query("INSERT INTO kdeploypack_contents (id,kdeploypack_item_id,content,ctype) VALUES ('$content_id','$item_id','$fileContent','P')");
        } elseif (is_dir($source)) {
            $dirHandle = opendir($source);
            while ($file = readdir($dirHandle)) {
                if ($file != "." && $file != "..") {
                    if (!is_dir($source . "/" . $file)) {
                        $__dest = $dest . "/" . $file;
                    } else {
                        $__dest = $dest . "/" . $file;
                    }
                    $result = $this->smartCopyDb($source . "/" . $file, $__dest, $options);
                }
            }
            closedir($dirHandle);
        } else {
            $result = false;
        }
        return $result;
    }

    /* START functions for ReleasePackage Manager */

    function getList($data){
        global $db;
        $list = array();
        $start = (empty($data['start'])) ? 0 : $data['start'];
        $total = $db->fetchByAssoc($db->query("SELECT COUNT(id) cnt FROM kreleasepackages WHERE deleted = 0"));
        $res = $db->limitQuery("SELECT * FROM kreleasepackages WHERE deleted = 0 ORDER BY date_entered DESC",$start,50);
        $auth_rights = 0;
        if($this->aclAccess("list")){
            $auth_rights = 1;
        }
        if($this->aclAccess("view")){
            $auth_rights = 2;
        }
        if($this->aclAccess("edit")){
            $auth_rights = 3;
        }
        if($this->aclAccess("create")){
            $auth_rights = 4;
        }
        if($this->aclAccess("delete")){
            $auth_rights = 5;
        }
        if($auth_rights == 0){ //no rights in this module
            return array('list' => $list, 'total' => 0);
        }
        while ($row = $db->fetchByAssoc($res)) {
            if($row['rpstatus'] >= 2) $auth_rights = 2; // no edit after status complete
            $list[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'rpstatus' => $row['rpstatus'],
                'rptype' => $row['rptype'],
                'release_version' => $row['release_version'],
                'set_version' => $row['set_version'],
                'release_date' => $row['release_date'],
                'required_release_regex' => $row['required_release_regex'],
                'software_name' => $row['software_name'],
                'software_version_major' => $row['software_version_major'],
                'software_version_minor' => $row['software_version_minor'],
                'software_version_release' => $row['software_version_release'],
                'date_entered' => $row['date_entered'],
                'auth_rights' => $auth_rights
            );
        }

        return array('list' => $list, 'total' => $total['cnt']);
    }

    function saveRP($data){
        global $db, $sugar_config;
        $this->retrieve($data['id']);
        if (empty($this->id)) {
            $this->new_with_id = true;
            $this->id = $data['id'];
        }
        $this->name = $data['name'];
        $this->rpstatus = $data['rpstatus'];
        $this->rptype = $data['rptype'];
        $this->release_version = $data['release_version'];
        $this->set_version = $data['set_version'];
        $this->release_date = $data['release_date'];
        $this->required_release_regex = $data['required_release_regex'];
        $this->software_name = $data['software_name'];
        $this->software_hash = md5($data['software_name'].$sugar_config['site_url']);
        $this->software_version_major = $data['software_version_major'];
        $this->software_version_minor = $data['software_version_minor'];
        $this->software_version_release = $data['software_version_release'];
        if(empty($data['source_system'])){
            $sysid = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE this_system = 1 AND deleted = 0"));
            $this->source_system = $sysid['id'];
        }else{
            $this->source_system = $data['source_system'];
        }
        $this->save();

        $oldCRs = array();
        $res = $db->query("SELECT kdeploymentcr_id FROM krp_kcr WHERE kreleasepackage_id = '" . $data['id'] . "' AND deleted = 0");
        while ($row = $db->fetchByAssoc($res)) $oldCRs[$row['kdeploymentcr_id']] = $row['kdeploymentcr_id'];
        $crs = json_decode($data['crs']);
        foreach ($crs as $cr_id) {
            $td = new TimeDate();
            $modified = date($td->get_db_date_format());
            if(empty($oldCRs[$cr_id])){
                $oldCRs[$cr_id] = null;
                unset($oldCRs[$cr_id]);
                $db->query("INSERT INTO krp_kcr (id, kreleasepackage_id, kdeploymentcr_id, date_modified, deleted) VALUES (UUID(), '" . $data['id'] . "', '$cr_id', '$modified', 0)");
            }else{
                $oldCRs[$cr_id] = null;
                unset($oldCRs[$cr_id]);
            }
        }
        foreach($oldCRs as $key => $cr_id){
            $db->query("UPDATE krp_kcr SET deleted = 1 WHERE kdeploymentcr_id = '$cr_id' AND kreleasepackage_id = '" . $data['id'] . "' AND deleted = 0");
        }


        return array('status' => 'OK', 'date_entered' => $this->date_entered, 'name' => $this->name, 'rptype' => $this->rptype, 'id' => $this->id);
    }

    function getCRs($data){
        global $db;
        $list = array();
        $res = $db->query("SELECT cr.* FROM kdeploymentcrs cr INNER JOIN krp_kcr rp ON rp.kdeploymentcr_id = cr.id AND rp.kreleasepackage_id = '".$data['id']."' WHERE cr.deleted = 0 AND cr.crstatus = 3 ORDER BY cr.date_entered DESC");
        while ($row = $db->fetchByAssoc($res)) {
            $list[] = array(
                'name' => $row['name'],
                'id' => $row['id'],
                'date_entered' => $row['date_entered']
            );
        }
        return array('list' => $list);
    }

    function getCRList(){
        global $db;
        $list = array();
        $start = (empty($data['start'])) ? 0 : $data['start'];
        $total = $db->fetchByAssoc($db->query("SELECT COUNT(cr.id) cnt FROM kdeploymentcrs cr WHERE cr.deleted = 0 AND cr.crstatus = 3 AND cr.id NOT IN (SELECT rc.kdeploymentcr_id FROM krp_kcr rc WHERE rc.deleted = 0)"));
        $res = $db->limitQuery("SELECT cr.* FROM kdeploymentcrs cr WHERE cr.deleted = 0 AND cr.crstatus = 3 AND cr.id NOT IN (SELECT rc.kdeploymentcr_id FROM krp_kcr rc WHERE rc.deleted = 0) ORDER BY cr.date_entered DESC",$start,50);
        while ($row = $db->fetchByAssoc($res)) {
            $list[] = array(
                'name' => $row['name'],
                'id' => $row['id'],
                'date_entered' => $row['date_entered']
            );
        }
        return array('list' => $list, 'total' => $total['cnt']);
    }
}
