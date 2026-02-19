<?php

namespace SpiceCRM\modules\Contacts\ACLObjectFieldHandlers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\extensions\modules\Projects\Project;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\modules\SpiceACLObjects\handlers\SpiceACLObjectFieldHandlerBase;

class ContactsACLFieldProjectIDHandler extends SpiceACLObjectFieldHandlerBase
{

    /**
     * Retrieves a list of contact IDs associated with the current user's parent ID.
     *
     * @return array An array of contact IDs that are linked to the current user's parent ID.
     * @throws DatabaseException
     */
    protected function getRelatedIds(): array
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $projectIds = Project::getProjectIdsForUserContact($currentUser);

        if (empty($projectIds)) return [];

        $projectIds = join("','", $projectIds);

        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT contact_id FROM projects_contacts WHERE project_id IN ('$projectIds') AND deleted = 0");

        $ids = [];

        while ($row = $db->fetchByAssoc($query)) {
            $ids[] = $row['id'];
        }

        return $ids;
    }
}