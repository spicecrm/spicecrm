<?php

namespace SpiceCRM\includes\SugarObjects;

use SpiceCRM\includes\database\DBManagerFactory;

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

    private $beanFiles = [];

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
        if (!isset($_SESSION['modules']) || $forceReload) {
            $this->modules = [];
            $modules = DBManagerFactory::getInstance()->query("SELECT module, bean, beanfile, visible, tagging FROM sysmodules UNION SELECT module, bean, beanfile, visible, tagging FROM syscustommodules");
            while ($module = DBManagerFactory::getInstance()->fetchByAssoc($modules)) {
                $this->moduleList[$module['module']] = $module['module'];

                // keep the module
                $this->modules[$module['module']] = $module;

                // if we have a bean try to load the beanfile, build it from the name or use the generic sugarbean
                if ($module['bean']) {
                    $this->beanList[$module['module']] = $module['bean'];

                    if (file_exists("custom/modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanFiles[$module['bean']] = "custom/modules/{$module['module']}/{$module['bean']}.php";
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\custom\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else if (file_exists("extensions/modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanFiles[$module['bean']] = "extensions/modules/{$module['module']}/{$module['bean']}.php";
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\extensions\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else if (file_exists("modules/{$module['module']}/{$module['bean']}.php")) {
                        $this->beanFiles[$module['bean']] = "modules/{$module['module']}/{$module['bean']}.php";
                        $this->beanClasses[$module['module']] = '\\SpiceCRM\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else {
                        $this->beanFiles[$module['bean']] = 'data/SugarBean.php';
                    }
                }
            }
            $_SESSION['modules'] = [
                'moduleDetails' => $this->modules,
                'moduleList'    => $this->moduleList,
                'beanList'      => $this->beanList,
                'beanFiles'     => $this->beanFiles,
                'beanClasses'   => $this->beanClasses
            ];
        } elseif (isset($_SESSION['modules'])) {
            $this->setLocalsFromSession();
        }

        $this->setGlobals();
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
    private function setGlobals(): void {
        global $moduleList, $beanList, $beanClasses, $beanFiles;

        $moduleList  = $_SESSION['modules']['moduleList'];
        $beanList    = $_SESSION['modules']['beanList'];
        $beanClasses = $_SESSION['modules']['beanClasses'];
        $beanFiles   = $_SESSION['modules']['beanFiles'];
    }

    /**
     * Sets the local attributes if the modules were already loaded in the session.
     */
    private function setLocalsFromSession(): void {
        $this->modules     = $_SESSION['modules']['moduleDetails'];
        $this->moduleList  = $_SESSION['modules']['moduleList'];
        $this->beanList    = $_SESSION['modules']['beanList'];
        $this->beanClasses = $_SESSION['modules']['beanClasses'];
        $this->beanFiles   = $_SESSION['modules']['beanFiles'];
    }
}
