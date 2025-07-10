<?php

namespace SpiceCRM\modules\SpiceACLObjects\handlers;


abstract class SpiceACLObjectFieldHandlerBase
{
    /**
     * Generates a database condition string based on the provided table and field names.
     *
     * @param string $tableName The name of the database table.
     * @param string $fieldName The name of the database field.
     * @return string Returns a formatted string representing the database condition.
     */
    public function getDBCondition(string $tableName, string $fieldName): string
    {
        $relatedIds = join(',', array_map(fn($id) => "'$id'", $this->getRelatedIds()));;

        return empty($relatedIds) ? '1 = 0' : "$tableName.$fieldName IN ($relatedIds)";
    }

    /**
     * Retrieves the full-text search condition based on the provided field name.
     * @param string $fieldName The name of the field for which to generate the full-text search condition.
     * @return object|null The full-text search condition generated for the specified field.
     */
    public function getFTSCondition(string $fieldName): ?object
    {
        $relatedIds = $this->getRelatedIds();

        return (object)[
            'key' => 'must',
            'value' => [
                'terms' => [
                    "$fieldName.raw" => $relatedIds
                ]
            ]];
    }

    /**
     * Checks access permissions for the provided field value.
     *
     * @param mixed $fieldValue The value of the field to be checked for access permissions.
     * @return bool True if access is granted for the field value, otherwise false.
     */
    public function checkFieldAccess(mixed $fieldValue): bool
    {
        $relatedIds = $this->getRelatedIds();

        return in_array($fieldValue, $relatedIds);
    }

    /**
     * Retrieves a list of project IDs associated with the current user's parent ID.
     *
     * @return array An array of project IDs that are linked to the current user's parent ID.
     */
    abstract protected function getRelatedIds(): array;
}