<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use Exception;
use SpiceCRM\includes\SpiceBeans\SpiceBean;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MRelationship extends M2MRelationship
{
    /**
     * initialize the instance from the given vardef relationship array
     * @param array $relationship
     * @return void
     * @throws Exception
     */
    protected function initializeFromVardef(array $relationship): void
    {
        $this->def = $relationship;

        $isSidesModuleIdentical = $this->def['lhs_module'] == $this->def['rhs_module'];

        if (!$isSidesModuleIdentical) {

            $lhsLinkDef = $this->getLinkFieldForRelationship($this->def['lhs_module']);
            $rhsLinkDef = $this->getLinkFieldForRelationship($this->def['rhs_module']);

            if (!isset($lhsLinkDef['name']) && isset($lhsLinkDef[0])) {
                $lhsLinkDef = $lhsLinkDef[0];
            }
            if (!isset($rhsLinkDef['name']) && isset($rhsLinkDef[0])) {
                $rhsLinkDef = $rhsLinkDef[0];
            }

            $this->lhsLink = $lhsLinkDef['name'];
            $this->rhsLink = $rhsLinkDef;

        } else {

            $links = $this->getLinkFieldForRelationship($this->def['lhs_module']);

            if ((!empty($links[0]['side']) && $links[0]['side'] == "right") || (!empty($links[0]['link_type']) && $links[0]['link_type'] == "one")) {
                # first link is right side
                $this->lhsLink = $links[1]['name'];
                $this->rhsLink = $links[0]['name'];
            } else {
                # first link is left side
                $this->lhsLink = $links[0]['name'];
                $this->rhsLink = $links[1]['name'];
            }
        }
    }

    /**
     * @param  $lhs SpiceBean left side bean to add to the relationship.
     * @param  $rhs SpiceBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     * @throws Exception
     */
    public function add($lhs, $rhs, $additionalFields = []): bool
    {
        $dataToInsert = $this->getRowToInsert($lhs, $rhs, $additionalFields);
        
        //If the current data matches the existing data, don't do anything
        if (!$this->checkExisting($dataToInsert))
        {
			// Pre-load the RHS relationship, which is used later in the add() function and expects a Bean
			// and we also use it for clearing relationships in case of non self-referencing O2M relations
			// (should be preloaded because when using the relate_to field for updating/saving relationships,
			// only the bean id is loaded into $rhs->$rhsLinkName)
			$rhsLinkName = $this->rhsLink;
			$rhs->load_relationship($rhsLinkName);
        	
			// If it's a One2Many self-referencing relationship
        	// the positions of the default One (LHS) and Many (RHS) are swaped
        	// so we should clear the links from the many (left) side
            $isSidesModuleIdentical = $this->def['lhs_module'] == $this->def['rhs_module'];

            if ($isSidesModuleIdentical) {
        		// Load right hand side relationship name
	            $linkName = $this->rhsLink;
	            // Load the relationship into the left hand side bean
	            $lhs->load_relationship($linkName);
	            
	            // Pick the loaded link
	            $link = $lhs->$linkName;
	            // Get many (LHS) side bean
	            $focus = $link->getFocus();
	            // Get relations
	        	$related = $link->getBeans();
	        	
        		// Clear the relations from many side bean
	        	foreach($related as $relBean) {
	        		$this->remove($focus, $relBean);
	        	}
            } else { // For non self-referencing, remove all the relationships from the many (RHS) side
            	$this->removeAll($rhs->$rhsLinkName);
            }
            
            // Add relationship
            parent::add($lhs, $rhs, $additionalFields);
        }

        return true;
    }
}
