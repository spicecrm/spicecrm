<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\UOMUnits;

use SpiceCRM\includes\database\DBManagerFactory;

class UOMLoader{
    public function loadUnitsOfMeasure(){
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $types = $db->query("SELECT id, iso, label, dimensions, main_unit, nominator, denominator  FROM uomunits WHERE deleted = 0");
        while ($type = $db->fetchByAssoc($types)){
            $retArray[] = $type;
        }
        return $retArray;

    }
}
