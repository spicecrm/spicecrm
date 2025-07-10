<?php

namespace SpiceCRM\modules\ServiceTickets\ACLObjectFieldHandlers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\modules\Projects\Project;
use SpiceCRM\modules\SpiceACLObjects\handlers\SpiceACLObjectFieldHandlerBase;

class ServiceTicketsACLFieldProjectIDHandler extends SpiceACLObjectFieldHandlerBase
{

    /**
     * Retrieves a list of project IDs associated with the current user's parent ID.
     *
     * @return array An array of project IDs that are linked to the current user's parent ID.
     * @throws DatabaseException
     */
    protected function getRelatedIds(): array
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        return Project::getProjectIdsForUserContact($currentUser);
    }
}