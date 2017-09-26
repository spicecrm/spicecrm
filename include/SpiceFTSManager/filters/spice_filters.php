<?php
$elasticFilters = array(
    /*
    "spice_email" => array(
        "type" => "pattern_capture",
        "preserve_original" => 1,
        "patterns" => array(
            "([^@]+)",
            "(\\p{L}+)",
            "(\\d+)",
            "@(.+)"
        )
    ),
    */
    "spice_ngram" => array(
        "type" => "nGram",
        "min_gram" => "3",
        "max_gram" => "20",
        //   "token_chars" => ["letter", "digit"]
    ),
    /*
    "spice_edgengram" => array(
        "type" => "edgeNGram",
        "min_gram" => "2",
        "max_gram" => "20",
        //   "token_chars" => ["letter", "digit"]
    )
    */
);