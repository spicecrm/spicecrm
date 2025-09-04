<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;

/**
 * Create relationship objects
 * @api
 */
class RelationshipFactory {

    static ?RelationshipFactory $rfInstance = null;

    /**
     * @static
     * @return RelationshipFactory
     */
    public static function getInstance(): RelationshipFactory
    {
        if (is_null(self::$rfInstance)) {
            self::$rfInstance = new RelationshipFactory();
        }

        return self::$rfInstance;
    }

    /**
     * get an instance of the relationship by name
     * @param  $relationshipName String
     * @return null|Relationship
     * @throws Exception
     */
    public function getRelationship(string $relationshipName): ?Relationship
    {
        $relationship = SpiceDictionaryRelationships::getInstance()->getRelationshipByName($relationshipName);

        if ($relationship && $relationship['status'] != 'a') {
            return null;
        }

        if (!$relationship) {
            $relationship = SpiceDictionaryHandler::getInstance()->getVardefRelationship($relationshipName);
        }

        if (!$relationship) return null;

        $typeDefinition = SpiceDictionaryRelationships::getInstance()->getRelationshipTypeDefinition($relationship['relationship_type']);

        if($typeDefinition){
            /** @var Relationship $classInstance */
            $classInstance = new $typeDefinition['class']($relationshipName, $relationship);
            return $classInstance;
        }

        LoggerManager::getLogger()->fatal("$relationshipName had an unknown type {$relationship['relationship_type']}");

        return null;
    }
}
