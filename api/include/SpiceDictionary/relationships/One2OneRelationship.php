<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use SpiceCRM\includes\SpiceBeans\SpiceBean;

/**
 * Represents 1-1 relationship
 * @api
 */
class One2OneRelationship extends M2MRelationship
{
    /**
     * @param  $lhs SpiceBean left side bean to add to the relationship.
     * @param  $rhs SpiceBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields = []): bool
    {
        $dataToInsert = $this->getRowToInsert($lhs, $rhs, $additionalFields);
        //If the current data matches the existing data, don't do anything
        if (!$this->checkExisting($dataToInsert))
        {
            $lhsLinkName = $this->lhsLink;
            $rhsLinkName = $this->rhsLink;
            //In a one to one, any existing links from both sides must be removed first.
            //one2Many will take care of the right side, so we'll do the left.
            $lhs->load_relationship($lhsLinkName);
            $this->removeAll($lhs->$lhsLinkName);
            $rhs->load_relationship($rhsLinkName);
            $this->removeAll($rhs->$rhsLinkName);

            return parent::add($lhs, $rhs, $additionalFields);
        }

        // data matched what was there so return false, since nothing happened
        return false;
    }


}
