<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\UOMUnits;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;

class UOMUnit extends SpiceBean {

    public function get_summary_text(){
        return $this->label;
    }

    /**
     * returns the trabslation for the unit of measure
     * @param $uom_id
     * @param $language
     * @return mixed
     * @throws \Exception
     */
    public static function getUOMtranslated($uom_id, $language = null){
        global $current_language;
        if(empty($language)) $language = $current_language;
        $uomRecord = DBManagerFactory::getInstance()->fetchOne("SELECT label FROM uomunits WHERE id = '{$uom_id}'");
        return SpiceLanguageManager::getInstance()->getLabel($uomRecord['label'], $language);
    }
}
