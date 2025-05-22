<?php

namespace SpiceCRM\modules\ServiceTickets\ACLObjectFieldHandlers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\modules\Projects\Project;
use SpiceCRM\modules\SpiceACLObjects\interfaces\SpiceACLObjectFieldHandlerI;

class ServiceTicketsACLFieldProjectIDHandler implements SpiceACLObjectFieldHandlerI
{
    /**
     * Generates a database condition string based on the provided table and field names.
     *
     * @param string $tableName The name of the database table.
     * @return string Returns a formatted string representing the database condition.
     * @throws DatabaseException
     */
    public function getDBCondition(string $tableName): string
    {
        $projectIds = join(',', array_map(fn($id) => "'$id'", $this->getProjectIds()));;

        return empty($projectIds) ? '1 = 0' : "$tableName.project_id IN ($projectIds)";
    }

    /**
     * Retrieves the full-text search condition based on the provided field name.
     *
     * @return object|null The full-text search condition generated for the specified field.
     * @throws DatabaseException
     */
    public function getFTSCondition(): ?object
    {
        $projectIds = $this->getProjectIds();

        return (object)[
            'key' => 'must',
            'value' => [
                'terms' => [
                    "project_id.raw" => $projectIds
                ]
            ]];
    }

    /**
     * Checks access permissions for the provided field value.
     *
     * @param mixed $fieldValue The value of the field to be checked for access permissions.
     * @return bool True if access is granted for the field value, otherwise false.
     * @throws DatabaseException
     */
    public function checkFieldAccess(mixed $fieldValue): bool
    {
        $projectIds = $this->getProjectIds();

        return in_array($fieldValue, $projectIds);
    }

    /**
     * Retrieves a list of project IDs associated with the current user's parent ID.
     *
     * @return array An array of project IDs that are linked to the current user's parent ID.
     * @throws DatabaseException
     */
    private function getProjectIds(): array
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        return Project::getProjectIdsForUserContact($currentUser);
    }
}