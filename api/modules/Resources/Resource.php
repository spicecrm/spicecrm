<?php
namespace SpiceCRM\modules\Resources;
//todo which package is it anyway
use SpiceCRM\data\SugarBean;


/**
 * Generic module for Ressources (e.g. conference Room, etc). Can be linked to Cost Centers ets
 *
 * Class Resource
 *
 */
class Resource extends SugarBean
{
    var $module_dir = 'Resources';
    var $object_name = 'Resource';
    var $table_name = 'resources';

    function __construct()
    {
        parent::__construct();
    }

    function get_summary_text()
    {
        return $this->name;
    }

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }
}
