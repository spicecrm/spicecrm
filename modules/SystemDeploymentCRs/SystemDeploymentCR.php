<?php


class SystemDeploymentCR extends SugarBean
{

    var $new_schema = true;
    var $module_dir = 'SystemDeploymentCRs';
    var $object_name = 'SystemDeploymentCR';
    var $table_name = 'systemdeploymentcrs';
    var $importable = false;

    function __construct()
    {
        parent::__construct();
    }

    function get_summary_text()
    {
        return $this->name;
    }

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function getList($data)
    {
        global $db;
        $start = (empty($data['start'])) ? 0 : $data['start'];
        $list = array();
        $total = $db->fetchByAssoc($db->query("SELECT COUNT(id) cnt FROM systemdeploymentcrs WHERE deleted = 0"));
        $res = $db->limitQuery("SELECT * FROM systemdeploymentcrs WHERE deleted = 0 ORDER BY date_entered DESC", $start, 50);
        $auth_rights = 0;
        if ($this->ACLAccess("list")) {
            $auth_rights = 1;
        }
        if ($this->ACLAccess("view")) {
            $auth_rights = 2;
        }
        if ($this->ACLAccess("edit")) {
            $auth_rights = 3;
        }
        if ($this->ACLAccess("create")) {
            $auth_rights = 4;
        }
        if ($this->ACLAccess("delete")) {
            $auth_rights = 5;
        }
        if ($auth_rights == 0) { //no rights in this module
            return array('list' => $list, 'total' => 0);
        }
        while ($row = $db->fetchByAssoc($res)) {
            $repairs = array();
            $rep_arr = explode(',', $row['repairs']);
            foreach ($rep_arr as $rep) {
                $repairs[] = substr($rep, 1, -1);
            }
            $repairmods = array();
            $repmod_arr = explode(',', $row['repair_modules']);
            foreach ($repmod_arr as $repmod) {
                $repairmods[] = substr($repmod, 1, -1);
            }
            $res1 = $db->query("SELECT * FROM krp_kcr WHERE systemdeploymentcr_id = '" . $row['id'] . "' AND deleted = 0");
            while ($row2 = $db->fetchByAssoc($res1)) $auth_rights = 2; //view
            $list[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'crid' => $row['crid'],
                'crstatus' => $row['crstatus'],
                'crtype' => $row['crtype'],
                'tickets' => $row['tickets'],
                'demandid' => $row['demandid'],
                'resolution' => $row['resolution'],
                'post_deploy_action' => $row['post_deploy_action'],
                'repairs' => $repairs,
                'repair_modules' => $repairmods,
                'description' => $row['description'],
                'date_entered' => $row['date_entered'],
                'auth_rights' => $auth_rights,
                'pre_deploy_action' => $row['pre_deploy_action']
            );
        }

        return array('list' => $list, 'total' => $total['cnt']);
    }

    public function save($check_notify = false){
        //set serviceticket_number
        if(empty($this->crid) || empty($this->id) || $this->new_with_id === true){
            $this->crid = SpiceNumberRanges::getNextNumberForField('SystemDeploymentCRs', 'crid');
        }

        return parent::save($check_notify);
    }


    function getFiles($data)
    {
        global $db;
        $rootDir = '.';
        if (!empty($data['nodeid'])) {
            $rootDir = $data['nodeid'];
        }

        $fileArray = array();
        $dirArray = array();
        if ($handle = opendir($rootDir)) {
            while (false !== ($file = readdir($handle))) {
                if ($file != '.' && $file != '..') {
                    $found = false;
                    if (!$found) {
                        if (filetype($rootDir . '/' . $file) == "dir") {
                            $dirArray[] = array(
                                'path' => $rootDir . '/' . $file,
                                'name' => $file,
                                'leaf' => false,
                                'isCommit' => false,
                                'date_changed' => date("Y-m-d H:i:s.", filemtime($rootDir . '/' . $file))
                            );
                        } else {
                            $fileArray[] = array(
                                'path' => $rootDir . '/' . $file,
                                'name' => $file,
                                'leaf' => true,
                                'isCommit' => false,
                                'date_changed' => date("Y-m-d H:i:s.", filemtime($rootDir . '/' . $file))
                            );
                        }
                    }
                }
            }

            closedir($handle);
        }
        usort($fileArray, function ($a, $b) {
            if (strtolower($a['name']) > strtolower($b['name']))
                return 1;
            elseif (strtolower($a['name']) == strtolower($b['name']))
                return 0;
            else
                return -1;
        });
        usort($dirArray, function ($a, $b) {
            if (strtolower($a['name']) > strtolower($b['name']))
                return 1;
            elseif (strtolower($a['name']) == strtolower($b['name']))
                return 0;
            else
                return -1;
        });
        $finalArray = array_merge($dirArray, $fileArray);
        if ($data['node'] == 'root') {
            return array(
                'path' => '.',
                'name' => './',
                'expanded' => true,
                'id' => 'masterroot',
                'children' => $finalArray
            );
        } else {
            return $finalArray;
        }
    }

    function getDetailFiles($data)
    {
        global $db;
        $list = array();
        $res = $db->query("SELECT * FROM systemdeploymentcrfiles WHERE systemdeploymentcr_id = '" . $data['id'] . "' AND deleted = 0");
        while ($row = $db->fetchByAssoc($res)) {
            $list[] = array(
                'path' => $row['name'],
                'name' => $row['name'],
                'date_changed' => date("Y-m-d H:i:s.", filemtime($row['name']))
            );
        }
        return array('list' => $list);
    }

    function getCommits($data)
    {
        global $db;
        $commList = array();
        $git = curl_init();

        $paramString = '';

        if (!empty($data['branch'])) {
            $paramString = '?sha=' . $data['branch'];
            if (!empty($data['until'])) {
                $paramString .= '&until=' . $data['until'];
            }
        }
        if (!empty($data['sha']) && $data['sha'] !== 'masterroot' && $data['node'] !== 'masterroot') {
            $paramString = '/' . $data['sha'];
        }
        $row = $db->fetchByAssoc($db->query("SELECT * FROM systemdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        curl_setopt($git, CURLOPT_URL, 'https://api.github.com/repos/' . $row['git_repo'] . '/commits' . (!empty($paramString) ? $paramString : ''));
        curl_setopt($git, CURLOPT_USERPWD, $row['git_user'] . ':' . $row['git_pass']);
        curl_setopt($git, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($git, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($git, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");

        $requestStart = microtime(true);
        $output = curl_exec($git);
        $requestStop = microtime(true);

        if ($output) {
            $commArray = json_decode($output, true);
            if (!empty($data['branch']) && ($data['sha'] === 'masterroot' || $data['node'] === 'masterroot')) {
                foreach ($commArray as $comm) {
                    $commList[] = array(
                        'id' => $comm['sha'],
                        'name' => $comm['commit']['message'] . " (" . $comm['commit']['author']['name'] . " / " . $comm['commit']['author']['date'] . ")",
                        'author' => $comm['commit']['author']['name'],
                        'date' => $comm['commit']['author']['date'],
                        'isCommit' => true,
                        'leaf' => false
                    );
                }
            }
            if (!empty($data['sha']) && $data['sha'] !== 'masterroot' && $data['node'] !== 'masterroot') {
                $id = $commArray['sha'];
                $autor = $commArray['commit']['author']['name'];
                $date = $commArray['commit']['author']['date'];
                foreach ($commArray['files'] as $file) {
                    $commList[] = array(
                        'id' => $id . "_" . $file['filename'],
                        'name' => $file['filename'],
                        'path' => $file['filename'],
                        'author' => $autor,
                        'date' => $date,
                        'isCommit' => false,
                        'leaf' => true
                    );
                }
            }
            if ($data['node'] == 'masterroot' && empty($data['until'])) {
                return array(
                    'path' => '.',
                    'name' => './',
                    'author' => '',
                    'date' => '',
                    'expanded' => true,
                    'id' => 'masterroot',
                    'children' => $commList
                );
            } else {
                return $commList;
            }
        }
    }

    function getBranches($data)
    {

        global $db;

        $branchList = array();
        $git = curl_init();
        $row = $db->fetchByAssoc($db->query("SELECT * FROM systemdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        curl_setopt($git, CURLOPT_URL, 'https://api.github.com/repos/' . $row['git_repo'] . '/branches');
        curl_setopt($git, CURLOPT_USERPWD, $row['git_user'] . ':' . $row['git_pass']);
        curl_setopt($git, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($git, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($git, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");

        $requestStart = microtime(true);
        $output = curl_exec($git);
        $requestStop = microtime(true);

        if ($output) {
            $branchArray = json_decode($output, true);
            foreach ($branchArray as $branch)
                $branchList[] = array(
                    'name' => $branch['name']
                );
        }

        return $branchList;
    }

    function getTables($data)
    {

        global $beanFiles;

        $tablesList = array();

        foreach ($beanFiles as $bean => $file) {
            if (file_exists($file)) {
                require_once($file);
                unset($GLOBALS['dictionary'][$bean]);
                $focus = new $bean ();
                if (($focus instanceOf SugarBean) && isset($focus->table_name) && !in_array($focus->table_name, $tablesList)) {
                    $tablesList[] = $focus->table_name;
                }
            }
        }

        include('modules/TableDictionary.php');

        foreach ($dictionary as $meta) {

            if (!isset($meta['table']) || in_array($meta['table'], $tablesList))
                continue;

            $tablesList[] = $meta['table'];
        }

        sort($tablesList);
        $return = array();
        foreach ($tablesList as $tablename) $return[] = array('name' => $tablename);

        return $return;
    }

    function getDBEntriesSQL()
    {
        $sqlArray = [];

        foreach ($this->getDetailDBEntries() as $entry) {
            switch ($entry['tableaction']) {
                case 'I':
                case 'U':
                    $entrydata = $this->db->fetchByAssoc($this->db->query("SELECT * FROM {$entry['tablename']} WHERE id = '{$entry['tablekey']}'"));
                    $fields = []; $values = [];
                    foreach($entrydata as $field => $value){

                        // add the package information
                        if($field == 'package' && $value == '' && $this->package != ''){
                            $value = $this->package;
                        }

                        $fields[] = $field;
                        $values[] = "'$value'";
                    }
                    $sqlArray[] = "REPLACE INTO {$entry['tablename']} (".implode(', ', $fields).") VALUES(".implode(', ', $values).")";
                    break;
                case 'D':
                    $sqlArray[] = "DELETE FROM {$entry['tablename']} WHERE id = '{$entry['tablekey']}'";
                    break;
            }
        }

        return implode(";\r\n", $sqlArray);
    }

    function getDetailDBEntries()
    {
        global $db, $beanFiles;
        $list = array();
        $res = $db->query("SELECT name, tablename, tableaction, tablekey, date_modified FROM systemdeploymentcrdbentrys WHERE systemdeploymentcr_id = '$this->id' AND deleted = 0 ORDER BY date_modified DESC ");
        while ($row = $db->fetchByAssoc($res)) {
            $detail = array();
            /*
            foreach ($beanFiles as $bean => $file) {
                if (file_exists($file)) {
                    require_once($file);
                    $focus = new $bean ();
                    if ($focus->table_name == $row['tablename']) {

                        $fieldArray = array();
                        foreach ($focus->field_defs as $fieldName => $fieldDefs) {
                            if (!empty($fieldDefs['name']) && $fieldDefs['source'] != 'non-db')
                                $fieldArray[] = $fieldDefs['name'];
                        }
                        $details = $this->getEntriesForTable($row['tablename'], '', $fieldArray, 0, $row['tablekey']);
                        $detail = $details[0]['detail'];
                    }
                }
            }
            */

            /*
            include('modules/TableDictionary.php');
            foreach ($dictionary as $meta) {
                if ($meta['table'] == $row['tablename']) {
                    $fieldArray = array();
                    foreach ($meta['fields'] as $fieldName => $fieldDefs) {
                        if (!empty($fieldDefs['name']) && $fieldDefs['source'] != 'non-db')
                            $fieldArray[] = $fieldDefs['name'];
                    }
                    $details = $this->getEntriesForTable($row['tablename'], '', $fieldArray, 0, $row['tablekey']);
                    $detail = $details[0]['detail'];
                }
            }
            */

            $list[] = array(
                'name' => $row['name'],
                'id' => $row['id'],
                'tablekey' => $row['tablekey'],
                'tablename' => $row['tablename'],
                'tableaction' => $row['tableaction'],
                'date_modified' => $row['date_modified']
            );
        }
        return $list;
    }

    /*
     * add a db reord entry
     * action si one of the following: I, U D (Insert, Update, Delete)
     */
    function addDBEntry($tableName, $id, $action, $name = '')
    {
        global $timedate;

        // check if we have a record
        $record = $this->db->fetchByAssoc($this->db->query("SELECT * FROM systemdeploymentcrdbentrys WHERE systemdeploymentcr_id='$this->id' AND tablename = '$tableName' AND tablekey='$id'"));
        if (!$record) {
            $this->db->query("INSERT INTO systemdeploymentcrdbentrys (id, name, systemdeploymentcr_id, tablename, tablekey, tableaction, date_modified, deleted) VALUES('" . create_guid() . "', '$name', '$this->id', '$tableName', '$id', '$action', '" . $timedate->nowDb() . "', 0)");
        } else {
            // if we inserted the record
            if ($action == 'D' && $record['tableaction'] == 'I') {
                $this->db->query("DELETE FROM systemdeploymentcrdbentrys WHERE id='{$record['id']}'");
            } else if ($action == 'U' && $record['tableaction'] == 'I') {
                $this->db->query("UPDATE systemdeploymentcrdbentrys SET date_modified='" . $timedate->nowDb() . "'  WHERE id='{$record['id']}'");
            } else {
                $this->db->query("UPDATE systemdeploymentcrdbentrys SET tableaction='$action', date_modified='" . $timedate->nowDb() . "'  WHERE id='{$record['id']}'");
            }
        }
    }

    function getDBEntries($data)
    {
        global $beanFiles;
        $children = array();
        $start = (empty($data['start'])) ? 0 : $data['start'];
        foreach ($beanFiles as $bean => $file) {
            if (file_exists($file)) {
                require_once($file);
                $focus = new $bean ();
                if ($focus->table_name == $data['table']) {

                    $fieldArray = array();
                    foreach ($focus->field_defs as $fieldName => $fieldDefs) {
                        if (!empty($fieldDefs['name']) && $fieldDefs['source'] != 'non-db')
                            $fieldArray[] = $fieldDefs['name'];
                    }

                    $children = $this->getEntriesForTable($data['table'], $data['search'], $fieldArray, $start, $data['id']);
                }
            }
        }

        include('modules/TableDictionary.php');
        foreach ($dictionary as $meta) {
            if ($meta['table'] == $data['table']) {
                foreach ($meta['fields'] as $fieldName => $fieldDefs) {
                    if (!empty($fieldDefs['name']) && $fieldDefs['source'] != 'non-db')
                        $fieldArray[] = $fieldDefs['name'];
                }
                $children = $this->getEntriesForTable($data['table'], $data['search'], $fieldArray, $start, $data['id']);
            }
        }
        $return = array(
            'list' => /*array(
                'path' => '.',
                'name' => './',
                'author' => '',
                'date' => '',
                'expanded' => true,
                'id' => 'masterroot',
                'children' =>*/
                $children['children']
            //)
        );

        $return['total'] = $children['total'];

        return $return;
    }

    private function getEntriesForTable($tableName, $tableFilter, $fieldDefs, $start = 0, $id = "")
    {
        global $db;

        $entries = array();

        $likeQuery = '';
        if (!empty($tableFilter)) {
            foreach ($fieldDefs as $thisField) {
                if (!empty($likeQuery))
                    $likeQuery .= ' OR ';

                $likeQuery .= $thisField . " like '%" . $tableFilter . "%'";
            }

            if (!empty($likeQuery))
                $likeQuery = ' WHERE (' . $likeQuery . ')';
        }
        if (!empty($likeQuery) && !empty($id)) $likeQuery .= " AND id = '$id'";
        if (empty($likeQuery) && !empty($id)) $likeQuery = " WHERE id = '$id'";

        $total = $db->fetchByAssoc($db->query("SELECT COUNT(id) cnt FROM $tableName" . $likeQuery));
        $dbObj = $db->limitQuery("SELECT * FROM $tableName" . $likeQuery, $start, 50);

        while ($thisEntry = $db->fetchByAssoc($dbObj)) {
            $fieldDetails = array();
            $labelName = empty($thisEntry['name']) ? $thisEntry['id'] : $thisEntry['name'];
            foreach ($fieldDefs as $thisField) {
                $fieldDetails[] = array(
                    'field' => $thisField,
                    'value' => $thisEntry[$thisField]
                );
            }
            $entries[] = array(
                'id' => $thisEntry['id'],
                'name' => $tableName . " / " . $labelName,
                'tablename' => $tableName,
                'detail' => $fieldDetails,
                'entryid' => $thisEntry['id']
            );
            if (!empty($id)) return $entries;
        }
        return array('total' => $total['cnt'], 'children' => $entries);
    }

    function getAppConfig()
    {
        global $db;
        $git_enabled = false;
        $row = $db->fetchByAssoc($db->query("SELECT * FROM systemdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        if (!empty($row['git_repo']) && !empty($row['git_user']) && !empty($row['git_pass'])) $git_enabled = true;
        return array('git_enabled' => $git_enabled);
    }
}