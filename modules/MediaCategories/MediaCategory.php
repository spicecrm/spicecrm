<?php

/*
 * Copyright notice
 * 
 * (c) 2016 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

class MediaCategory extends SugarBean
{

    public $table_name = "mediacategories";
    public $object_name = "MediaCategory";
    public $module_dir = 'MediaCategories';
    public $unformated_numbers = true;

    public function __construct()
    {
        parent::__construct();
    }

    public function bean_implements( $interface )
    {
        switch ( $interface ) {
            case 'ACL':
                return true;
        }
        return false;
    }

    public function get_summary_text()
    {
        return $this->name;
    }

}