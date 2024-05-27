<?php
namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSingleton;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class SpiceDictionaryHandler extends SpiceSingleton
{
    public $dictionary = [];

    /**
     * legacy
     * load the files containing metadata related vardefs
     * this is the old way od defining vardefs for metadata tables
     */
    public static function loadMetaDataFiles($directories = ['metadata', 'extensions/metadata', 'custom/metadata', 'custom/extensions/metadata', 'custom/Extension/modules']) {
        foreach ($directories as $directory) {
            self::loadMetaDataFilesFromDir($directory);
        }
    }

    /**
     * Loads the metadata files from a specified directory.
     *
     * @param string $directory
     */
    private static function loadMetaDataFilesFromDir(string $directory): void {
        if ($metaDataHandle = @opendir('./' . $directory)) {
            while (false !== ($metaDataFile = readdir($metaDataHandle))) {
                if (preg_match('/\.php$/', $metaDataFile)) {
                    include($directory . '/' . $metaDataFile);
                }
            }
        }
    }


    /**
     * load vardefs cached in sysdictionaryfields & relationships
     * @return void
     */
    public function loadCachedVardefs($forceReload = false){

        if(SpiceDictionaryVardefs::isDbManaged()){
            SpiceDictionaryVardefs::loadDictionariesCacheFromDb($forceReload);
        }
    }



    /**
     * load the files containing module related vardefs
     * this is the old way od defining vardefs for module tables
     * load only if corresponding module is present in sysmodules
     * @param string $directory
     * @return void
     */
    private static function loadModuleFilesFromDir(string $directory): void {
        if ($metaDataHandle = @opendir('./' . $directory)) {
            while (false !== ($metaDataFile = readdir($metaDataHandle))) {
                if(is_dir($directory.'/'.$metaDataFile.'/Ext/Vardefs')) {
                    $fileSystemIterator = new \FilesystemIterator($directory.'/'.$metaDataFile.'/Ext/Vardefs');
                    foreach ($fileSystemIterator as $fileInfo){
                        if (preg_match('/\.php$/', $fileInfo->getFilename())) {
                            include($directory . '/' . $metaDataFile . '/Ext/Vardefs/' . $fileInfo->getFilename());
                        }
                    }
                }
                elseif(is_dir($directory.'/'.$metaDataFile)){
                    foreach ( new \DirectoryIterator( $directory.'/'.$metaDataFile ) as $defsfile ) {
                        if ( $defsfile->isDot() ) continue;
                        if ( preg_match( '/vardefs.php$/', $defsfile->getFilename(), $found ) )
                            include($directory . '/' . $metaDataFile . '/' . $defsfile->getFilename());
                    }
                }
            }
        }
    }

    /**
     * load the module vardefs defined in files
     * specific folder order to overwrite with file custom definition
     */
    public static function loadModuleFiles($module = null) {
        if(!empty($module)){
            $directories = ['modules/'.$module, 'extensions/modules/'.$module, 'custom/modules/'.$module, 'custom/Extension/modules/'.$module];
        } else{
            $directories = ['modules', 'extensions/modules', 'custom/modules', 'custom/Extension/modules'];
        }

        foreach ($directories as $directory) {
            self::loadModuleFilesFromDir($directory);
        }
    }

    /**
     * retrieves the dictionary definitions from tables sysdictionarydefinitions, syscustomdictionarydefinitions
     * for the dictionary manager in frontend
     * @param null $status the status of the definitions
     * @return array
     * @throws Exception
     */
    public static function getDictionaryDefinitions(string $status = null){
        return SpiceDictionaryDefinitions::getInstance()->getDefinitions();
    }

    /**
     * save the dict definitions
     *
     * @param $definitions
     * @throws Exception
     */
    public function setDictionaryDefinitions($definitions){

        foreach($definitions as $definition){
            switch($definition['scope']){
                case 'c':
                    unset($definition['scope']);
                    SystemDeploymentCR::writeDBEntry('syscustomdictionarydefinitions', $definition['id'], $definition, $definition['name']);
                    break;
                default:
                    unset($definition['scope']);
                    SystemDeploymentCR::writeDBEntry('sysdictionarydefinitions', $definition['id'], $definition, $definition['name']);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('dictionarydefinitions');
    }


    /**
     * retrieves the dictionary items
     *
     * @return array
     */
    public function getDictionaryItems(){
        return SpiceDictionaryItems::getInstance()->getItems(null, []);
    }

    /**
     * save the dict definitions
     *
     * @param $definitions
     * @throws Exception
     */
    public function setDictionaryItems($items){

        foreach($items as $item){

            // make sure wqe have all values
            if(!$item['non_db']) $item['non_db'] = 0;
            if(!$item['exclude_from_audited']) $item['exclude_from_audited'] = 0;

            // unset non dab fields
            unset($item['defined']);
            unset($item['cached']);
            unset($item['database']);

            switch($item['scope']){
                case 'c':
                    unset($item['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryitems", $item['id'], $item, $item['name']);
                    break;
                default:
                    unset($item['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryitems", $item['id'], $item, $item['name']);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('dictionaryitems');
    }


    /**
     * retrieves the dictionary relationships located in sysdictionaryrelationships, syscustomdictionaryrelationships
     * this method is used for the dictionary manager itself and for the logic retrieving active relationships
     * @param string $status default value is all. Possible is all| a
     * @return array
     */
    public function getDictionaryRelationships(string $status = 'all'){
        $db = DBManagerFactory::getInstance();
        $relOriginTables = ['sysdictionaryrelationships' => 'g', 'syscustomdictionaryrelationships' => 'c'];
        $relArray = [];

        foreach($relOriginTables as $relOriginTable => $scope){
            $q = "SELECT rels.*, 
itemsleft.sysdictionaryitem_name lhs_key, itemsright.sysdictionaryitem_name rhs_key, 
lhsdictionaries.sysdictionary_tablename lhs_table,rhsdictionaries.sysdictionary_tablename rhs_table,
lhssysmods.module_name lhs_module, rhssysmods.module_name rhs_module,
joindictionaries.tablename join_table, joinitemsleft.sysdictionaryitem_name join_key_lhs,joinitemsright.sysdictionaryitem_name join_key_rhs

FROM ".$relOriginTable." rels 
LEFT JOIN
 (
	SELECT id sysdictionary_id, tablename sysdictionary_tablename FROM sysdictionarydefinitions UNION 
 SELECT id sysdictionary_id, tablename sysdictionary_tablename FROM syscustomdictionarydefinitions 
 ) lhsdictionaries ON lhsdictionaries.sysdictionary_id = rels.lhs_sysdictionarydefinition_id 

LEFT JOIN
 (
	SELECT id sysmodule_id, module module_name, sysdictionarydefinition_id  FROM sysmodules UNION 
 SELECT id sysmodule_id, module module_name, sysdictionarydefinition_id FROM syscustommodules
 ) lhssysmods ON lhsdictionaries.sysdictionary_id = lhssysmods.sysdictionarydefinition_id 
  
LEFT JOIN
        (SELECT id sysdictionary_id, tablename sysdictionary_tablename FROM sysdictionarydefinitions UNION 
 SELECT id sysdictionary_id, tablename sysdictionary_tablename FROM syscustomdictionarydefinitions) rhsdictionaries ON rhsdictionaries.sysdictionary_id = rels.rhs_sysdictionarydefinition_id 
    
LEFT JOIN
 (
	SELECT id sysmodule_id, module module_name, sysdictionarydefinition_id  FROM sysmodules UNION 
 SELECT id sysmodule_id, module module_name, sysdictionarydefinition_id FROM syscustommodules
 ) rhssysmods ON rhsdictionaries.sysdictionary_id = rhssysmods.sysdictionarydefinition_id 
    
LEFT JOIN
        (SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM sysdictionaryitems UNION 
 SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM syscustomdictionaryitems) itemsleft ON itemsleft.sysdictionaryitem_id = rels.lhs_sysdictionaryitem_id 

LEFT JOIN
        (SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM sysdictionaryitems UNION 
 SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM syscustomdictionaryitems) itemsright ON itemsright.sysdictionaryitem_id = rels.rhs_sysdictionaryitem_id
  
LEFT JOIN
 (
	SELECT id sysdictionary_id, tablename FROM sysdictionarydefinitions UNION 
 SELECT id sysdictionary_id, tablename FROM syscustomdictionarydefinitions 
 ) joindictionaries ON joindictionaries.sysdictionary_id = rels.join_sysdictionarydefinition_id   
  
LEFT JOIN
        (SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM sysdictionaryitems UNION 
 SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM syscustomdictionaryitems) joinitemsleft ON joinitemsleft.sysdictionaryitem_id = rels.join_lhs_sysdictionaryitem_id 

LEFT JOIN
        (SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM sysdictionaryitems UNION 
 SELECT id sysdictionaryitem_id, name sysdictionaryitem_name FROM syscustomdictionaryitems) joinitemsright ON joinitemsright.sysdictionaryitem_id = rels.join_rhs_sysdictionaryitem_id
  
 WHERE rels.deleted = 0";

            // add status limitation
            $statusWhere = '';
            if($status === 'a'){
                $statusWhere =  " AND rels.status ='{$status}}'";
            }
            $q.= $statusWhere;

            $dictionaryrelationships = $db->query($q);
            // store Ids to get unique entries
            $storeRelIds = [];
            while($dictionaryrelationship = $db->fetchByAssoc($dictionaryrelationships)){
                if(!in_array($dictionaryrelationship['id'], $storeRelIds)){
                    $storeRelIds[] = $dictionaryrelationship['id'];
                    $dictionaryrelationship['deleted'] = intval($dictionaryrelationship['deleted']);
                    $relArray[] = array_merge($dictionaryrelationship, ['scope' => $scope]);
                }
            }
        }

        return $relArray;
    }

    /**
     * writes the relationship changes to the database
     *
     * @param $relationships
     * @throws Exception
     */
    public function setDictionaryRelationships($relationships){

        // unset the fields we do not save (historically present in the array but not no longer in use for save purpose
        // todo: see if we can get rid of them
        $unsetKeys = ['lhs_key', 'rhs_key', 'lhs_linkdefault', 'rhs_linkdefault', 'lhs_table', 'rhs_table', 'lhs_module', 'rhs_module', 'join_table', 'join_key_lhs', 'join_key_rhs', 'reverse'];

        foreach($relationships as $relationship){
            // unset the fields we do not save (historically present in the array but not no longer in use for save purpose
            foreach($unsetKeys as $unsetKey){
                if(array_key_exists($unsetKey, $relationship)) {
                    unset($relationship[$unsetKey]);
                }
            }

            // save to proper dictionaryrelationships table
            switch($relationship['scope']){
                case 'c':
                    unset($relationship['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryrelationships", $relationship['id'], $relationship, $relationship['name']);
                    break;
                default:
                    unset($relationship['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryrelationships", $relationship['id'], $relationship, $relationship['name']);
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
     * @param $relationshiprelationshipfields
     * @throws Exception
     */
    public function setDictionaryRelationshipFields($relationshiprelationshipfields){

        foreach($relationshiprelationshipfields as $relationshiprelationshipfield){
            switch($relationshiprelationshipfield['scope']){
                case 'c':
                    unset($relationshiprelationshipfield['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryrelationshipfields", $relationshiprelationshipfield['id'], $relationshiprelationshipfield, $relationshiprelationshipfield['sysdictionaryitem_id']);
                    break;
                default:
                    unset($relationshiprelationshipfield['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryrelationshipfields", $relationshiprelationshipfield['id'], $relationshiprelationshipfield, $relationshiprelationshipfield['sysdictionaryitem_id']);
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
     * @param $relationshiprelatefields
     * @throws Exception
     */
    public function setDictionaryRelateFields($relationshiprelatefields){

        foreach($relationshiprelatefields as $relationshiprelatefield){
            switch($relationshiprelatefield['scope']){
                case 'c':
                    unset($relationshiprelatefield['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdictionaryrelationshiprelatefields", $relationshiprelatefield['id'], $relationshiprelatefield, $relationshiprelatefield['sysdictionaryitem_id']);
                    break;
                default:
                    unset($relationshiprelatefield['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdictionaryrelationshiprelatefields", $relationshiprelatefield['id'], $relationshiprelatefield, $relationshiprelatefield['sysdictionaryitem_id']);
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
        return SpiceDictionaryDomains::getInstance()->getDomains();
    }

    /**
     * @throws Exception
     */
    public function setDomainDefinitions($definitions){

        foreach($definitions as $definition){
            switch($definition['scope']){
                case 'c':
                    unset($definition['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdomaindefinitions", $definition['id'], $definition, $definition['name']);
                    break;
                default:
                    unset($definition['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdomaindefinitions", $definition['id'], $definition, $definition['name']);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('domaindefinitions');
    }

    public function getDomainFields($useCache = true){
        $cached = SpiceCache::get('domainfields');
        if($useCache && $cached) return $cached;

        $db = DBManagerFactory::getInstance();
        $fieldsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfields");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $domainfield['deleted'] = intval($domainfield['deleted']);
            $domainfield['sequence'] = intval($domainfield['sequence']);
            $domainfield['required'] = intval($domainfield['required']);
            $domainfield['exclude_from_index'] = intval($domainfield['exclude_from_index']);
            $fieldsArray[] = array_merge($domainfield, ['scope' => 'g']);
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfields");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            $domainfield['deleted'] = intval($domainfield['deleted']);
            $domainfield['sequence'] = intval($domainfield['sequence']);
            $domainfield['required'] = intval($domainfield['required']);
            $domainfield['exclude_from_index'] = intval($domainfield['exclude_from_index']);
            $fieldsArray[] = array_merge($domainfield, ['scope' => 'c']);
        }

        SpiceCache::set('domainfields', $fieldsArray);

        return $fieldsArray;
    }


    public function setDomainFields($domainfields){

        foreach($domainfields as $domainfield){
            switch($domainfield['scope']){
                case 'c':
                    unset($domainfield['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdomainfields", $domainfield['id'], $domainfield, $domainfield['name']);
                    break;
                default:
                    unset($domainfield['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdomainfields", $domainfield['id'], $domainfield, $domainfield['name']);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('domainfields');
    }

    public function getDomainFieldValidations($useCache = true){

        $cached = SpiceCache::get('domainfieldvalidations');
        if($useCache && $cached) return $cached;

        $db = DBManagerFactory::getInstance();
        $validationsArray = [];
        $domainfields = $db->query("SELECT * FROM sysdomainfieldvalidations");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            // temporary workaround to harmonize validation_type
            if($domainfield['validation_type'] == 'options') {
                $domainfield['validation_type'] = 'enum';
            }
            $validationsArray[] = array_merge($domainfield, ['scope' => 'g']);
        }
        $domainfields = $db->query("SELECT * FROM syscustomdomainfieldvalidations");
        while($domainfield = $db->fetchByAssoc($domainfields)){
            // temporary workaround to harmonize validation_type
            if($domainfield['validation_type'] == 'options') {
                $domainfield['validation_type'] = 'enum';
            }
            $validationsArray[] = array_merge($domainfield, ['scope' => 'c']);
        }

        SpiceCache::set('domainfieldvalidations', $validationsArray);

        return $validationsArray;
    }


    public function setDomainFieldValidations($domainfieldvalidations){

        foreach($domainfieldvalidations as $domainfieldvalidation){
            switch($domainfieldvalidation['scope']){
                case 'c':
                    unset($domainfieldvalidation['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdomainfieldvalidations", $domainfieldvalidation['id'], $domainfieldvalidation, $domainfieldvalidation['name']);
                    break;
                default:
                    unset($domainfieldvalidation['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdomainfieldvalidations", $domainfieldvalidation['id'], $domainfieldvalidation, $domainfieldvalidation['name']);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('domainfieldvalidations');
    }

    public function getDomainFieldValidationValues($useCache = true){

        $cached = SpiceCache::get('domainfieldvalidationvalues');
        if($useCache &&  $cached) return $cached;

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

        SpiceCache::set('domainfieldvalidationvalues', $validationvaluesArray);

        return $validationvaluesArray;
    }

    public function setDomainFieldValidationValues($domainfieldvalidationvalues){

        foreach($domainfieldvalidationvalues as $domainfieldvalidationvalue){
            $name = $domainfieldvalidationvalue['enumvalue'] . '/' . $domainfieldvalidationvalue['maxval'];
            switch($domainfieldvalidationvalue['scope']){
                case 'c':
                    unset($domainfieldvalidationvalue['scope']);
                    SystemDeploymentCR::writeDBEntry("syscustomdomainfieldvalidationvalues", $domainfieldvalidationvalue['id'], $domainfieldvalidationvalue, $name);
                    break;
                default:
                    unset($domainfieldvalidationvalue['scope']);
                    SystemDeploymentCR::writeDBEntry("sysdomainfieldvalidationvalues", $domainfieldvalidationvalue['id'], $domainfieldvalidationvalue, $name);
                    break;
            }
        }

        // clear the cache
        SpiceCache::clear('domainfieldvalidationvaluess');
    }

    /**
     * Returns table names that have a certain content type set in the vardefs.
     *
     * @param string $contentType
     * @return array
     */
    public function getAllTablesOfType(string $contentType): array {
        $tables = [];

        foreach ($this->dictionary as $item) {
            if (strtolower($item['contenttype']) == strtolower($contentType)) {
                $tables[] = $item['table'];
            }
        }

        return $tables;
    }

    /**
     * @param string $objectName
     * @return array|mixed
     */
    public function loadDictionaryIndicesFromSession(string $objectName){
        return $_SESSION['dictionaries'][$objectName]['indices'] ?: [];
    }
}
