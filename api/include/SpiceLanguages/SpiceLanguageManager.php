<?php


namespace SpiceCRM\includes\SpiceLanguages;

use SpiceCRM\includes\database\DBManagerFactory;
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


    /**
     * returns the system dfault language or if that is not set returns en_us
     *
     * @return mixed|string
     * @throws \Exception
     */
    public function getSystemDefaultLanguage(){
        $defaultLanguage = DBManagerFactory::getInstance()->fetchOne("SELECT language_code FROM syslangs WHERE is_default = 1");
        return $defaultLanguage['language_code'] ?? 'en_us';
    }
}