<?php
$elasticCharFilters = [
    "spice_phone" => [  // remove any character that is not a digit
        "type" => "pattern_replace",
        "pattern" => "(\\D)",
        "replacement" => ""
    ]
];