<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class DictionaryController
{

    /**
     * uilds a note array
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    function getNodes($req, $res, $args)
    {
        return $res->withJson($this->buildNodeArray($args['module']));
    }

    /*
     * Helper function to get the Fields for a module
     */

    private function buildNodeArray($module)
    {

        $returnArray = [];

        $nodeModule = BeanFactory::getBean($module);
        // $nodeModule->load_relationships();
        if ($nodeModule) {

            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                // 2011-03-23 also exculde the excluded modules from the config in the Module Tree
                //if ($field_defs['type'] == 'link' && (!isset($field_defs['module']) || (isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))) {
                if ($field_defs['type'] == 'link') {
                    if($nodeModule->load_relationship($field_name)) {
                        //BUGFIX 2010/07/13 to display alternative module name if vname is not maintained
                        $returnArray[] = [
                            'path' => 'link:' . $module . ':' . $field_name,
                            'module' => $nodeModule->$field_name->getRelatedModuleName(),
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false,
                            'label' => $field_defs['vname']
                        ];
                    }
                }
            }

            //2013-01-09 add support for Studio Relate Fields
            // get all relate fields where the link is empty ... those with link we get via the link anyway properly
            if ($field_defs['type'] == 'relate') {
                if (isset($field_defs['module']))
                    $returnArray[] = [
                        'path' => 'relate:' . $module . ':' . $field_name,
                        'module' => translate($field_defs['module'], $module),
                        'bean' => $field_defs['module'],
                        'leaf' => false,
                        'label' => $field_defs['vname']
                    ];
                else
                    $returnArray[] = [
                        'path' => 'relate:' . $module . ':' . $field_name,
                        'module' => $field_defs['name'],
                        'bean' => $field_defs['module'],
                        'leaf' => false,
                        'label' => $field_defs['vname']
                    ];
            }
        }

        // 2013-08-21 BUG #492 added sorting for the module tree
        usort($returnArray, function ($a, $b) {
            if (strtolower($a['module']) > strtolower($b['module']))
                return 1;
            elseif (strtolower($a['module']) == strtolower($b['module']))
                return 0;
            else
                return -1;
        });

        // 2013-08-21 BUG #492 merge with the basic functional elelements
        return $returnArray;
    }

    /**
     * builds a field array
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    function getFields($req, $res, $args)
    {
        return $res->withJson($this->buildFieldArray($args['module']));
    }

    private function buildFieldArray($module)
    {
        $returnArray = [];

        $nodeModule = BeanFactory::getBean($module);

        foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
            if ($field_defs['type'] != 'link') {
                $returnArray[] = [
                    'id' => 'field:' . $field_defs['name'],
                    'name' => $field_defs['name'],
                    // in case of a kreporter field return the report_data_type so operators ar processed properly
                    // 2011-05-31 changed to kreporttype returned if fieldttype is kreporter
                    // 2011-10-15 if the kreporttype is set return it
                    //'type' => ($field_defs['type'] == 'kreporter') ? $field_defs['kreporttype'] :  $field_defs['type'],
                    'type' => (isset($field_defs['kreporttype'])) ? $field_defs['kreporttype'] : $field_defs['type'],
                    'text' => (translate($field_defs['vname'], $module) != '') ? translate($field_defs['vname'], $module) : $field_defs['name'],
                    'leaf' => true,
                    'options' => $field_defs['options'],
                    'label' => $field_defs['vname']
                ];
            }
        }

        // 2013-08-21 Bug#493 sorting name for the fields
        usort($returnArray, "arraySortByName");

        return $returnArray;
    }
}
