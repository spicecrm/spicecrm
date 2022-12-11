<?php


namespace SpiceCRM\modules\OrgUnits\hooks;

use SpiceCRM\modules\OrgUnits\OrgUnit;

class OrgUnitsHooks
{

    /**
     * write relationship audit entries
     * event: be
     * @throws \Exception
     */
    public function orgUnitEntryToRevisionList(&$bean, $related, $data)
    {

        //todo need to check this with a breakpoint, write an insert at orgUnitEntryToRevisionList accordingly
        //reminder when a user is added to an orgunit (or an orgunit is added to an orgunit) all documents related to that orgunit need to be retrieved
        //and the latest revisions have to be added to users_documentrevision
        if ($data['related_module'] != 'EmailAddresses') return;

        $dataBefore = $bean->email_addresses->relationship->fetchedRow ?? [];
        $dataAfter = $bean->email_addresses->relationship->updatedRow ?? ['opt_in_status' => $data['related_bean']->opt_in_status, 'id' => $bean->email_addresses->relationship->relid];
        OrgUnit::orgUnitEntryToRevisionList();
        EmailAddress::writeRelationshipAudit($dataBefore, $dataAfter);
    }
}