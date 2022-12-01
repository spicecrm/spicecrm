<?php


namespace SpiceCRM\includes\SpiceLanguages;

use SpiceCRM\includes\SpiceSingleton;

/**
 * Class SpiceLanguageManager
 * @package SpiceCRM\includes\SpiceLanguages
 *
 * handles language and labels on the backend with some utility functions
 */
class SpiceLanguageManager extends SpiceSingleton
{
    public function getLabel($labelname, $language){
        $handler = new SpiceLanguagesRESTHandler();
        return $handler->getTranslationLabelDataByName($labelname, $language);
    }
}