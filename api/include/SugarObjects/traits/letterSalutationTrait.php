<?php

namespace SpiceCRM\includes\SugarObjects\traits;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * a simple trait that adds some letter salutation functions
 */
trait letterSalutationTrait{
    public function getLetterSalutation()
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $currentUser->getPreference('language');
        $language = $this->communication_language ?: $currentLanguage ?: 'en_us';
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($language);
        return $app_list_strings['salutation_letter_dom'][$this->salutation];
    }

    public function getLetterName()
    {
        $nameArray = [];
        if(!empty($this->degree1)) $nameArray[] =  $this->degree1;
        if(!empty($this->first_name)) $nameArray[] =  $this->first_name;
        if(!empty($this->last_name)) $nameArray[] =  $this->last_name;
        if(!empty($this->degree2)) $nameArray[] =  $this->degree2;
        return implode(' ', $nameArray);
    }

    public function getLetterLastName()
    {
        $nameArray = [];
        if(!empty($this->degree1)) $nameArray[] =  $this->degree1;
        if(!empty($this->last_name)) $nameArray[] =  $this->last_name;
        if(!empty($this->degree2)) $nameArray[] =  $this->degree2;
        return implode(' ', $nameArray);
    }
}