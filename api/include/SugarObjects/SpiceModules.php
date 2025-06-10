<?php
/**
 * This alias is needed for backwards compatibility with custom code.
 * Once all the occurrences of the old full namespace class names are gone, this file can be safely removed.
 * Don't forget to composer dump-autoload
 */
namespace SpiceCRM\includes\SugarObjects;

class_alias(\SpiceCRM\includes\SpiceBeans\SpiceModules::class, 'SpiceCRM\includes\SugarObjects\SpiceModules');
