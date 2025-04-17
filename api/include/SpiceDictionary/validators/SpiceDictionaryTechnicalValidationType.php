<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryMetadataItem;

class SpiceDictionaryTechnicalValidationType extends SpiceDictionaryMetadataItem
{
    protected static string $managerClass = SpiceDictionaryTechnicalValidationTypes::class;
    private static string $label = "Technical validation type";
}