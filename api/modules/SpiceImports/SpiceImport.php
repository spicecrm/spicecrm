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
namespace SpiceCRM\modules\SpiceImports;

use SpiceCRM\data\SugarBean;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

class SpiceImport extends SugarBean
{
    //Sugar vars
    var $table_name = "spiceimports";
    var $object_name = "SpiceImport";
    var $new_schema = true;
    var $module_dir = "SpiceImports";


    var $objectimport;

    public static function getFilePreview($params)
    {
        $delimiter = ($params['separator'] == 'comma') ? ',' : ';';
        $enclosure = chr(8);

        switch ($params['enclosure']) {
            case 'single':
                $enclosure = "'";
                break;
            case 'double':
                $enclosure = '"';
                break;
        }

        $row = 0;
        $fileData = [];
        $fileHeader = [];

        $maxRows = (isset(SpiceConfig::getInstance()->config['import_max_records_per_file']) ? SpiceConfig::getInstance()->config['import_max_records_per_file'] : 50);


        if (($handle = fopen("upload://" . $params['file_md5'], "r")) !== FALSE) {
            $fileHeader = fgetcsv($handle, 0, $delimiter, $enclosure);
            $fileHeader = array_map(function($item) {
                return !mb_detect_encoding($item,'utf-8',true) ? utf8_encode($item) : $item;
            }, $fileHeader);

            if (!is_array($fileHeader) || count($fileHeader) < 2) {
                throw new BadRequestException('separator or enclosure settings do not match the file settings');
            }

            while (($data = fgetcsv($handle, 0, $delimiter, $enclosure)) !== FALSE) {
                if ([null] !== $data) {
                    if ($row < 2) {
                        $fileData[] = array_map(function ($item) {
                            return !mb_detect_encoding($item, 'utf-8', true) ? utf8_encode($item) : $item;
                        }, $data);
                    }
                    $row++;
                }
            }
            fclose($handle);
        }

        $attachments = [
            'fileHeader' => $fileHeader,
            'fileData' => $fileData,
            'fileRows' => $row,
            'fileTooBig' => $row > $maxRows
        ];

        return $attachments;
    }

    public function deleteImportFile($filemd5)
    {
        if (!unlink("upload://" . $filemd5)) {
            return json_encode(['status' => 'File cant be deleted']);
        } else {
            return json_encode(['status' => 'succeed']);
        }
    }

    function mark_deleted($id)
    {
        $db = DBManagerFactory::getInstance();

        $data = json_decode($this->data);
        $filemd5 = $data->fileId;

        $beanList = $this->get_list("", " data like '%$filemd5%' ");

        if (count($beanList['list']) == 1)
            $this->deleteImportFile($filemd5);

        parent::mark_deleted($id);

        $query = $db->query("DELETE FROM spiceimportlogs WHERE import_id = '$id'");
        if (!$query)
            return false;

        return true;

    }

    public function getSavedImports($module)
    {
        $db = DBManagerFactory::getInstance();
        $imports = [];
        $savedImports = $db->query("SELECT * FROM spiceimporttemplates WHERE module = '$module' ORDER BY name");
        while ($savedImport = $db->fetchByAssoc($savedImports)) {
            $savedImport['mappings'] = json_decode(str_replace(["\r", "\n", "&#039;"], ['', '', '"'], html_entity_decode($savedImport['mappings'], ENT_QUOTES)), true) ?: [];
            $savedImport['fixed'] = json_decode(str_replace(["\r", "\n", "&#039;"], ['', '', '"'], html_entity_decode($savedImport['fixed'], ENT_QUOTES)), true) ?: [];
            $savedImport['checks'] = json_decode(str_replace(["\r", "\n", "&#039;"], ['', '', '"'], html_entity_decode($savedImport['checks'], ENT_QUOTES)), true) ?: [];

            $imports[] = $savedImport;
        }

        return $imports;
    }

    function saveFromImport($data)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->objectimport = json_decode($data['objectimport']);
        $this->data = $data['objectimport'];
        $this->module = $this->objectimport->module;
        $this->name = $this->objectimport->module . "_" . gmdate('Y-m-d H:i:s');
        $this->assigned_user_id = $current_user->id;

        if (isset($this->objectimport->templateName))
            $this->saveTemplate();

        if ($this->objectimport->fileTooBig) {
            $this->status = 'q';
            parent::save();
            return json_encode(['status' => 'scheduled', 'msg' => 'Import has been scheduled']);
        } else {
            $this->status = 'i';
            parent::save();
            return $this->process();
        }
    }

    public function process()
    {
        $decodedData = json_decode($this->data);
        $this->objectimport = $decodedData;
        $error = false;
        $list = [];
        $delimiter = ($this->objectimport->separator == 'comma') ? ',' : ';';
        $enclosure = chr(8);

        switch ($this->objectimport->enclosure) {
            case 'single':
                $enclosure = "'";
                break;
            case 'double':
                $enclosure = '"';
                break;
        }

        if (($handle = fopen("upload://" . $this->objectimport->fileId, "r")) !== FALSE) {

            $fileHeader = fgetcsv($handle, 1000, $delimiter, $enclosure);
            $fileHeader = array_map(function($item) {
                return !mb_detect_encoding($item,'utf-8',true) ? utf8_encode($item) : $item;
            }, $fileHeader);

            while (($row = fgetcsv($handle, 1000, $delimiter, $enclosure)) !== FALSE) {

                if ([null] !== $row) {
                    $row = array_map(function ($item) {
                        return !mb_detect_encoding($item, 'utf-8', true) ? utf8_encode($item) : $item;
                    }, $row);

                    $retrieve = [];

                    foreach ($this->objectimport->checkFields as $check_field)
                        $retrieve[$check_field->moduleField] = $row[array_search($check_field->mappedField, $fileHeader)];

                    $newBean = BeanFactory::getBean($this->objectimport->module);

                    switch ($this->objectimport->importAction) {
                        case 'update':
                            $this->updateExistingRecord($fileHeader, $newBean, $row, $retrieve, $error, $list);
                            break;
                        case 'new':
                            $this->createNewRecord($newBean, $row, $fileHeader, $error, $list);
                            break;
                    }
                }
            }

            fclose($handle);

            if ($error)
                $this->status = 'e';
            else
                $this->status = 'c';

            $this->save();

        } else {

            $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '" . $this->id . "', 'Cant open file', 'upload://" . $this->objectimport->fileId . "')";
            $this->db->query($sql);
            $this->status = 'e';
            $this->save();
            return json_encode(['status' => 'error', 'list' => $list, 'import_id' => $this->id, 'msg' => 'Cant open file ' . $this->objectimport->fileName]);
        }

        return json_encode(['status' => 'imported', 'list' => $list, 'import_id' => $this->id]);
    }


    function createNewRecord($newBean, $row, $fileHeader, &$error, &$list)
    {

        if ($this->objectimport->idFieldAction == 'have') {
            $id = $row[array_search($this->objectimport->idFIeld, $fileHeader)];
            $newBean->retrieve($id);
        }

        if (empty($newBean->id)) {

            foreach ($row as $idx => $col) {

                if (isset($this->objectimport->fileMapping->{$fileHeader[$idx]})) {
                    $newBean->{$this->objectimport->fileMapping->{$fileHeader[$idx]}} = $col;

                    if ($this->objectimport->idFieldAction == 'have' &&
                        $this->objectimport->idField == $this->objectimport->fileMapping->{$fileHeader[$idx]}) {

                        $newBean->new_with_id = true;
                        $newBean->id = $col;
                    }
                }
            }

            foreach ($this->objectimport->fixedFields as $field)
                $newBean->{$field->field} = $this->objectimport->fixedFieldsValues->{$field->field};

            $newBeanId = $newBean->save();
            $assignedUser = BeanFactory::getBean('Users', $newBean->assigned_user_id);
            $notify = boolval(!$assignedUser ? false : $assignedUser->receive_notifications);
            $newBean->save($notify);
            $list[] = ['status' => 'imported', 'recordId' => $newBeanId, 'data' => [$row[0], $row[1], $row[2], $row[3]]];

            if ($this->objectimport->importDuplicateAction == 'log') {
                $dupRecs = $newBean->checkForDuplicates();

                if (count($dupRecs) > 0) {
                    $error = true;
                    $newBeanId = $newBean->save();
                    LoggerManager::getLogger()->debug('SpiceImports saved id ' . $newBeanId);
                    $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '" . $this->id . "', '" . 'Duplicate Entry' . "', '" . implode('";"', $row) . "')";
                    $list[] = ['status' => 'Duplicate Entry', 'data' => [$row[0], $row[1], $row[2], $row[3]]];
                    $this->db->query($sql);
                }
            }
        } else {
            $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '" . $this->id . "', 'Record Exists', '" . implode('";"', $row) . "')";
            $error = true;
            $list[] = ['status' => 'Record Exists', 'data' => [$row[0], $row[1], $row[2], $row[3]]];
            $this->db->query($sql);
        }
    }

    function updateExistingRecord($fileHeader, $newBean, $row, $retrieve, &$error, &$list)
    {
        $newBean->retrieve_by_string_fields($retrieve);

        if (!empty($newBean->id)) {
            foreach ($row as $idx => $col) {
                if (!empty($this->objectimport->fileMapping->{$fileHeader[$idx]}))
                    $newBean->{$this->objectimport->fileMapping->{$fileHeader[$idx]}} = $col;
            }

            foreach ($this->objectimport->fixedFields as $field)
                $newBean->{$field->field} = $this->objectimport->fixedFieldsValues->{$field->field};

            $newBeanId = $newBean->save();
            $assignedUser = BeanFactory::getBean('Users', $newBean->assigned_user_id);
            $notify = boolval(!$assignedUser ? false : $assignedUser->receive_notifications);
            $newBean->save($notify);
            LoggerManager::getLogger()->debug('SpiceImports saved id ' . $newBeanId);
            $list[] = ['status' => 'updated', 'recordId' => $newBeanId, 'data' => [$row[0], $row[1], $row[2], $row[3]]];
        } else {
            $sql = "INSERT INTO spiceimportlogs (id, import_id, msg, data) VALUES (UUID(), '" . $this->id . "', 'No Entries', '" . implode('";"', $row) . "')";
            $error = true;
            $list[] = ['status' => 'No Entries', 'data' => [$row[0], $row[1], $row[2], $row[3]]];
            $this->db->query($sql);
        }

    }

    function saveTemplate()
    {
        $spiceImportTemplates = BeanFactory::newBean("SpiceImportTemplates");
        if ($spiceImportTemplates) {
            $spiceImportTemplates->name = $this->objectimport->templateName;
            $spiceImportTemplates->module = $this->objectimport->module;
            $spiceImportTemplates->mappings = json_encode($this->objectimport->fileMapping);
            $spiceImportTemplates->fixed = json_encode($this->objectimport->fixedFields);
            if ($this->objectimport->importAction == 'update')
                $spiceImportTemplates->checks = json_encode($this->objectimport->checkFields);

            $spiceImportTemplates->save();
        }
    }

}
