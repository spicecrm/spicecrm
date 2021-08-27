<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;

class SpiceUICalendarColorConditionsController {

    static function getCalendarColorConditions()
    {
        $db = DBManagerFactory::getInstance();
        $list = [];

        $query = "SELECT * FROM sysuicalendarcolorconditions ORDER BY priority";
        $queryRes = $db->query($query);
        while ($row = $db->fetchByAssoc($queryRes)) $list[] = $row;

        return $list;
    }
}
