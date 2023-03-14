<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;

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

        $cached = SpiceCache::get(self::cachename);
        if ($cached) {
            $this->dictionary = $cached;
            return;
        }

        $this->loadDictionary();
    }

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

                // writes the cache
                $this->writeCache();
            }
        } else {
            // load from file
            $this->loadSystemCache();
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

    private function writeCache(){
        SpiceCache::set(self::cachename, $this->dictionary);
    }

    /**
     * generates the system cahe file and saves it
     *
     * @return true
     */
    public function generateSystemCache(){
        $systemDictionary = [];
        $definitons = SpiceDictionaryDefinitions::getInstance()->getDefinitions();
        $systemDefinitions = array_map(function($d){return $d['name'];}, array_filter($definitons, function($d){return $d['package'] == 'system';}));
        foreach ($systemDefinitions as $systemDefinition){
            if(isset($this->dictionary[$systemDefinition])) $systemDictionary[$systemDefinition] = $this->dictionary[$systemDefinition];
        }
        $fHandle = fopen(self::systemdump, 'w');
        fwrite($fHandle, serialize($systemDictionary));
        fclose($fHandle);
        // $res = file_put_contents('./include/SpiceDictionary/system/systemcached.dump', serialize($systemDictionary));
        return true;
    }

    private function loadSystemCache(){
        $fHandle = fopen(self::systemdump, 'r');
        $this->dictionary = unserialize(fread($fHandle, filesize(self::systemdump)));
        fclose($fHandle);
    }
}