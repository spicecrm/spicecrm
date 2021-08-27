<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use stdClass;

class SpiceUIRepositoryController
{
    static function getModuleRepository()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $modules = $db->query("SELECT * FROM sysuimodulerepository UNION ALL SELECT * FROM sysuicustommodulerepository");
        while ($module = $db->fetchByAssoc($modules)) {
            $retArray[$module['id']] = [
                'id' => $module['id'],
                'path' => $module['path'],
                'module' => $module['module']
            ];
        }

        return $retArray;
    }

    static function getComponents()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        $components = $db->query("SELECT * FROM sysuiobjectrepository UNION ALL SELECT * FROM sysuicustomobjectrepository");
        while ($component = $db->fetchByAssoc($components)) {
            $retArray[$component['object']] = [
                'path' => $component['path'],
                'component' => $component['component'],
                'module' => $component['module'],
                'deprecated' => $component['deprecated'],
                'componentconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($component['componentconfig'])), true) ?: []
            ];
        }

        return $retArray;
    }

    static function getComponentDefaultConfigs()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $componentconfigs = $db->query("SELECT * FROM sysuicomponentdefaultconf");
        while ($componentconfig = $db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        $componentconfigs = $db->query("SELECT * FROM sysuicustomcomponentdefaultconf");
        while ($componentconfig = $db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        return $retArray;
    }

    static function getComponentModuleConfigs()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $componentconfigs = $db->query("SELECT * FROM sysuicomponentmoduleconf");
        while ($componentconfig = $db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['module']][$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        $componentconfigs = $db->query("SELECT * FROM sysuicustomcomponentmoduleconf");
        while ($componentconfig = $db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['module']][$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        return $retArray;
    }

    /**
     * retirves the libs defined for the laoder
     *
     * @return array
     */
    static function getLibraries()
    {

        $db = DBManagerFactory::getInstance();

        $return = [];
        $sql = "SELECT * FROM (SELECT * FROM sysuilibs UNION SELECT * FROM sysuicustomlibs) libs ORDER BY libs.rank ASC";
        $res = $db->query($sql);
        while($row = $db->fetchByAssoc($res))
        {
            // find any sugarconfig value that should be replaced while loading
            $matches = [];
            preg_match('/{(.*?)}/', $row['src'], $matches);
            if(count($matches) == 2){
                $configpathentries = explode('.', $matches[1]);
                $configvalue = SpiceConfig::getInstance()->config;
                foreach($configpathentries as $configpathentry){
                    $configvalue = $configvalue[$configpathentry];
                }
                $row['src'] = str_replace($matches[0], $configvalue, $row['src']);
            }

            $return[$row['name']][] = ['loaded' => false, 'src' => $row['src']];
        }

        return $return;
    }

}
