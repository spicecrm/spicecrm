<?php
namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceDictionaryHandler
{
    /**
     * loads the metadata files
     */
    public static function loadMetaDataFiles() {
        $metaDataDirectories = ['metadata', 'extensions/metadata', 'custom/metadata'];
        global $dictionary;
        foreach ($metaDataDirectories as $metaDataDirectory) {
            self::loadMetaDataFilesFromDir($metaDataDirectory);
        }

        if(file_exists('custom/application/Ext/TableDictionary/tabledictionary.ext.php')){
            include('custom/application/Ext/TableDictionary/tabledictionary.ext.php');
        }
    }

    /**
     * Loads the metadata files from a particular directory.
     *
     * @param string $directory
     */
    private static function loadMetaDataFilesFromDir(string $directory): void {
        global $dictionary;
        if ($metaDataHandle = @opendir('./' . $directory)) {
            while (false !== ($metaDataFile = readdir($metaDataHandle))) {
                if (preg_match('/\.php$/', $metaDataFile)) {
                    include($directory . '/' . $metaDataFile);
                }
            }
        }
    }

    /**
     * loads the dictionary Definitions of type metadata from the database
     */
    static function loadMetaDataDefinitions(){
        global $dictionary;
        if(isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']){
            SpiceDictionaryVardefs::loadDictionaries($dictionary, 'metadata');
        }
    }

    /**
     * retrieves the dictionary definitions
     *
     * @return array
     */
    public function getDictionaryDefinitions(){
        $db = DBManagerFactory::getInstance();
        $defArray = [];
        $dictionarydefinitions = $db->query("SELECT * FROM sysdictionarydefinitions WHERE deleted = 0");
        while($dictionarydefinition = $db->fetchByAssoc($dictionarydefinitions)){
            $dictionarydefinition['deleted'] = intval($dictionarydefinition['deleted']);
            $defArray[] = array_merge($dictionarydefinition, ['scope' => 'g']);
        }
        $dictionarydefinitions = $db->query("SELECT * FROM syscustomdictionarydefinitions WHERE deleted = 0");
        while($dictionarydefinition = $db->fetchByAssoc($dictionarydefinitions)){
            $dictionarydefinition['deleted'] = intval($dictionarydefinition['deleted']);
            $defArray[] = array_merge($dictionarydefinition, ['scope' => 'c']);;
        }

        return $defArray;
    }

    /**
     * save the dict definitions
     *
     * @param $definitions
     * @throws Exception
     */
    public function setDictionaryDefinitions($definitions){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($definitions as $definition){
            switch($definition['scope']){
                case 'c':
                    unset($definition['scope']);
                    $db->upsertQuery('syscustomdictionarydefinitions', ['id' => $definition['id']], $definition);
                    if ($cr) $cr->addDBEntry("syscustomdictionarydefinitions", $definition['id'], 'I', $definition['name']);
                    break;
                default:
                    unset($definition['scope']);
                    $db->upsertQuery('sysdictionarydefinitions', ['id' => $definition['id']], $definition);
                    if ($cr) $cr->addDBEntry("sysdictionarydefinitions", $definition['id'], 'I', $definition['name']);
                    break;
            }
        }
    }


    /**
     * retrieves the dictionary items
     *
     * @return array
     */
    public function getDictionaryItems(){
        $db = DBManagerFactory::getInstance();
        $itemArray = [];
        $dictionaryitems = $db->query("SELECT * FROM sysdictionaryitems WHERE deleted = 0");
        while($dictionaryitem = $db->fetchByAssoc($dictionaryitems)){
            $dictionaryitem['sequence'] = intval($dictionaryitem['sequence']);
            $dictionaryitem['deleted'] = intval($dictionaryitem['deleted']);
            $itemArray[] = array_merge($dictionaryitem, ['scope' => 'g']);
        }
        $dictionaryitems = $db->query("SELECT * FROM syscustomdictionaryitems WHERE deleted = 0");
        while($dictionaryitem = $db->fetchByAssoc($dictionaryitems)){
            $dictionaryitem['sequence'] = intval($dictionaryitem['sequence']);
            $dictionaryitem['deleted'] = intval($dictionaryitem['deleted']);
            $itemArray[] = array_merge($dictionaryitem, ['scope' => 'c']);;
        }

        return $itemArray;
    }

    /**
     * save the dict definitions
     *
     * @param $definitions
     * @throws Exception
     */
    public function setDictionaryItems($items){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($items as $item){
            switch($item['scope']){
                case 'c':
                    unset($item['scope']);
                    $db->upsertQuery('syscustomdictionaryitems', ['id' => $item['id']], $item);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryitems", $item['id'], 'I', $item['name']);
                    break;
                default:
                    unset($item['scope']);
                    $db->upsertQuery('sysdictionaryitems', ['id' => $item['id']], $item);
                    if ($cr) $cr->addDBEntry("sysdictionaryitems", $item['id'], 'I', $item['name']);
                    break;
            }
        }
    }


    /**
     * retrieves the dictionary relationships
     *
     * @return array
     */
    public function getDictionaryRelationships(){
        $db = DBManagerFactory::getInstance();
        $relArray = [];
        $dictionaryrelationships = $db->query("SELECT * FROM sysdictionaryrelationships WHERE deleted = 0");
        while($dictionaryrelationship = $db->fetchByAssoc($dictionaryrelationships)){
            $dictionaryrelationship['deleted'] = intval($dictionaryrelationship['deleted']);
            $relArray[] = array_merge($dictionaryrelationship, ['scope' => 'g']);
        }
        $dictionaryrelationships = $db->query("SELECT * FROM syscustomdictionaryrelationships WHERE deleted = 0");
        while($dictionaryrelationship = $db->fetchByAssoc($dictionaryrelationships)){
            $dictionaryrelationship['deleted'] = intval($dictionaryrelationship['deleted']);
            $relArray[] = array_merge($dictionaryrelationship, ['scope' => 'c']);;
        }

        return $relArray;
    }

    /**
     * writes the relationship changes to the database
     *
     * @param $relationships
     */
    public function setDictionaryRelationships($relationships){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($relationships as $relationship){
            switch($relationship['scope']){
                case 'c':
                    unset($relationship['scope']);
                    $db->upsertQuery('syscustomdictionaryrelationships', ['id' => $relationship['id']], $relationship);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryrelationships", $relationship['id'], 'I', $relationship['name']);
                    break;
                default:
                    unset($relationship['scope']);
                    $db->upsertQuery('sysdictionaryrelationships', ['id' => $relationship['id']], $relationship);
                    if ($cr) $cr->addDBEntry("sysdictionaryrelationships", $relationship['id'], 'I', $relationship['name']);
                    break;
            }
        }
    }

    /**
     * retrieves the dictionary relatioonshipd relate fields
     *
     * @return array
     */
    public function getDictionaryRelationshipFields(){
        $db = DBManagerFactory::getInstance();
        $relFieldArray = [];
        $dictionaryrelationshipields = $db->query("SELECT * FROM sysdictionaryrelationshipfields WHERE deleted = 0");
        while($dictionaryrelationshipield = $db->fetchByAssoc($dictionaryrelationshipields)){
            $dictionaryrelationshipield['deleted'] = intval($dictionaryrelationshipield['deleted']);
            $relFieldArray[] = array_merge($dictionaryrelationshipield, ['scope' => 'g']);
        }
        $dictionaryrelationshipields = $db->query("SELECT * FROM syscustomdictionaryrelationshipfields WHERE deleted = 0");
        while($dictionaryrelationshipield = $db->fetchByAssoc($dictionaryrelationshipields)){
            $dictionaryrelationshipield['deleted'] = intval($dictionaryrelationshipield['deleted']);
            $relFieldArray[] = array_merge($dictionaryrelationshipield, ['scope' => 'c']);;
        }

        return $relFieldArray;
    }

    /**
     * writes the relationship changes to the database
     *
     * @param $relationships
     */
    public function setDictionaryRelationshipFields($relationshiprelationshipfields){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($relationshiprelationshipfields as $relationshiprelationshipfield){
            switch($relationshiprelationshipfield['scope']){
                case 'c':
                    unset($relationshiprelationshipfield['scope']);
                    $db->upsertQuery('syscustomdictionaryrelationshipfields', ['id' => $relationshiprelationshipfield['id']], $relationshiprelationshipfield);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryrelationshipfields", $relationshiprelationshipfield['id'], 'I', $relationshiprelationshipfield['sysdictionaryitem_id']);
                    break;
                default:
                    unset($relationshiprelationshipfield['scope']);
                    $db->upsertQuery('sysdictionaryrelationshipfields', ['id' => $relationshiprelationshipfield['id']], $relationshiprelationshipfield);
                    if ($cr) $cr->addDBEntry("sysdictionaryrelationshipfields", $relationshiprelationshipfield['id'], 'I', $relationshiprelationshipfield['sysdictionaryitem_id']);
                    break;
            }
        }
    }

    /**
    /**
     * retrieves the dictionary relatioonshipd relate fields
     *
     * @return array
     */
    public function getDictionaryRelateFields(){
        $db = DBManagerFactory::getInstance();
        $relFieldArray = [];
        $dictionaryrelatefields = $db->query("SELECT * FROM sysdictionaryrelationshiprelatefields WHERE deleted = 0");
        while($dictionaryrelatefield = $db->fetchByAssoc($dictionaryrelatefields)){
            $dictionaryrelatefield['deleted'] = intval($dictionaryrelatefield['deleted']);
            $relFieldArray[] = array_merge($dictionaryrelatefield, ['scope' => 'g']);
        }
        $dictionaryrelatefields = $db->query("SELECT * FROM syscustomdictionaryrelationshiprelatefields WHERE deleted = 0");
        while($dictionaryrelatefield = $db->fetchByAssoc($dictionaryrelatefields)){
            $dictionaryrelatefield['deleted'] = intval($dictionaryrelatefield['deleted']);
            $relFieldArray[] = array_merge($dictionaryrelatefield, ['scope' => 'c']);;
        }

        return $relFieldArray;
    }

    /**
     * writes the relationship changes to the database
     *
     * @param $relationships
     */
    public function setDictionaryRelateFields($relationshiprelatefields){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($relationshiprelatefields as $relationshiprelatefield){
            switch($relationshiprelatefield['scope']){
                case 'c':
                    unset($relationshiprelatefield['scope']);
                    $db->upsertQuery('syscustomdictionaryrelationshiprelatefields', ['id' => $relationshiprelatefield['id']], $relationshiprelatefield);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryrelationshiprelatefields", $relationshiprelatefield['id'], 'I', $relationshiprelatefield['sysdictionaryitem_id']);
                    break;
                default:
                    unset($relationshiprelatefield['scope']);
                    $db->upsertQuery('sysdictionaryrelationshiprelatefields', ['id' => $relationshiprelatefield['id']], $relationshiprelatefield);
                    if ($cr) $cr->addDBEntry("sysdictionaryrelationshiprelatefields", $relationshiprelatefield['id'], 'I', $relationshiprelatefield['sysdictionaryitem_id']);
                    break;
            }
        }
    }

    /**
     * retrieves the dictionary indexes
     *
     * @return array
     */
    public function getDictionaryIndexes(){
        $db = DBManagerFactory::getInstance();
        $indexArray = [];
        $dictionaryindexes = $db->query("SELECT * FROM sysdictionaryindexes WHERE deleted = 0");
        while($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)){
            $dictionaryindex['deleted'] = intval($dictionaryindex['deleted']);
            $indexArray[] = array_merge($dictionaryindex, ['scope' => 'g']);
        }
        $dictionaryindexes = $db->query("SELECT * FROM syscustomdictionaryindexes WHERE deleted = 0");
        while($dictionaryindex = $db->fetchByAssoc($dictionaryindexes)){
            $dictionaryindex['deleted'] = intval($dictionaryindex['deleted']);
            $indexArray[] = array_merge($dictionaryindex, ['scope' => 'c']);;
        }

        return $indexArray;
    }


    /**
     * writes the relationship changes to the database
     *
     * @param $relationships
     */
    public function setDictionaryIndexes($indexes){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($indexes as $index){
            switch($index['scope']){
                case 'c':
                    unset($index['scope']);
                    $db->upsertQuery('syscustomdictionaryindexes', ['id' => $index['id']], $index);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryindexes", $index['id'], 'I', $index['name']);
                    break;
                default:
                    unset($index['scope']);
                    $db->upsertQuery('sysdictionaryindexes', ['id' => $index['id']], $index);
                    if ($cr) $cr->addDBEntry("sysdictionaryindexes", $index['id'], 'I', $index['name']);
                    break;
            }
        }
    }

    /**
     * retrieves the dictionary indexitems
     *
     * @return array
     */
    public function getDictionaryIndexItems(){
        $db = DBManagerFactory::getInstance();
        $indexItemsArray = [];
        $dictionaryindexitems = $db->query("SELECT * FROM sysdictionaryindexitems WHERE deleted = 0");
        while($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)){
            $dictionaryindexitem['deleted'] = intval($dictionaryindexitem['deleted']);
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'g']);
        }
        $dictionaryindexitems = $db->query("SELECT * FROM syscustomdictionaryindexitems WHERE deleted = 0");
        while($dictionaryindexitem = $db->fetchByAssoc($dictionaryindexitems)){
            $dictionaryindexitem['sequence'] = intval($dictionaryindexitem['sequence']);
            $dictionaryindexitem['deleted'] = intval($dictionaryindexitem['deleted']);
            $indexItemsArray[] = array_merge($dictionaryindexitem, ['scope' => 'c']);;
        }

        return $indexItemsArray;
    }

    /**
     * writes the indexitems to the database
     *
     * @param $relationships
     */
    public function setDictionaryIndexItems($indexitems){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($indexitems as $indexitem){
            switch($indexitem['scope']){
                case 'c':
                    unset($indexitem['scope']);
                    $db->upsertQuery('syscustomdictionaryindexitems', ['id' => $indexitem['id']], $indexitem);
                    if ($cr) $cr->addDBEntry("syscustomdictionaryindexitems", $indexitem['id'], 'I', $indexitem['id']);
                    break;
                default:
                    unset($indexitem['scope']);
                    $db->upsertQuery('sysdictionaryindexitems', ['id' => $indexitem['id']], $indexitem);
                    if ($cr) $cr->addDBEntry("sysdictionaryindexitems", $indexitem['id'], 'I', $indexitem['id']);
                    break;
            }
        }
    }

    public function postLanguageLabels($labels, $translations){
        $db = DBManagerFactory::getInstance();
        foreach($labels as $label){
            $db->upsertQuery('syslanguagelabels', ['id' => $label['id']], $label);
        }
        foreach($translations as $translation){
            $db->upsertQuery('syslanguagetranslations', ['id' => $translation['id']], $translation);
        }
    }
    public function postLanguageCustomLabels($labels, $translations){
        $db = DBManagerFactory::getInstance();
        foreach($labels as $label){
            $db->upsertQuery('syslanguagecustomlabels', ['id' => $label['id']], $label);
        }
        foreach($translations as $translation){
            $db->upsertQuery('syslanguagecustomtranslations', ['id' => $translation['id']], $translation);
        }
    }

    public function getDomainDefinitions(){
        $db = DBManagerFactory::getInstance();
        $defArray = [];
        $domaindefinitions = $db->query("SELECT * FROM sysdomaindefinitions WHERE deleted = 0");
        while($domaindefinition = $db->fetchByAssoc($domaindefinitions)){
            $domaindefinition['deleted'] = intval($domaindefinition['deleted']);
            $defArray[] = array_merge($domaindefinition, ['scope' => 'g']);
        }
        $domaindefinitions = $db->query("SELECT * FROM syscustomdomaindefinitions WHERE deleted = 0");
        while($domaindefinition = $db->fetchByAssoc($domaindefinitions)){
            $domaindefinition['deleted'] = intval($domaindefinition['deleted']);
            $defArray[] = array_merge($domaindefinition, ['scope' => 'c']);;
        }

        return $defArray;
    }

    public function setDomainDefinitions($definitions){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($definitions as $definition){
            switch($definition['scope']){
                case 'c':
                    unset($definition['scope']);
                    $db->upsertQuery('syscustomdomaindefinitions', ['id' => $definition['id']], $definition);
                    if ($cr) $cr->addDBEntry("syscustomdomaindefinitions", $definition['id'], 'I', $definition['name']);
                    break;
                default:
                    unset($definition['scope']);
                    $db->upsertQuery('sysdomaindefinitions', ['id' => $definition['id']], $definition);
                    if ($cr) $cr->addDBEntry("sysdomaindefinitions", $definition['id'], 'I', $definition['name']);
                    break;
            }
        }
    }

    public function getDomainFields(){
        $db = DBManagerFactory::getInstance();
        $fieldsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfields WHERE deleted = 0");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $domainfield['deleted'] = intval($domainfield['deleted']);
            $domainfield['sequence'] = intval($domainfield['sequence']);
            $fieldsArray[] = array_merge($domainfield, ['scope' => 'g']);
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfields WHERE deleted = 0");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $domainfield['deleted'] = intval($domainfield['deleted']);
            $domainfield['sequence'] = intval($domainfield['sequence']);
            $fieldsArray[] = array_merge($domainfield, ['scope' => 'c']);
        }

        return $fieldsArray;
    }


    public function setDomainFields($domainfields){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($domainfields as $domainfield){
            switch($domainfield['scope']){
                case 'c':
                    unset($domainfield['scope']);
                    $db->upsertQuery('syscustomdomainfields', ['id' => $domainfield['id']], $domainfield);
                    if ($cr) $cr->addDBEntry("syscustomdomainfields", $domainfield['id'], 'I', $domainfield['name']);
                    break;
                default:
                    unset($domainfield['scope']);
                    $db->upsertQuery('sysdomainfields', ['id' => $domainfield['id']], $domainfield);
                    if ($cr) $cr->addDBEntry("sysdomainfields", $domainfield['id'], 'I', $domainfield['name']);
                    break;
            }
        }
    }

    public function getDomainFieldValidations(){
        $db = DBManagerFactory::getInstance();
        $validationsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfieldvalidations WHERE deleted = 0");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[] = array_merge($domainfield, ['scope' => 'g']);
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfieldvalidations WHERE deleted = 0");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $validationsArray[] = array_merge($domainfield, ['scope' => 'c']);
        }

        return $validationsArray;
    }


    public function setDomainFieldValidations($domainfieldvalidations){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach($domainfieldvalidations as $domainfieldvalidation){
            switch($domainfieldvalidation['scope']){
                case 'c':
                    unset($domainfieldvalidation['scope']);
                    $db->upsertQuery('syscustomdomainfieldvalidations', ['id' => $domainfieldvalidation['id']], $domainfieldvalidation);
                    if ($cr) $cr->addDBEntry("syscustomdomainfieldvalidations", $domainfieldvalidation['id'], 'I', $domainfieldvalidation['name']);
                    break;
                default:
                    unset($domainfieldvalidation['scope']);
                    $db->upsertQuery('sysdomainfieldvalidations', ['id' => $domainfieldvalidation['id']], $domainfieldvalidation);
                    if ($cr) $cr->addDBEntry("sysdomainfieldvalidations", $domainfieldvalidation['id'], 'I', $domainfieldvalidation['name']);
                    break;
            }
        }
    }

    public function getDomainFieldValidationValues(){
        $db = DBManagerFactory::getInstance();
        $validationvaluesArray = [];
        $domainfieldvalidations = $db->query("SELECT * FROM sysdomainfieldvalidationvalues WHERE deleted = 0");
        while($domainfieldvalidation = $db->fetchByAssoc($domainfieldvalidations)){
            $validationvaluesArray[] = array_merge($domainfieldvalidation, ['scope' => 'g']);
        }
        $domainfieldvalidations = $db->query("SELECT * FROM syscustomdomainfieldvalidationvalues WHERE deleted = 0");
        while($domainfieldvalidation = $db->fetchByAssoc($domainfieldvalidations)){
            $validationvaluesArray[] = array_merge($domainfieldvalidation, ['scope' => 'c']);
        }

        return $validationvaluesArray;
    }

    public function setDomainFieldValidationValues($domainfieldvalidationvalues){
        $db = DBManagerFactory::getInstance();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR']) {
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);
        }

        foreach($domainfieldvalidationvalues as $domainfieldvalidationvalue){
            switch($domainfieldvalidationvalue['scope']){
                case 'c':
                    unset($domainfieldvalidationvalue['scope']);
                    $db->upsertQuery('syscustomdomainfieldvalidationvalues', ['id' => $domainfieldvalidationvalue['id']], $domainfieldvalidationvalue);
                    if ($cr) $cr->addDBEntry("syscustomdomainfieldvalidationvalues", $domainfieldvalidationvalue['id'], 'I', $domainfieldvalidationvalue['minvalue'] . '/' . $domainfieldvalidationvalue['maxvalue']);
                    break;
                default:
                    unset($domainfieldvalidationvalue['scope']);
                    $db->upsertQuery('sysdomainfieldvalidationvalues', ['id' => $domainfieldvalidationvalue['id']], $domainfieldvalidationvalue);
                    if ($cr) $cr->addDBEntry("sysdomainfieldvalidationvalues", $domainfieldvalidationvalue['id'], 'I', $domainfieldvalidationvalue['minvalue'] . '/' . $domainfieldvalidationvalue['maxvalue']);
                    break;
            }
        }
    }


}
