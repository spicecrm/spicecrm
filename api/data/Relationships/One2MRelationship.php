<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\data\Relationships;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;


/**
 * Represents a one to many relationship that is table based.
 * @api
 */
class One2MRelationship extends M2MRelationship
{

    public function __construct($def)
    {
        global $dictionary;

        $this->def = $def;
        $this->name = (!empty($def['name']) ? $def['name'] : $def['relationship_name']); // BWC

        $this->selfReferencing = $def['lhs_module'] == $def['rhs_module'];
        $lhsModule = $def['lhs_module'];
        $rhsModule = $def['rhs_module'];

        if ($this->selfReferencing)
        {
            $links = VardefManager::getLinkFieldForRelationship(
                $lhsModule, BeanFactory::getObjectName($lhsModule), $this->name
            );
            if (empty($links))
            {
                LoggerManager::getLogger()->fatal("No Links found for relationship {$this->name}");
            }
            else {
                if (!is_array($links)) //Only one link for a self referencing relationship, this is very bad.
                {
                    $this->lhsLinkDef = $this->rhsLinkDef = $links;
                }
                else if (!empty($links[0]) && !empty($links[1]))
                {

                    if ((!empty($links[0]['side']) && $links[0]['side'] == "right")
                        || (!empty($links[0]['link_type']) && $links[0]['link_type'] == "one"))
                    {
                        //$links[0] is the RHS
                        $this->lhsLinkDef = $links[1];
                        $this->rhsLinkDef = $links[0];
                    } else
                    {
                        //$links[0] is the LHS
                        $this->lhsLinkDef = $links[0];
                        $this->rhsLinkDef = $links[1];
                    }
                }
            }
        } else
        {
            $this->lhsLinkDef = VardefManager::getLinkFieldForRelationship(
                $lhsModule, BeanFactory::getObjectName($lhsModule), $this->name
            );
            $this->rhsLinkDef = VardefManager::getLinkFieldForRelationship(
                $rhsModule, BeanFactory::getObjectName($rhsModule), $this->name
            );
            if (!isset($this->lhsLinkDef['name']) && isset($this->lhsLinkDef[0]))
            {
              $this->lhsLinkDef = $this->lhsLinkDef[0];
            }
            if (!isset($this->rhsLinkDef['name']) && isset($this->rhsLinkDef[0])) {
                $this->rhsLinkDef = $this->rhsLinkDef[0];
            }
        }
        $this->lhsLink = $this->lhsLinkDef['name'];
        $this->rhsLink = $this->rhsLinkDef['name'];
    }

    protected function linkIsLHS($link) {
        return ($link->getSide() == REL_LHS && !$this->selfReferencing) ||
               ($link->getSide() == REL_RHS && $this->selfReferencing);
    }

    /**
     * @param  $lhs SugarBean left side bean to add to the relationship.
     * @param  $rhs SugarBean right side bean to add to the relationship.
     * @param  $additionalFields key=>value pairs of fields to save on the relationship
     * @return boolean true if successful
     */
    public function add($lhs, $rhs, $additionalFields = [])
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
        	if ($this->selfReferencing) {
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
    }

    /**
     * Just overriding the function from M2M to prevent it from occuring
     * 
     * The logic for dealing with adding self-referencing one-to-many relations is in the add() method
     */
    protected function addSelfReferencing($lhs, $rhs, $additionalFields = [])
    {
        //No-op on One2M.
    }

    /**
     * Just overriding the function from M2M to prevent it from occuring
     */
    protected function removeSelfReferencing($lhs, $rhs, $additionalFields = [])
    {
        //No-op on One2M.
    }
}
