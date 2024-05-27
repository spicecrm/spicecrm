<?php
namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

/**
 * a loader for the domains and domain validations
 *
 * Class SpiceDictionaryDomainLoader
 * @package SpiceCRM\includes\SpiceDictionary
 */
class SpiceDictionaryDomainLoader
{
    public function loadDomainValidations()
    {
        return SpiceDictionaryDomainValidations::getInstance()->domainValidations;
    }

    /**
     * Loads all enum values for a domain field.
     *
     * @param string $domain
     * @return array
     * @throws \Exception
     */
    public function loadValidationValuesForDomain(string $domain): array {
        $db = DBManagerFactory::getInstance();
        $enumValues = [];

        // get the domain field
        $query = "SELECT * FROM sysdomainfields WHERE name ='{$domain}' AND deleted = 0 AND status='a'";
        $result = $db->query($query);
        $domainField = $db->fetchRow($result);

        // get the domain field validation
        if ($domainField['fieldtype'] != 'enum') {
            return $enumValues;
        }
        $query2 = "SELECT * FROM sysdomainfieldvalidations WHERE id ='{$domainField['sysdomainfieldvalidation_id']}' AND deleted = 0 AND status='a'";
        $result2 = $db->query($query2);
        $domainValidation = $db->fetchRow($result2);

        // get the domain field validation values (i.e. the enum values)
        if ($domainValidation['validation_type'] != 'enum') {
            return $enumValues;
        }
        $query3 = "SELECT * FROM sysdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id ='{$domainValidation['id']}' AND deleted = 0 AND status='a'";
        $result3 = $db->query($query3);
        while ($row = $db->fetchRow($result3)) {
            $enumValues[] = $row['enumvalue'];
        }

        return $enumValues;
    }
}
