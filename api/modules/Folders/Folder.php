<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Folders;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;

class Folder extends SugarBean
{
    public $new_schema = true;
    public $module_dir = 'Folders';
    public $object_name = 'Folder';
    public $table_name = 'folders';
    public $importable = false;

    public function __construct()
    {
        parent::__construct();
    }

    public function get_summary_text()
    {
        return $this->name;
    }

    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }
}