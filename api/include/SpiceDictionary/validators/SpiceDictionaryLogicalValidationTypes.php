<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryMetadataTable;

/**
 * A manager class for SpiceDictionaryLogicalValidationType
 */
class SpiceDictionaryLogicalValidationTypes extends SpiceDictionaryMetadataTable
{
    protected static string $tableName = 'sysdictionarylogicalvalidationtypes';
    protected static string $cacheName = 'logicalvalidationtypes';
}