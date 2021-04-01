<?php

/**
 * determine if we have a lgnauge specific filter set to be applied
 */

use SpiceCRM\includes\SugarObjects\SpiceConfig;

$languagefilter = [];
if(SpiceConfig::getInstance()->config['fts']['languagefilter']){
    $languagefilter[] = SpiceConfig::getInstance()->config['fts']['languagefilter'];
}


$elasticNormalizers = [
    "spice_lowercase" => [
        "type" => "custom",
        "filter" => array_merge(["lowercase"],$languagefilter)
    ]
];