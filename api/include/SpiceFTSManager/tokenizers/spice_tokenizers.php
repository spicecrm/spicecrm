<?php
$elasticTokenizers = [
    "spice_standard_all" => [
        "type" => "standard",
        "min_gram" => "3",
        "max_gram" => "20",
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
        "min_gram" => "3",
        "max_gram" => "20",
        "token_chars" => [
            "letter",
            "digit"
        ]
    ],
    "spice_ngram_all" => [
        "type" => "nGram",
        "min_gram" => "3",
        "max_gram" => "20",
        "token_chars"=> [
            "letter",
            "digit",
            "punctuation",
            "symbol",
            "whitespace",
            "custom"
        ],
        "custom_token_chars" => "+&"
    ],
    "spice_ngram_all_search" => [
        "type" => "nGram",
        "min_gram" => "3",
        "max_gram" => "20",
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
        "min_gram" => "3",
        "max_gram" => "20",
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
