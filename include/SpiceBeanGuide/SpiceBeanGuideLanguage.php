<?php

global $db;
if ($db) {
    $guideObjects = $db->query("SELECT * FROM spicebeanguides");
    while ($guideObject = $db->fetchByAssoc($guideObjects)) {
        if (!empty($guideObject['build_language']))
            include $guideObject['build_language'];

    }
}
