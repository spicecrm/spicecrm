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
     * @param false $forceReload necessary in repair database logic
     * @throws \Exception
     */
    static function loadModules($forceReload = false){
        global $moduleList, $beanList, $beanClasses, $beanFiles;
        if(isset($_SESSION['modules']) && !$forceReload){
            $moduleList = $_SESSION['modules']['moduleList'];
            $beanList = $_SESSION['modules']['beanList'];
            $beanClasses = $_SESSION['modules']['beanClasses'];
            $beanFiles = $_SESSION['modules']['beanFiles'];
        } else {
            $modules = DBManagerFactory::getInstance()->query("SELECT module, bean, beanfile, visible FROM sysmodules UNION SELECT module, bean, beanfile, visible FROM syscustommodules");
            while ($module = DBManagerFactory::getInstance()->fetchByAssoc($modules)) {
                $moduleList[$module['module']] = $module['module'];

                // if we have a bean try to load the beanfile, build it from the name or use the generic sugarbean
                if ($module['bean']) {
                    $beanList[$module['module']] = $module['bean'];

                    if(!empty($module['beanfile']) && file_exists($module['beanfile'])){
                        $beanFiles[$module['bean']] =  $module['beanfile'];
                    } else if (file_exists("modules/{$module['module']}/{$module['bean']}.php")) {
                        $beanFiles[$module['bean']] = "modules/{$module['module']}/{$module['bean']}.php";
                        $beanClasses[$module['module']] = '\\SpiceCRM\\modules\\'.$module['module'].'\\'.$module['bean'];
                    }  else if (file_exists("custom/modules/{$module['module']}/{$module['bean']}.php")) {
                        $beanFiles[$module['bean']] = "custom/modules/{$module['module']}/{$module['bean']}.php";
                        $beanClasses[$module['module']] = '\\SpiceCRM\\custom\\modules\\'.$module['module'].'\\'.$module['bean'];
                    } else {
                        $beanFiles[$module['bean']] = 'data/SugarBean.php';
                    }
                }
            }
            $_SESSION['modules'] = [
                'moduleList' => $moduleList,
                'beanList' => $beanList,
                'beanFiles' => $beanFiles,
                'beanClasses' => $beanClasses
            ];
        }
    }
}
