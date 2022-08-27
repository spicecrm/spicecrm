<?php

namespace SpiceCRM\includes\SpiceGDPRManager\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

class SpiceGDPRManagerSchedulerJobTasks
{
    public function processRetentions(){
        $db = DBManagerFactory::getInstance();
        $retentions = $db->query("SELECT * FROM sysgdprretentions WHERE deleted = 0 AND active = 1");
        while($retention = $db->fetchByAssoc($retentions)){
            $moduleFilter = new SysModuleFilters();
            $filterWhere = $moduleFilter->generateWhereClauseForFilterId($retention['sysmodulefilter_id']);

            $seed = BeanFactory::getBean($moduleFilter->filtermodule);

            $query = "SELECT id, deleted FROM {$seed->_tablename} WHERE {$filterWhere}";
            if($retention['retention_type'] != 'P'){
                $query.= " AND {$seed->_tablename}.deleted = 0";
            }

            $relatedModules = explode(',', $retention['delete_related']);

            // query the ids
            $ids = $db->query($query);
            while($id = $db->fetchByAssoc($ids)){
                switch($retention['retention_type']){
                    case 'I';
                        $seed = BeanFactory::getBean($moduleFilter->filtermodule, $id['id']);
                        $seed->is_inactive = 1;
                        $seed->save();
                        break;
                    case 'D';
                        $seed = BeanFactory::getBean($moduleFilter->filtermodule, $id['id']);

                        // delete related modules
                        $this->deleteRelated($seed, $relatedModules);

                        // delete the bean itself
                        $seed->mark_deleted($id['id']);
                        break;
                    case 'P':
                        if($id['deleted'] == 0){
                            $seed = BeanFactory::getBean($moduleFilter->filtermodule, $id['id']);

                            // delete related modules
                            $this->deleteRelated($seed, $relatedModules, true);

                            // delete the bean itself
                            $seed->mark_deleted($id['id']);
                        }

                        // physically delete the record
                        $db->query("DELETE FROM {$seed->_tablename} WHERE id = '{$id['id']}'");

                        break;
                }
            }
        }
        return true;
    }

    /**
     * deletes all related beans that are relevant
     *
     * @param SpiceBean $bean
     */
    public function deleteRelated(SpiceBean $bean, $relatedModules, $purge = false){
        if(count($relatedModules) > 0) {

            foreach ($bean->field_defs as $fieldname => $fielddata) {
                if ($fielddata['type'] == 'link') {
                    if($bean->load_relationship($fieldname)) {
                        $module = $bean->{$fieldname}->getRelatedModuleName();
                        if (in_array($module, $relatedModules)) {
                            $relatedBeans = $bean->get_linked_beans($fieldname);
                            foreach ($relatedBeans as $relatedBean) {
                                $relatedBean->mark_deleted($relatedBean->id);

                                // physically delete the record
                                if($purge){
                                    $relatedBean->db->query("DELETE FROM {$relatedBean->_tablename} WHERE id = '{$relatedBean->id}'");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}