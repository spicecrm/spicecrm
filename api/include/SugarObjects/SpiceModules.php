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
    private static $instance;

    /**
     * the retrieved modules
     *
     * @var
     */
    private $modules;

    /**
     * @return SpiceModules
     */
    static function getInstance()
    {
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
    public function loadModules($forceReload = false)
    {
        global $moduleList, $beanList, $beanClasses, $beanFiles;
        if (isset($_SESSION['modules']) && !$forceReload) {
            $moduleList = $_SESSION['modules']['moduleList'];
            $beanList = $_SESSION['modules']['beanList'];
            $beanClasses = $_SESSION['modules']['beanClasses'];
            $beanFiles = $_SESSION['modules']['beanFiles'];
            $this->modules = $_SESSION['modules']['moduleDetails'];
        } else {
            $this->modules = [];
            $modules = DBManagerFactory::getInstance()->query("SELECT module, bean, beanfile, visible, tagging FROM sysmodules UNION SELECT module, bean, beanfile, visible, tagging FROM syscustommodules");
            while ($module = DBManagerFactory::getInstance()->fetchByAssoc($modules)) {
                $moduleList[$module['module']] = $module['module'];

                // keep the module
                $this->modules[$module['module']] = $module;

                // if we have a bean try to load the beanfile, build it from the name or use the generic sugarbean
                if ($module['bean']) {
                    $beanList[$module['module']] = $module['bean'];

                    if (!empty($module['beanfile']) && file_exists($module['beanfile'])) {
                        $beanFiles[$module['bean']] = $module['beanfile'];
                    } else if (file_exists("modules/{$module['module']}/{$module['bean']}.php")) {
                        $beanFiles[$module['bean']] = "modules/{$module['module']}/{$module['bean']}.php";
                        $beanClasses[$module['module']] = '\\SpiceCRM\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else if (file_exists("custom/modules/{$module['module']}/{$module['bean']}.php")) {
                        $beanFiles[$module['bean']] = "custom/modules/{$module['module']}/{$module['bean']}.php";
                        $beanClasses[$module['module']] = '\\SpiceCRM\\custom\\modules\\' . $module['module'] . '\\' . $module['bean'];
                    } else {
                        $beanFiles[$module['bean']] = 'data/SugarBean.php';
                    }
                }
            }
            $_SESSION['modules'] = [
                'moduleDetails' => $this->modules,
                'moduleList' => $moduleList,
                'beanList' => $beanList,
                'beanFiles' => $beanFiles,
                'beanClasses' => $beanClasses
            ];
        }
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
}
