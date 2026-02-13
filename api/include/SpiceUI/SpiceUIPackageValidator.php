<?php

namespace SpiceCRM\includes\SpiceUI;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinitions;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainFields;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomains;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainValidations;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItems;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;

class SpiceUIPackageValidator
{
    const TYPE_MISSING = 'missing dependency';

    const TYPE_MISMATCH = 'package dependency mismatch';

    const TYPE_EMPTY_CHILDREN = 'empty children';

    const TYPE_MISSING_TEMPLATE_DEFINITION = 'missing template definitions';

    private array $packagesWithDependencies = [];

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT package, packages FROM systemdeploymentpackages WHERE packages IS NOT NULL AND packages != ''");

        while ($row = $db->fetchByAssoc($query)) {
            $this->packagesWithDependencies[$row['package']] = explode(',', $row['packages']);
        }
    }

    /**
     * @throws DatabaseException
     * @throws Exception
     */
    public function validate(): array
    {
        $dictionaryItems = SpiceDictionaryItems::getInstance()->retrieveItems();
        $dictionaryIndexes = SpiceDictionaryIndexes::getInstance()->getIndexes();
        $dictionaryRelationshipPolymorphes = SpiceDictionaryRelationships::getInstance()->retrievePolymorphRelationships();

        $packageEntriesArray = [
            'dictItems' => $dictionaryItems,
            'dictIndexes' => $dictionaryIndexes,
            'dictRelationshipPolymorphes' => $dictionaryRelationshipPolymorphes,
        ];

        $errors = [];

        foreach ($packageEntriesArray as $itemType => $items) {
            foreach ($items as $item) {
                if (empty($item['package']) || $item['package'] === 'system') {
                    continue;
                }

                switch ($itemType) {
                    case 'dictItems':
                        $validationRes = $this->validateDictionaryItem($item);
                        break;
                    case 'dictIndexes':
                        $validationRes = $this->validateIndex($item);
                        break;
                    case 'dictRelationshipPolymorphes':
                        $validationRes = $this->validatePolymorphes($item);
                        break;
                }

                if (!empty($validationRes)) {
                    $errors[$item['package']][] = $validationRes;
                }
            }
        }

        return $errors;
    }

    /**
     * @param array $item
     * @param array $dependency item from which we extract the packages for the validation
     * @param bool $isFatal
     * @return null|array
     */
    public function validateItemsPackage(array $item, array $dependency, bool $isFatal = false): null|array
    {
        $itemPackage = $item['package'];
        $dependencyPackage = $dependency['package'];

        if (in_array($dependencyPackage, ['system', 'core']) || $itemPackage == $dependencyPackage) {
            return null;
        }

        $pkgDependencies = $this->packagesWithDependencies[$itemPackage] ?? [];

        if ($pkgDependencies === []) {
            $errorMessage = "Expected dependency package '$itemPackage', but got '$dependencyPackage'";
            return $this->buildErrorObject($item, self::TYPE_MISMATCH, $dependency, null, $errorMessage, $isFatal);
        }

        $isValid = in_array($dependencyPackage, $pkgDependencies);

        if (!$isValid) {
            $pkgDependencies = implode(', ', $pkgDependencies);
            $errorMessage = "Expected dependency packages: $pkgDependencies, but got $dependencyPackage";
            return $this->buildErrorObject($item, self::TYPE_MISMATCH, $dependency, null, $errorMessage, $isFatal);
        }

        return null;
    }

    /**
     * prepares an object from the item array with table addition to be validated
     * @param array|object $item
     * @param string $table
     * @return array
     */
    public function buildItemObjectToValidate(array|object $item, string $table): array
    {
        $itemArray = is_array($item) ? $item : (array) $item;

        return [
            'name' => $itemArray['relationship_name'] ?? $itemArray['name'],
            'id' => $itemArray['id'],
            'package' => $itemArray['package'],
            'table' => $table
        ];
    }

    /**
     * @param array $item
     * @param string $errorType
     * @param array|null $itemDependency
     * @param string|null $table
     * @param string|null $errorMessage
     * @param bool $isFatal
     * @return array
     */
    public function buildErrorObject(array $item, string $errorType, array $itemDependency = null, string $table = null, string $errorMessage = null, bool $isFatal = false): array
    {
        $itemTable = $item['table'] ?: $table;
        $depTable = $itemDependency['table'] ?? null;

        return [
            'item_name' => $item['name'],
            'item_id' => $item['id'],
            'item_table' => $itemTable,
            'dep_name' => $itemDependency['name'] ?? null,
            'dep_id' => $itemDependency['id'] ?? null,
            'dep_table' => $depTable,
            'error_type' => $errorType,
            'error_message' => $errorMessage,
            'is_fatal' => $isFatal
        ];
    }

    /**
     * compares and validates the packages between a dictionary domain, and then it's values
     * also check if the domain is present
     * @param $domain
     * @return array|null
     */
    public function validateDomain($domain): array|null
    {
        $domainFields = SpiceDictionaryDomainFields::getInstance()->getDomainFields($domain['id']);

        if (!$domainFields) {
            return $this->buildErrorObject($domain, self::TYPE_MISSING, ['id' => $domain['id'], 'table' => 'sysdomaindefinitions'], 'sysdomainfields');
        }

        foreach ($domainFields as $domainField) {
            $domainFieldObj = $this->buildItemObjectToValidate($domainField, 'sysdomainfields');
            $domainDefinitionObj = $this->buildItemObjectToValidate($domain, 'sysdomaindefinitions');
            $domainDefinitionPkgCheck = $this->validateItemsPackage($domainFieldObj, $domainDefinitionObj);

            if ($domainDefinitionPkgCheck !== null) {
                return $domainDefinitionPkgCheck;
            }

            # stop validating further if no domainfieldvalidation defined
            if (empty($domainField['sysdomainfieldvalidation_id'])) continue;

            $domainValidation = SpiceDictionaryDomainValidations::getInstance()->domainValidations[$domainField['sysdomainfieldvalidation_id']];

            if (!$domainValidation) {
                return $this->buildErrorObject($domainField, self::TYPE_EMPTY_CHILDREN, $domain);
            }

            $domainValidationObj = $this->buildItemObjectToValidate($domainValidation, 'sysdomainfieldvalidations');
            $domainValidationPkgCheck = $this->validateItemsPackage($domainFieldObj, $domainValidationObj);

            if ($domainValidationPkgCheck !== null) {
                return $domainValidationPkgCheck;
            }

            # validate domain validation values
            foreach ($domainValidation['validationvalues'] as $validationValue) {
                $validationValueObj = $this->buildItemObjectToValidate($validationValue, 'sysdomainfieldvalidationvalues');

                $validateValidationPkgCheck = $this->validateItemsPackage($validationValueObj, $domainValidationObj);

                if ($validateValidationPkgCheck !== null) {
                    return $validateValidationPkgCheck;
                }
            }
        }

        return null;
    }

    /**
     * validates the domains of the dictionary item and compares packages and package dependencies
     * @param $item
     * @return array|null
     */
    public function validateDictionaryItem($item): array|null
    {
        $dictionaryDefinition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($item['sysdictionarydefinition_id']);

        if (!$dictionaryDefinition) {
            return $this->buildErrorObject($item, self::TYPE_MISSING, ['id' => $item['sysdictionarydefinition_id'], 'table' => 'sysdictionarydefinitions'], 'sysdictionaryitems');
        }

        $dictionaryDefObject = $this->buildItemObjectToValidate($dictionaryDefinition, 'sysdictionarydefinitions');
        $dictionaryItemObject = $this->buildItemObjectToValidate($item, 'sysdictionaryitems');
        $dictionaryDefPkgCheck = $this->validateItemsPackage($dictionaryItemObject, $dictionaryDefObject);

        if ($dictionaryDefPkgCheck !== null) {
            return $dictionaryDefPkgCheck;
        }

        if ($item['sysdictionary_ref_id'] && !$item['sysdomaindefinition_id']) {
            $dictionaryRefDefinition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($item['sysdictionary_ref_id']);

            if (!$dictionaryRefDefinition) {
                return $this->buildErrorObject($item, self::TYPE_MISSING_TEMPLATE_DEFINITION, null, 'sysdictionarydefinitions');
            }

            $dictionaryRefDefObject = $this->buildItemObjectToValidate($dictionaryRefDefinition, 'sysdictionarydefinitions');
            $dictionaryRefDefPkgCheck = $this->validateItemsPackage($dictionaryItemObject, $dictionaryRefDefObject);

            if ($dictionaryRefDefPkgCheck !== null) {
                return $dictionaryRefDefPkgCheck;
            }

            # stop further validation because no domain definition is present
            return null;
        }

        # validate domain definition package and it's dependencies and collect error messages, if any
        $domainDefinition = SpiceDictionaryDomains::getInstance()->getDomainById($item['sysdomaindefinition_id']);

        if (!$domainDefinition) {
            return $this->buildErrorObject($item, self::TYPE_MISSING, ['id' => $item['sysdomaindefinition_id'], 'table' => 'sysdomaindefinitions'], 'sysdictionaryitems', null, true);
        }

        $domainObj = $this->buildItemObjectToValidate($domainDefinition, 'sysdomaindefinitions');
        $domainPkgCheck = $this->validateItemsPackage($dictionaryItemObject, $domainObj, true);

        if ($domainPkgCheck !== null) {
            return $domainPkgCheck;
        }

        $domainValidationRes = $this->validateDomain($domainDefinition);

        if ($domainValidationRes !== null) {
            return $domainValidationRes;
        }

        return null;
    }

    /**
     * validates the index and it's items
     * @param $index
     * @return array|null
     */
    public function validateIndex($index): array|null
    {
        $dictionaryDefinition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($index['sysdictionarydefinition_id']);

        if (!$dictionaryDefinition) {
            return $this->buildErrorObject($index, self::TYPE_MISSING, ['id' => $index['sysdictionarydefinition_id'], 'table' => 'sysdictionarydefinitions'], 'sysdictionaryindexes');
        }

        $dictionaryDefObj = $this->buildItemObjectToValidate($dictionaryDefinition, 'sysdictionarydefinitions');
        $dictionaryIndexObj = $this->buildItemObjectToValidate($index, 'sysdictionaryindexes');

        # compare packages of the definition and index
        $dictionaryDefinitionPkgCheck = $this->validateItemsPackage($dictionaryIndexObj, $dictionaryDefObj);

        if ($dictionaryDefinitionPkgCheck !== null) {
            return $dictionaryDefinitionPkgCheck;
        }

        $index['indexItems'] = SpiceDictionaryIndexes::getInstance()->getIndexItems($index['id']);

        if (empty($index['indexItems'])) {
            return $this->buildErrorObject($index, self::TYPE_EMPTY_CHILDREN, null, 'sysdictionaryindexitems');
        }

        # compare index items packages with the index and dictionary items packages with its defined index items
        foreach ($index['indexItems'] as $indexItem) {
            $indexItemObj = $this->buildItemObjectToValidate($indexItem, 'sysdictionaryindexitems');
            $indexItemPkgCheck = $this->validateItemsPackage($indexItemObj, $dictionaryIndexObj, true);

            if ($indexItemPkgCheck !== null) {
                return $indexItemPkgCheck;
            }

            $dictionaryItem = SpiceDictionaryItems::getInstance()->getItem($indexItem['sysdictionaryitem_id']);

            if (!$dictionaryItem) {
                return $this->buildErrorObject($indexItem, self::TYPE_MISSING, ['id' => $indexItem['sysdictionaryitem_id'], 'table' => 'sysdictionaryitems'], null, null, true);
            }

            if ($indexItem['sysdictionaryforeignitem_id'] && $indexItem['sysdictionaryforeigndefinition_id']) {
                $foreignItem = SpiceDictionaryItems::getInstance()->getItem($indexItem['sysdictionaryforeignitem_id']);

                if (!$foreignItem) {
                    return $this->buildErrorObject($indexItem, self::TYPE_MISSING, ['id' => $indexItem['sysdictionaryforeignitem_id'], 'table' => 'sysdictionaryitems'], null, null, true);
                }

                $foreignDefinition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($indexItem['sysdictionaryforeigndefinition_id']);
                $foreignItemObj = $this->buildItemObjectToValidate($foreignItem, 'sysdictionaryitems');

                $foreignDefinitionObj = $this->buildItemObjectToValidate($foreignDefinition, 'sysdictionarydefinitions');
                $foreignItemPkgCheck = $this->validateItemsPackage($indexItemObj, $foreignItemObj, true);

                if ($foreignItemPkgCheck !== null) {
                    return $foreignItemPkgCheck;
                }

                $foreignDefinitionPkgCheck = $this->validateItemsPackage($indexItemObj, $foreignDefinitionObj);

                if ($foreignDefinitionPkgCheck !== null) {
                    return $foreignDefinitionPkgCheck;
                }
            }

            $dictionaryItemObj = $this->buildItemObjectToValidate($dictionaryItem, 'sysdictionaryitems');
            $dictionaryItemPkgCheck = $this->validateItemsPackage($indexItemObj, $dictionaryItemObj, true);

            if ($dictionaryItemPkgCheck !== null) {
                return $dictionaryItemPkgCheck;
            }

            $indexItemDictionaryItemValidationRes = $this->validateDictionaryItem($dictionaryItem);

            if ($indexItemDictionaryItemValidationRes !== null) {
                return $indexItemDictionaryItemValidationRes;
            }
        }

        return null;
    }

    /**
     * validates the relationship fields or polymorph relationship dependencies i.e., whether they exist and compares packages with the item dependencies
     * @param array $item
     * @return array|null
     */
    public function validatePolymorphes(array $item) :array|null
    {
        if (!$item['relationship_id']) {
            return $this->buildErrorObject($item, self::TYPE_MISSING, ['id' => $item['relationship_id'], 'table' => 'sysdictionaryrelationships'], 'sysdictionaryrelationshippolymorphs');
        }

        $polymorphDefinition = $this->buildItemObjectToValidate($item, 'sysdictionaryrelationshippolymorphs');

        $dictionaryDefinition = SpiceDictionaryDefinitions::getInstance()->getDefinitionById($item['lhs_sysdictionarydefinition_id']);

        if (!$dictionaryDefinition) {
            return $this->buildErrorObject($item, self::TYPE_MISSING, ['id' => $item['lhs_sysdictionarydefinition_id'], 'table' => 'sysdictionarydefinitions'], 'sysdictionaryrelationshippolymorphs');
        }

        $dictionaryItem = SpiceDictionaryItems::getInstance()->getItem($item['lhs_sysdictionaryitem_id']);

        if (!$dictionaryItem) {
            return $this->buildErrorObject($item, self::TYPE_MISSING, ['id' => $item['lhs_sysdictionaryitem_id'], 'table' => 'sysdictionaryitems'], 'sysdictionaryrelationshippolymorphs', null, true);
        }

        $dictionaryItemObj = $this->buildItemObjectToValidate($dictionaryItem, 'sysdictionaryitems');
        $dictionaryItemPkgCheck = $this->validateItemsPackage($polymorphDefinition, $dictionaryItemObj, true);

        if ($dictionaryItemPkgCheck !== null) {
            return $dictionaryItemPkgCheck;
        }

        return null;
    }

}