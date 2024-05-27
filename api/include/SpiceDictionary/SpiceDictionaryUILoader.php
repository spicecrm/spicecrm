<?php

namespace SpiceCRM\includes\SpiceDictionary;

class SpiceDictionaryUILoader
{
    /**
     * get dictionary definitions
     * @return array
     */
    public function getDictionaryDefinitions()
    {
        return array_values(
            SpiceDictionaryDefinitions::getInstance()->getDefinitions()
        );
    }
}