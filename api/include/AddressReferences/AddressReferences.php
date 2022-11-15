<?php

namespace SpiceCRM\includes\AddressReferences;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;

class AddressReferences
{
    /**
     * the address field names without prefix
     * @var string[]
     */
    private $addressFields = [
        'address_street',
        'address_street_number',
        'address_street_number_suffix',
        'address_attn',
        'address_city',
        'address_district',
        'address_postalcode',
        'address_state',
        'address_country',
        'address_latitude',
        'address_longitude'
    ];
    /**
     * array that holds the entries from spice_address_references table
     * @var array with fields
     *  id
     *  parent_module
     *  parent_address_key
     *  parent_link_name
     *  child_module
     *  child_address_key
     *  child_link_name
     */
    private $referenceMetadata = [];

    /**
     * new AddressReferences() should only be used if necessary like in sysuiloadtaskitems
     * @throws Exception
     */
    public function __construct()
    {
        self::loadReferenceMetadata();
    }

    /**
     * get only one instance singleton strategy
     * @return static
     */
    public static function getInstance(): self
    {

        static $instance = null;

        if (!$instance) $instance = new self();

        return $instance;
    }

    /**
     * load reference metadata
     * @throws Exception
     */
    public function loadReferenceMetadata()
    {
        $list = [];
        $db = DBManagerFactory::getInstance();
        if($db->tableExists('spice_address_references')){
            $query = $db->query("SELECT * FROM spice_address_references ORDER BY parent_module");
            if (!$query) return;
            while ($row = $db->fetchByAssoc($query)) {
                $list[] = $row;
            }
        }

        $this->referenceMetadata = $list;
    }

    /**
     * get reference metadata
     * @return array
     * @throws Exception
     */
    public function getReferenceMetadata(): array
    {
        return $this->referenceMetadata;
    }

    /**
     * update beans address that are referencing their address to the passed parent bean
     * @param SpiceBean $parentBean
     * @return void
     * @throws Exception
     */
    public function updateReferencedBeansAddress(SpiceBean $parentBean)
    {
        if (!$this->hasAddressFields($parentBean)) return;

        $parentMetadata = $this->getParentReferenceMetadata($parentBean);

        if (empty($parentMetadata) || !$this->addressHasChanged($parentBean, $parentMetadata[0])) return;


        # update address for all referenced modules
        foreach ($parentMetadata as $metadata) {

            $childBean = BeanFactory::newBean($metadata['child_module']);
            $childFieldName = $metadata['child_address_key'] . '_address_reference_id';

            # if the child does not have the field in the vardefs do nothing
            if (!$childBean->field_defs[$childFieldName]) continue;

            $linkedBeans = $parentBean->get_linked_beans($metadata['parent_link_name']);

            foreach ($linkedBeans as $childBean) {
                if ($childBean->$childFieldName != $parentBean->id) continue;
                $this->updateChildAddress($parentBean, $childBean, $metadata);
                $childBean->save();
            }
        }
    }

    /**
     * check if a bean has address fields
     * @param SpiceBean $bean
     * @return bool
     */
    private function hasAddressFields(SpiceBean $bean): bool
    {
        foreach ($bean->field_defs as $fieldDef) {
            if (preg_match("/address_street/", $fieldDef['name'])) {
                return true;
            }
        }
        return false;
    }

    /**
     * update child address fields
     * @param SpiceBean $parentBean
     * @param SpiceBean $childBean
     * @param array $metadata
     */
    private function updateChildAddress(SpiceBean $parentBean, SpiceBean $childBean, array $metadata)
    {
        foreach ($this->addressFields as $field) {
            $childField = "{$metadata['child_address_key']}_$field";
            $parentField = "{$metadata['parent_address_key']}_$field";
            $childBean->$childField = $parentBean->$parentField;
        }
    }

    /**
     * check if address has changed
     * @param SpiceBean $parentBean
     * @param array $parentMetadata
     * @return bool
     */
    private function addressHasChanged(SpiceBean $parentBean, array $parentMetadata): bool
    {
        foreach ($this->addressFields as $field) {
            $fieldName = "{$parentMetadata['parent_address_key']}_$field";
            if ($parentBean->$fieldName != $parentBean->fetched_row[$fieldName]) {
                return true;
            }
        }
        return false;
    }

    /**
     * get the parent reference metadata
     * @param SpiceBean $parentBean
     * @return array
     * @throws Exception
     */
    private function getParentReferenceMetadata(SpiceBean $parentBean): array
    {
        return array_filter($this->getReferenceMetadata(), function ($metadata) use ($parentBean) {
            return $metadata['parent_module'] == $parentBean->_module;
        });
    }
}