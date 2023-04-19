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
        $cached = SpiceCache::get('domainvalidations');
        if($cached) return $cached;

        $db = DBManagerFactory::getInstance();
        $validationsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfieldvalidations WHERE deleted = 0 AND status = 'a'");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[$domainfield['name']] = [
                'id' => $domainfield['id'],
                'validation_type' => $domainfield['validation_type'],
                'operator' => $domainfield['operator'],
                'validationvalues' => []
            ];
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfieldvalidations WHERE deleted = 0 AND status = 'a'");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[$domainfield['name']] = [
                'id' => $domainfield['id'],
                'validation_type' => $domainfield['validation_type'],
                'operator' => $domainfield['operator'],
                'validationvalues' => []
            ];
        }

        // load the values
        foreach($validationsArray as $valname => $valdata){
            $domainvalues = $db->query("SELECT * FROM sysdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$valdata['id']}' AND deleted = 0 AND status = 'a'");
            while($domainvalue = $db->fetchByAssoc($domainvalues)){
                $validationsArray[$valname]['validationvalues'][] = [
                    'enumvalue' => $domainvalue['enumvalue'],
//                    'minvalue' => $domainvalue['minvalue'],
//                    'maxval' => $domainvalue['maxval'],
                    'label' => $domainvalue['label'],
                    'sequence' => $domainvalue['sequence']
                ];
            }
        }

        // Loaded doms from custom will fully replace the existing dom in core
        $replaceCoreDoms = [];
        $domainvalues = $db->query("SELECT * FROM syscustomdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$valdata['id']}' AND deleted = 0 AND status = 'a'");
        while($domainvalue = $db->fetchByAssoc($domainvalues)){
            // replace the full dom set in core by the one set in custom
            if(!in_array($valname, $replaceCoreDoms) && isset($validationsArray[$valname]['validationvalues'])){
                $validationsArray[$valname]['validationvalues'] = [];
                $replaceCore[] = $valname;
            }
            // fill the dom
            $validationsArray[$valname]['validationvalues'][] = [
                'enumvalue' => $domainvalue['enumvalue'],
//                'minvalue' => $domainvalue['minvalue'],
//                'maxvalue' => $domainvalue['maxvalue'],
                'label' => $domainvalue['label'],
                'sequence' => $domainvalue['sequence']
            ];
        }

        SpiceCache::set('domainvalidations', $validationsArray);

        return $validationsArray;
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
