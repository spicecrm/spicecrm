<?php


namespace SpiceCRM\modules\OrgUnits\hooks;

use SpiceCRM\modules\OrgUnits\OrgUnit;

class OrgUnitsHooks
{

    /**
     * write users_documentrevision entries
     * event: be
     * @throws \Exception
     */
    public function orgUnitEntryToRevisionList(&$bean, $related, $data){
        OrgUnit::orgUnitEntryToRevisionList($bean, $data);
    }

    public function removeDeletedOrgUnitEntry (&$bean, $related, $data) {
        OrgUnit::removeDeletedOrgUnitEntry($bean, $data);
    }

}