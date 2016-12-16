<?php

require_once('data/SugarBean.php');
require_once('include/utils.php');

class KDeploymentSystem extends SugarBean
{

    var $new_schema = true;
    var $module_dir = 'KDeploymentSystems';
    var $object_name = 'KDeploymentSystem';
    var $table_name = 'kdeploymentsystems';
    var $importable = false;

    function KDeploymentSystem()
    {
        parent::SugarBean();
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

    function test_connection($post)
    {
        $options = array(
            CURLOPT_RETURNTRANSFER => true,         // return web page
            CURLOPT_HEADER => false,        // don't return headers
            CURLOPT_VERBOSE => 1                //
        );
        if (substr($post['url'], -1) === "/") {
            $post['url'] .= "KREST/login";
        } else {
            $post['url'] .= "/KREST/login";
        }
        $post['url'] .= "?user_name=" . $post['user'] . "&password=" . md5($post['password']);
        $ch = curl_init($post['url']);
        curl_setopt_array($ch, $options);
        $content = curl_exec($ch);
        $err = curl_errno($ch);
        $errmsg = curl_error($ch);
        $header = curl_getinfo($ch);
        curl_close($ch);

        $header['errno'] = $err;
        $header['errmsg'] = $errmsg;
        $header['content'] = $content;
        return $header;
    }

    function add_system_link($id, $link)
    {
        global $db;
        $guid = create_guid();
        $sql = "INSERT INTO kdeploymentsystems_kdeploymentsystems (id, kdeploymentsystem1_id, kdeploymentsystem2_id, date_modified) VALUES ('$guid', '$id', '$link', NOW())";
        $db->query($sql);
        return $guid;
    }

    function distribute($id)
    {
        if (!empty($id)) {
            $this->retrieve($id);
            $data = "data=" . json_encode($this->get_dist_data($id));
            $options = array(
                CURLOPT_RETURNTRANSFER => true,         // return web page
                CURLOPT_HEADER => false,        // don't return headers
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $data              //
            );
            if (substr($this->url, -1) === "/") {
                $this->url .= "KREST/kdeployment/distribute";
            } else {
                $this->url .= "/KREST/kdeployment/distribute";
            }
            $this->url .= "?user_name=" . $this->sys_username . "&password=" . md5($this->sys_password);//."&data=".json_encode($this->get_dist_data());
            $ch = curl_init($this->url);
            curl_setopt_array($ch, $options);
            $content = curl_exec($ch);
            $err = curl_errno($ch);
            $errmsg = curl_error($ch);
            $header = curl_getinfo($ch);
            curl_close($ch);

            $header['errno'] = $err;
            $header['errmsg'] = $errmsg;
            $header['content'] = $content;
            return $header;
        }
    }

    function get_dist_data($id)
    {
        global $db;
        $return = array(
            'systems' => array(),
            'links' => array()
        );
        $res = $db->query("SELECT * FROM kdeploymentsystems WHERE deleted = 0");
        while ($row = $db->fetchByAssoc($res)) {
            if ($row['id'] === $id) {
                $row['this_system'] = 1;
            } else {
                $row['this_system'] = 0;
            }
            $return['systems'][] = $row;
        }
        $res = $db->query("SELECT * FROM kdeploymentsystems_kdeploymentsystems WHERE deleted = 0");
        while ($row = $db->fetchByAssoc($res)) {
            $return['links'][] = $row;
        }
        $data['systems'] = base64_encode(json_encode($return['systems']));
        $data['links'] = base64_encode(json_encode($return['links']));
        return $data;
    }

    function import_systems($params)
    {
        global $db;
        $data['systems'] = json_decode(base64_decode(html_entity_decode($params['systems'])));
        $data['links'] = json_decode(base64_decode(html_entity_decode($params['links'])));
        //$GLOBALS['log']->fatal("KREST import_systems:\n".print_r($data,true));
        if (count($data['systems']) > 0) {
            $db->query("DELETE FROM kdeploymentsystems");
            foreach ($data['systems'] as $sys) {
                $sql = "INSERT INTO kdeploymentsystems (id,name,date_entered,date_modified,modified_user_id,created_by,description,assigned_user_id,sys_username,sys_password,master_flag,url,type,this_system) VALUES ('$sys->id','$sys->name','$sys->date_entered','$sys->date_modified','$sys->modified_user_id','$sys->created_by','$sys->description','$sys->assigned_user_id','$sys->sys_username','$sys->sys_password',$sys->master_flag,'$sys->url','$sys->type',$sys->this_system)";
                $db->query($sql);
            }
        }
        if (count($data['links']) > 0) {
            $db->query("DELETE FROM kdeploymentsystems_kdeploymentsystems");
            foreach ($data['links'] as $link) {
                $sql = "INSERT INTO kdeploymentsystems_kdeploymentsystems (id,kdeploymentsystem1_id,kdeploymentsystem2_id,date_modified) VALUES ('$link->id','$link->kdeploymentsystem1_id','$link->kdeploymentsystem2_id','$link->date_modified')";
                $db->query($sql);
            }
        }
        return "OK";
    }

    function get_systems()
    {
        $this_found = false;
        $bean_list = $this->get_full_list();
        $systems = array();

        foreach ($bean_list as $bean) {
            $systems[] = array(
                'id' => $bean->id,
                'name' => $bean->name,
                'url' => $bean->url,
                'sys_username' => $bean->sys_username,
                'sys_password' => $bean->sys_password,
                'master_flag' => $bean->master_flag,
                'type' => $bean->type,
                'this_system' => $bean->this_system,
                'status' => $bean->status,
                'add_systems' => $bean->add_systems ?: json_encode(array()),
                'git_repo' => $bean->git_repo,
                'git_user' => $bean->git_user,
                'git_pass' => $bean->git_pass
            );
            if ($bean->this_system === '1') {
                $this_found = true;
            }
        }

        if (!$this_found) {
            global $sugar_config;
            $this->new_with_id = true;
            $this->id = '1';
            $this->name = 'this system';
            $this->url = $sugar_config['site_url'];
            $this->this_system = 1;
            $this->master_flag = 1;
            $id = $this->save();
            $systems[] = array(
                'id' => $id,
                'name' => $this->name,
                'url' => $this->url,
                'sys_username' => '',
                'sys_password' => '',
                'master_flag' => '1',
                'type' => '',
                'this_system' => '1',
                'status' => '',
                'add_systems' => json_encode(array())
            );
        }

        return array('list' => $systems);
    }

    function get_source_systems()
    {
        global $db;
        $systems = array();
        $row = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        if (!empty($row['id'])) {
            $this->retrieve($row['id']);
            $bean_list = $this->get_linked_beans('kdeploymentsystems_link', 'KDeploymentSystem');

            foreach ($bean_list as $bean) {
                $systems[] = array(
                    'id' => $bean->id,
                    'name' => $bean->name,
                    'url' => $bean->url,
                    'sys_username' => $bean->sys_username,
                    'sys_password' => $bean->sys_password,
                    'master_flag' => $bean->master_flag,
                    'type' => $bean->type,
                    'this_system' => $bean->this_system
                );
            }
        }

        return array('list' => $systems);
    }

    function del_system($id)
    {
        global $db;
        $this->retrieve($id);
        $this->mark_deleted($id);
        $db->query("UPDATE kdeploymentsystems_kdeploymentsystems SET deleted = 1 WHERE kdeploymentsystem2_id = '$id'");
    }

    function get_release_packages($params)
    {
        global $db, $app_list_strings;
        require_once('modules/KReleasePackages/KReleasePackage.php');
        include('custom/application/Ext/Language/en_us.lang.ext.php');
        if(empty($params['start'])) $start = 0; else $start = $params['start'];
        $rp = new KReleasePackage();
        if ($params['remote'] === '1') {
            $bean_list = $rp->get_list('release_date', "kreleasepackages.rpstatus = '7'",$start,50);
        } else {
            $bean_list = $rp->get_list('release_date','',$start,50);
        }
        $packages = array();
        $fetched = array();
        $res = $db->query("SELECT kreleasepackage_id FROM kdeploypack_sysstatus WHERE kdeploymentsystem_id = '" . $params['sysid'] . "'");
        while ($row = $db->fetchByAssoc($res)) {
            $fetched[$row['kreleasepackage_id']] = $row['kreleasepackage_id'];
        }
        foreach ($bean_list['list'] as $bean) {
            if (empty($fetched[$bean->id])) {
                $items = array();
                $res = $db->query("SELECT id,ckey,ctype, date_modified FROM kdeploypack_items WHERE kreleasepackage_id = '$bean->id' AND deleted = 0");
                while ($row = $db->fetchByAssoc($res)) $items[] = $row;
                if ($params['remote'] === '1') {
                    $remote = 1;
                } else {
                    $remote = 0;
                }
                $source = $db->fetchByAssoc($db->query("SELECT name FROM kdeploymentsystems WHERE id = '" . $bean->source_system . "'"));
                //if(count($items) == 0) continue;
                $packages[] = array(
                    'id' => $bean->id,
                    'name' => $bean->name,
                    'rpstatus' => $app_list_strings['rpstatus_dom'][$bean->rpstatus],
                    'rptype' => $app_list_strings['rptype_dom'][$bean->rptype],
                    'rpstatus_raw' => $bean->rpstatus,
                    'rptype_raw' => $bean->rptype,
                    'release_date' => $bean->release_date,
                    'release_version' => $bean->release_version,
                    'items' => $items,
                    'remote' => $remote,
                    'source_release_date' => $bean->source_release_date,
                    'source_system_id' => $bean->source_system,
                    'source_system_name' => (empty($source['name'])) ? $bean->source_system : $source['name']
                );
            }
        }
        return array('list' => $packages);
    }

    function get_remote_packages($system_id)
    {
        global $db;
        if (!empty($system_id)) {
            $this->retrieve($system_id);
            $sysid = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE this_system = 1 AND deleted = 0"));
            $options = array(
                CURLOPT_RETURNTRANSFER => true,         // return web page
                CURLOPT_HEADER => false,        // don't return headers
                CURLOPT_POST => false
            );
            if(!empty($params['start'])) $start = 0; else $start = $params['start'];
            if (substr($this->url, -1) === "/") {
                $this->url .= "KREST/kdeployment/localReleasePackages";
            } else {
                $this->url .= "/KREST/kdeployment/localReleasePackages";
            }
            $this->url .= "?remote=1&user_name=" . $this->sys_username . "&password=" . md5($this->sys_password) . "&sysid=" . $sysid['id']."&start=".$start;//."&data=".json_encode($this->get_dist_data());
            $ch = curl_init($this->url);
            curl_setopt_array($ch, $options);
            $content = curl_exec($ch);
            $err = curl_errno($ch);
            $errmsg = curl_error($ch);
            $header = curl_getinfo($ch);
            curl_close($ch);

            $header['errno'] = $err;
            $header['errmsg'] = $errmsg;
            $header['content'] = $content;
            return json_decode($content);
        }
    }

    function fetch_remote_package($id, $system, $data)
    {
        global $db;
        set_time_limit(900);
        require_once('modules/KReleasePackages/KReleasePackage.php');
        $rp = new KReleasePackage();
        $rp->new_with_id = true;
        $rp->id = $data['id'];
        $rp->name = $data['name'];
        $rp->rpstatus = '5';
        $rp->rptype = $data['rptype_raw'];
        $rp->release_version = $data['release_version'];
        $rp->source_release_date = $data['release_date'];
        $rp->source_system = $system;
        $rp->save(false);
        foreach ($data['items'] as $item) {
            $db->query("INSERT INTO kdeploypack_items (id,ckey,ctype,kreleasepackage_id,date_modified) VALUE ('" . $item['id'] . "','" . $item['ckey'] . "','" . $item['ctype'] . "','$id','" . $item['date_modified'] . "')");
        }
        $sysid = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE this_system = 1 AND deleted = 0"));
        //contents von remote $system holen
        $this->retrieve($system);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,         // return web page
            CURLOPT_HEADER => false,        // don't return headers
            CURLOPT_POST => false
        );
        if (substr($this->url, -1) === "/") {
            $this->url .= "KREST/kdeployment/fetchReleasePackageContent/$id/" . $sysid['id'];
        } else {
            $this->url .= "/KREST/kdeployment/fetchReleasePackageContent/$id/" . $sysid['id'];
        }
        $this->url .= "?&user_name=" . $this->sys_username . "&password=" . md5($this->sys_password);//."&data=".json_encode($this->get_dist_data());
        $ch = curl_init($this->url);
        curl_setopt_array($ch, $options);
        $content = curl_exec($ch);
        $err = curl_errno($ch);
        $errmsg = curl_error($ch);
        $header = curl_getinfo($ch);
        curl_close($ch);

        $header['errno'] = $err;
        $header['errmsg'] = $errmsg;
        $header['content'] = $content;

        $res_content = json_decode($content);
        foreach ($res_content as $item) {
            $db->query("INSERT INTO kdeploypack_contents (id, kdeploypack_item_id, content, ctype, deleted) VALUES ('" . $item->id . "','" . $item->kdeploypack_item_id . "','" . $item->content . "','" . $item->ctype . "','" . $item->deleted . "')");
        }
        $this->notify_source_systems($id, '5');
        return array('OK');
    }

    function notify_source_systems($package_id, $status)
    {
        global $db;
        $row = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        if (!empty($row['id'])) {
            $this->retrieve($row['id']);
            $this->update_remote_package_status($package_id, $status, $row['id']);
            $bean_list = $this->get_linked_beans('kdeploymentsystems_link', 'KDeploymentSystem');
            $row2 = $db->fetchByAssoc($db->query("SELECT id FROM kdeploymentsystems WHERE deleted = 0 AND master_flag = 1"));
            require_once('data/BeanFactory.php');
            $master = BeanFactory::getBean('KDeploymentSystems', $row2['id']);
            if (!empty($master->id)) {
                $bean_list[] = $master;
            }
            $notified_systems = array();
            foreach ($bean_list as $bean) {
                if(!empty($notified_systems[$bean->id])){
                    continue;
                }else{
                    $notified_systems[$bean->id] = $bean->id;
                }
                $options = array(
                    CURLOPT_RETURNTRANSFER => true,         // return web page
                    CURLOPT_HEADER => false,        // don't return headers
                    CURLOPT_POST => false
                );
                if (substr($bean->url, -1) === "/") {
                    $bean->url .= "KREST/kdeployment/remoteReleasePackageStatusUpdate/$package_id/$status/".$this->id;
                } else {
                    $bean->url .= "/KREST/kdeployment/remoteReleasePackageStatusUpdate/$package_id/$status/".$this->id;
                }
                $bean->url .= "?user_name=" . $bean->sys_username . "&password=" . md5($bean->sys_password);
                $ch = curl_init($bean->url);
                curl_setopt_array($ch, $options);
                $content = curl_exec($ch);
                $err = curl_errno($ch);
                $errmsg = curl_error($ch);
                $header = curl_getinfo($ch);
                curl_close($ch);

                $header['errno'] = $err;
                $header['errmsg'] = $errmsg;
                $header['content'] = $content;
                //return json_decode($content);
            }
        }
        return array('OK');
    }

    function update_remote_package_status($pack_id, $status, $sysid)
    {
        $return = array('status' => 'ok', 'msg' => '');
        global $db;
        $td = new TimeDate();
        $date = date($td->get_db_date_time_format());
        $res = $db->query("SELECT * FROM kdeploypack_sysstatus WHERE kreleasepackage_id = '$pack_id' AND kdeploymentsystem_id = '$sysid'");
        $entrys = array();
        while($entry = $db->fetchByAssoc($res)) $entrys[] = $entry;
        if (count($entrys) > 0) {
            foreach($entrys as $row) {
                $db->query("UPDATE kdeploypack_sysstatus SET history = 1 WHERE id = '" . $row['id'] . "'");
            }
            $db->query("INSERT INTO kdeploypack_sysstatus (id, kreleasepackage_id, kdeploymentsystem_id, pstatus,date_modified,history) VALUES ('" . create_guid() . "','$pack_id','$sysid','$status','$date',0)");
        } else {
            $db->query("INSERT INTO kdeploypack_sysstatus (id, kreleasepackage_id, kdeploymentsystem_id, pstatus,date_modified,history) VALUES ('" . create_guid() . "','$pack_id','$sysid','$status','$date',0)");
        }
        return $return;
    }

    function fetch_package_content($id, $system)
    {
        global $db;
        $sql = "SELECT * FROM kdeploypack_contents WHERE kdeploypack_item_id IN (SELECT id FROM kdeploypack_items WHERE kreleasepackage_id = '$id')";
        $res = $db->query($sql);
        $content = array();
        while ($row = $db->fetchByAssoc($res)) {
            $content[] = $row;
        }
        return $content;
    }

    function release_package($packs)
    {
        $return = array('status' => 'ok', 'msg' => '');
        foreach ($packs as $pack_id) {
            $this->notify_source_systems($pack_id, '7');
            require_once('modules/KReleasePackages/KReleasePackage.php');
            $rp = new KReleasePackage();
            $rp->retrieve($pack_id);
            $rp->rpstatus = '7';
            $rp->release_date = $GLOBALS['timedate']->nowDb();
            $rp->save();
        }
        return $return;
    }

    function mark_deployed($packs)
    {
        $return = array('status' => 'ok', 'msg' => '');
        foreach ($packs as $pack_id) {
            $this->notify_source_systems($pack_id, '6');
            require_once('modules/KReleasePackages/KReleasePackage.php');
            $rp = new KReleasePackage();
            $rp->retrieve($pack_id);
            $rp->rpstatus = '6';
            $rp->save();
        }
        return $return;
    }

    function check_access($packs)
    {
        global $db;
        $items = $this->get_items_from_packages($packs);
        $return = array('status' => 'ok', 'msg' => '');
        foreach ($items as $item) {
            if ($item['ctype'] === 'file') {
                if (substr($item['ckey'], 0, 2) === "./") {
                    $item['ckey'] = substr($item['ckey'], 2);
                }
                if (is_writable($item['ckey'])) {
                    $item['writable'] = true;
                } else {
                    $parts = explode("/", $item['ckey']);
                    array_pop($parts);
                    $dir = implode("/", $parts);
                    if ($this->is_writable_r($dir)) {
                        $item['writable'] = true;
                    } else {
                        $item['writable'] = false;
                        $return['status'] = 'error';
                        $return['msg'] .= $item['ckey'] . " not writable\n";
                    }
                }
            }
        }
        return $return;
    }

    function get_items_from_packages($packages)
    {
        global $db;
        $items = array();
        $res = $db->query("SELECT * FROM kdeploypack_items WHERE kreleasepackage_id IN ('" . implode("','", $packages) . "') AND deleted = 0 ORDER BY date_modified DESC");
        while ($row = $db->fetchByAssoc($res)) {
            if (isset($items[$row['ckey']])) {
                $date1 = new DateTime($row['date_modified']);
                $date2 = new DateTime($items[$row['ckey']]['date_modified']);
                if ($date1 > $date2) { //date1 is newer than date2
                    $items[$row['ckey']] = $row;
                }
            } else {
                $items[$row['ckey']] = $row;
            }
        }
        return $items;
    }

    function is_writable_r($dir)
    {
        if (is_dir($dir)) {
            if (is_writable($dir)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (file_exists($dir)) {
                return (is_writable($dir));
            } else {
                //maybe we have to create a parent folder so look if we can write last existing parent folder
                $parts = explode("/", $dir);
                $c = count($parts);
                $i = 1;
                while ($c > $i) {
                    array_pop($parts);
                    $pdir = implode("/", $parts);
                    if (is_dir($pdir)) {
                        if (is_writable($pdir)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        $i++;
                    }
                }
            }
        }
    }

    function backup($packs)
    {
        global $db;
        $return = array('status' => 'ok', 'msg' => '');
        $items = $this->get_items_from_packages($packs);
        foreach ($items as $item) {
            if (file_exists($item['ckey'])) {
                $item['exists'] = true;
            } else {
                $item['exists'] = false;
            }
            if ($item['ctype'] === 'file' && $item['exists']) {
                $content = base64_encode(file_get_contents($item['ckey']));
                $db->query("INSERT INTO kdeploypack_contents (id, kdeploypack_item_id, content, ctype, deleted) VALUES ('" . create_guid() . "','" . $item['id'] . "','$content','B',0)");
            }
            if ($item['ctype'] === 'db') {
                $ident = explode('/', $item['ckey']);
                $exists = $db->fetchByAssoc($db->query("SELECT * FROM " . $ident[0] . " WHERE id = '" . $ident[1] . "'"));
                if (!empty($exists['id'])) {
                    $dbContent = base64_encode(json_encode($exists));
                    $db->query("INSERT INTO kdeploypack_contents (id, kdeploypack_item_id, content, ctype, deleted) VALUES ('" . create_guid() . "','" . $item['id'] . "','$dbContent','B',0)");
                } else {
                    $item['exists'] = false;
                }
            }
        }
        return $return;
    }

    function write_files($packs, $remote)
    {
        global $db;
        $return = array('status' => 'ok', 'msg' => '');
        if (!$remote) {
            $res = $db->fetchByAssoc($db->query("SELECT add_systems FROM kdeploymentsystems WHERE this_system = 1"));
            if (!empty($res['add_systems']) && $res['add_systems'] !== "[]") {
                $add_systems = json_decode($res['add_systems']);
                foreach ($add_systems as $system) {
                    $this->write_files_remote($packs, $system);
                }
                return $return;
            }
        }
        $items = $this->get_items_from_packages($packs);
        foreach ($items as $item) {
            $content = $db->fetchByAssoc($db->query("SELECT * FROM kdeploypack_contents WHERE kdeploypack_item_id = '" . $item['id'] . "' AND ctype = 'P'"));
            if ($item['ctype'] === 'file') {
                $parts = explode('/', $item['ckey']);
                $file = array_pop($parts);
                $dir = '';
                foreach ($parts as $part) {
                    if (empty($dir)) {
                        if (!is_dir($dir .= "$part")) {
                            mkdir($dir);
                            $item['dirs_created'][] = $dir;
                        }
                    } else {
                        if (!is_dir($dir .= "/$part")) {
                            mkdir($dir);
                            $item['dirs_created'][] = $dir;
                        }
                    }
                }
                if (count($item['dirs_created']) > 0) {
                    $db->query("UPDATE kdeploypack_contents SET dirs_created = '" . json_encode($item['dirs_created']) . "' WHERE id = '" . $item['id'] . "'");
                }
                $res = file_put_contents("$dir/$file", base64_decode($content['content']));
                if ($res === false) {
                    $return['status'] = 'error';
                    $return['msg'] .= 'error writing ' . $item['ckey'] . "\n";
                    return $return;
                }
            }
        }
        return $return;
    }

    function write_files_remote($packs, $system)
    {
        if (count($packs) == 1) {
            $param = $packs[0];
        } else {
            $param = json_encode($packs);
        }
        $this->retrieve($system);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,         // return web page
            CURLOPT_HEADER => false,        // don't return headers
            CURLOPT_POST => false
        );
        if (substr($this->url, -1) === "/") {
            $this->url .= "KREST/kdeployment/remoteWriteFilesPackage/$param";
        } else {
            $this->url .= "/KREST/kdeployment/remoteWriteFilesPackage/$param";
        }
        $this->url .= "?user_name=" . $this->sys_username . "&password=" . md5($this->sys_password);
        $ch = curl_init($this->url);
        curl_setopt_array($ch, $options);
        $content = curl_exec($ch);
        $err = curl_errno($ch);
        $errmsg = curl_error($ch);
        $header = curl_getinfo($ch);
        curl_close($ch);

        $header['errno'] = $err;
        $header['errmsg'] = $errmsg;
        $header['content'] = $content;
    }

    function write_db($packs)
    {
        global $db;
        $items = $this->get_items_from_packages($packs);
        $return = array('status' => 'ok', 'msg' => '');
        foreach ($items as $item) {
            $content = $db->fetchByAssoc($db->query("SELECT * FROM kdeploypack_contents WHERE kdeploypack_item_id = '" . $item['id'] . "' AND ctype = 'P'"));
            if ($item['ctype'] === 'db') {
                $ident = explode('/', $item['ckey']);
                $dbRecord = json_decode(base64_decode($content['content']));
                $exists = $db->fetchByAssoc($db->query("SELECT * FROM " . $ident[0] . " WHERE id = '" . $ident[1] . "'"));
                if (!empty($exists['id'])) {
                    $sql = "UPDATE " . $ident[0] . " SET ";
                    foreach ($dbRecord as $field => $value) {
                        $sql .= $field . " = '" . $value . "',";
                    }
                    $sql = substr($sql, 0, -1);
                    $sql .= " WHERE id = '" . $ident[1] . "'";
                    if (!$db->query($sql)) {
                        $return['status'] = 'error';
                        $return['msg'] .= 'error writing ' . $item['ckey'] . "\n";
                        return $return;
                    }
                } else {
                    $sql = "INSERT INTO " . $ident[0] . " ";
                    $fields = array();
                    $values = array();
                    foreach ($dbRecord as $field => $value) {
                        $fields[] = $field;
                        $values[] = $value;
                    }
                    $sql .= "(" . implode(",", $fields) . ") VALUES ('" . implode("','", $values) . "')";
                    if (!$db->query($sql)) {
                        $return['status'] = 'error';
                        $return['msg'] .= 'error writing ' . $item['ckey'] . "\n";
                        return $return;
                    }
                }
            }
        }
        return $return;
    }

    function repair($packs, $remote)
    {
        require_once('modules/Administration/QuickRepairAndRebuild.php');
        global $db;
        $return = array('status' => 'ok', 'msg' => '');
        if (!$remote) {
            $res = $db->fetchByAssoc($db->query("SELECT add_systems FROM kdeploymentsystems WHERE this_system = 1"));
            if (!empty($res['add_systems']) && $res['add_systems'] !== "[]") {
                $add_systems = json_decode($res['add_systems']);
                foreach ($add_systems as $system) {
                    $this->remote_repair($packs, $system);
                }
                return $return;
            }
        }
        $modules_array = array();
        $repair_array = array();
        foreach ($packs as $pack_id) {
            $row = $db->fetchByAssoc($db->query("SELECT repairs, repair_modules FROM kreleasepackages WHERE id = '$pack_id'"));
            $parts_modules = explode('^,^', substr($row['repair_modules'], 1, -1));
            foreach ($parts_modules as $mod) {
                if (!array_search($mod, $modules_array)) {
                    $modules_array[] = $mod;
                }
            }
            $parts_repair = explode('^,^', substr($row['repairs'], 1, -1));
            foreach ($parts_repair as $rep) {
                if (!array_search($rep, $repair_array)) {
                    $repair_array[] = $rep;
                }
            }
        }
        $randc = new RepairAndClear();
        $randc->repairAndClearAll($repair_array, $modules_array, false, false);
        return $return;
    }

    function remote_repair($packs, $system)
    {
        if (count($packs) == 1) {
            $param = $packs[0];
        } else {
            $param = json_encode($packs);
        }
        $this->retrieve($system);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,         // return web page
            CURLOPT_HEADER => false,        // don't return headers
            CURLOPT_POST => false
        );
        if (substr($this->url, -1) === "/") {
            $this->url .= "KREST/kdeployment/remoteRepairPackage/$param";
        } else {
            $this->url .= "/KREST/kdeployment/remoteRepairPackage/$param";
        }
        $this->url .= "?user_name=" . $this->sys_username . "&password=" . md5($this->sys_password);
        $ch = curl_init($this->url);
        curl_setopt_array($ch, $options);
        $content = curl_exec($ch);
        $err = curl_errno($ch);
        $errmsg = curl_error($ch);
        $header = curl_getinfo($ch);
        curl_close($ch);

        $header['errno'] = $err;
        $header['errmsg'] = $errmsg;
        $header['content'] = $content;
    }

    function rollback($packs)
    {
        global $db;
        $return = array('status' => 'ok', 'msg' => '');
        $items = $this->get_items_from_packages($packs);
        foreach ($items as $item) {
            $backup = $db->fetchByAssoc($db->query("SELECT * FROM kdeploypack_contents WHERE kdeploypack_item_id = '" . $item['id'] . "' AND ctype = 'B'"));
            if ($item['ctype'] === 'file') {
                if ($item['exists']) {
                    if (!empty($backup['id'])) {
                        file_put_contents($item['ckey'], base64_decode($backup['content']));
                    } else {
                        unlink($item['ckey']);
                        if (count($item['dirs_created']) > 0) {
                            foreach ($item['dirs_created'] as $dir) {
                                rmdir($dir);
                            }
                        }
                    }
                } else {
                    unlink($item['ckey']);
                    if (count($item['dirs_created']) > 0) {
                        foreach ($item['dirs_created'] as $dir) {
                            rmdir($dir);
                        }
                    }
                }
            }
            if ($item['ctype'] === 'db') {
                $ident = explode('/', $item['ckey']);
                $exists = $db->fetchByAssoc($db->query("SELECT * FROM " . $ident[0] . " WHERE id = '" . $ident[1] . "'"));
                if (!empty($exists['id'])) {
                    if (!empty($backup['id'])) {
                        $update = array();
                        $sql = "UPDATE " . $ident[0] . " SET ";
                        foreach (json_decode(base64_decode($backup['content'])) as $field => $value) {
                            $update[] = "$field = '$value'";
                        }
                        $sql .= implode(",", $update);
                        $sql .= " WHERE id = '" . $ident[1] . "'";
                        $db->query($sql);
                    } else {
                        $db->query("DELETE FROM " . $ident[0] . " WHERE id = '" . $ident[1] . "'");
                    }
                } else {
                    $db->query("DELETE FROM " . $ident[0] . " WHERE id = '" . $ident[1] . "'");
                }
            }
        }
        foreach ($packs as $pack_id) {
            $this->notify_source_systems($pack_id, '5');
            require_once('modules/KReleasePackages/KReleasePackage.php');
            $rp = new KReleasePackage();
            $rp->retrieve($pack_id);
            $rp->rpstatus = '5';
            $rp->save();
        }
        return $return;
    }

    function release_package_history($pack_id)
    {
        global $db, $app_list_strings;
        include('custom/application/Ext/Language/en_us.lang.ext.php');
        $list = array();
        $res = $db->query("SELECT stat.id id, stat.kdeploymentsystem_id system_id, sys.name system, stat.pstatus status_raw, stat.date_modified, stat.history FROM kdeploypack_sysstatus stat INNER JOIN kdeploymentsystems sys ON stat.kdeploymentsystem_id = sys.id WHERE stat.kreleasepackage_id = '$pack_id'");
        while ($row = $db->fetchByAssoc($res)) {
            $row['status'] = $app_list_strings['rpstatus_dom'][$row['status_raw']];
            /*$row['text'] = $app_list_strings['rpstatus_dom'][$row['status_raw']];
            $res2 = $db->query("SELECT stat.id id, stat.kdeploymentsystem_id system_id, sys.name system, stat.pstatus status_raw, stat.date_modified, stat.history FROM kdeploypack_sysstatus stat INNER JOIN kdeploymentsystems sys ON stat.kdeploymentsystem_id = sys.id WHERE stat.kreleasepackage_id = '$pack_id' AND stat.history = 1 AND stat.kdeploymentsystem_id = '".$row['system_id']."'");
            while ($row2 = $db->fetchByAssoc($res2)) {
                $row2['leaf'] = true;
                $row2['text'] = $app_list_strings['rpstatus_dom'][$row2['status_raw']];
                $row2['status'] = $app_list_strings['rpstatus_dom'][$row2['status_raw']];
                $row['children'][] = $row2;
            }*/
            $list[] = $row;
        }
        return array('list' => $list);
    }

    function getRepositories($data){
        $repos = array();
        $git = curl_init();

        $paramString = '';

        curl_setopt($git, CURLOPT_URL, 'https://api.github.com/user/repos');
        curl_setopt($git, CURLOPT_USERPWD, $data['user'] . ':' . $data['pass']);
        curl_setopt($git, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($git, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($git, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");

        $requestStart = microtime(true);
        $output = curl_exec($git);
        $requestStop = microtime(true);

        if ($output) {
            $repoArray = json_decode($output, true);
            $repos[] = array(
                'name' => ''
            );
            if(count($repoArray) > 0){
                foreach($repoArray as $repo) {
                    $repos[] = array(
                        'name' => $repo['full_name']
                    );
                }
            }
        }

        return $repos;
    }

    function getUpdates(){
        global $db;
        //get installed software
        $installedSW = array();
        $res = $db->query("SELECT * FROM kreleasepackages WHERE deleted = 0 AND software_name IS NOT NULL");
        $installedVersions = array();
        while($row = $db->fetchByAssoc($res)){
            if(!isset($installedVersions[$row['software_hash']])) $installedVersions[$row['software_hash']] = 0;
            if(version_compare($row['software_version_major'].".".$row['software_version_minor'].".".$row['software_version_release'],$installedVersions[$row['software_hash']]) === 1){
                $installedVersions[$row['software_hash']] = $row['software_version_major'].".".$row['software_version_minor'].".".$row['software_version_release'];
                $installedSW[$row['software_hash']] = $row;
            }
        }
        $latestRepoVersions = $this->getLatestSwVersions($installedVersions);
        $updates = array();
        $updateVersions = array();
        $returnarray = array();
        foreach($latestRepoVersions as $sw){
            if(version_compare($sw['software_version_major'].".".$sw['software_version_minor'].".".$sw['software_version_release'],$installedVersions[$sw['software_hash']]) === 1){
                $updateVersions[$sw['software_hash']] = $sw['software_version_major'].".".$sw['software_version_minor'].".".$sw['software_version_release'];
                $returnarray[] = $sw['software_name']."(new: ".$updateVersions[$sw['software_hash']].", your: ".$installedVersions[$sw['software_hash']].")";
                $updates[] = $sw;
            }
        }
        $count = count($updateVersions);
        return array('count' => $count, 'updates' => $updates, 'string' => implode(', ',$returnarray));
    }

    function getLatestSwVersions($sw){
        global $db;
        $latestVersions = array();
        $installedSw = array();
        foreach($sw as $hash => $pack) $installedSw[] = $hash;
        $res = $db->query("SELECT * FROM kdeploymentsystems WHERE type = 'repo' AND deleted = 0");
        while($row = $db->fetchByAssoc($res)){
            $options = array(
                CURLOPT_RETURNTRANSFER => true,         // return web page
                CURLOPT_HEADER => false,        // don't return headers
                CURLOPT_POST => false
            );
            if (substr($row->url, -1) === "/") {
                $row->url .= "KREST/kdeployment/latestSwVersions/".encodeURIComponent(json_encode($installedSw));
            } else {
                $row->url .= "/KREST/kdeployment/latestSwVersions/".encodeURIComponent(json_encode($installedSw));
            }
            $row->url .= "?user_name=" . $row->sys_username . "&password=" . md5($row->sys_password);
            $ch = curl_init($row->url);
            curl_setopt_array($ch, $options);
            $content = curl_exec($ch);
            $err = curl_errno($ch);
            $errmsg = curl_error($ch);
            $header = curl_getinfo($ch);
            curl_close($ch);

            $header['errno'] = $err;
            $header['errmsg'] = $errmsg;
            $header['content'] = $content;
            $thisLatestVersions = json_decode(html_entity_decode($content));
            foreach($thisLatestVersions as $swpack){
                $swpack['source_system'] = $row['source_system'];
                $latestVersions[] = $swpack;
            }
        }
        return $latestVersions;
    }

    function latestSwVersions($data){
        global $db;
        $return = array();
        foreach($data as $swHash){
            $latestSW = array();
            $res = $db->query("SELECT * FROM kreleasepackages WHERE deleted = 0 AND software_hash = '$swHash' AND rpstatus = '7'");
            $latestVersions = array();
            while($row = $db->fetchByAssoc($res)){
                if(!isset($latestVersions[$row['software_hash']])) $latestVersions[$row['software_hash']] = 0;
                if(version_compare($row['software_version_major'].".".$row['software_version_minor'].".".$row['software_version_release'],$latestVersions[$row['software_hash']]) === 1){
                    $latestVersions[$row['software_hash']] = $row['software_version_major'].".".$row['software_version_minor'].".".$row['software_version_release'];
                    $latestSW[$row['software_hash']] = $row;
                }
            }
            foreach($latestSW as $hash => $sw) $return[] = $sw;
        }
        return $return;
    }

    function getAppConfig(){
        global $db;
        $row = $db->fetchByAssoc($db->query("SELECT * FROM kdeploymentsystems WHERE deleted = 0 AND this_system = 1"));
        return $row;
    }


    function recieveZipFromForm($data){
        global $sugar_config;
        $return = array('success' => true, 'error' => '');
        if(isset($_FILES['uploadzippackage']) && $_FILES['uploadzippackage']['error'] == UPLOAD_ERR_OK){
            $file = $_FILES['uploadzippackage'];
            $tmp_name = $file["tmp_name"];
            $name = basename($file["name"]);
            if(!file_exists($sugar_config['upload_dir'].'temp')){
                mkdir($sugar_config['upload_dir'].'temp');
            }
            if(move_uploaded_file($tmp_name, $sugar_config['upload_dir'].'temp'.$name)){
                $return = $this->processZipToRP($sugar_config['upload_dir'].'temp'.$name);
            }else{
                $return = array('success' => false, 'error' => 'Error: not able to move file to '.$sugar_config['upload_dir'].'temp'.$name);
            }
        }else{
            $return = array('success' => false, 'error' => 'Error: No file recieved !');
        }
        return $return;
    }

    function recieveZipFromRest(){

    }

    function processZipToRP($dir){
        global $sugar_config;
        require_once('include/utils/php_zip_utils.php');
        $workdir = $sugar_config['upload_dir'].'temp';
        unzip($dir,$workdir);
        if(file_exists($workdir.'/manifest.php')){
            include($workdir.'/manifest.php');
            if(isset($manifest) && count($manifest) > 0 && isset($installdefs) && count($installdefs) > 0){
                /** @var KReleasePackage $rp */
                $rp = BeanFactory::getBean('KReleasePackages');
                $rp->name = $manifest['name']." ".$manifest['version'];
                $rp->rpstatus = '5';
                $rp->rptype = '4';
                $rp->save();
                if(isset($installdefs['pre_execute']) && count($installdefs['pre_execute']) > 0) {
                    foreach ($installdefs['pre_execute'] as $pre) {
                        require_once(str_replace('<basepath>',$workdir,$pre));
                    }
                }
                if(isset($installdefs['copy']) && count($installdefs['copy']) > 0) {
                    foreach ($installdefs['copy'] as $cpy) {
                        $rp->smartCopyDb($cpy['to'], str_replace('<basepath>',$workdir,$cpy['from']));
                    }
                }
                if(isset($installdefs['language']) && count($installdefs['language']) > 0) {
                    foreach ($installdefs['language'] as $lng) {
                        $name = basename(str_replace('<basepath>',$workdir,$lng['from']));
                        if($lng['to_module'] !== 'application'){
                            $rp->smartCopyDb('custom/Extension/modules/'.$lng['to_module'].'/Ext/Language/'.$name, str_replace('<basepath>',$workdir,$lng['from']));
                        }else{
                            $rp->smartCopyDb('custom/Extension/application/Ext/Language/'.$name, str_replace('<basepath>',$workdir,$lng['from']));
                        }
                    }
                }
                if(isset($installdefs['relationships']) && count($installdefs['relationships']) > 0) {
                    foreach ($installdefs['relationships'] as $rel) {
                        $name = basename(str_replace('<basepath>',$workdir,$rel['from']));
                        $rp->smartCopyDb('custom/metadata/'.$name, str_replace('<basepath>',$workdir,$rel['meta_data']));
                        $str = "<?php \n //WARNING: The contents of this file are auto-generated\n include('custom/metadata/$name');\n\n?>" ;
                        $out = sugar_fopen ( $workdir."/inc_".$name, 'w' ) ;
                        fwrite ( $out, $str) ;
                        fclose ( $out );
                        $rp->smartCopyDb('custom/Extension/application/Ext/TableDictionary/'.$name, $workdir."/inc_".$name);
                        if (!empty($rel['module_vardefs'])) {
                            $path = 'custom/Extension/modules/' . $rel['module']. '/Ext/Vardefs/'.basename(str_replace('<basepath>',$workdir,$rel['module_vardefs']));
                            if($rel['module'] == 'application'){
                                $path ='custom/Extension/' . $rel['module']. '/Ext/Vardefs/'.basename(str_replace('<basepath>',$workdir,$rel['module_vardefs']));
                            }
                            $rp->smartCopyDb($path, str_replace('<basepath>',$workdir,$rel['module_vardefs']));
                        }
                        if (!empty($rel['module_layoutdefs'])) {
                            $path = 'custom/Extension/modules/' . $rel['module']. '/Ext/Layoutdefs/'.basename(str_replace('<basepath>',$workdir,$rel['module_layoutdefs']));
                            if($rel['module'] == 'application'){
                                $path ='custom/Extension/' . $rel['module']. '/Ext/Layoutdefs/'.basename(str_replace('<basepath>',$workdir,$rel['module_layoutdefs']));
                            }
                            $rp->smartCopyDb($path, str_replace('<basepath>',$workdir,$rel['module_layoutdefs']));
                        }
                    }
                }
                if(isset($installdefs['post_execute']) && count($installdefs['post_execute']) > 0) {
                    foreach ($installdefs['post_execute'] as $pos) {
                        require_once(str_replace('<basepath>',$workdir,$pos));
                    }
                }
                rrmdir($workdir);
                return array('success' => true, 'error' => '');
            }else{
                return array('success' => false, 'error' => 'Error: Invalid manifest.php!');
            }
        }
    }
}

function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (is_dir($dir."/".$object))
                    rrmdir($dir."/".$object);
                else
                    unlink($dir."/".$object);
            }
        }
        rmdir($dir);
    }
}