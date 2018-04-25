<?php
/**
 * Generate SpiceUI table entries from all defs (var, detail, edit, list, subpanel)
 * User: maretval
 * Date: 03.07.2017
 * Time: 09:07
 */
require_once 'include/utils.php';
require_once 'modules/SpiceUIGenerator/SpiceFTSGenerator.php';
require_once 'modules/SystemUI/SystemUIRESTHandler.php';

class SpiceUIGenerator {
    public $module;
    public $create_module = false;
    public $action;
    public $prefix; //mark entries with project shortname to identify new entries in Database
    public $default_subpanel_component = 'ObjectRelatedlistList';
    public $clean_export_file = true;
    public $csvpath = "modules/SpiceUIGenerator/csv";
    public $sqlpath = "modules/SpiceUIGenerator/sql";
    public $customLabels = [];

    public function __construct($prefix = '', $language = 'en_us', $sqlsonly = true){
        global $sugar_config;

//        $this->ui = new SystemUIRESTHandler();
//        $this->module = $module_name;
//        $this->moduleconf = $this->getComponentModuleConfig();
        $this->prefix = $prefix;
        $this->language = $language;

        $this->host = $sugar_config['dbconfig']['db_host_name'];
        $this->user = $sugar_config['dbconfig']['db_user_name'];
        $this->pwd = $sugar_config['dbconfig']['db_password'];
        $this->dbname = $sugar_config['dbconfig']['db_name'];

        $this->ui = new SystemUIRESTHandler();
//
//        //check if module is new
//        $modules = $this->ui->getModules();
//        if(!isset($modules[$module_name])){
//            $this->create_module = true;
//        }
    }


    /**
     * grab all DB entries related to SpiceUI configuration for a module
     * @param null $module_name
     */
    public function exportModuleConfiguration($module_name)
    {
        global $sugar_config;

        //target file
        $sqlfile = dirname(__FILE__)."/spiceui_".$module_name.".sql";
        $sqlfile = str_replace("\\", "/", $sqlfile);
        if($this->clean_export_file)
            file_put_contents($sqlfile, '');

        $commands = array();
        //command basic
        $cmdBase = "mysqldump ";
        $cmdBase.= "--no-create-info -R -c --triggers  ";
        $cmdBase.= "--replace ";
        $cmdBase.= "-h " . $this->host . " -u " . $this->user ." -p" . $this->pwd;
        $cmdBase.= " " . $this->dbname . " ";


        //check on sysrolemodules
        $rolesmodules = $this->ui->getSysRoleModules();
        $sysrole_ids = array();
        foreach($rolesmodules as $role_id => $modules) {
            if($idx = array_search('Meetings', array_column($modules, 'module'))){
                $sysrole_ids[] = $role_id;
            }
        }

        //get sysmodules
        $cmd = $cmdBase;
        $cmd.= "sysmodules ";
        $cmd.= "-w\"module='".$module_name."'\"";
        $cmd.= " >> ".$sqlfile;
        $commands[] = $cmd;

        //get sysuirolemodules
        $cmd = $cmdBase;
        $cmd.= "sysuicustomrolemodules ";
        $cmd.= "-w\"module='".$module_name."'\"";
        $cmd.= " >> ".$sqlfile;
        $commands[] = $cmd;

        //get sysuiroles
        if(count($sysrole_ids) > 0) {
            //where clause
            $where="";
            for($i = 0; $i<count($sysrole_ids); $i++){
                $where.= "id='" . $sysrole_ids[$i] . "'";
                if($i < count($sysrole_ids)-1)
                    $where.= " OR ";
            }
            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomroles ";
            $cmd.= "-w\"".$where."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;
        }

        //get sysuicomponentmoduleconf
        $cmd = $cmdBase;
        $cmd.= "sysuicustomcomponentmoduleconf ";
        $cmd.= "-w\"module='".$module_name."'\"";
        $cmd.= " >> ".$sqlfile;
        $commands[] = $cmd;

        //get sysuicomponentsets
        $cmd = $cmdBase;
        $cmd.= "sysuicustomcomponentsets ";
        $cmd.= "-w\"module='".$module_name."'\"";
        $cmd.= " >> ".$sqlfile;
        $commands[] = $cmd;

        //get module components, fieldsets, actionsets
        $componentsets = $this->getComponentSets($module_name);
        $component_ids = array();
        $fieldset_ids = array();
        
        //store relevant ids
        foreach($componentsets as $componentset_id => $componentset){
            foreach($componentset['items'] as $idx => $component ){
                $component_ids[] = $component['id'];
                if(!is_object($component['componentConfig'])) {
                    if (isset($component['componentConfig']['fieldset'])) {
                        $fieldset_ids[] = $component['componentConfig']['fieldset'];
                    }
                    if (isset($component['componentConfig']['actionset'])) {
                        $actionset_ids[] = $component['componentConfig']['actionset'];
                    }
                    if (isset($component['componentConfig']['reportid'])) {
                        $cmd = $cmdBase;
                        $cmd .= "kreports ";
                        $cmd .= "-w\"id='" . $component['componentConfig']['reportid'] . "'\"";
                        $cmd .= " >> " . $sqlfile;
                        $commands[] = $cmd;
                    }
                }
            }
        }
        //get sysuicomponentsetscomponents
        if(count($component_ids) > 0) {
            //where clause
            $where="";
            for($i = 0; $i<count($component_ids); $i++){
                $where.= "id='" . $component_ids[$i] . "'";
                if($i < count($component_ids)-1)
                    $where.= " OR ";
            }
            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomcomponentsetscomponents ";
            $cmd.= "-w\"".$where."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;
        }
        //get sysuifieldsets
        if(count($fieldset_ids) > 0) {
            //where clause
            $where="";
            $whereFieldsetid="";
            for($i = 0; $i<count($fieldset_ids); $i++) {
                $where.= "id='" . $fieldset_ids[$i] . "'";
                $whereFieldsetid.= "fieldset_id='" . $fieldset_ids[$i] . "'";
                if ($i < count($fieldset_ids) - 1) {
                    $where .= " OR ";
                    $whereFieldsetid.= " OR ";
                }
            }
            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomfieldsets ";
            $cmd.= "-w\"".$where."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;

            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomfieldsetsitems ";
            $cmd.= "-w\"".$whereFieldsetid."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;
        }

        //get sysuiactionsets
        if(count($actionset_ids) > 0) {
            //where clause
            $where="";
            $whereActionsetid="";
            for($i = 0; $i<count($actionset_ids); $i++) {
                $where.= "id='" . $actionset_ids[$i] . "'";
                $whereActionsetid.= "actionset_id='" . $actionset_ids[$i] . "'";
                if ($i < count($actionset_ids) - 1) {
                    $where .= " OR ";
                    $whereActionsetid.= " OR ";
                }
            }
            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomactionsets ";
            $cmd.= "-w\"".$where."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;

            //cmd
            $cmd = $cmdBase;
            $cmd.= "sysuicustomactionsetitems ";
            $cmd.= "-w\"".$whereActionsetid."\"";
            $cmd.= " >> " . $sqlfile;
            $commands[] = $cmd;
        }

        echo '<pre>'.implode("; ", $commands);
        echo '</pre><br>';
        if(is_array($commands)){
            foreach($commands as $cmd){
                system($cmd, $output);
                if(!$output) system("echo success ".$cmd." deployed"); else system("echo ERROR dumping ".$cmd);

            }
        }



    }


    public function getMenuDefaultActionSet(){
        return 'e227ac0f-e1e6-4564-acca-8f3423ae0bd2';
    }
    public function getSubpanelDefaultActionSet(){
        return '406f744e-971d-41d5-a7fc-c73df139e492';
    }


    /**
     * Use first panels definition for header content
     * @param $module_name
     * @return array
     */
    public function generateDetailViewHeader($module_name = null){
        if(empty($module_name))
            $module_name = $this->module;
        $component = 'ObjectPageHeaderDetails';
        $create_component = false;
        $data = array();
//        $path = $this->getDefsFilePath($module_name, "detailviewdefs");
        $path = $this->getDefsFilePath($module_name, "listviewdefs");
        if(!file_exists($path)) {
            return array('success' => false, 'errmsg' => 'Path does not exist: '.$path);
        }
        else{
//            global $viewdefs;
            global $listViewDefs;
            require_once $path;

            //check if component key is defined
            $action = 'add';
            $fieldset_id = create_guid();
            if(isset($this->moduleconf[$component])) {
                $action = 'update';
                $fieldset_id = $this->moduleconf[$component]['*']['fieldset'];
            }
            else{
                $create_component = true;
            }


            // fieldset id, module, name
            $data[$action][$fieldset_id]['name'] = $this->prefix." ".$module_name." Listview";
            $data[$action][$fieldset_id]['module'] = $module_name;

            // fieldsetitems => only 1st panel
            $sequence = 0;
            foreach($listViewDefs[$module_name] as $fieldname => $field_conf){
                $fieldsetitem_id = create_guid();
                $fieldconfig = array();
                if($fieldname == "date_modified" || $fieldname == "date_entered")
                    $fieldconfig = array("readonly" => true);
                $data[$action][$fieldset_id]['items'][] = array(
                    'id' => $fieldsetitem_id,
                    'fieldset_id' => $fieldset_id,
                    'field' => strtolower($fieldname),
                    'fieldset' => '',
                    'sequence' => $sequence,
                    'fieldconfig' => $fieldconfig
                );
                $sequence++;
            }



//            echo '<pre>fieldsetitems '.__LINE__.print_r($data, true);
            $success = $this->setFieldSets($data);
            $errmsg = '';
            if(!$success)
                $errmsg = 'Error'.__CLASS__. ' -> ' . __METHOD__.' for module '.$module_name.' on line '.__LINE__;

            if($create_component){
                $params = array('id' => create_guid(),
                    'module' => $module_name,
                    'component' => $component,
                    'componentConfig' => array('fieldset' => $fieldset_id),
                    'role_id' => '*'
                );

                $this->setComponentModuleConfig($params);
            }

        }
    }


    public function rowToFieldSetItems($fieldset_id, $row){
        $items = array();
        foreach($row as $fieldIdx => $field_conf){
            $field = (is_array($field_conf) ? $field_conf['name'] : $field_conf);
            if(empty($field)) continue;

            $fieldconfig = array('link' => (isset($field_conf['link']) ?: false), 'sortable' => (isset($field_conf['sortable']) ?: false));
            if($field == "date_modified" || $field == "date_entered")
                $fieldconfig = array("readonly" => true);
            $items[] = array(
                'id' => create_guid(),
                'fieldset_id' => $fieldset_id,
                'field' => $field,
                'fieldset' => '',
                'sequence' => $fieldIdx,
                'fieldconfig' => $fieldconfig

            );
        }
        return $items;
    }


    public function panelToFieldSet(&$data, $module_name, $action, $fieldset_id, $panel_name, $panel){
        $data[$action][$fieldset_id]['name'] = $module_name." ".$panel_name." Data";
        $data[$action][$fieldset_id]['module'] = $module_name;
        $data[$action][$fieldset_id]['items'] = array();
        foreach($panel as $rowIdx => $row){
            $row_fieldset_id = create_guid();
            $data[$action][$row_fieldset_id]['id'] = $row_fieldset_id;
            $data[$action][$row_fieldset_id]['name'] = $this->prefix." ".$module_name." row".$rowIdx;
            $data[$action][$row_fieldset_id]['module'] = $module_name;
            $data[$action][$row_fieldset_id]['items'] = $this->rowToFieldSetItems($row_fieldset_id, $row);

            $data[$action][$fieldset_id]['items'][] = array(
                'id' => create_guid(),
                'fieldset_id' => $fieldset_id,
                'field' => '',
                'fieldset' => $row_fieldset_id,
                'sequence' => $rowIdx,
                'fieldconfig' => array()

            );
        }
    }


    public function readClassicLayoutDefs($module_name){
        $data = array();
        if(empty($module_name))
            $module_name = $this->module;
        //items
        $path = $this->getDefsFilePath($module_name, "layoutdefs");
        if(!file_exists($path)) {
            return array('success' => false, 'errmsg' => 'Path does not exist: '.$path);
        }
        else {
            global $layout_defs;
            if (file_exists ('modules/'.$module_name.'/metadata/subpaneldefs.php' ))
                require ('modules/'.$module_name.'/metadata/subpaneldefs.php');
            if (file_exists ('custom/modules/'.$module_name.'/metadata/subpaneldefs.php' ))
                require ('custom/modules/'.$module_name.'/metadata/subpaneldefs.php');
            if ( file_exists('custom/modules/'.$module_name.'/Ext/Layoutdefs/layoutdefs.ext.php' ))
                require ('custom/modules/'.$module_name.'/Ext/Layoutdefs/layoutdefs.ext.php');


            foreach($layout_defs[$module_name]['subpanel_setup'] as $subpanelkey => $subpanel){
                $data[$module_name]['layoutdefs'][$subpanelkey] = $subpanel;
            }
        }
        return $data;
    }


    public function readClassicListView($module_name = null){
        if(empty($module_name))
            $module_name = $this->module;
        $data = array();
        $path = $this->getDefsFilePath($module_name, "listviewdefs");
        if(!file_exists($path)) {
            return array('success' => false, 'errmsg' => 'Path does not exist: '.$path);
        }
        else{
            global $listViewDefs;
            require_once $path;
            foreach($listViewDefs[$module_name] as $field_name => $field_conf){
                if($field_conf['default']){
                    $data[$module_name]['listview'][] = $field_name;
                }
            }
        }
//        die('<pre>'.print_r(array('data' => $data, ), true));
        return $data;
    }
    public function readClassicViewDefs($module_name = null, $defs = "detailviewdefs"){
        if(empty($module_name))
            $module_name = $this->module;
        $tabs = array();
        $panels = array();
        $buttons = array();

        $path = $this->getDefsFilePath($module_name, $defs);
        //if this not custom folder, leave it. UI Standard will be used
        if(!preg_match("/custom/", $path))
            return array();

        if(!file_exists($path)) {
            return array('success' => false, 'errmsg' => 'Path does not exist: '.$path);
        }
        else{
            global $viewdefs;
            require_once $path;
            $view = ($defs == 'editviewdefs' ? 'EditView' : 'DetailView');
            $panels = $this->getTabPanelStructure($viewdefs[$module_name][$view]);
            $tabs = $this->getClassicTabs($viewdefs[$module_name][$view]);
            $usetabs = $this->getClassicUseTabs($viewdefs[$module_name][$view]);
            $buttons = $this->getButtonStructure($viewdefs[$module_name][$view]);
        }
       // die('<pre>'.print_r(array('usetabs' => $usetabs, 'tabs' => $tabs, 'panels' => $panels, 'buttons' => $buttons), true));
        return array('usetabs' => $usetabs, 'tabs' => $tabs, 'panels' => $panels, 'buttons' => $buttons);
    }

    public function classicViewDefsToCSV($file_name, $data){
        //if data is empty, don't save CSV
        if(empty($data))
            return;

        //make CSV of it
        $csv = array();

        if($data['usetabs'] == true)
            $csv[] = '"USETABS"';

        foreach($data['tabs'] as $item){
            $csv[] = '"TAB";"' . $item . '"';
        }
        foreach($data['buttons'] as $item){
            $csv[] = '"BUTTON";"' . $item . '"';
        }
        $fieldCounter = 0;
        foreach($data['panels'] as $tab => $panel){
            foreach($panel as $panel_name => $row){
                foreach($row as $rowIdx => $cols) {
                    $csv[] = '"PANEL";"' . $tab . '";"' . strtoupper($panel_name) . '";"' . $rowIdx . '";"' . implode("|", $cols). '"';
                }
            }
        }
        echo '<pre>'.$file_name."\n".print_r(implode("\n", $csv), true);
        file_put_contents($file_name, implode("\n", $csv));
//        die('<pre>'.$file_name.print_r(implode("\n", $csv), true));
    }

    public function classicViewCSVtoUI($file_name, $module_name, $mode = 'ObjectRecordDetails'){

        $createdIds = array(); //store all ids created for revert ... just in case
        $createdIdsCSV = array(); //store all ids created for revert in a csv file... just in case
        $data = array();
        $handle = fopen($file_name, 'r');
        while ( ($buffer = fgets( $handle, 16000 )) !== false ) {
            // read the next entry
            $array = str_getcsv ( $buffer ,";");
            if ( empty( $array ) ) continue;
            $data[] = $array;
        }

//        die('<pre>'.print_r($data, true));
        //if data is empty, stop here
        if(empty($data))
            return;

        //make SQLs of it
        $sqls = array();
            // Check the kind of component needed:
            // 1 TAB => ObjectRecordDetails + ObjectRecordDetailsTab
            // >=2 TABS => ObjectRecordTabbedDetails
        if($data[0][0] == "USETABS"){
            $mode = 'ObjectRecordTabbedDetails';
            $objectRecordTabbedDetailsId = create_guid();
            $sqls[] = "INSERT INTO sysuicustomcomponentsets (`id`, `name`, `module`) VALUES('".$objectRecordTabbedDetailsId."','".$module_name." Detail Tabbed Container','".$module_name."');";
            $sqls[] = "INSERT INTO sysuicustomcomponentsetscomponents (`id`, `componentset_id`, `sequence`, `component`, `componentConfig`) VALUES('".create_guid()."','".$objectRecordTabbedDetailsId."', 0, 'ObjectRecordTabbedDetails', null);";

        }

        //loop tabs first
        //first col contains type of entry
        $storeTabs = array();
        for($i=0; $i<count($data); $i++){
            if($data[$i][0] == 'TAB'){
                $tabid = create_guid();
                $storeTabs[$data[$i][1]] = $tabid;
                $createdIds['sysuicustomcomponentsets']['id'][$tabid] = "created";
                $createdIdsCSV[] = '"sysuicustomcomponentsets";"id";"'.$tabid.'";"created"';
                $sqls[] = "INSERT INTO sysuicustomcomponentsets (id, module, name) VALUES('".$tabid."', '".$module_name."', '".$data[$i][1]."');";
            }
        }
        //create 1 componentset if no tabs in use
        if(count($storeTabs) <= 0){
            $singletabid = create_guid();
            $createdIds['sysuicustomcomponentsets']['id'][$singletabid] = "created";
            $createdIdsCSV[] = '"sysuicustomcomponentsets";"id";"'.$singletabid.'";"created"';
            $sqls[] = "INSERT INTO sysuicustomcomponentsets (id, module, name) VALUES('".$singletabid."', '".$module_name."', '".$module_name." View Component" ."');";
        }

        //loop panels
        //first col contains type of entry
        $storePanels = array();
        $currenttab = "";
        for($i=0; $i<count($data); $i++){
            if($data[$i][0] == 'PANEL'){
                if(!in_array($data[$i][2], array_keys($storePanels))) {
                    //get panel counter within tab
                    if($currenttab != $data[$i][1]) {
                        $panelscounter = 0;
                        $currenttab = $data[$i][1];
                    }

                    $panelid = create_guid();
                    $storePanels[$data[$i][2]] = $panelid;
                    $createdIds['sysuicustomfieldsets']['id'][$panelid] = "created";
                    $createdIdsCSV[] = '"sysuicustomfieldsets";"id";"'.$panelid.'";"created"';
                    $sqls[] = "INSERT INTO sysuicustomfieldsets (id, module, name) VALUES('".$panelid."', '".$module_name."', '".$this->prefix." ".$data[$i][2]."');";
                    $sysuicomponentsetscomponents_id = create_guid();
                    $createdIds['sysuicustomcomponentsetscomponents']['id'][$sysuicomponentsetscomponents_id] = "created";
                    $createdIdsCSV[] = '"sysuicustomcomponentsetscomponents";"id";"'.$sysuicomponentsetscomponents_id.'";"created"';

                    if(empty($singletabid))
                        $sqls[] = "INSERT INTO sysuicustomcomponentsetscomponents (id, componentset_id, sequence, component, componentconfig) VALUES('".$sysuicomponentsetscomponents_id."', '". $storeTabs[ substr($data[$i][1], 4) ] ."', ".$panelscounter.", 'ObjectRecordDetailsTab', '{\"name\":\"".$data[$i][2]."\", \"fieldset\": \"".$panelid."\"}');";
                    else
                        $sqls[] = "INSERT INTO sysuicustomcomponentsetscomponents (id, componentset_id, sequence, component, componentconfig) VALUES('".$sysuicomponentsetscomponents_id."', '". $singletabid."', ".$panelscounter.", 'ObjectRecordDetailsTab', '{\"name\":\"".$data[$i][2]."\", \"fieldset\": \"".$panelid."\"}');";

                    $rowcounter = 0;
                    $panelscounter++;
                }
                //grab fields. Each row is another fieldset, fields are fiedsetitems
                $fielditems = explode("|", $data[$i][4]);
                //die('<pre>'.print_r($data, true));
                if(is_array($fielditems)) {
                    //fieldset
                    $sysuifieldset_id2 = create_guid();
                    $createdIds['sysuicustomfieldsets']['id'][$sysuifieldset_id2] = "created";
                    $createdIdsCSV[] = '"sysuicustomfieldsets";"id";"' . $sysuifieldset_id2 . '";"created"';
                    $sqls[] = "INSERT INTO sysuicustomfieldsets (id, module, name) VALUES('" . $sysuifieldset_id2 . "', '".$module_name."', '".$this->prefix." ".$module_name." ".$data[$i][2]." row ".$rowcounter."');";

                    $sysuifieldsetsitems_id = create_guid();
                    $createdIds['sysuicustomfieldsetsitems']['id'][$sysuifieldsetsitems_id] = "created";
                    $createdIdsCSV[] = '"sysuicustomfieldsetsitems";"id";"' . $sysuifieldsetsitems_id . '";"created"';
                    $sqls[] = "INSERT INTO sysuicustomfieldsetsitems (id, fieldset_id, sequence, fieldset) VALUES('" . $sysuifieldsetsitems_id . "', '" . $panelid . "', " . $rowcounter . ", '" . $sysuifieldset_id2."');";

                    //fielditems
                    for ($j = 0; $j < count($fielditems); $j++) {
                        $sysuifieldsetsitems_id2 = create_guid();
                        $createdIds['sysuicustomfieldsetsitems']['id'][$sysuifieldsetsitems_id2] = "created";
                        $createdIdsCSV[] = '"sysuicustomfieldsetsitems";"id";"' . $sysuifieldsetsitems_id2 . '";"created"';
                        $sqls[] = "INSERT INTO sysuicustomfieldsetsitems (id, fieldset_id, sequence, field, fieldconfig) VALUES('" . $sysuifieldsetsitems_id2 . "', '" . $sysuifieldset_id2 . "', " . $j . ", '" . $fielditems[$j] . "', null);";

                    }
                    $rowcounter++;
                }

            }

        }

        //prepare tabbed componentconfig
        $componentconfig = array();
        if(!empty($storeTabs)) {
            foreach ($storeTabs as $tabname => $tabid) {
                $componentconfig["tabs"][] = array("name" => $tabname, "componentset" => $tabid);
            }
        }else{
            $componentconfig = array("componentset" => $singletabid);
        }


        //set tabs in moduleconf
        $getcomponentmoduleconf = "SELECT * FROM sysuicustomcomponentmoduleconf WHERE module='".$module_name."' AND component='".$mode."';";
        $res = $GLOBALS['db']->query($getcomponentmoduleconf);
        if($GLOBALS['db']->getRowCount($res) > 0){
            while($row = $GLOBALS['db']->fetchByAssoc($res)) {
                $createdIds['sysuicustomcomponentmoduleconf']['id'][$row['id']] = "updated";
                $createdIdsCSV[] = '"sysuicustomcomponentmoduleconf";"id";"'.$row['id'].'";"updated"';
                $sqls[] = "UPDATE sysuicustomcomponentmoduleconf SET componentconfig='" . json_encode($componentconfig) . "' WHERE id='" . $row['id'] . "';";
            }
        }else{
            $sysuicomponentmoduleconf_id = create_guid();
            $createdIds['sysuicustomcomponentmoduleconf']['id'][$sysuicomponentmoduleconf_id] = "created";
            $createdIdsCSV[] = '"sysuicustomcomponentmoduleconf";"id";"'.$sysuicomponentmoduleconf_id.'";"created"';
            $sqls[] = "INSERT INTO sysuicustomcomponentmoduleconf (id, module, component, componentconfig, role_id) VALUES('".$sysuicomponentmoduleconf_id."', '".$module_name."', '".$mode."', '".json_encode($componentconfig)."', '*');";
        }

        //create ObjectRecordViewDetail2and1 entries when tabbed in use
        if(count($storeTabs) > 0) {
            $objectRecordViewDetailId = create_guid();
            $sqls[] = "INSERT INTO sysuicustomcomponentsets (`id`, `name`, `module`) VALUES('" . $objectRecordViewDetailId . "','" . $module_name . " Detail View Container','" . $module_name . "');";
            $componentConfig = array(
                "main" => $objectRecordViewDetailId,
                "sidebar" => "aecff45f-931e-45d4-8999-9993bde30b16"
            );
            $sqls[] = "INSERT INTO sysuicustomcomponentmoduleconf (`id`, `role_id`, `module`, `component`, `componentConfig`) VALUES('" . create_guid() . "','*', '".$module_name."', 'ObjectRecordViewDetail2and1', '" . $GLOBALS['db']->quote(json_encode($componentConfig)) . "');";

            $componentConfig = array(
                "tabs" => array(
                    array("name" => "LBL_RELATED", "componentset" => "662979fb-033b-4077-9e6e-482cee7772c0"),
                    array("name" => "LBL_DETAIL", "componentset" => $objectRecordTabbedDetailsId),
                    array("name" => "LBL_MAP", "componentset" => "1620c69d-92e6-4051-864d-8dcedc775610"),
                )
            );
            $sqls[] = "INSERT INTO sysuicustomcomponentsetscomponents (`id`, `componentset_id`, `sequence`, `component`, `componentConfig`) VALUES('" . create_guid() . "','" . $objectRecordViewDetailId . "', 0, 'ObjectTabContainer', '" . $GLOBALS['db']->quote(json_encode($componentConfig)) . "');";

        }

        //createdIds to sql
        if(count($sqls) > 0) {
            if (!file_put_contents($this->csvpath."/" . $module_name . "_converted_entries.csv", implode("\n", $createdIdsCSV)))
                echo('<pre> Could not save CSV in '.__FUNCTION__.'() :-(');
            if (!file_put_contents($this->sqlpath."/" . $module_name . "_converted_entries.sql", implode("\n", $sqls)))
                echo('<pre> Could not save SQL report :-(');
        }
    }

    public function classicLayoutDefsToCSV($file_name, $data){

        //make CSV of it
        $csv = array();
        foreach($data as $module_name => $layoutdefs){
            foreach($layoutdefs['layoutdefs'] as $subpanel_name => $subpanel){
                $collection = "";
                if($subpanel['type'] == 'collection'){
                    $collection = implode(",", array_keys($subpanel['collection_list']));
                }
                //skip activities and history => use UI default
                if($subpanel['type'] == 'collection' && ($subpanel_name=='activities' || $subpanel_name == 'history') )
                    continue;

                $csv[] = "'SUBPANELDEFS';'" . $module_name . "';'" . $subpanel_name ."';'".$subpanel['module']."';'".$subpanel['order']."';'".$collection."'";

                //grab subpanel_name, find file and list fields. Skip when Collection.
                $subpanel_file_name = "modules/".$subpanel['module']."/metadata/subpanels/".$subpanel['subpanel_name'].".php";
                $subpanel_file_name = get_custom_file_if_exists($subpanel_file_name);

                if(file_exists($subpanel_file_name)){
                    global $subpanel_layout;
                    require_once $subpanel_file_name;
//                    die('<pre>'.print_r($subpanel_layout, true));
                    foreach($subpanel_layout['list_fields'] as $list_field_name => $list_field){
                        $json = '{"default": '.($list_field['default'] ? 'true' : 'false').', "link":'.(isset($list_field['widget_class']) && $list_field['widget_class'] == 'SubPanelDetailViewLink' ? 'true' : 'false').'}';
                        $csv[] = "'SUBPANELLISTFIELDS';'" . $subpanel_name ."';'".$subpanel['module']."';'".$list_field_name."';'".$json."'";
                    }
                }
            }
        }
        if(!empty($csv)) {
            echo '<pre>'.$file_name."\n".print_r(implode("\n", $csv), true);
            file_put_contents($file_name, implode("\n", $csv));
        }
    }

    public function classicLayoutDefsCSVtoUI($file_name, $module_name)
    {
        if(empty($module_name))
            $module_name = $this->module_name;

        $createdIds = array(); //store all ids created for revert ... just in case
        $createdIdsCSV = array(); //store all ids created for revert in a csv file... just in case

        $data = array();
        $handle = fopen($file_name, 'r');
        while ( ($buffer = fgets( $handle, 16000 )) !== false ) {
            // read the next entry
            $array = str_getcsv ( $buffer ,";", "'");
            if ( empty( $array ) ) continue;
            $data[] = $array;
        }

       // die('<pre>'.print_r($data, true));
        //if data is empty, stop here
        if(empty($data))
            return;

        //make SQLs of it
        //each subpanel is a componentset and a fieldset
        $sqls = array();
        $storeSubpanels = array();
        $fieldset_id = "";
        $rowcounter = 0;

        //main component to be set in ObjectRelateContainer config
        $componentset_id = create_guid();
        $createdIds['sysuicustomcomponentsets']['id'][$componentset_id] = "created";
        $createdIdsCSV[] = '"sysuicustomcomponentsets";"id";"'.$componentset_id.'";"created"';
        $sqls[] = "INSERT INTO sysuicustomcomponentsets (id, module, name) VALUES('".$componentset_id."', '".$module_name."', '".$this->prefix." ".$module_name." Subpanels');";
        $componentconfig = array("componentset" => $componentset_id);


        //set ObjectRelateContainer in moduleconf
        $mode = "ObjectRelateContainer";
        $getcomponentmoduleconf = "SELECT * FROM sysuicustomcomponentmoduleconf WHERE module='".$module_name."' AND component='".$mode."';";
        $res = $GLOBALS['db']->query($getcomponentmoduleconf);
        if($GLOBALS['db']->getRowCount($res) > 0){
            while($row = $GLOBALS['db']->fetchByAssoc($res)) {
                $createdIds['sysuicustomcomponentmoduleconf']['id'][$row['id']] = "updated";
                $createdIdsCSV[] = '"sysuicomponentmoduleconf";"id";"'.$row['id'].'";"updated"';
                $sqls[] = "UPDATE sysuicomponentmoduleconf SET componentconfig='" . json_encode($componentconfig) . "' WHERE id='" . $row['id'] . "';";
            }
        }else{
            $sysuicomponentmoduleconf_id = create_guid();
            $createdIds['sysuicustomcomponentmoduleconf']['id'][$sysuicomponentmoduleconf_id] = "created";
            $createdIdsCSV[] = '"sysuicomponentmoduleconf";"id";"'.$sysuicomponentmoduleconf_id.'";"created"';
            $sqls[] = "INSERT INTO sysuicustomcomponentmoduleconf (id, module, component, componentconfig, role_id) VALUES('".$sysuicomponentmoduleconf_id."', '".$module_name."', '".$mode."', '".json_encode($componentconfig)."', '*');";
        }

        for($i=0; $i<count($data); $i++){
            if($data[$i][0] == 'SUBPANELDEFS'){
                $fieldset_id = create_guid();
                $createdIds['sysuicustomfieldsets']['id'][$fieldset_id] = "created";
                $createdIdsCSV[] = '"sysuicustomfieldsets";"id";"'.$fieldset_id.'";"created"';
                $sqls[] = "INSERT INTO sysuicustomfieldsets (id, module, name) VALUES('".$fieldset_id."', '".$module_name."', '". $this->prefix." ".$module_name. " Subpanel ".$data[$i][2]."');";
                //prepare componentconfig
                $componentconfig = array("object" => $data[$i][3], "fieldset" => $fieldset_id, "actionset" => $this->getSubpanelDefaultActionSet());
                $sqls[] = "INSERT INTO sysuicustomcomponentsetscomponents (id, componentset_id, sequence, component, componentconfig) VALUES('".$fieldset_id."', '".$componentset_id."', '".$data[$i][4]."', 'ObjectRelatedlistList', '".json_encode($componentconfig)."');";
                $rowcounter=0;
            }else{ // it's SUBPANELLISTFIELDS
                //do not create entry for field like "_%button"
                if(!preg_match("/_button/i", $data[$i][3])){
                    $fieldsetsitem_id = create_guid();
                    $createdIds['sysuicustomfieldsetsitems']['id'][$fieldsetsitem_id] = "created";
                    $createdIdsCSV[] = '"sysuicustomfieldsetsitems";"id";"' . $fieldsetsitem_id . '";"created"';
                    $sqls[] = "INSERT INTO sysuicustomfieldsetsitems (id, fieldset_id, sequence, field, fieldset) VALUES('" . $fieldsetsitem_id . "', '" . $fieldset_id . "', " . $rowcounter . ", '" . $data[$i][3] . "', null);";
                    $rowcounter++;
                }
            }
        }



        //createdIds to CSV
        if(count($sqls) > 0) {
            if (!file_put_contents($this->csvpath."/" . $module_name . "_layoutdefs_converted_entries.csv", implode("\n", $createdIdsCSV)))
                echo('<pre> Could not save CSV report '.__FUNCTION__.'() :-(');
            if (!file_put_contents($this->sqlpath."/" . $module_name . "_layoutdefs_converted_entries.sql", implode("\n", $sqls)))
                echo('<pre> Could not save SQL report '.__FUNCTION__.'() :-(');
        }
//        die('<pre>'.implode(";\n", $sqls));


    }

    public function classicListViewDefsToCSV($file_name, $data){
        $csv = array();
        if(empty($data))
            return array();

        foreach($data as $module_name => $listview){
            foreach($listview as $fields){
                for($i=0; $i<count($fields); $i++) {
                    //set link
                    $link = "false";
                    if(isset($fields[$i]['link'])){
                        if(gettype($fields[$i]['link']) == 'string') $link = $fields[$i]['link'];
                        elseif(gettype($fields[$i]['link']) == 'boolean' && $fields[$i]['link'] === true) $link = "true";
                    }
                    $csv[] = '"' . strtolower($fields[$i]) . '";"'.$link.'"';
                }
            }
        }

        if(!empty($csv)) {
            echo '<pre>'.$file_name."\n".print_r(implode("\n", $csv), true);
            file_put_contents($file_name, implode("\n", $csv));
        }
    }
    public function classicListViewCSVtoUI($file_name, $module_name){
        if(empty($module_name))
            $module_name = $this->module_name;

            $createdIds = array(); //store all ids created for revert ... just in case
            $createdIdsCSV = array(); //store all ids created for revert in a csv file... just in case

            $data = array();
            if(!$handle = fopen($file_name, 'r'))
                return;

            while ( ($buffer = fgets( $handle, 16000 )) !== false ) {
                // read the next entry
                $array = str_getcsv ( $buffer ,";");
                if ( empty( $array ) ) continue;
                $data[] = $array;
            }

        //fieldset
        $sysuifieldset_id = create_guid();
        $createdIds['sysuicustomfieldsets']['id'][$sysuifieldset_id] = "created";
        $createdIdsCSV[] = '"sysuicustomfieldsets";"id";"' . $sysuifieldset_id . '";"created"';
        $sqls[] = "INSERT INTO sysuicustomfieldsets (id, module, name) VALUES('" . $sysuifieldset_id . "', '".$module_name."', '" . $this->prefix.' '.$module_name . " ListView');";
        //fieldsetitems
        for($i=0; $i<count($data); $i++){
            $sysuifieldsetsitems_id = create_guid();
            $createdIds['sysuicustomfieldsetsitems']['id'][$sysuifieldsetsitems_id] = "created";
            $createdIdsCSV[] = '"sysuicustomfieldsetsitems";"id";"' . $sysuifieldsetsitems_id . '";"created"';
            $fieldconf = array('link' => $data[$i][1]);
            $sqls[] = "INSERT INTO sysuicustomfieldsetsitems (id, fieldset_id, sequence, field, fieldset, fieldconfig) VALUES('" . $sysuifieldsetsitems_id . "', '" . $sysuifieldset_id . "', " . $i . ", '".$data[$i][0]."', null, '".json_encode($fieldconf)."');";
        }

        //prepare componentconfig
        $componentconfig = array("fieldset" => $sysuifieldset_id, "inlineedit" => false);

        //set in moduleconf
        $mode= 'ObjectList';
        $getcomponentmoduleconf = "SELECT * FROM sysuicustomcomponentmoduleconf WHERE module='".$module_name."' AND component='".$mode."'";
        $res = $GLOBALS['db']->query($getcomponentmoduleconf);
        if($GLOBALS['db']->getRowCount($res) > 0){
            while($row = $GLOBALS['db']->fetchByAssoc($res)) {
                $createdIds['sysuicustomcomponentmoduleconf']['id'][$row['id']] = "updated";
                $createdIdsCSV[] = '"sysuicustomcomponentmoduleconf";"id";"'.$row['id'].'";"updated"';
                $sqls[] = "UPDATE sysuicustomcomponentmoduleconf SET componentconfig='" . json_encode($componentconfig) . "' WHERE id='" . $row['id'] . "';";
            }
        }else{
            $sysuicomponentmoduleconf_id = create_guid();
            $createdIds['sysuicustomcomponentmoduleconf']['id'][$sysuicomponentmoduleconf_id] = "created";
            $createdIdsCSV[] = '"sysuicustomcomponentmoduleconf";"id";"'.$sysuicomponentmoduleconf_id.'";"created"';
            $sqls[] = "INSERT INTO sysuicustomcomponentmoduleconf (id, module, component, componentconfig, role_id) VALUES('".$sysuicomponentmoduleconf_id."', '".$module_name."', '".$mode."', '".json_encode($componentconfig)."','*');";
        }

        //createdIds to CSV
        if(count($sqls) > 0) {
            if (!file_put_contents($this->csvpath."/" . $module_name . "_converted_listview.csv", implode("\n", $createdIdsCSV)))
                echo('<pre> Could not save CSV report ' . $module_name . '_converted_listview.csv :-(');
            if (!file_put_contents($this->sqlpath."/" . $module_name . "_converted_listview.sql", implode("\n", $sqls)))
                echo('<pre> Could not save SQL report '.__FUNCTION__.' :-(');
        }
//        die('<pre>'.implode(";\n", $sqls));
    }



    public function generateListView($module_name = null){
        if(empty($module_name))
            $module_name = $this->module;
        $component = 'ObjectList';
        $create_component = false;
        $data = array();
        $path = $this->getDefsFilePath($module_name, "listviewdefs");
        if(!file_exists($path)) {
            return array('success' => false, 'errmsg' => 'Path does not exist: '.$path);
        }
        else{
            global $listViewDefs;
            require_once $path;

            //check if component key is defined
            $action = 'add';
            $fieldset_id = create_guid();
            if(isset($this->moduleconf[$component])) {
                $action = 'update';
                $fieldset_id = $this->moduleconf[$component]['*']['fieldset'];
            }
            else{
                $create_component = true;
            }

            // fieldset id, module, name
            $data[$action][$fieldset_id]['name'] = $this->prefix." ".$module_name." Listview";
            $data[$action][$fieldset_id]['module'] = $module_name;

            // fieldsetitems
            $sequence = 0;
            foreach($listViewDefs[$module_name] as $field_name => $field_conf){
                    $fieldsetitem_id = create_guid();
                    $data[$action][$fieldset_id]['items'][$sequence] = array(
                        'id' => $fieldsetitem_id,
                        'fieldset_id' => $fieldset_id,
                        'field' => strtolower($field_name),
                        'fieldset' => '',
                        'sequence' => $sequence,
                    );
                    //add fieldconfig
                    $fieldconfig = array();
                    $fieldconfig['default'] = (isset($field_conf['default']) ?: false);
                    if(isset($field_conf['label']))
                        $fieldconfig['label'] = $field_conf['label'];
                    $fieldconfig['link'] = (isset($field_conf['link']) ?: false);
                    $fieldconfig['sortable'] = (isset($field_conf['sortable']) ?: false);
                    $fieldconfig['readonly'] = (isset($field_conf['readonly']) ?: false);
                    $data[$action][$fieldset_id]['items'][$sequence]['fieldconfig'] = $fieldconfig;
                    $sequence++;
            }
//            echo '<pre>fieldsetitems '.__LINE__.print_r($data, true);

            $success = $this->setFieldSets($data);
            $errmsg = '';
            if(!$success)
                $errmsg = 'Error during setFieldSets()';

            if($create_component){
                $params = array('id' => create_guid(),
                    'module' => $module_name,
                    'component' => $component,
                    'componentconfig' => array('fieldset' => $fieldset_id, 'inlineedit' => false),
                    'role_id' => '*'
                );

                $this->setComponentModuleConfig($params);

            }

            return array('success' => $success, 'errmsg' => $errmsg);

        }
    }

    /**
     * make sure custom modules have an entry in syscustommodules tables
     *
     */
    public function classicModulesToUI($modules){
        $sqls = array();
        foreach ($modules as $module_name) {
            if($module_name == "Administration") continue;
            $bean = BeanFactory::getBean($module_name);
            if($bean){
                $sQ = "SELECT * FROM syscustommodules WHERE module='".$module_name."'";
                $res = $GLOBALS['db']->query($sQ);
                if($GLOBALS['db']->getRowCount($res) <= 0){
                    $sqls[] = "INSERT INTO syscustommodules (id, module, singular, icon, track, favorites, actionset, duplicatecheck ) VALUES('".create_guid()."', '".$module_name."', '".$bean->object_name."', null, 1, 0, '".$this->getMenuDefaultActionSet()."', 0);";
                }
            }
        }
        if(count($sqls) > 0) {
            if (!file_put_contents($this->sqlpath."/sysmodules_entries.sql", implode("\n", $sqls)))
                echo('<pre> Could not save SQL ".__FUNCTION__." :-(');
        }
    }

    /**
     * create SQLs for all custom labels
     * source might be:
     * custom/modules/MODULENAME/Ext/Language/CURRENTLANGUAGE.lang.ext.php
     * custom/modules/MODULENAME/language/CURRENTLANGUAGE.lang.php (since spicecrm 20180100)
     */
    public function generateCustomLabels($module_name){
        $sources = array(
            //"custom/Extension/modules/$module_name/Ext/Language",
            "custom/modules/$module_name/language"
        );

        foreach ($sources as $src) {
            if(!is_dir($src)) continue;
            foreach (new DirectoryIterator($src) as $fileInfo) {
                if ($fileInfo->isDot() || !$fileInfo->isFile()) continue;
                $srcfile = $fileInfo->getFilename();
                if(file_exists($src . "/" . $srcfile)){
                    global $mod_strings;
                    include include_once $src . "/" . $srcfile;
                    if(!is_null($mod_strings))
                        foreach($mod_strings as $lbl => $translation){
                            $this->customLabels[$lbl][substr($srcfile, 0,5)] = $translation;
                        }
                }
            }
        }
    }

    public function getClassicTabs($viewdefs){
        $tabKeys = array();
        if($viewdefs['templateMeta']['useTabs']) {
            foreach ($viewdefs['templateMeta']['tabDefs'] as $tabKey => $tab) {
                if ($tab['newTab'] == true)
                    $tabKeys[] = $tabKey;
            }
        }
        return $tabKeys;
    }

    public function getClassicUseTabs($viewdefs){
        $usetabs = false;
        if($viewdefs['templateMeta']['useTabs'] && count($viewdefs['templateMeta']['tabDefs']) > 0){
            $usetabs = true;
        }
        return $usetabs;
    }
    public function getTabPanelStructure($viewdefs){
        $storePanels = array();
        $noTabs = false;
        $tabKeys = $this->getClassicTabs($viewdefs);
        if(empty($tabKeys))
            $noTabs = true;
        foreach($viewdefs['panels'] as $panel_name => $panel){
            if(in_array($panel_name, $tabKeys) || in_array(strtoupper($panel_name), $tabKeys) || $noTabs) {
                $currentTab = $panel_name;
                if($noTabs) $currentTab = 'main';
            }
            //extract, row, fieldnames
            $extract = array();
            foreach($panel as $row => $fieldsets) {
                foreach ($fieldsets as $fieldset) {
                    if(!is_array($fieldset))
                        $extract[$row][] = $fieldset;
                    else {
                        $extract[$row][] = $fieldset['name'];
                    }
                }
            }

            $storePanels[strtoupper('tab_' . $currentTab)][strtoupper($panel_name)] = $extract;
        }
        return $storePanels;
    }


    public function getPanelsForTab($viewdefs, $tabKeys, $tabLbl){
        $counter = 0;
        $startIdx = 0;
        $storePanels = array();


        $startIdx = 0;
        foreach($viewdefs['panels'] as $panel_name => $panel){
            if($panel_name == $tabLbl){
                break;
            }
            $startIdx++;
        }
        $nextIdx = $startIdx +1;
        foreach($viewdefs['panels'] as $panel_name => $panel){
            if($panel_name == $tabLbl || $panel_name == strtolower($$tabLbl)){
                //$storePanels[$panel_name] = $panel;
                $len = array_search(array_keys($viewdefs['panels']), $tabKeys[$nextIdx]);
                $storePanels = array_slice($viewdefs['panels'], $startIdx, $len);
            }
            $counter++;
        }
        return $storePanels;
    }

    public function getButtonStructure($viewdefs){
        $storeButtons = array();
        if(is_array($viewdefs['templateMeta']['form']['buttons'])){
            foreach($viewdefs['templateMeta']['form']['buttons'] as $button){
                if(is_array($button)){
                    if(key($button) == 'customCode') {
                        //try to find a value for button
                        preg_match("/value=['\"](.*?)['\"]/", $button['customCode'], $matches, PREG_OFFSET_CAPTURE, 3);
                        $storeButtons[] = 'CSTM_BTN_' . preg_replace("/[^a-zA-Z0-9]/", "", $matches[1][0]);
                    }
                    else{
                        $storeButtons[] = 'CSTM_BTN_' . key($button);
                    }
                }
                else{
                    $storeButtons[] = $button;
                }
            }
        }


        return $storeButtons;
    }
    function setModule($data){
        global $moduleList;
        $GLOBALS['ACLController']->filterModuleList($moduleList);
        if(!empty($moduleList[$data['module']])){
            $q="REPLACE INTO sysmodules (id, module, singular, icon, bean, visible, track, favorites, actionset, duplicatecheck )
              VALUES('".$data['id']."', '".$data['module']."', '".$data['singular']."', '".$data['icon']."', '".$data['bean']."',
              '".$data['visible']."', '".$data['track']."', '".$data['favorites']."', '".$data['actionset']."', '".$data['duplicatecheck']."')";
            return $GLOBALS['db']->query($q);
        }

        return false;
    }

    /**
     * set minimal FTS config
     * @param null $module_name
     */
    public function generateFtsConfig($module_name){
        //get listview defs
        global $listViewDefs;
        $path = $this->getDefsFilePath($module_name, "listviewdefs");
        if(file_exists($path)) {
            require_once $path;
            echo '<pre>'.print_r($module_name, true);
            $fts = new SpiceFTSGenerator($module_name);
            $fts->generateFtsConfig($listViewDefs[$module_name], $module_name);
        }
    }

//////////using KREST SystemUI
    public function getComponents(){
        $c = $this->ui->getComponents();
        return $c;
    }

    public function getComponentModuleConfig($module_name = null){
        $mc = $this->ui->getComponentModuleConfigs();
        if(empty($module_name))
            $module_name = $this->module;
        return (!isset($mc[$module_name]) ? false : $mc[$module_name]);
    }

    public function setComponentModuleConfig($params){
        global $db;
        foreach($params as $key => $value){
            $cols[] = strtolower($key);
            if(is_array($value))
                $colvals[] = "'".json_encode($value)."'";
            else
                $colvals[] = "'". $value ."'";
        }
        $q = "REPLACE INTO sysuicustomcomponentmoduleconf (".implode("," , $cols).") VALUES(".implode("," , $colvals).")";
        $db->query($q);
    }

    public function getFieldSets($module_name){
        $fs = $this->ui->getFieldSets();
        $currentFs = array();
        foreach($fs as $id => $fieldset)
            if($fieldset['module'] == $module_name)
                $currentFs[$id] = $fs[$id];
        return $currentFs;
    }

    /**
     * save fieldsets
     * @param $data
     * @return bool
     */
    public function setFieldSets($data){
        return $this->ui->setFieldSets($data);
    }

    public function getComponentSets($module_name){
        $cs = $this->ui->getComponentSets();
        $currentCs = array();
        foreach($cs as $id => $componentset)
            if($componentset['module'] == $module_name)
                $currentCs[$id] = $cs[$id];
        return $currentCs;
    }
    public function getComponentSet($module_name, $componentset_id){
        $cs = $this->ui->getComponentSets();
        $currentCs = array();
        foreach($cs as $id => $componentset)
            if($componentset['module'] == $module_name && $id==$componentset_id)
                return $cs[$id];
        return $currentCs;
    }
    public function getComponentSetByTypeWithParent($module_name, $type){
        $cs = $this->ui->getComponentSets();
        $currentCs = array();
        foreach($cs as $id => $componentset) {
            if ($componentset['module'] == $module_name) {
                foreach($componentset['items'] as $itemIdx => $item){
                    if($item['component'] == $type)
                        return $componentset;
                }
            }
        }
        return $currentCs;
    }


    /**
     * save components
     * @param $data
     * @return bool
     */
    public function setComponentSets($data){
        return $this->ui->setComponentSets($data);
    }


    /**
     * get path to file containing metadatadefs
     * @param $module_name
     * @param $defs
     * @return string
     */
    public function getDefsFilePath($module_name, $defs ){
        switch($defs){
            case 'listviewdefs':
            case 'detailviewdefs':
            case 'editviewdefs':
                $path = "modules/".$module_name."/metadata/".$defs.".php";
                if(file_exists("custom/".$path))
                    $path = "custom/".$path;
                break;

            case 'subpaneldefs':
            case 'layoutdefs':
            case 'layout_defs':
                $path = "custom/modules/".$module_name."/Ext/Layoutdefs/layoutdefs.ext.php";
                if(!file_exists("custom/modules/".$module_name."/Ext/Layoutdefs/layoutdefs.ext.php"))
                    $path = get_custom_file_if_exists("modules/".$module_name."/metadata/subpaneldefs.php");

                if (file_exists ('modules/'.$module_name.'/metadata/subpaneldefs.php' ))
                    $path = 'modules/'.$module_name.'/metadata/subpaneldefs.php';
                if (file_exists ('custom/modules/'.$module_name.'/metadata/subpaneldefs.php' ))
                    $path = 'custom/modules/'.$module_name.'/metadata/subpaneldefs.php';
                if ( file_exists('custom/modules/'.$module_name.'/Ext/Layoutdefs/layoutdefs.ext.php' ))
                    $path = 'custom/modules/'.$module_name.'/Ext/Layoutdefs/layoutdefs.ext.php';
                break;
        }
        return $path;
    }


    /**
     * overwrite default config for SA role
     */
    public function loadCustomSalesRole($modules){
        $sqls = array();
        $sa_modules = array();
        //get current modules in sysuirole SALES
        $sQ = "SELECT module FROM sysuicustomrolemodules WHERE sysuirole_id='*' OR sysuirole_id=(SELECT id FROM sysuiroles WHERE identifier='SA');";
        $res = $GLOBALS['db']->query($sQ);
        while($row = $GLOBALS['db']->fetchByAssoc($res)){
            $sa_modules[] =  $row['module'];
        }
        //insert modules in sysuirolemodules
        for($i=0; $i<count($modules); $i++){
            if(!in_array($modules[$i], $sa_modules))
//                $sqls[] = "INSERT INTO sysuirolemodules (id, sysuirole_id, module, sequence) SELECT UUID(), id, '".$modules[$i]."', $i FROM sysuiroles WHERE identifier='SA';";
                $sqls[] = "INSERT INTO sysuicustomrolemodules (id, sysuirole_id, module, sequence) VALUES(UUID(), (SELECT id FROM sysuicustomroles WHERE identifier='SA'), '".$modules[$i]."', $i);";
        }

        if(count($sqls) > 0)
            if (!file_put_contents($this->sqlpath."/sysuiroles_entries.sql", implode("\n", $sqls)))
                echo('<pre> Could not save SQL in '.__FUNCTION__.'() report :-(');
    }
}





