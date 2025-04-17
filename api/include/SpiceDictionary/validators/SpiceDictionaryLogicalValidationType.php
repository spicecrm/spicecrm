<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryMetadataItem;

class SpiceDictionaryLogicalValidationType extends SpiceDictionaryMetadataItem
{
    protected static string $managerClass = SpiceDictionaryLogicalValidationTypes::class;
    private static string $label = "Logical validation type";
}