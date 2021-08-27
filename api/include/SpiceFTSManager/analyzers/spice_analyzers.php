<?php

/**
 * determine if we have a lgnauge specific filter set to be applied
 */

use SpiceCRM\includes\SugarObjects\SpiceConfig;

$languagefilter = [];
if(SpiceConfig::getInstance()->config['fts']['languagefilter']){
    $languagefilter[] = SpiceConfig::getInstance()->config['fts']['languagefilter'];
}

$elasticAnalyzers = [
    "spice_standard" => [
        "type" => "custom",
        "tokenizer" => "standard",
        "filter" => $languagefilter
    ],
    "spice_standard_all" => [
        "type" => "custom",
        "tokenizer" => "spice_standard_all",
        "filter" => $languagefilter
    ],
    "spice_ngram" => [
        "type" => "custom",
        "tokenizer" => "spice_ngram",
        "filter" => array_merge(["lowercase"],$languagefilter)
    ],
    "spice_ngram_all" => [
        "type" => "custom",
        "tokenizer" => "spice_ngram_all",
        "filter" => array_merge(["lowercase"],$languagefilter)
    ],
    "spice_ngram_all_search" => [
        "type" => "custom",
        "tokenizer" => "spice_ngram_all_search",
        "filter" => array_merge(["lowercase"],$languagefilter)
    ],
    "spice_html" => [
        "type" => "custom",
        "tokenizer" => "spice_ngram",
        "filter" => array_merge(["lowercase"],$languagefilter),
        "char_filter" => ["html_strip"]
    ],
    "spice_edgengram" => [
        "type" => "custom",
        "tokenizer" => "spice_edgengram",
        "filter" => array_merge(["lowercase"],$languagefilter)
    ],
    "spice_email" => [
        "type" => "custom",
        "tokenizer" => "spice_email",
        "filter" => ["lowercase"]
    ]
];
