<?php
namespace SpiceCRM\modules\Administration\api;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class CleanUpHandler
{
    public $scope = 'global';
    public $db_location = 'local';
    private static $UNUSED_SEARCH_PATTERN = [
        'tables' => [
            'sysuiactionsets',
            'sysuicomponentsets',
            'sysuifieldsets',
        ],
        'pattern' => [
            [
                'table' => 'dashboardcomponents',
                'columns' => ['componentconfig'],
            ],
            [
                'table' => 'sysuiadmincomponents',
                'columns' => ['componentconfig'],
            ],
            [
                'table' => 'sysuicomponentdefaultconf',
                'columns' => ['componentconfig'],
            ],
            [
                'table' => 'sysuicomponentmoduleconf',
                'columns' => ['componentconfig'],
            ],
            [
                'table' => 'sysuicomponentsetscomponents',
                'columns' => ['componentconfig'],
            ],
            [
                'table' => 'sysuidashboarddashlets',
                'columns' => ['componentconfig'],
            ],
        ]
    ];
    public static $CUSTOM_TABLE_NAME_MAP = [
        'syslanguagelabels' => 'syslanguagecustomlabels',
    ];

    public function __construct()
    {
        $db = DBManagerFactory::getInstance();
        $this->db = $db;
    }

    public function getIncompleteRecords()
    {
        // LABELs
        $checks = [];
        $sql = "SELECT target.id, target.name FROM syslanguagelabels target 
                LEFT JOIN syslanguagetranslations rel ON(rel.syslanguagelabel_id = target.id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'syslanguagelabels',
            'sql' => $sql,
            'description' => 'Labels without Translations',
        ];
        $sql = "SELECT target.id, target.translation_default name FROM syslanguagetranslations target 
                LEFT JOIN syslanguagelabels rel ON(target.syslanguagelabel_id = rel.id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'syslanguagetranslations',
            'sql' => $sql,
            'description' => 'Translations with an invalid Label',
        ];

        // ACTIONSETs
        $sql = "SELECT target.id, target.name FROM sysuiactionsets target 
                LEFT JOIN sysuiactionsetitems rel ON(rel.actionset_id = target.id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuiactionsets',
            'sql' => $sql,
            'description' => 'Actionsets wihtout Items',
        ];
        $sql = "SELECT target.id, IFNULL(target.action, target.component) name 
                FROM sysuiactionsetitems target 
                LEFT JOIN sysuiactionsets rel ON(target.actionset_id = rel.id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuiactionsetitems',
            'sql' => $sql,
            'description' => 'ActionsetItems with an invalid Actionset',
        ];
        // COMPONENTSETs
        $sql = "SELECT target.id, target.name FROM sysuicomponentsets target 
                LEFT JOIN sysuicomponentsetscomponents rel ON(target.id = rel.componentset_id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicomponentsets',
            'sql' => $sql,
            'description' => 'Componentsets without Components',
        ];
        $sql = "SELECT target.id, target.component name FROM sysuicomponentsetscomponents target 
                LEFT JOIN sysuicomponentsets rel ON(rel.id = target.componentset_id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicomponentsetscomponents',
            'sql' => $sql,
            'description' => 'ComponentsetsComponents with invalid Componentset',
        ];
        // componentsetitems missing component in objectrepository
        $sql = "SELECT target.id, target.component name FROM sysuicomponentsetscomponents target 
                LEFT JOIN sysuiobjectrepository rel ON(rel.component = target.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicomponentsetscomponents',
            'sql' => $sql,
            'description' => 'ComponentsetItems with an invalid component',
        ];
        // FIELDSETs
        $sql = "SELECT target.id, IFNULL(target.field, target.fieldset) name 
                FROM sysuifieldsetsitems target 
                LEFT JOIN sysuifieldsets rel ON(rel.id = target.fieldset_id OR rel.id = target.fieldset)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuifieldsetsitems',
            'sql' => $sql,
            'description' => 'Fieldsetitems with an invalid Fieldset',
        ];
        $sql = "SELECT target.id, target.name FROM sysuifieldsets target 
                LEFT JOIN sysuifieldsetsitems rel ON(target.id = rel.fieldset_id)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuifieldsets',
            'sql' => $sql,
            'description' => 'Fieldsets without Items',
        ];
        // ROLEs
        $sql = "SELECT target.id, target.module name FROM sysuirolemodules target 
                LEFT JOIN sysuiroles rel ON(rel.id = target.sysuirole_id)
                WHERE rel.id IS NULL AND target.sysuirole_id != '*'";
        $checks[] = [
            'table' => 'sysuirolemodules',
            'sql' => $sql,
            'description' => 'Rolemodules with an invalid role',
        ];
        // ROUTEs
        $sql = "SELECT target.id, target.path name FROM sysuiroutes target 
                LEFT JOIN sysuiobjectrepository rel ON(rel.component = target.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuiroutes',
            'sql' => $sql,
            'description' => 'Routes with an invalid component',

        ];
        // OBJECTREPOSITORY... Components
        $sql = "SELECT target.id, target.object name FROM sysuiobjectrepository target 
                LEFT JOIN sysuimodulerepository rel ON(rel.id = target.module)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuiobjectrepository',
            'sql' => $sql,
            'description' => 'Components which are assigned to a module which not exists'
        ];
        // DASHBOARDs
        $sql = "SELECT target.id, target.name FROM sysuidashboarddashlets target 
                LEFT JOIN sysuiobjectrepository rel ON(rel.component = target.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuidashboarddashlets',
            'sql' => $sql,
            'description' => 'Dashlets with an invalid component',
        ];
        // FIELDTYPEMAPPINGs
        $sql = "SELECT target.id, target.fieldtype name FROM sysuifieldtypemapping target 
                LEFT JOIN sysuiobjectrepository rel ON(rel.component = target.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuifieldtypemapping',
            'sql' => $sql,
            'description' => 'Types wiht invalid components',
        ];
        // ADMINCOMOPNENTs... Navigation
        $sql = "SELECT target.id, IFNULL(target.adminaction, target.admin_label) name 
                FROM sysuiadmincomponents target 
                LEFT JOIN sysuiobjectrepository rel ON(target.component = rel.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuiadmincomponents',
            'sql' => $sql,
            'description' => 'Adminnavigationitem with an invalid component',
        ];
        // COPYRULEs
        $sql = "SELECT target.id, CONCAT(target.frommodule, ' to ', target.tomodule, ': ', target.tofield) name 
                FROM sysuicopyrules target 
                LEFT JOIN sysmodules rel ON(target.frommodule = rel.module OR target.tomodule = rel.module)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicopyrules',
            'sql' => $sql,
            'description' => 'Copyrules with an invalid Module',
        ];
        /*
        // not necessary needed to be in object repository...
        $sql = "SELECT target.id FROM sysuicomponentdefaultconf target
                LEFT JOIN sysuiobjectrepository rel ON(target.component = rel.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicomponentdefaultconf',
            'sql' => $sql
        ];
        $sql = "SELECT target.id FROM sysuicomponentmoduleconf target
                LEFT JOIN sysuiobjectrepository rel ON(target.component = rel.component)
                WHERE rel.id IS NULL";
        $checks[] = [
            'table' => 'sysuicomponentmoduleconf',
            'sql' => $sql
        ];
        */
        //todo: workflows and spicebeanguides...
        $return = [];
        foreach($checks as $check)
        {
            $res = $this->db->query($check['sql']);
            while($row = $this->db->fetchByAssoc($res))
            {
                $check['records'][] = $row;
                $return['total_records']++;
            }
            unset($check['sql']);
            $return['checks'][] = $check;
        }
        $return['total_checks'] = count($checks);

        return $return;
    }

    /**
     * tries to find records that aren't in use by searching in various config fields in tables defined in $UNUSED_SEARCH_PATTERN
     */
    public function getUnusedRecords()
    {
        // if db is mysql, this statement could help to find table and columns to look for:
        //SELECT * FROM information_schema.COLUMNS WHERE COLUMN_NAME LIKE '%conf%' AND COLUMN_TYPE = 'text';
        foreach(static::$UNUSED_SEARCH_PATTERN['tables'] as $table)
        {
            $sql = "SELECT {$table}.id FROM {$table}\n";
            foreach(static::$UNUSED_SEARCH_PATTERN['pattern'] as $pattern)
            {
                $column_sqls = [];
                foreach($pattern['columns'] as $column)
                {
                    $column_sqls[] = "{$pattern['table']}.{$column} LIKE CONCAT('%', {$table}.id, '%')";
                }
                $sql .= "LEFT JOIN {$pattern['table']} ON(".implode(' OR ', $column_sqls).")\n";
                $where_sqls[] = "{$pattern['table']}.id IS NULL";
            }
            $sql .= "WHERE ".implode(' AND ', $where_sqls).";";
            //var_dump($sql); exit;
        }
    }

    /**
     * if scope is 'custom' it will try to get the corresponding custom table
     * @param {string} $name
     * @param {string} null $scope
     * @return {string} mixed
     */
    public function getTableName($name, $scope = null)
    {
        if($scope == 'custom' || (!$scope && $this->scope == 'custom'))
        {
            return static::getCustomTableName($name);
        }
        else
            return $name;
    }

    /**
     * tries to map a global table to the corresponding custom table
     * example: sysuiactionsets to sysuicustomactionsets
     * @param $name
     * @return mixed
     */
    public static function getCustomTableName($name)
    {
        // if table starts with 'sysui' the custom table will start with 'sysuicustom'... otherwise there is no  it has to be mapped...
        if(strpos($name, 'sysui') === 0)
        {
            return str_replace('sysui', 'sysuicustom', $name);
        }
        return static::$CUSTOM_TABLE_NAME_MAP[$name] ? static::$CUSTOM_TABLE_NAME_MAP[$name] : $name;
    }


    /**
     * delete the following cache-file \vendor\dompdf\dompdf\lib\fonts\dompdf_font_family_cache.php (when it's there)
     */
    public function cleanDompdfStyleCacheFile()
    {
        $rootDir = realpath(__DIR__ . "/../../../");
        $fontDir = isset(SpiceConfig::getInstance()->config['dompdf']['fontDir']) ? SpiceConfig::getInstance()->config['dompdf']['fontDir'] : 'dompdf/fonts/';
        return unlink($rootDir.'/'.create_cache_directory($fontDir).'dompdf_font_family_cache.php');
    }
}
