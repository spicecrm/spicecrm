<?php

global $db;
if ($db && $db->tableExists("spicebeanguides")) {
    $guideObjects = $db->query("SELECT * FROM spicebeanguides");
    while ($guideObject = $db->fetchByAssoc($guideObjects)) {
        if (!empty($guideObject['build_language']))
            include $guideObject['build_language'];

    }
}
