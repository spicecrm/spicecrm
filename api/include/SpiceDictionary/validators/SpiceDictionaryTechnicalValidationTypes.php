<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryMetadataTable;

/**
 * A manager class for SpiceDictionaryTechnicalValidationType
 */
class SpiceDictionaryTechnicalValidationTypes extends SpiceDictionaryMetadataTable
{
    protected static string $tableName = 'sysdictionarytechnicalvalidationtypes';
    protected static string $cacheName = 'technicalvalidationtypes';
}
