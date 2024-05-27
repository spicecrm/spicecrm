<?php

namespace SpiceCRM\includes\SpiceDictionary;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SystemStartupMode\SystemStartupMode;
use function DI\string;

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
     * @param bool|null $autoLoad
     * @return SpiceDictionary
     * @throws Exception
     */
    static function getInstance(?bool $autoLoad = true): SpiceDictionary
    {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self($autoLoad);
        }
        return self::$instance;
    }

    /**
     * @throws Exception
     */
    public function __construct(?bool $autoLoad = true)
    {

        # autoload is disabled in installer or when the system dump will be reloaded
        if (!$autoLoad) {
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
            }

            if (empty($this->dictionary)) {
                $this->reloadSystemDump();
            } else {
                $this->writeCache();
            }

        } else {
            $this->reloadSystemDump();
        }
    }

    /**
     * write the loaded system dump dictionaries to the cache to temporarily hold the system defined dictionaries.
     * This keeps the system alive until SpiceDictionaryVardefs::repairDictionaries action is taken
     * @return void
     * @throws Exception
     */
    public function reloadSystemDump(): void
    {
        $this->loadSystemDumpFile();
        $this->repairDBTableForDictionaries($this->dictionary);
        SpiceInstaller::loadSystemPackage(DBManagerFactory::getInstance());
        SpiceCache::instance()->resetFull();
        SystemStartupMode::setRecoveryMode(true);
    }

    /**
     * used after loading the dictionaries from the system cache
     * @param array $dictionaries
     * @throws Exception
     */
    private function repairDBTableForDictionaries(array $dictionaries): void
    {
        foreach ($dictionaries as $item) {
            try {
                SpiceDictionaryVardefs::repairTable($item, true);
            } catch (\Throwable $e) {
                LoggerManager::getLogger()->error("failed to repair dictionary {$item['name']} {$item['id']}" . $e->getMessage());
            }
        }
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

    /**
     * get dictionary definition by table name
     * @param string $tableName
     * @return array|null
     */
    public function getDefsByTableName(string $tableName): ?array
    {
        foreach ($this->dictionary as $dic) {
            if ($tableName != $dic['table']) continue;
            return $dic;
        }
        return null;
    }

    public function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionary);
    }

    /**
     * generates the system cache file and saves it
     * @return bool
     * @throws DatabaseException
     */
    public function generateSystemDumpFile(): bool
    {
        $systemDictionary = [];
        SpiceDictionaryDefinitions::getInstance()->reloadItems();
        $definitons = SpiceDictionaryDefinitions::getInstance()->getDefinitions();

        # reload the dictionary array from the cache table
        $this->loadDictionary();

        $systemDefinitions = array_map(function($d){return $d['name'];}, array_filter($definitons, function($d){return $d['package'] == 'system' || $d['Name'] == 'User';}));
        foreach ($systemDefinitions as $systemDefinition){
            if(isset($this->dictionary[$systemDefinition])) $systemDictionary[$systemDefinition] = $this->dictionary[$systemDefinition];
        }
        $fHandle = fopen(self::systemdump, 'w');
        fwrite($fHandle, serialize([
            'dictionary' => $systemDictionary,
            'hash' => md5(serialize($systemDictionary))
        ]));
        fclose($fHandle);
        return true;
    }

    /**
     * load dictionary from system cache file
     * @throws Exception
     */
    public function loadSystemDumpFile(): ?string
    {
        $content = $this->getSystemDumpFileContent();
        $this->dictionary = $content['dictionary'];
        $this->writeCache();
        $this->writeSystemDumpFileHashToConfig($content['hash']);
        return $content['hash'];
    }

    /**
     * get system cache file content
     * @return array
     */
    private static function getSystemDumpFileContent(): array
    {
        $fHandle = fopen(self::systemdump, 'r');
        $content = unserialize(fread($fHandle, filesize(self::systemdump)));
        fclose($fHandle);
        return $content;
    }

    /**
     * write system cache hash to config
     * @param string $hash
     * @return void
     * @throws Exception
     */
    public static function writeSystemDumpFileHashToConfig(string $hash): void
    {
        $db = DBManagerFactory::getInstance();

        if (!$db->tableExists('config')) return;

        $hashEntry = ['category' => 'dictionary', 'name' => 'system_dump_hash', 'value' => $hash];
        // $db->deleteQuery('config', ['category' => $hashEntry['category'], 'name' => $hashEntry['name']]);
        // $db->insertQuery('config', $hashEntry);
        $db->query("DELETE FROM config WHERE category='dictionary' AND name='system_dump_hash'");
        $db->query("INSERT INTO config (category, name, value) VALUES('dictionary', 'system_dump_hash', '{$hash}')");
        SpiceCache::deleteByKey('dbconfig');
        SpiceConfig::getInstance()->reloadConfig(true);
    }

    /**
     * compare system dump hashes to force repair system dump dictionaries if the dump hash
     * on the database  differs from the hash in the dump file. Meaning that a new version of
     * the file is generated and a repair is necessary
     * @return bool
     * @throws Exception
     */
    public static function compareSystemDumpHashes(): bool
    {
        # skip the comparison for the SpiceCRM public-config reference system
        if (SpiceConfig::getInstance()->get('systemvardefs.create_system_file_enabled') == 1) {
            return true;
        }

        $db = DBManagerFactory::getInstance();
        $configHash = (string) $db->getOne("SELECT value FROM config WHERE category = 'dictionary' AND name = 'system_dump_hash'");
        return $configHash === self::getSystemDumpFileContent()['hash'];
    }
}