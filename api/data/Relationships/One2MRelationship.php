<?php
/**
 * This alias is needed for backwards compatibility with custom code.
 * Once all the occurrences of the old full namespace class names are gone, this file can be safely removed.
 * Don't forget to composer dump-autoload
 */
namespace SpiceCRM\data\Relationships;

class_alias(\SpiceCRM\includes\SpiceDictionary\relationships\One2MRelationship::class, 'SpiceCRM\data\Relationships\One2MRelationship');
