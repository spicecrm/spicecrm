<?php
namespace SpiceCRM\includes\SpicePhoneNumberParser;
/**
 * Class SpiceACLHooks
 *
 * handles the vardefs, retirvbeal and storage fo the users hash
 */
class SpicePhoneNumberHooks{

    public function hook_before_save(&$bean, $event, $arguments)
    {
        

        $country = '';
        $phoneFields = [];

        // determine phone fields and country
        foreach($bean->field_name_map as $fieldname => $fielddata){
            if($fielddata['type'] == 'phone' && !empty($bean->$fieldname)){
                $phoneFields[] = $fieldname;
            }

            if(empty($country) && strpos($fieldname, '_country') > 0 && !empty($bean->$fieldname)){
                $country = $bean->$fieldname;
            }
        }

        // parse phine fields
        foreach($phoneFields as $phoneField){
            $bean->$phoneField = SpicePhoneNumberParser::convertToInternational($bean->$phoneField, $country);
        }
    }
}
