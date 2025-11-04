<?php
namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\extensions\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSingleton;

class SpiceDictionaryHandler extends SpiceSingleton
{
    public $dictionary = [];

    private $vardefRelationships = [];

    public function __get($name)
    {
        return $this->$name;
    }

    /**
     * load legacy vardefs definitions
     * @return void
     * @throws \Exception
     */
    public static function loadLegacyFiles(){

        SpiceDictionaryHandler::loadMetaDataFiles();
        SpiceDictionaryHandler::loadModuleFiles();

        foreach(SpiceDictionaryHandler::getInstance()->dictionary as $vardef){
            self::extractRelationshipFromDictionary($vardef['relationships']);
        }
    }

    /**
     * extract relationship from dictionary
     * @param array|null $relationships
     * @return void
     */
    private static function extractRelationshipFromDictionary(?array $relationships): void
    {
        if(!$relationships) return;

        foreach ($relationships as $relationshipName => $vardefRelationship) {

            $vardefRelationship['relationship_name'] = $relationshipName;
            SpiceDictionaryHandler::getInstance()->vardefRelationships[$relationshipName] = $vardefRelationship;
        }
    }

    /**
     * get relationship by name
     * @param string $relationshipName
     * @return array|null
     */
    public function getVardefRelationship(string $relationshipName): ?array
    {
        $relationship = $this->vardefRelationships[$relationshipName];

        if (!$relationship) return null;

        $bothSidesModuleExists = (SpiceModules::getInstance()->moduleExists($relationship['lhs_module']) && SpiceModules::getInstance()->moduleExists($relationship['rhs_module']));

        return $bothSidesModuleExists ? $relationship : null;

    }


    /**
     * legacy
     * load the files containing metadata related vardefs
     * this is the old way od defining vardefs for metadata tables
     */
    private static function loadMetaDataFiles($directories = ['metadata', 'extensions/metadata', 'custom/metadata', 'custom/extensions/metadata', 'custom/Extension/modules']) {
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
    private static function loadModuleFiles() {

        $directories = ['modules', 'extensions/modules', 'custom/modules', 'custom/Extension/modules'];

        foreach ($directories as $directory) {
            self::loadModuleFilesFromDir($directory);
        }
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
     * @param string $objectName
     * @return array|mixed
     */
    public function loadDictionaryIndicesFromSession(string $objectName){
        return $_SESSION['dictionaries'][$objectName]['indices'] ?: [];
    }
}
