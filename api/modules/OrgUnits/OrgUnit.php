<?php

namespace SpiceCRM\modules\OrgUnits;

use SpiceCRM\data\BeanFactory;
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

    //the function below will add or remove entries from useres_documentrevisions according to changes made in documents or orgunits
    public function orgUnitEntryToRevisionList ($bean, $data){

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
                        $insert_query .= " SELECT $guidSQL, $current_date, $current_date, '0', '$data[related_id]', '$documentRevision->id', '0'";

                        $bean->db->query($insert_query);
                    }
                }
            }

        }
        //this triggers when you add an OrgUnit to a Document
        if ($data['related_module'] == 'OrgUnits' && $data['module'] == 'Documents') {
            $documentBean = BeanFactory::getBean('Documents', $data[id]);
            $documentRevisions = $documentBean->get_linked_beans('documentrevisions','DocumentRevisions');
            $orgUnitBean = BeanFactory::getBean('OrgUnits', $data[related_id]);

            $memberOrgUnits = $orgUnitBean->get_full_list('', "parent_id=($orgUnitBean)");
            $this->userHelper($orgUnitBean, $documentRevisions);
            if ($memberOrgUnits !== 0){
                foreach ($memberOrgUnits as $memberOrgUnit){
                    $memberOrgUnitBean = BeanFactory::getBean('OrgUnits', $memberOrgUnit[related_id]);
                    $firstChildren = $memberOrgUnitBean->get_full_list('', "parent_id=($memberOrgUnitBean)");
                    $this->userHelper($memberOrgUnitBean, $documentRevisions);
                    if ($firstChildren !== 0) {
                        foreach ($firstChildren as $firstChild) {
                            $memberOrgUnitChild = BeanFactory::getBean('OrgUnits', $firstChild[related_id]);
                            $secondChildren = $memberOrgUnitChild->get_full_list('', "parent_id=($memberOrgUnitChild)");
                            $this->userHelper($memberOrgUnitChild, $documentRevisions);
                            if ($secondChildren !== 0) {
                                foreach ($secondChildren as $secondChild) {
                                    $memberOrgUnitGrandChild = BeanFactory::getBean('OrgUnits', $secondChild[related_id]);
                                    $this->userHelper($memberOrgUnitGrandChild, $documentRevisions);
                                }
                            }
                        }
                    }
                }
            }

        }
    }

    public function removeDeletedOrgUnitEntry ($bean, $data) {

        //this triggers when you remove a User from an OrgUnit
        if ($data['related_module'] == 'Users') {
            $userBean = BeanFactory::getBean('Users', $data[related_id]);
            $linkedDocuments = $bean->get_linked_beans('documents', 'Documents');
            foreach ($linkedDocuments as $linkedDocument) {
                $documentRevisions = $linkedDocument->get_linked_beans('documentrevisions','DocumentRevisions');
                foreach ($documentRevisions as $documentRevision) {
                $delete_query="delete from users_documentrevisions where user_id='$userBean->id' and acceptance_status=0 and document_revision_id='$documentRevision->id'";

                $bean->db->query($delete_query);
                }
            }
        }
        //this triggers when you remove an OrgUnit from a Document
        if ($data['related_module'] == 'OrgUnits' && $data['module'] == 'Documents') {
            $documentBean = BeanFactory::getBean('Documents', $data[id]);
            $documentRevisions = $documentBean->get_linked_beans('documentrevisions', 'DocumentRevisions');
            $orgUnitBean = BeanFactory::getBean('OrgUnits', $data[related_id]);
            $relatedUsers = $orgUnitBean->get_linked_beans('users', 'Users');
            foreach ($documentRevisions as $documentRevision) {
                    foreach ($relatedUsers as $relatedUser) {
                        $delete_query = "delete from users_documentrevisions where user_id='$relatedUser->id' and acceptance_status=0 and document_revision_id='$documentRevision->id'";

                        $bean->db->query($delete_query);
                    }
            }
        }
    }

    public function userHelper ($userRelation, $documentRevisions){
        $current_date = $userRelation->db->now();
        $guidSQL = $userRelation->db->getGuidSQL();
        $relatedUsers = $userRelation->get_linked_beans('users', 'Users');
        foreach ($documentRevisions as $documentRevision) {
            if ($documentRevision->documentrevisionstatus == "r"){
                foreach ($relatedUsers as $relatedUser){
                    $insert_query = "INSERT INTO users_documentrevisions (id,date_entered, date_modified, deleted, user_id, document_revision_id,acceptance_status)";
                    $insert_query .= " SELECT $guidSQL, $current_date, $current_date, '0', '$relatedUser->id', '$documentRevision->id', '0'";

                    $userRelation->db->query($insert_query);
                }
            }
        }
    }

}