<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\SugarObjects\templates\person;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryLink;
use SpiceCRM\includes\SugarObjects\traits\letterSalutationTrait;
use SpiceCRM\includes\utils\SpiceUtils;

class Person extends SpiceBean
{
    // adds the letter salutation functions
    use letterSalutationTrait;

    var $picture;
    /**
     * @var bool controls whether or not to invoke the getLocalFormatttedName method with title and salutation
     */
    var $createLocaleFormattedName = true;

    /**
     * @var SpiceDictionaryLink
     */
    public $email_addresses;

    /**
     * @var false|\SpiceCRM\includes\SpiceBeans\SpiceBean
     */
    public $emailAddress;

    public function __construct()
    {
        parent::__construct();
        $this->emailAddress = BeanFactory::getBean('EmailAddresses');
    }

    /**
     * need to override to have a name field created for this class
     *
     * @see parent::retrieve()
     */
    public function retrieve($id = -1, $encode = true, $deleted = true, $relationships = true)
    {
        $retVal = parent::retrieve($id, $encode, $deleted, $relationships);
        $this->_create_proper_name_field();
        // call fill_in_relationship_fields again .... workaround till we get the SpiceBean::fill_in_relationship_fields clean
        if ($relationships) {
            $this->fill_in_relationship_fields();
        }
        return $retVal;
    }

    /**
     * a helper function to reterieve a person via an email address
     *
     * @param $email
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return Basic|bool|null
     */
    public function retrieve_by_email_address($email, $encode = true, $deleted = true, $relationships = true)
    {
        $email_addr = BeanFactory::getBean('EmailAddresses');
        $result = $email_addr->retrieve_by_string_fields(['email_address' => $email]);
        if($result)
        {
            $sql = "SELECT bean_id FROM email_addr_bean_rel WHERE email_address_id = '{$email_addr->id}' AND bean_module = '$this->_module' AND deleted = 0";
            $row = $this->db->fetchByAssoc($this->db->query($sql));
            if(!$row) return false;
            return $this->retrieve($row['bean_id'], $encode, $deleted, $relationships);
        }
        return false;
    }

    /**
     * This function helps generate the name and full_name member field variables from the salutation, title, first_name and last_name fields.
     * It takes into account the locale format settings as well as ACL settings if supported.
     */
    public function _create_proper_name_field()
    {
        // for the backwards compatibility
        $this->full_name = $this->first_name ? "{$this->first_name} {$this->last_name}" : $this->last_name;
        $this->name = $this->full_name;
        return $this->full_name;
    }

    /**
     * fill in primary email address opt in status
     * @param $status
     */
    public function fillInPrimaryEmailAddressOptInStatus($status)
    {
        $this->primary_email_opt_in_status = $status;
    }

    /**
     * @see parent::get_summary_text()
     */
    public function get_summary_text()
    {
        $this->_create_proper_name_field();
        return $this->name;
    }


    /**
     * exports a structure for the GDPR Releases
     * follows all links that have gdpr flags and if they are set lists tho
     **/
    function getGDPRRelease()
    {
        $db = DBManagerFactory::getInstance();

        $gdprReleases = [
            'gdpr_data_agreement' => $this->gdpr_data_agreement,
            'gdpr_marketing_agreement' => $this->gdpr_marketing_agreement,
            'related' => [],
            'audit' => []
        ];

        foreach ($this->field_defs as $field) {
            if ($field['type'] == 'link' && !empty($field['module'])) {
                $seed = BeanFactory::getBean($field['module']);
                if ($seed && (isset($seed->field_defs['gdpr_marketing_agreement']) || isset($seed->field_defs['gdpr_data_agreement']))) {
                    $linkedBeans = $this->get_linked_beans($field['name'], $seed->_objectname);
                    foreach($linkedBeans as $linkedBean){
                        if($linkedBean->gdpr_data_agreement || $linkedBean->gdpr_marketing_agreement){
                            $gdprReleases['related'][] = [
                                'module' => $field['module'],
                                'id' => $linkedBean->id,
                                'summary_text' => $linkedBean->get_summary_text(),
                                'date_entered' => $linkedBean->date_entered,
                                'created_by' => $linkedBean->created_by,
                                'created_by_name' => $linkedBean->created_by_user->name,
                                'date_modified' => $linkedBean->date_modified,
                                'modified_user_id' => $linkedBean->modified_user_id,
                                'modified_by_name' => $linkedBean->modified_by_user->name,
                                'gdpr_data_agreement' => $linkedBean->gdpr_data_agreement,
                                'gdpr_marketing_agreement' => $linkedBean->gdpr_marketing_agreement
                            ];
                        }
                    }
                }
            }
        }

        usort($gdprReleases['related'], function($a, $b){
            return $a['date_modified'] > $b['date_modified'] ? -1 : 1;
        });

        // get audit fields
        if($this->is_AuditEnabled()){
            $audittablename = $this->get_audit_table_name();
            $auditFields = $db->query("SELECT * FROM $audittablename WHERE parent_id = '{$this->id}' AND field_name like 'gdpr_%' ORDER BY date_created DESC");
            while($auditField = $db->fetchByAssoc($auditFields)){
                $createdUser = BeanFactory::getBean('Users', $auditField['created_by']);
                $gdprReleases['audit'][]= [
                    'date_created' => $auditField['date_created'],
                    'field_name' => $auditField['field_name'],
                    'value' => $auditField['after_value_text'] ??$auditField['after_value_string'],
                    'created_by' => $auditField['created_by'],
                    'created_by_name' => $createdUser->full_name
                ];
            }
        }

        return $gdprReleases;
    }

    /**
     * introduced 2018-05-29 maretval
     * get array containing primary email address full data
     * @return mixed : bool | array
     */
    public function getPrimaryEmailAddressData(){

        $linkedAddresses = $this->get_linked_beans('email_addresses');

        foreach($linkedAddresses as $linkedAddresse){
            if($linkedAddresse->primary_address){
                return $linkedAddresse;
            }
        }
        return false;
    }

    /**
     * Generate VCARD content
     * @return string $content
     * @throws \Exception
     */
    public function getVCardContent(): string
    {
        global $app_list_strings;

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $current_user->getPreference('language');
        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($currentLanguage);

        $content = "BEGIN:VCARD\nVERSION:4.0\n";
        $content .= "N:{$this->last_name};{$this->first_name};;{$app_list_strings['salutation_dom'][$this->salutation]} {$this->degree1};{$this->degree2}\n";
        $content .= "FN:{$this->salutation} {$this->degree1} {$this->first_name} {$this->last_name} {$this->degree2}\n";
        $content .= $this->email1 && $this->email1 != "" ? "EMAIL;TYPE=INTERNET:{$this->email1}\n" : "";
        $content .= $this->account_name && $this->account_name != "" ? "ORG:{$this->account_name}\n" : "";
        $content .= $this->phone_work && $this->phone_work != "" ? "TEL;TYPE=WORK:{$this->phone_work}\n" : "";
        $content .= $this->phone_fax && $this->phone_fax != "" ? "TEL;TYPE=WORK;TYPE=FAX:{$this->phone_fax}\n" : "";
        $content .= $this->phone_home && $this->phone_home != "" ? "TEL;TYPE=HOME:{$this->phone_home}\n" : "";
        $content .= $this->phone_mobile && $this->phone_mobile != "" ? "TEL;TYPE=CELL:{$this->phone_mobile}\n" : "";
        $content .= $this->phone_other && $this->phone_other != "" ? "TEL:{$this->phone_other}\n" : "";
        $title = $app_list_strings && $app_list_strings['contacts_title_dom'] ? $app_list_strings['contacts_title_dom'][$this->title_dd] : null;
        $content .= $title && $title != "" ? "TITLE:{$title}\n" : "";
        $content .= "ADR:;";
        $content .= ";";
        $content .= $this->primary_address_street && $this->primary_address_street != "" ? "{$this->primary_address_street};" : ';';
        $content .= $this->primary_address_city && $this->primary_address_city != "" ? "{$this->primary_address_city};" : ';';
        $content .= ";";
        $content .= $this->primary_address_postalcode && $this->primary_address_postalcode != "" ? "{$this->primary_address_postalcode};" : ';';
        $content .= $this->primary_address_country && $this->primary_address_country != "" ? "{$this->primary_address_country}" : '';
        $content .= "\nEND:VCARD";
        return $content;
    }

    /**
     * Check if the person's birthday is today (or on a specific date).
     *
     * @param string|null $comparisonDate The date to check for the anniversary. Format: YYYY-MM-DD. Optional. If not specified, the current system date is used.
     * @param string|null $timezone Optional. If no comparison date is specified, the current system date has to be used. Then a time zone is required. If not specified, the timezone of the current user is used.
     * @return bool
     *
     * @throws \DateInvalidTimeZoneException
     * @throws \DateMalformedStringException
     */
    public function hasBirthday(?string $comparisonDate = null, ?string $timezone = null): bool
    {
        return ( !empty( $this->birthdate ) and self::isAnniversary( $this->birthdate, $comparisonDate, $timezone ));
    }

    /**
     * Check whether there is an anniversary today - or on another specific day.
     *
     * @param string $anniversaryDay The date of the anniversary, e.g. a birthday. Format: MM-DD or YYYY-MM-DD
     * @param string|null $comparisonDate The date to check for the anniversary. Format: YYYY-MM-DD. Optional. If not specified, the current system date is used.
     * @param string|null $timezone Optional. If no comparison date is specified, the current system date has to be used. Then a time zone is required. If not specified, the timezone of the current user is used.
     * @return bool
     * Might be to do: Use as timezone the zone of the postal address of the person.
     *                 Until then, we will use the time zone of the current user.
     *
     * @throws \DateInvalidTimeZoneException
     * @throws \DateMalformedStringException
     */
    public static function isAnniversary(string $anniversaryDay, ?string $comparisonDate = null, ?string $timezone = null): bool
    {
        # YYYY-MM-DD --> MM-DD
        if ( strlen( $anniversaryDay ) > 5 ) $anniversaryDay = substr( $anniversaryDay, -5 );

        if ( empty( $comparisonDate )) {
            if ( empty( $timezone )) {
                $timezone = AuthenticationController::getInstance()->getCurrentUser()->getPreference('timezone');
                if ( empty( $timezone )) $timezone = 'UTC';
            }
            $comparisonDateAsObject = ( new \DateTime('now', new \DateTimeZone( $timezone )));
            $comparisonDateIsLeapYear = ( $comparisonDateAsObject->format('L') === '1' );
            $comparisonDate = $comparisonDateAsObject->format('m-d');
        } else {
            $comparisonDateIsLeapYear = ( date('L', mktime(0, 0, 0, 1, 1, substr( $comparisonDate, 0, 4 ))) === '1' );
            $comparisonDate = substr( $comparisonDate, -5 );
        }

        # In case the birthdate is on 29th february we "correct" it to 28th:
        if ( !$comparisonDateIsLeapYear and $anniversaryDay === '02-29') $anniversaryDay = '02-28';

        return $anniversaryDay === $comparisonDate;
    }

}
