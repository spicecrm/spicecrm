<?php

namespace SpiceCRM\modules\SpiceACLObjects\interfaces;

interface SpiceACLObjectFieldHandlerI
{
    /**
     * Generates a database condition string based on the provided table and field names.
     *
     * @param string $tableName The name of the database table.
     * @return string Returns a formatted string representing the database condition.
     */
    public function getDBCondition(string $tableName): string;

    /**
     * Retrieves the full-text search condition based on the provided field name.
     *
     * @return object|null The full-text search condition generated for the specified field.
     */
    public function getFTSCondition(): ?object;

    /**
     * Checks access permissions for the provided field value.
     *
     * @param mixed $fieldValue The value of the field to be checked for access permissions.
     * @return bool True if access is granted for the field value, otherwise false.
     */
    public function checkFieldAccess(mixed $fieldValue): bool;
}