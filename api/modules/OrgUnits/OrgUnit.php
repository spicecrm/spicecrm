<?php

namespace SpiceCRM\modules\OrgUnits;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;

class OrgUnit extends \SpiceCRM\data\SpiceBean
{
    public function save($check_notify = false, $fts_index_bean = true)
    {
        $response = parent::save($check_notify, $fts_index_bean);

        if($this->orgchart_id != $this->fetched_row['orgchart_id']){
            // update all linked OrgUnits
            $linkedUnits = $this->get_linked_beans('members', 'OrgUnit', [], 0, -99, 0, "orgchart_id != '{$this->orgchart_id}'");
            foreach ($linkedUnits as $linkedUnit){
                $linkedUnit->orgchart_id = $this->orgchart_id;
                $linkedUnit->save();
            }

            // update all linked orgCharts
            $linkedCharts = $this->get_linked_beans('orgcharts', 'OrgChart');
            foreach ($linkedCharts as $linkedChart){
                $linkedChart->orgchart_id = $this->orgchart_id;
                $linkedChart->save();
            }
        }

        return $response;
    }
    /**
     * @param $bean SpiceBean
     * @param $data
     */
    //the function below will add or remove entries from useres_documentrevisions according to changes made in documents or orgunits
    public static function   orgUnitEntryToRevisionList ($bean, $data){

        $current_date = $bean->db->now();
        $guidSQL = $bean->db->getGuidSQL();
        //this triggers when you add a User to an OrgUnit
        if ($data['related_module'] == 'Users') {
            $linkedDocuments = $bean->get_linked_beans('documents', 'Documents');
            foreach ($linkedDocuments as $linkedDocument) {
                $documentRevisions = $linkedDocument->get_linked_beans('documentrevisions','DocumentRevisions');
                foreach ($documentRevisions as $documentRevision) {
                    if ($documentRevision->documentrevisionstatus == "r"){

                        $insert_query = "INSERT INTO users_documentrevisions (id,date_entered, date_modified, deleted, user_id, document_revision_id,acceptance_status)";
                        $insert_query .= " VALUES ($guidSQL, $current_date, $current_date, '0', '{$data['related_id']}', '{$documentRevision->id}', '0')";

                        $bean->db->query($insert_query);
                    }
                }
            }
            if ($bean->parent_id) {
                $parentRelation = BeanFactory::getBean('OrgUnits');
                $parentRelation->recurringParent($bean, $guidSQL, $current_date, $data);
            }

        }
        //this triggers when you add an OrgUnit to a Document, also adds all Users that are assigned to children of the original OrgUnit
        if ($data['related_module'] == 'OrgUnits' && $data['module'] == 'Documents') {
            $documentBean = BeanFactory::getBean('Documents', $data['id']);
            $documentRevisions = $documentBean->get_linked_beans('documentrevisions','DocumentRevisions');
            $orgUnitBean = BeanFactory::getBean('OrgUnits', $data['related_id']);
            foreach ($documentRevisions as $documentRevision) {
                if ($documentRevision->documentrevisionstatus == "r") {
                    $userEntries = BeanFactory::getBean('OrgUnits');
                    $userEntries->recurringMember($orgUnitBean, $documentRevision, $guidSQL, $current_date, null);
                        }
            }

        }
    }

    public function removeDeletedOrgUnitEntry ($bean, $data) {
        //a reminder, the associated hook triggers also when you move a user from one orgunit to another as a user is only supposed to be assigned to one
        //this triggers when you remove a User from an OrgUnit
        if ($data['related_module'] == 'Users') {
            $userBean = BeanFactory::getBean('Users', $data['related_id']);
            $linkedDocuments = $bean->get_linked_beans('documents', 'Documents');
            foreach ($linkedDocuments as $linkedDocument) {
                $documentRevisions = $linkedDocument->get_linked_beans('documentrevisions','DocumentRevisions');
                foreach ($documentRevisions as $documentRevision) {
                $delete_query="delete from users_documentrevisions where user_id='$userBean->id' and acceptance_status=0 and document_revision_id='$documentRevision->id'";

                $bean->db->query($delete_query);
                }
            }
            if ($bean->parent_id) {
                $parentRelation = BeanFactory::getBean('OrgUnits');
                $parentRelation->recurringParentDeletion($bean, $data);
            }
        }
        //this triggers when you remove an OrgUnit from a Document
        if ($data['related_module'] == 'OrgUnits' && $data['module'] == 'Documents') {
            $documentBean = BeanFactory::getBean('Documents', $data['id']);
            $documentRevisions = $documentBean->get_linked_beans('documentrevisions', 'DocumentRevisions');
            $orgUnitBean = BeanFactory::getBean('OrgUnits', $data['related_id']);
            foreach ($documentRevisions as $documentRevision) {
                $userEntries = BeanFactory::getBean('OrgUnits');
                $userEntries->recurringMemberDeletion($orgUnitBean, $documentRevision, null);
            }
        }
    }

    //this checks for Members of Orgunits that are children of the original Orgunit and creates users_documentrevisions for them
    public function recurringMember ($orgUnitBean, $documentRevision, $guidSQL, $current_date, $orgUnitChildren){
        global $holdRelatedUserIds;
        if ($orgUnitChildren == null){
            $memberOrgUnits = $orgUnitBean->get_full_list('', "parent_id='{$orgUnitBean->id}'");
            $relatedUsers = $orgUnitBean->get_linked_beans('users', 'Users');
            foreach ($relatedUsers as $relatedUser) {
                $holdRelatedUserIds[] = $relatedUser->id;
            }
            if ($memberOrgUnits !== 0){
                $this->recurringMember($orgUnitBean, $documentRevision, $guidSQL, $current_date, $memberOrgUnits);
            }
            array_unique($holdRelatedUserIds);
            foreach ($holdRelatedUserIds as $holdRelatedUserId){
                $insert_query = "INSERT INTO users_documentrevisions (id,date_entered, date_modified, deleted, user_id, document_revision_id,acceptance_status)";
                $insert_query .= " VALUES ($guidSQL, $current_date, $current_date, '0', '$holdRelatedUserId', '$documentRevision->id', '0')";

                $orgUnitBean->db->query($insert_query);
            }
        }else{
            foreach ($orgUnitChildren as $orgUnitChild) {
                $orgUnitBean = BeanFactory::getBean('OrgUnits', $orgUnitChild->id);
                $memberOrgUnits = $orgUnitBean->get_full_list('', "parent_id='{$orgUnitBean->id}'");
                $relatedUsers = $orgUnitBean->get_linked_beans('users', 'Users');
                foreach ($relatedUsers as $relatedUser) {
                    $holdRelatedUserIds[] = $relatedUser->id;
                }
                if ($memberOrgUnits !== null) {
                    $this->recurringMember($orgUnitBean, $documentRevision, $guidSQL, $current_date, $memberOrgUnits);
                }
            }
        }
    }

    //as we can't know how many layers of orgunits a customer uses recurrsion ensures that we still delete everything properly
    public function recurringMemberDeletion ($orgUnitBean, $documentRevision, $orgUnitChildren){
        global $holdRelatedUserIds;
        if ($orgUnitChildren == null){
            $memberOrgUnits = $orgUnitBean->get_full_list('', "parent_id='{$orgUnitBean->id}'");
            $relatedUsers = $orgUnitBean->get_linked_beans('users', 'Users');
            foreach ($relatedUsers as $relatedUser) {
                $holdRelatedUserIds[] = $relatedUser->id;
            }
            if (!empty($memberOrgUnits)){
                $this->recurringMemberDeletion($orgUnitBean, $documentRevision, $memberOrgUnits);
            }
            foreach ($holdRelatedUserIds as $holdRelatedUserId){
                $delete_query = "delete from users_documentrevisions where user_id='$holdRelatedUserId' and acceptance_status=0 and document_revision_id='$documentRevision->id'";

                $orgUnitBean->db->query($delete_query);
            }
        }else{
            foreach ($orgUnitChildren as $orgUnitChild) {
                $orgUnitBean = BeanFactory::getBean('OrgUnits', $orgUnitChild->id);
                $memberOrgUnits = $orgUnitBean->get_full_list('', "parent_id='{$orgUnitBean->id}'");
                $relatedUsers = $orgUnitBean->get_linked_beans('users', 'Users');
                foreach ($relatedUsers as $relatedUser) {
                    $holdRelatedUserIds[] = $relatedUser->id;
                }
                if ($memberOrgUnits !== null) {
                    $this->recurringMemberDeletion($orgUnitBean, $documentRevision, $memberOrgUnits);
                }
            }
        }
    }

    public function recurringParent ($bean, $guidSQL, $current_date, $data){
        $parentBean = BeanFactory::getBean('OrgUnits', $bean->parent_id);
        $parentDocuments = $parentBean->get_linked_beans('documents', 'Documents');
        foreach ($parentDocuments as $parentDocument) {
            $documentRevisions = $parentDocument->get_linked_beans('documentrevisions','DocumentRevisions');
            foreach ($documentRevisions as $documentRevision) {
                if ($documentRevision->documentrevisionstatus == "r"){

                    $insert_query = "INSERT INTO users_documentrevisions (id,date_entered, date_modified, deleted, user_id, document_revision_id,acceptance_status)";
                    $insert_query .= " SELECT $guidSQL, $current_date, $current_date, '0', '{$data['related_id']}', '$documentRevision->id', '0'";

                    $bean->db->query($insert_query);
                }
            }
        }
        if (empty($parentBean->parent_id)) {
            $this->recurringParent($parentBean, $guidSQL, $current_date, $data);
        }
    }

    //when a user is removed from an Orgunit, this checks all possible parent orgunits for relating documents and deletes all entries in users_documentrevisions related to those
    public function recurringParentDeletion ($bean, $data){
        $parentBean = BeanFactory::getBean('OrgUnits', $bean->parent_id);
        if (!empty($parentBean) === true){
        $parentDocuments = $parentBean->get_linked_beans('documents', 'Documents');
        foreach ($parentDocuments as $parentDocument) {
            $documentRevisions = $parentDocument->get_linked_beans('documentrevisions','DocumentRevisions');
            foreach ($documentRevisions as $documentRevision) {

                    $delete_query="delete from users_documentrevisions where user_id='$data[related_id]' and acceptance_status=0 and document_revision_id='$documentRevision->id'";

                    $bean->db->query($delete_query);
            }
        }}
        if (empty($parentBean->parent_id)) {
            $this->recurringParentDeletion($parentBean, $data);
        }
    }

}