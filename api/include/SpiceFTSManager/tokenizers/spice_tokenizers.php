<?php
/**
 * get the config and set optiona min and max ngram
 */
$spiceConfig = \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config;
$minNgram = $spiceConfig['fts']['min_ngram'] ?: '3';
$maxNgram = $spiceConfig['fts']['max_ngram'] ?: '20';

$elasticTokenizers = [
    "spice_standard_all" => [
        "type" => "standard",
        "min_gram" => $minNgram,
        "max_gram" => $maxNgram,
        "token_chars"=> [
            "letter",
            "digit",
            "punctuation",
            "symbol",
            "whitespace"
        ],
    ],
    "spice_ngram" => [
        "type" => "nGram",
        "min_gram" => $minNgram,
        "max_gram" => $maxNgram,
        "token_chars" => [
            "letter",
            "digit"
        ]
    ],
    "spice_ngram_all" => [
        "type" => "nGram",
        "min_gram" => $minNgram,
        "max_gram" => $maxNgram,
        "token_chars"=> [
            "letter",
            "digit",
            "punctuation",
            "symbol",
            "whitespace",
            "custom"
        ],
        "custom_token_chars" => "+&/"
    ],
    "spice_ngram_all_search" => [
        "type" => "nGram",
        "min_gram" => $minNgram,
        "max_gram" => $maxNgram,
        "token_chars"=> [
            "letter",
            "digit",
            "punctuation",
            "symbol",
            "custom"
        ],
        "custom_token_chars" => "+&"
    ],
    "spice_edgengram" => [
        "type" => "edge_ngram",
        "min_gram" => $minNgram,
        "max_gram" => $maxNgram,
        "token_chars" => [
            "letter",
            "digit"
        ]
    ],
    "spice_email" => [
        "type" => "uax_url_email",
        "max_token_length" => 5
    ]
];
