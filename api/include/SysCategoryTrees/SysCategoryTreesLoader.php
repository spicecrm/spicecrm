<?php

namespace SpiceCRM\includes\SysCategoryTrees;

use SpiceCRM\includes\database\DBManagerFactory;

/**
 * class with loader functions to laod the treelinks initially when the UX initializes
 */
class SysCategoryTreesLoader
{
    /**
     * static loader that loiads all existing tree links to modules and field defs
     *
     * @return array
     * @throws \Exception
     */
    public static function loadTreeLinks(): array
    {
        // get a dabataxse instance
        $db = DBManagerFactory::getInstance();

        // build the link array
        $linkArray = [];
        $links = $db->query("SELECT * FROM syscategorytreelinks");
        while($link = $db->fetchByAssoc($links)){
            $linkArray[] = $link;
        }
        return $linkArray;
    }
}