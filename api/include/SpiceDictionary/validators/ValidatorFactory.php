<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainFields;
use SpiceCRM\includes\SpiceDictionary\validators\logical\LogicalValidator;
use SpiceCRM\includes\SpiceDictionary\validators\technical\TechnicalValidator;
use SpiceCRM\includes\SpiceSingleton;

class ValidatorFactory extends SpiceSingleton
{
    /**
     * Returns all validators for a given $domainFieldId
     *
     * @param string $domainFieldId
     * @return array
     */
    public function getValidators(string $domainFieldId): array {
        $domainField = SpiceDictionaryDomainFields::getInstance()->getDomainField($domainFieldId);

        return [
            'technical' => $this->getTechnicalValidator($domainField['dbtype']),
            'logical'   => $this->getLogicalValidator($domainField['fieldtype']),
        ];
    }

    /**
     * Returns the technical validator for a specified DB field type
     *
     * @param string|null $dbType
     * @return TechnicalValidator|null
     */
    private function getTechnicalValidator(?string $dbType): ?TechnicalValidator {
        if ($dbType === null) {
            return null;
        }

        return SpiceDictionaryTechnicalValidationTypes::getInstance()->getItemByLabel($dbType);
    }

    /**
     * Returns the logical validator for a specified field type
     *
     * @param string|null $fieldType
     * @return LogicalValidator|null
     */
    private function getLogicalValidator(?string $fieldType): ?LogicalValidator {
        if ($fieldType === null) {
            return null;
        }

        return SpiceDictionaryLogicalValidationTypes::getInstance()->getItemByLabel($fieldType);
    }
}