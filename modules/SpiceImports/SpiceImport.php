<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/**
 * twentyreasons SpiceImport
 * @author Stefan Wölflinger (twentyreasons)
 */
require_once('include/SugarObjects/templates/basic/Basic.php');
require_once('include/utils.php');

class SpiceImport extends SugarBean
{
    //Sugar vars
    var $table_name = "spiceimports";
    var $object_name = "SpiceImport";
    var $new_schema = true;
    var $module_dir = "SpiceImports";
    var $id;
    var $date_entered;
    var $date_modified;
    var $assigned_user_id;
    var $modified_user_id;
    var $created_by;
    var $created_by_name;
    var $modified_by_name;
    var $description;
    var $name;

    function __construct()
    {
        parent::__construct();
    }

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function get_summary_text()
    {
        return $this->name;
    }

    public static function saveImportFiles($post)
    {
        global $current_user, $db;
        $guid = create_guid();

        require_once('include/upload_file.php');
        $upload_file = new UploadFile('file');
        if (isset($_FILES['file']) && $upload_file->confirm_upload()) {
            $filename = $upload_file->get_stored_file_name();
            $file_mime_type = $upload_file->mime_type;
            $filesize = $upload_file->get_uploaded_file_size();
            $filemd5 = $upload_file->get_uploaded_file_md5();
            $upload_file->final_move($filemd5, false);
        }

        $row = 0;
        $fileData = Array();
        $fileTooBig = false;
        global $sugar_config;
        $file = file("upload://" . $filemd5);
        if(count($file) > $sugar_config['import_max_records_per_file']){
            $fileTooBig = true;
        }
        if (($handle = fopen("upload://" . $filemd5, "r")) !== FALSE) {
            $fileHeader = fgetcsv($handle, 1000, ",");

            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if($row < 2)
                    $fileData[] = $data;
                $row++;
            }
            fclose($handle);
        }

        $attachments[] = array(
            'id' => $guid,
            'user_id' => $current_user->id,
            'user_name' => $current_user->user_name,
            'date' => $GLOBALS['timedate']->to_display_date_time(gmdate('Y-m-d H:i:s')),
            'text' => nl2br($_POST['text']),
            'filename' => $filename,
            'filesize' => $filesize,
            'filemd5' => $filemd5,
            'file_mime_type' => $file_mime_type,
            'fileheader' => $fileHeader,
            'filedata' => $fileData,
            'filerows' => $row
        );

        return json_encode(array('files' => $attachments,'fileTooBig' => $fileTooBig));
    }

    public function getSavedImports($module){
        global $db;

        $imports = array();
        $savedImports = $db->query("SELECT * FROM spiceimporttemplates WHERE module = '$module' ORDER BY name");
        while($savedImport = $db->fetchByAssoc($savedImports)){
            $savedImport['mappings'] = json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($savedImport['mappings'], ENT_QUOTES)), true) ?: array();
            $savedImport['fixed'] = json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($savedImport['fixed'],ENT_QUOTES)), true) ?: array();
            $savedImport['checks'] = json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($savedImport['checks'],ENT_QUOTES)), true) ?: array();

            $imports[] = $savedImport;
        }

        return $imports;
    }

    public function process($data){
        $objectimport = json_decode($data['objectimport']);
        $fixedData = json_decode($data['data']);
        $this->module = $data['module'];
        if($data['saveOnly'] == "true"){
            $this->data = json_encode(array('objectimport' => $objectimport, 'data' => $fixedData));
            $this->save();
            return json_encode(array('list' => array(), 'import_id' => $this->id, 'status' => $this->status, 'msg' => "Import saved"));
        }
        $this->status = 'p';
        $this->save();
        $error = false;
        $list = array();
        if (($handle = fopen("upload://" . $objectimport->fileId, "r")) !== FALSE) {
            $fileHeader = fgetcsv($handle, 1000, ",");
            while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $retrieve = array();
                foreach ($objectimport->checkFields as $check_field) $retrieve[$check_field->field] = $row[array_search($check_field->field,$fileHeader)];
                require_once('data/BeanFactory.php');
                $newBean = BeanFactory::getBean($data['module']);
                $newBean->retrieve_by_string_fields($retrieve);
                if(empty($newBean->id)) {
                    foreach ($row as $idx => $col) {
                        if(!empty($objectimport->fileMapping->{$fileHeader[$idx]})) {
                            $newBean->{$objectimport->fileMapping->{$fileHeader[$idx]}} = $col;
                        }
                    }
                    foreach ($objectimport->fixedFields as $field) {
                        $newBean->{$field->field} = $fixedData->{$field->field};
                    }
                    $newBean->save();
                    $list[] = array('status' => 'imported','data' => array($row[0],$row[1],$row[2],$row[3]));
                }else{
                    $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '".$data['import_id']."', 'Duplicate Entry', '".implode(',',$row)."')";
                    $error = true;
                    $list[] = array('status' => 'Duplicate Entry','data' => array($row[0],$row[1],$row[2],$row[3]));
                    $this->db->query($sql);
                }
            }
            fclose($handle);
            if($error){ $this->status = 'e'; }else{ $this->status = 'c'; }
            $this->save();
        }else{
            $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '".$data['import_id']."', 'Cant open file', 'upload://" . $objectimport->fileId."')";
            $this->db->query($sql);
            $this->status = 'e';
            $this->save();
            return json_encode(array('list' => $list, 'import_id' => $this->id, 'status' => $this->status, 'msg' => 'Cant open file upload://' . $objectimport->fileId));
        }

        return json_encode(array('list' => $list, 'import_id' => $this->id, 'status' => $this->status, 'msg' => ""));
    }
}