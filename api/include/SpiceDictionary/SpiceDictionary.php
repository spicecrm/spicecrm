<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceDictionary
{
    /**
     * the main table name
     */
    const table = 'sysdictionaryfields';

    /**
     * the cache object name
     */
    const cachename = 'dictionary';

    const systemdump = './include/SpiceDictionary/system/systemcached.dump';

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance = null;

    /**
     * @var a separate instance that can be initiated that holds the systems config
     */
    private static $systeminstance;



    public $dictionary;

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionary
     */
    static function getInstance(): SpiceDictionary
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function __construct()
    {

        # skip loading the dictionary data while installing. The installer will manually call loadSystemCache
        if (SpiceConfig::getInstance()->installing) {
            return;
        }

        $cached = SpiceCache::get(self::cachename);
        if ($cached) {
            $this->dictionary = $cached;
            return;
        }

        $this->loadDictionary();
    }

    /**
     * @throws Exception
     */
    public function loadDictionary(){
        $this->dictionary = [];
        $db = DBManagerFactory::getInstance();

        if($db->tableExists(self::table)) {
            $dictionarys = $db->query("SELECT * FROM " . self::table);
            while ($dictionary = $db->fetchByAssoc($dictionarys)) {
                $this->dictionary[$dictionary['sysdictionaryname']]['id'] = $dictionary['sysdictionaryid'];
                $this->dictionary[$dictionary['sysdictionaryname']]['dictionaryname'] = $dictionary['sysdictionaryname'];
                $this->dictionary[$dictionary['sysdictionaryname']]['name'] = $dictionary['sysdictionaryname'];
                $this->dictionary[$dictionary['sysdictionaryname']]['table'] = $dictionary['sysdictionarytablename'];
                $this->dictionary[$dictionary['sysdictionaryname']]['audited'] = $dictionary['sysdictionarytableaudited'];
                $this->dictionary[$dictionary['sysdictionaryname']]['contenttype'] = $dictionary['sysdictionarytablecontenttype'];
                $this->dictionary[$dictionary['sysdictionaryname']]['fields'][$dictionary['fieldname']] = json_decode(html_entity_decode($dictionary['fielddefinition'], ENT_QUOTES), true);
                $this->dictionary[$dictionary['sysdictionaryname']]['indices'] = self::getDictionaryIndexCacheFromDb($dictionary['sysdictionaryname']);
            }

            // writes the cache
            $this->writeCache();

        } else {
            $this->loadSafeModeSystemDictionaries();
        }
    }

    /**
     * write the loaded dictionaries to the cache to temporarily hold the system defined dictionaries.
     * This keeps the system alive until SpiceDictionaryVardefs::repairDictionaries action is taken
     * @return void
     * @throws Exception
     */
    private function loadSafeModeSystemDictionaries(): void
    {
        $this->loadSystemCache();
        $this->writeCache();
        $this->repairDBTableForDictionaries($this->dictionary);
    }

    /**
     * used after loading the dictionaries from the system cache
     * @param array $dictionaries
     * @throws Exception
     */
    private function repairDBTableForDictionaries(array $dictionaries): void
    {
        $db = DBManagerFactory::getInstance();
        $sql = '';

        foreach ($dictionaries as $item) {
            $sql .= SpiceDictionaryVardefs::repairTable($item);
        }

        if (!empty($sql)) {
            $db->query($sql);
        }
    }

    /**
     * get cached indices for specified dictionary name
     * @param string $dictionaryName
     * @return array
     * @throws Exception
     */
    public static function getDictionaryIndexCacheFromDb(string $dictionaryName): array
    {
        $db = DBManagerFactory::getInstance();
        $indices = [];

        $q = "SELECT sysindices.* FROM sysdictionaryindices sysindices WHERE sysindices.sysdictionaryname = '$dictionaryName'";

        if(!($res = $db->query($q))) return $indices;

        while($row = $db->fetchByAssoc($res)){
            $indices[] = json_decode(html_entity_decode($row['indexdefinition'], ENT_QUOTES), true);
        }

        return $indices;
    }

    /**
     * gets the dictionary for the requested name
     *
     * @param $dictionaryname
     * @return mixed
     */
    public function getDefs($dictionaryname){
        return $this->dictionary[$dictionaryname];
    }

    public function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionary);
    }

    /**
     * generates the system cache file and saves it
     *
     * @return true
     */
    public function generateSystemCache(){
        $systemDictionary = [];
        $definitons = SpiceDictionaryDefinitions::getInstance()->getDefinitions();
        $systemDefinitions = array_map(function($d){return $d['name'];}, array_filter($definitons, function($d){return $d['package'] == 'system' || $d['Name'] == 'User';}));
        foreach ($systemDefinitions as $systemDefinition){
            if(isset($this->dictionary[$systemDefinition])) $systemDictionary[$systemDefinition] = $this->dictionary[$systemDefinition];
        }
        $fHandle = fopen(self::systemdump, 'w');
        fwrite($fHandle, serialize($systemDictionary));
        fclose($fHandle);
        return true;
    }

    /**
     * load dictionary from system cache file
     * @throws Exception
     */
    public function loadSystemCache(): void
    {
        $fHandle = fopen(self::systemdump, 'r');
        $this->dictionary = unserialize(fread($fHandle, filesize(self::systemdump)));
        fclose($fHandle);
    }
}