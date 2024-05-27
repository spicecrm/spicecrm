<?php

namespace SpiceCRM\includes\SugarObjects;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;

/**
 * Class SpiceModules
 *
 * enables the loading of modules from the Database
 *
 * @package SpiceCRM\includes\SugarObjects
 */
class SpiceModules
{

    /**
     * for the singelton implementation
     *
     * @var
     */
    private static $instance = null;

    /**
     * the retrieved modules
     *
     * @var
     */
    public $modules = [];

    private $moduleList = [];

    private $beanList = [];

    private $beanClasses = [];

    private function __construct() {}

    private function __clone() {}

    /**
     * @return SpiceModules
     */
    public static function getInstance(): SpiceModules {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * @param false $forceReload necessary in repair database logic
     * @throws \Exception
     */
    public function loadModules($forceReload = false): void {
        $cached = SpiceCache::get('spiceModules');
        if (!$cached || $forceReload) {

            # reset the modules session cache when reloading the modules from the database
            unset($_SESSION['SpiceUI']['modules']);

            $this->modules = [];
            $columns = ['id', 'acl', 'module', 'bean', 'beanfile', 'workflow', 'visible', 'tagging', 'sysdictionarydefinition_id'];
            $modules = DBManagerFactory::getInstance()->query("SELECT ".implode(', ', $columns)." FROM sysmodules UNION ALL SELECT ".implode(', ', $columns)." FROM syscustommodules");
            while ($module = DBManagerFactory::getInstance()->fetchByAssoc($modules)) {
                $this->moduleList[$module['module']] = $module['module'];

                // keep the module with its original sysmodules id when a custom entry is found (important for acl module actions)
                if(!empty($this->modules[$module['module']]) && !empty($this->modules[$module['module']]['id'])) {
                    // keep the original id from sysmodules (ACL module actions compatibility)
                    $module['id'] = $this->modules[$module['module']]['id'];
                }

                $module['audited'] = false;

                if (!empty($module['sysdictionarydefinition_id'])) {
                    try {
                        $module['audited'] = (new SpiceDictionaryDefinition($module['sysdictionarydefinition_id']))->getDefinition()->audited == 1;
                    } catch (\Throwable) {}
                } else {
                    $module['audited'] = (bool) SpiceDictionary::getInstance()->getDefs($module['bean'])['audited'];
                }

                $this->modules[$module['module']] = $module;

                // if we have a bean try to load the beanfile, build it from the name or use the generic sugarbean
                if ($module['bean']) {
                    $this->beanList[$module['module']] = $module['bean'];


                    if($module['beanfile']) {
                        $this->beanClasses[$module['module']] = $module['beanfile'];
                    } else if (file_exists("custom/modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\custom\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else if (file_exists("extensions/modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\extensions\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else if (file_exists("modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    }
                }
            }
            $cached = [
                'moduleDetails' => $this->modules,
                'moduleList'    => $this->moduleList,
                'beanList'      => $this->beanList,
                'beanFiles'     => $this->beanFiles,
                'beanClasses'   => $this->beanClasses
            ];
            SpiceCache::set('spiceModules', $cached);

        } elseif ($cached) {
            $this->modules     = $cached['moduleDetails'];
            $this->moduleList  = $cached['moduleList'];
            $this->beanList    = $cached['beanList'];
            $this->beanClasses = $cached['beanClasses'];
            $this->beanFiles   = $cached['beanFiles'];
        }

        $this->setGlobals($cached);
    }

    /**
     * returns the sysmodule id of the module by name
     *
     * @param $moduleName
     * @return mixed
     */
    public function getModuleId($moduleName){
        return $this->modules[$moduleName]['id'];
    }

    /**
     * A getter for the module list.
     *
     * @return array
     * @throws \Exception
     */
    public function getModuleList(): array {
        if (empty($this->moduleList)) {
            $this->loadModules();
        }

        return $this->moduleList;
    }

    /**
     * Returns the module name of a bean.
     *
     * @param string $beanName
     * @return string|null
     */
    public function getModuleName(string $beanName): ?string {
        $moduleNamesArray = array_flip($this->beanList);

        return $moduleNamesArray[$beanName] ?? null;
    }

    /**
     * gets the module name by the definition id
     *
     * @param $definitionId
     * @return false|int|string
     */
    public function getModuleByDictionaryDefinitionId($definitionId){
        foreach ($this->modules as $moduleName => $moduleDetails) {
            if($moduleDetails['sysdictionarydefinition_id'] == $definitionId){
                return $moduleName;
            }
        }

        return false;
    }

    /**
     * Returns the module details
     *
     * @param string $modulename
     * @return array
     */
    public function getModuleDetails(string $modulename): ?array {

        return $this->modules[$modulename] ?: [];
    }

    /**
     * check if a module exists
     *
     * @param string $modulename
     * @return bool|null
     */
    public function moduleExists(string $modulename): ?bool{
        return isset($this->modules[$modulename]);
    }

    /**
     * A getter for the bean list.
     *
     * @return array
     * @throws \Exception
     */
    public function getBeanList(): array {
        if (empty($this->beanList)) {
            $this->loadModules();
        }

        return $this->beanList;
    }

    /**
     * Returns the bean name of a module.
     *
     * @param string $moduleName
     * @return string|null
     */
    public function getBeanName(?string $moduleName): ?string {
        return $this->beanList[$moduleName] ?? null;
    }

    /**
     * Setter for the bean list.
     *
     * @param array $beanList
     */
    public function setBeanList(array $beanList): void {
        $this->beanList = $beanList;
    }

    /**
     * A getter for the bean files.
     *
     * @return array
     * @throws \Exception
     * @deprecated should be completely removed later
     */
    public function getBeanFiles(): array {
        if (empty($this->beanFiles)) {
            $this->loadModules();
        }

        return $this->beanFiles;
    }

    /**
     * A getter for the bean classes.
     *
     * @return array
     * @throws \Exception
     */
    public function getBeanClasses(): array {
        if (empty($this->beanClasses)) {
            $this->loadModules();
        }

        return $this->beanClasses;
    }

    /**
     * Returns the bean class for a module.
     *
     * @param string $beanModule
     * @return string|null
     */
    public function getBeanClassForModule(?string $beanModule): ?string {
        return $this->beanClasses[$beanModule] ?? null;
    }

    /**
     * Returns the bean class for a bean name.
     *
     * @param string $beanName
     * @return string|null
     */
    public function getBeanClassForBeanName(string $beanName): ?string {
        return $this->getBeanClassForModule($this->getModuleName($beanName));
    }

    /**
     * Setter for a bean class.
     *
     * @param string $module
     * @param string $value
     */
    public function setBeanClass(string $module, string $value): void {
        $this->beanClasses[$module] = $value;
    }

    /**
     * returns if the tagging is active for a module
     *
     * @param $module
     * @return mixed
     */
    public function taggingActive($module)
    {
        return $this->modules[$module]['tagging'];
    }

    /**
     * Removes a module from the modules list.
     *
     * @param string $module
     */
    public function unsetModule(string $module): void {
        unset($this->moduleList[$module]);
    }

    /**
     * Sets the values for the global variables.
     * Left for backwards compatibility.
     */
    private function setGlobals($cached): void {
        global $moduleList, $beanList, $beanClasses, $beanFiles;

        $moduleList  = $cached['moduleList'];
        $beanList    = $cached['beanList'];
        $beanClasses = $cached['beanClasses'];
        $beanFiles   = $cached['beanFiles'];
    }

}
