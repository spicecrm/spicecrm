<?php

namespace SpiceCRM\includes\SpiceGDPRManager\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;

class SpiceGDPRManagerSchedulerJobTasks
{
    public function processRetentions()
    {
        $db = DBManagerFactory::getInstance();
        $retentions = $db->query("SELECT * FROM sysgdprretentions WHERE deleted = 0 AND active = 1");
        while ($retention = $db->fetchByAssoc($retentions)) {
            $moduleFilter = new SysModuleFilters();
            $filterWhere = $moduleFilter->generateWhereClauseForFilterId($retention['sysmodulefilter_id']);

            $seed = BeanFactory::getBean($moduleFilter->filtermodule);

            if ($filterWhere) {
                $query = "SELECT id, deleted FROM {$seed->_tablename} WHERE {$filterWhere}";

                if ($retention['retention_type'] != 'P') {
                    $query .= " AND {$seed->_tablename}.deleted = 0";
                }
            }

            $relatedModules = explode(',', $retention['delete_related']);

            // query the ids
            $ids = $db->query($query);
            while ($id = $db->fetchByAssoc($ids)) {
                switch ($retention['retention_type']) {
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
                        $seed = BeanFactory::getBean($moduleFilter->filtermodule, $id['id'], [], false);

                        if ($id['deleted'] == 0) {

                            // delete the bean itself
                            $seed->mark_deleted($id['id']);
                        }

                        // delete related modules
                        $this->deleteRelated($seed, $relatedModules, true);

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
    public function deleteRelated(SpiceBean $bean, $relatedModules, $purge = false)
    {
        if (count($relatedModules) > 0) {

            foreach ($bean->field_defs as $fieldname => $fielddata) {
                if ($fielddata['type'] == 'link') {
                    if ($bean->load_relationship($fieldname)) {
                        $module = $bean->{$fieldname}->getRelatedModuleName();
                        if (in_array($module, $relatedModules)) {
                            $relatedBeans = $bean->get_linked_beans($fieldname);

                            foreach ($relatedBeans as $relatedBean) {
                                $relationshipDef = $bean->{$fieldname}->relationship;

                                // delete related data
                                $this->deleteRelatedBeans($bean, $relatedBean, $relationshipDef);

                                // physically delete the record
                                if ($purge) {
                                    $relatedBean->db->query("DELETE FROM {$relatedBean->_tablename} WHERE id = '{$relatedBean->id}'");
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * deleting related Beans of the $relatedBean according to relationship type
     * loops through links & retrieves related Beans to check if we can set deleted flag on relatedBean
     * if $relatedBean has other not-deleted relationships then it should not be deleted
     *
     * @param SpiceBean $beanToBeDeleted
     * @param SpiceBean $relatedBean
     * @param object $relationshipDef
     * @return void
     */
    private function deleteRelatedBeans(SpiceBean $beanToBeDeleted, SpiceBean $relatedBean, object $relationshipDef)
    {

        switch ($relationshipDef->type) {
            case 'many-to-many':
                $lhsLink = $relationshipDef->lhsLink;
                if ($relatedBean->load_relationship($relationshipDef->lhsLink)) {
                    $relatedBean->$lhsLink->delete($relatedBean->id, $beanToBeDeleted->id);
                } else {
                    LoggerManager::getLogger()->fatal('Deleting GDPR Beans', "error loading relationship $lhsLink in " . __FILE__);
                }
                break;

            case 'one-to-many':
                // get linked fields of the relatedBean
                $linked_fields = array_filter(
                    $relatedBean->get_linked_fields(),
                    function ($key) {
                        return !in_array($key, ['assigned_user_link', 'created_by_link', 'modified_user_link', 'mailboxes']);
                    },
                    ARRAY_FILTER_USE_KEY
                );

                // retrieve only links of the relatedBean
                $linkNames = [];
                foreach ($linked_fields as $linkedField) {
                    $linkNames[] = $linkedField['name'];
                }

                if (count($linkNames) > 0) {
                    // collection of all the beans related to the related Bean
                    $beansRelatedToRelatedBeanList = $relatedBean->get_multiple_linked_beans($linkNames);

                    // delete related bean if we've not got any m-2-m relationships
                    if (empty($beansRelatedToRelatedBeanList)) {
                        $relatedBean->mark_deleted($relatedBean->id);
                    } else {

                        // arrays for activities and specially treated related-related modules
                        $activities = ['Calls', 'Emails', 'Letters', 'Notes', 'Meetings', 'Tasks'];
                        $speciallyTreatedModules = ['EmailTemplates'];

                        // delete related true per default
                        $deleteRelatedBean = true;

                        // check if $relatedBean is an Activity & check if any beanListItem is not the $beanToBeDeleted
                        if (in_array($relatedBean->_module, $activities)) {
                            foreach ($beansRelatedToRelatedBeanList as $beanListItem) {

                                // special treatment for beanListItem of a related-Email
                                if (in_array($beanListItem->_module, $speciallyTreatedModules)) {
                                    continue;
                                }

                                if ($beanListItem->id != $beanToBeDeleted->id) {
                                    $deleteRelatedBean = false;
                                    break;
                                }
                            }
                        }

                        // make sure we delete the related bean if can
                        if ($deleteRelatedBean) $relatedBean->mark_deleted($relatedBean->id);
                    }
                }
                break;
        }
    }
}