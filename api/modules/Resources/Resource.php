<?php
namespace SpiceCRM\modules\Resources;
//todo which package is it anyway
use SpiceCRM\data\SpiceBean;


/**
 * Generic module for Ressources (e.g. conference Room, etc). Can be linked to Cost Centers ets
 *
 * Class Resource
 *
 */
class Resource extends SpiceBean
{

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
