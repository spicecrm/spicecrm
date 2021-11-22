<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

namespace SpiceCRM\includes\database;

use SpiceCRM\data\SugarBean;
use Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/*********************************************************************************
 * Description: This file handles the Data base functionality for the application.
 * It acts as the DB abstraction layer for the application. It depends on helper classes
 * which generate the necessary SQL. This sql is then passed to PEAR DB classes.
 * The helper class is chosen in DBManagerFactory, which is driven by 'db_type' in 'dbconfig' under config.php.
 *
 * All the functions in this class will work with any bean which implements the meta interface.
 * The passed bean is passed to helper class which uses these functions to generate correct sql.
 *
 * The meta interface has the following functions:
 * getTableName()                Returns table name of the object.
 * getFieldDefinitions()         Returns a collection of field definitions in order.
 * getFieldDefintion(name)       Return field definition for the field.
 * getFieldValue(name)           Returns the value of the field identified by name.
 *                               If the field is not set, the function will return boolean FALSE.
 * getPrimaryFieldDefinition()   Returns the field definition for primary key
 *
 * The field definition is an array with the following keys:
 *
 * name      This represents name of the field. This is a required field.
 * type      This represents type of the field. This is a required field and valid values are:
 *           �   int
 *           �   long
 *           �   varchar
 *           �   text
 *           �   date
 *           �   datetime
 *           �   double
 *           �   float
 *           �   uint
 *           �   ulong
 *           �   time
 *           �   short
 *           �   enum
 * length    This is used only when the type is varchar and denotes the length of the string.
 *           The max value is 255.
 * enumvals  This is a list of valid values for an enum separated by "|".
 *           It is used only if the type is �enum�;
 * required  This field dictates whether it is a required value.
 *           The default value is �FALSE�.
 * isPrimary This field identifies the primary key of the table.
 *           If none of the fields have this flag set to �TRUE�,
 *           the first field definition is assume to be the primary key.
 *           Default value for this field is �FALSE�.
 * default   This field sets the default value for the field definition.
 *
 *
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/


/**
 * MySQL manager implementation for mysqli extension
 */
class MysqliManager extends DBManager
{
    /**
     * @see DBManager::$dbType
     */
    public $dbType = 'mysql';
    public $variant = 'mysqli';
    public $priority = 10;
    public $label = 'LBL_MYSQLI';
    public $dbName = 'MySQL';

    protected $maxNameLengths = [
        'table' => 64,
        'column' => 64,
        'index' => 64,
        'alias' => 256
    ];

    protected $type_map = [
        'int'      => 'int',
        'double'   => 'double',
        'float'    => 'float',
        'uint'     => 'int unsigned',
        'ulong'    => 'bigint unsigned',
        'long'     => 'bigint',
        'short'    => 'smallint',
        'varchar'  => 'varchar',
        'text'     => 'text',
        'shorttext'=> 'text',
        'longtext' => 'longtext',
        'date'     => 'date',
        'enum'     => 'varchar',
        'relate'   => 'varchar',
        'multienum'=> 'text',
        'html'     => 'text',
        'longhtml' => 'longtext',
        'datetime' => 'datetime',
        'datetimecombo' => 'datetime',
        'time'     => 'time',
        'bool'     => 'bool',
        'tinyint'  => 'tinyint',
        'char'     => 'char',
        'blob'     => 'blob',
        'longblob' => 'longblob',
        'currency' => 'decimal(26,6)',
        'decimal'  => 'decimal',
        'decimal2' => 'decimal',
        'id'       => 'char(36)',
        'url'      => 'varchar',
        'encrypt'  => 'varchar',
        'file'     => 'varchar',
        'decimal_tpl' => 'decimal(%d, %d)',

    ];

    protected $capabilities = [
        "affected_rows" => true,
        "select_rows" => true,
        "inline_keys" => true,
        "create_user" => true,
        "fulltext" => true,
        "collation" => true,
        "create_db" => true,
        "disable_keys" => true,
    ];


    /**
     * @see DBManager::$backendFunctions
     */
    protected $backendFunctions = [
        'free_result' => 'mysqli_free_result',
        'close' => 'mysqli_close',
        'row_count' => 'mysqli_num_rows',
        'affected_row_count' => 'mysqli_affected_rows',
    ];

    /**
     * @see MysqlManager::query()
     */
    
    public function query($sql, $dieOnError = false, $msg = '', $suppress = false, $keepResult = false)
    {

        try {
            if (is_array($sql)) {
                return $this->queryArray($sql, $dieOnError, $msg, $suppress);
            }

            static $queryMD5 = [];

            parent::countQuery($sql);
            LoggerManager::getLogger()->info('Query:' . $sql);
            $this->checkConnection();
            $this->query_time = microtime(true);
            $this->lastsql = $sql;
            $result = $suppress ? @mysqli_query($this->database, $sql) : mysqli_query($this->database, $sql);
            $md5 = md5($sql);

            if (empty($queryMD5[$md5]))
                $queryMD5[$md5] = true;

            $this->query_time = microtime(true) - $this->query_time;
            LoggerManager::getLogger()->info('Query Execution Time:' . $this->query_time);

            if (isset($GLOBALS['totalquerytime'])) $GLOBALS['totalquerytime'] += $this->query_time;

            // This is some heavy duty debugging, leave commented out unless you need this:
            /*
            $bt = debug_backtrace();
            for ( $i = count($bt) ; $i-- ; $i > 0 ) {
                if ( strpos('MysqliManager.php',$bt[$i]['file']) === false ) {
                    $line = $bt[$i];
                }
            }

            \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal("${line['file']}:${line['line']} ${line['function']} \nQuery: $sql\n");
            */


            if ($keepResult) {
                $this->lastResult = $result;
            }
            if ($result === false) {
                $this->checkError($msg . ' Query Failed: ' . $sql, $dieOnError);
            }
        } catch (Exception $e) {
            throw $e;
        }

        return $result;

    }

    /**
     * just execute query
     * introduced 2018-06-06
     * @param string $sql SQL Statement to execute
     * @param bool $suppress Flag to suppress all error output unless in debug logging mode.
     */
    public function queryOnly($sql, $suppress = true)
    {
        $this->checkConnection();
        $result = $suppress ? @mysqli_query($this->database, $sql) : mysqli_query($this->database, $sql);
        return $result;
    }

    /**
     * Returns the number of rows affected by the last query
     *
     * @return int
     */
    public function getAffectedRowCount($result)
    {
        return mysqli_affected_rows($this->getDatabase());
    }

    /**
     * Returns the number of rows returned by the result
     *
     * This function can't be reliably implemented on most DB, do not use it.
     * @abstract
     * @param resource $result
     * @return int
     * @deprecated
     */
    public function getRowCount($result)
    {
        return mysqli_num_rows($result);
    }


    /**
     * Disconnects from the database
     *
     * Also handles any cleanup needed
     */
    public function disconnect()
    {
        LoggerManager::getLogger()->debug('Calling MySQLi::disconnect()');
        if (!empty($this->database)) {
            $this->freeResult();
            mysqli_close($this->database);
            $this->database = null;
        }
    }

    /**
     * @see DBManager::freeDbResult()
     */

    protected function freeDbResult($dbResult)
    {
        if (!empty($dbResult))
            mysqli_free_result($dbResult);
    }

    /**
     * @see DBManager::getFieldsArray()
     */


        public function getFieldsArray($result, $make_lower_case = false)
        {
            $field_array = [];

            if (!isset($result) || empty($result))
                return 0;

            $i = 0;
            while ($i < mysqli_num_fields($result)) {
                $meta = mysqli_fetch_field_direct($result, $i);
                if (!$meta)
                    return 0;

                if ($make_lower_case == true)
                    $meta->name = strtolower($meta->name);

                $field_array[] = $meta->name;

                $i++;
            }

            return $field_array;
        }

/**
 * @see DBManager::fetchRow()
 */
    public function fetchRow($result)
    {
        if (empty($result)) return false;

        $row = mysqli_fetch_assoc($result);
        if ($row == null) $row = false; //Make sure MySQLi driver results are consistent with other database drivers
        return $row;
    }

    /**
     * @see DBManager::quote()
     */
    public function quote($string)
    {
        return mysqli_real_escape_string($this->getDatabase(), $this->quoteInternal($string));
    }

    /**
     * @see DBManager::connect()
     */
    public function connect(array $configOptions = null, $dieOnError = false)
    {


        if (is_null($configOptions))
            $configOptions = SpiceConfig::getInstance()->config['dbconfig'];

        if (!isset($this->database)) {

            //mysqli connector has a separate parameter for port.. We need to separate it out from the host name
            $dbhost = $configOptions['db_host_name'];
            $dbport = (!empty($configOptions['db_port']) ? $configOptions['db_port'] : null);
            $pos = strpos($configOptions['db_host_name'], ':');
            if ($pos !== false) {
                $dbhost = substr($configOptions['db_host_name'], 0, $pos);
                $dbport = substr($configOptions['db_host_name'], $pos + 1);
            }

            $this->database = mysqli_connect($dbhost, $configOptions['db_user_name'], $configOptions['db_password'], isset($configOptions['db_name']) ? $configOptions['db_name'] : '', $dbport);
            if (empty($this->database)) {
                LoggerManager::getLogger()->fatal("Could not connect to DB server " . $dbhost . " as " . $configOptions['db_user_name'] . ". port " . $dbport . ": " . mysqli_connect_error());
                if ($dieOnError) {
                    if (isset($GLOBALS['app_strings']['ERR_NO_DB'])) {
                        sugar_die($GLOBALS['app_strings']['ERR_NO_DB']);
                    } else {
                        sugar_die("Could not connect to the database. Please refer to spicecrm.log for details.");
                    }
                } else {
                    return false;
                }
            }
        }

        if (!empty($configOptions['db_name']) && !@mysqli_select_db($this->database, $configOptions['db_name'])) {
            LoggerManager::getLogger()->fatal("Unable to select database {$configOptions['db_name']}: " . mysqli_connect_error());
            if ($dieOnError) {
                if (isset($GLOBALS['app_strings']['ERR_NO_DB'])) {
                    sugar_die($GLOBALS['app_strings']['ERR_NO_DB']);
                } else {
                    sugar_die("Could not connect to the database. Please refer to spicecrm.log for details.");
                }
            } else {
                return false;
            }
        }

        // cn: using direct calls to prevent this from spamming the Logs
        // CR1000349 mysql8 compatibility: remove hardcoded charset
        $charset = $this->getOption('charset');
        if (empty($charset)) {
            $charset = 'utf8';
        }
        mysqli_set_charset($this->database, $charset);
	    // mysqli_query($this->database,"SET CHARACTER SET ".$charset."");
	    $names = "SET NAMES '$charset'";
	    $collation = $this->getOption('collation');
	    if(!empty($collation)) {
	        $names .= " COLLATE '$collation'";
		}
	    mysqli_query($this->database,$names);

		if($this->checkError('Could Not Connect', $dieOnError))
		    LoggerManager::getLogger()->info("connected to db");

		$this->connectOptions = $configOptions;
		return true;
	}

	/**
	 * (non-PHPdoc)
	 * @see MysqlManager::lastDbError()
	 */
	public function lastDbError()
	{
		if($this->database) {
		    if(mysqli_errno($this->database)) {
			    return "MySQL error ".mysqli_errno($this->database).": ".mysqli_error($this->database);
		    }
		} else {
			$err =  mysqli_connect_error();
			if($err) {
			    return $err;
			}
		}

		return false;
	}
    public function getDbInfo()
    {
        $charsets = $this->getCharsetInfo();
        $charset_str = [];
        foreach($charsets as $name => $value) {
            $charset_str[] = "$name = $value";
        }
        return [
            "MySQLi Version" => @mysqli_get_client_info(),
            "MySQLi Host Info" => @mysqli_get_host_info($this->database),
            "MySQLi Server Info" => @mysqli_get_server_info($this->database),
            "MySQLi Client Encoding" =>  @mysqli_character_set_name($this->database),
            "MySQL Character Set Settings" => join(", ", $charset_str),
        ];
    }

/**
 * Select database
 * @param string $dbname
 */
	protected function selectDb($dbname)
	{
		return mysqli_select_db($this->getDatabase(), $dbname);
	}

	/**
	 * Check if this driver can be used
	 * @return bool
	 */
    public function valid()
    {
        return function_exists("mysqli_connect") && empty(SpiceConfig::getInstance()->config['mysqli_disabled']);
    }

    public function compareVarDefs($fielddef1, $fielddef2, $ignoreName = false)
    {
	    $compared = parent::compareVarDefs($fielddef1, $fielddef2, $ignoreName);
	    if(!$compared) return false;

	    // return  mysqli_real_escape_string($this->database, $fielddef2['comment']) != $fielddef1['comment'] ? false : true;
	    if(str_replace([';'], '', $fielddef2['comment']) != $fielddef1['comment'])
	        return false;
	    else
	        return true;
        }


    /**
     * introduced in SpiceCRM 20180900
     * Original DBManager function: added ticks for columns names
     * add ticks to column names to prevent mysql strict mode from issuing errors when column name is a reserved word
     * @param array $fieldDef
     * @param bool $ignoreRequired
     * @param string $table
     * @param bool $return_as_array
     * @return array|string
     */
    protected function oneColumnSQLRep($fieldDef, $ignoreRequired = false, $table = '', $return_as_array = false)
    {
        // introduced in spicecrm 202001001
        // check that the right type is passed to support definitions like int 20
        $this->normalizeVardefs($fieldDef);


        $name = $fieldDef['name'];
        $type = $this->getFieldType($fieldDef);
        $colType = $this->getColumnType($type);

        if ($parts = $this->getTypeParts($colType)) {
            $colBaseType = $parts['baseType'];
            $defLen = isset($parts['len']) ? $parts['len'] : '255'; // Use the mappings length (precision) as default if it exists
        }

        if (!empty($fieldDef['len'])) {
            if (in_array($colBaseType, ['nvarchar', 'nchar', 'varchar', 'varchar2', 'char'])) {
                $colType = "$colBaseType(${fieldDef['len']})";
            } elseif (($colBaseType == 'decimal' || $colBaseType == 'float')) {
                if (!empty($fieldDef['precision']) && is_numeric($fieldDef['precision']))
                    if (strpos($fieldDef['len'], ',') === false) {
                        $colType = $colBaseType . "(" . $fieldDef['len'] . "," . $fieldDef['precision'] . ")";
                    } else {
                        $colType = $colBaseType . "(" . $fieldDef['len'] . ")";
                    }
                else
                    $colType = $colBaseType . "(" . $fieldDef['len'] . ")";
            }
        } else {
            if (in_array($colBaseType, ['nvarchar', 'nchar', 'varchar', 'varchar2', 'char'])) {
                $colType = "$colBaseType($defLen)";
            }
        }

        $default = '';

        // Bug #52610 We should have ability don't add DEFAULT part to query for boolean fields
        if (!empty($fieldDef['no_default'])) {
            // nothing to do
        } elseif (isset($fieldDef['default']) && strlen($fieldDef['default']) > 0) {
            $default = " DEFAULT " . $this->quoted($fieldDef['default']);
        } elseif (!isset($default) && $type == 'bool') {
            $default = " DEFAULT 0 ";
        }

        $auto_increment = '';
        if (!empty($fieldDef['auto_increment']) && $fieldDef['auto_increment'])
            $auto_increment = $this->setAutoIncrement($table, $fieldDef['name']);

        $required = 'NULL';  // MySQL defaults to NULL, SQL Server defaults to NOT NULL -- must specify
        //Starting in 6.0, only ID and auto_increment fields will be NOT NULL in the DB.
        if ((empty($fieldDef['isnull']) || strtolower($fieldDef['isnull']) == 'false') &&
            (!empty($auto_increment) || $name == 'id' || ($fieldDef['type'] == 'id' && !empty($fieldDef['required'])))) {
            $required = "NOT NULL";
        }
        // If the field is marked both required & isnull=>false - alwqys make it not null
        // Use this to ensure primary key fields never defined as null
        if (isset($fieldDef['isnull']) && (strtolower($fieldDef['isnull']) == 'false' || $fieldDef['isnull'] === false)
            && !empty($fieldDef['required'])) {
            $required = "NOT NULL";
        }
        if ($ignoreRequired)
            $required = "";

        $comment = '';
        if (!empty($fieldDef['comment'])) {
            $comment = " COMMENT '" . mysqli_real_escape_string($this->database, $fieldDef['comment']) . "'";
        }

        if ($return_as_array) {
            return [
                'name' => "`" . $name . "`",
                'colType' => $colType,
                'colBaseType' => $colBaseType,  // Adding base type for easier processing in derived classes
                'default' => $default,
                'required' => $required,
                'auto_increment' => $auto_increment,
                'comment' => $comment,
                'full' => "$name $colType $default $required $auto_increment $comment",
            ];
        } else {
            return "`$name` $colType $default $required $auto_increment $comment";
        }
    }

    /**
     * use MYSQL in the upsert Query
     *
     * @see DBManager::upsertQuery()
     */
    public function upsertQuery($table, array $pks, array $data, bool $execute = true)
    {
        // quote the names
        $cols = array_keys($data);
        foreach ( $cols as $k => $v ) {
            $cols[$k] = $this->quote($v);
        }

        // quote the values
        $vals = array_values($data);
        foreach ( $vals as $k => $v ) {
            $vals[$k] = is_null($v) ? "null" : "'{$this->quote( $v )}'";
        }

        // run the query
        $this->query("REPLACE INTO " . $table . " (" . implode(',', $cols) . ") VALUES (" . implode(",", $vals) . ")");
    }

    /**
     * @see DBManager::limitQuery()
     */


    public function limitQuery($sql, $start, $count, $dieOnError = false, $msg = '', $execute = true)
    {
        $start = (int)$start;
        $count = (int)$count;
        if ($start < 0)
            $start = 0;
        LoggerManager::getLogger()->debug('Limit Query:' . $sql. ' Start: '.$start.' count:'.$count);

        $sql = "$sql LIMIT $start,$count";
        $this->lastsql = $sql;

        if(!empty($GLOBALS['sugar_config']['check_query'])){
            $this->checkQuery($sql);
        }
        if(!$execute) {
            return $sql;
        }

        return $this->query($sql, $dieOnError, $msg);
    }


    /**
     * @see DBManager::checkQuery()
     */

    protected function checkQuery($sql, $object_name = false)
    {
        $result   = $this->query('EXPLAIN ' . $sql);
        $badQuery = [];
        while ($row = $this->fetchByAssoc($result)) {
            if (empty($row['table']))
                continue;
            $badQuery[$row['table']] = '';
            if (strtoupper($row['type']) == 'ALL')
                $badQuery[$row['table']]  .=  ' Full Table Scan;';
            if (empty($row['key']))
                $badQuery[$row['table']] .= ' No Index Key Used;';
            if (!empty($row['Extra']) && substr_count($row['Extra'], 'Using filesort') > 0)
                $badQuery[$row['table']] .= ' Using FileSort;';
            if (!empty($row['Extra']) && substr_count($row['Extra'], 'Using temporary') > 0)
                $badQuery[$row['table']] .= ' Using Temporary Table;';
        }

        if ( empty($badQuery) )
            return true;

        foreach($badQuery as $table=>$data ){
            if(!empty($data)){
                $warning = ' Table:' . $table . ' Data:' . $data;
                if(!empty($GLOBALS['sugar_config']['check_query_log'])){
                    LoggerManager::getLogger()->fatal($sql);
                    LoggerManager::getLogger()->fatal('CHECK QUERY:' .$warning);
                }
                else{
                    LoggerManager::getLogger()->warn('CHECK QUERY:' .$warning);
                }
            }
        }

        return false;
    }

    /*
 * @see DBManager::get_columns()
 */
    public function get_columns($tablename)
    {
        //find all unique indexes and primary keys.
        // $result = $this->query("DESCRIBE $tablename");
        $result = $this->query("SHOW FULL COLUMNS FROM $tablename");

        $columns = [];
        while (($row=$this->fetchByAssoc($result)) !=null) {
            $name = strtolower($row['Field']);
            $columns[$name]['name']=$name;
            $matches = [];
            preg_match_all('/(\w+)(?:\(([0-9]+,?[0-9]*)\)|)( unsigned)?/i', $row['Type'], $matches);
            $columns[$name]['type']=strtolower($matches[1][0]);
            if ( isset($matches[2][0]) && in_array(strtolower($matches[1][0]),['varchar','char','varchar2','int','decimal','float']) )
                $columns[$name]['len']=strtolower($matches[2][0]);
            if ( stristr($row['Extra'],'auto_increment') )
                $columns[$name]['auto_increment'] = '1';
            if ($row['Null'] == 'NO' && !stristr($row['Key'],'PRI'))
                $columns[$name]['required'] = 'true';
            if (!empty($row['Default']) )
                $columns[$name]['default'] = $row['Default'];
            if (!empty($row['Comment']) )
                $columns[$name]['comment'] = $row['Comment'];
        }
        return $columns;
    }

    /**
     * Get a list of columns names for selects
     * Convenient when you have a union query to ensure that column name have the same order
     * @see DBManager::get_columns_list()
     */

    public function get_columns_list($tablename, $delimiter= ', ', $fallback ='*')
    {
        $columns = $this->get_columns($tablename);
        $cols = [];
        foreach($columns as $c => $col){
            $cols[] = $col['name'];
        }
        $list = implode($delimiter, $cols);

        // fall back in case no columns found or any other problem occured
        if(!$list){
            $list = $fallback;
        }
        return $list;
    }

    /**
     * @see DBManager::getTablesArray()
     */
    public function getTablesArray()
    {
        $this->log->debug('Fetching table list');

        if ($this->getDatabase()) {
            $tables = [];
            $r = $this->query('SHOW TABLES');
            if (!empty($r)) {
                while ($a = $this->fetchByAssoc($r)) {
                    $row = array_values($a);
                    $tables[]=$row[0];
                }
                return $tables;
            }
        }

        return false; // no database available
    }

    /**
     * @see DBManager::version()
     */
    public function version()
    {
        return $this->getOne("SELECT version() version");
    }

    /**
     * @see DBManager::tableExists()
     */
    public function tableExists($tableName)
    {
        $this->log->info("tableExists: $tableName");

        if ($this->getDatabase()) {
            $result = $this->query("SHOW TABLES LIKE ".$this->quoted($tableName));
            if(empty($result)) return false;
            $row = $this->fetchByAssoc($result);
            return !empty($row);
        }

        return false;
    }

    /**
     * Get tables like expression
     * @param $like string
     * @return array
     */
    public function tablesLike($like)
    {
        if ($this->getDatabase()) {
            $tables = [];
            $r = $this->query('SHOW TABLES LIKE '.$this->quoted($like));
            if (!empty($r)) {
                while ($a = $this->fetchByAssoc($r)) {
                    $row = array_values($a);
                    $tables[]=$row[0];
                }
                return $tables;
            }
        }
        return false;
    }

    /**
     * @see DBManager::repairTableParams()
     *
     * For MySQL, we can write the ALTER TABLE statement all in one line, which speeds things
     * up quite a bit. So here, we'll parse the returned SQL into a single ALTER TABLE command.
     */

    public function repairTableParams($tablename, $fielddefs, $indices, $execute = true, $engine = null)
    {
        $sql = parent::repairTableParams($tablename,$fielddefs,$indices,false,$engine);

        if ( $sql == '' )
            return '';

        if ( stristr($sql,'create table') )
        {
            if ($execute) {
                $msg = "Error creating table: ".$tablename. ":";
                $this->query($sql,true,$msg);
            }
            return $sql;
        }

        // first, parse out all the comments
        $match = [];
        preg_match_all('!/\*.*?\*/!is', $sql, $match);
        $commentBlocks = $match[0];
        $sql = preg_replace('!/\*.*?\*/!is','', $sql);

        // now, we should only have alter table statements
        // let's replace the 'alter table name' part with a comma
        $sql = preg_replace("!alter table $tablename!is",', ', $sql);

        // re-add it at the beginning
        $sql = substr_replace($sql,'',strpos($sql,','),1);
        $sql = str_replace(";","",$sql);
        $sql = str_replace("\n","",$sql);
        $sql = "ALTER TABLE $tablename $sql";

        if ( $execute )
            $this->query($sql,'Error with MySQL repair table');

        // and re-add the comments at the beginning
        $sql = implode("\n",$commentBlocks) . "\n". $sql . ";\n";

        return $sql;
    }

    /**
     * @see DBManager::convert()
     */
    public function convert($string, $type, array $additional_parameters = [])
    {
        $all_parameters = $additional_parameters;
        if(is_array($string)) {
            $all_parameters = array_merge($string, $all_parameters);
        } elseif (!is_null($string)) {
            array_unshift($all_parameters, $string);
        }
        $all_strings = implode(',', $all_parameters);

        switch (strtolower($type)) {
            case 'today':
                return "CURDATE()";
            case 'left':
                return "LEFT($all_strings)";
            case 'date_format':
                if(empty($additional_parameters)) {
                    return "DATE_FORMAT($string,'%Y-%m-%d')";
                } else {
                    $format = $additional_parameters[0];
                    if($format[0] != "'") {
                        $format = $this->quoted($format);
                    }
                    return "DATE_FORMAT($string,$format)";
                }
            case 'ifnull':
                if(empty($additional_parameters) && !strstr($all_strings, ",")) {
                    $all_strings .= ",''";
                }
                return "IFNULL($all_strings)";
            case 'concat':
                return "CONCAT($all_strings)";
            case 'quarter':
                return "QUARTER($string)";
            case "length":
                return "LENGTH($string)";
            case 'month':
                return "MONTH($string)";
            case 'add_date':
                return "DATE_ADD($string, INTERVAL {$additional_parameters[0]} {$additional_parameters[1]})";
            case 'add_time':
                return "DATE_ADD($string, INTERVAL + CONCAT({$additional_parameters[0]}, ':', {$additional_parameters[1]}) HOUR_MINUTE)";
            case 'add_tz_offset' :
                $getUserUTCOffset = $GLOBALS['timedate']->getUserUTCOffset();
                $operation = $getUserUTCOffset < 0 ? '-' : '+';
                return $string . ' ' . $operation . ' INTERVAL ' . abs($getUserUTCOffset) . ' MINUTE';
            case 'avg':
                return "avg($string)";
        }

        return $string;
    }

    /**
     * (non-PHPdoc)
     * @see DBManager::fromConvert()
     */

    public function fromConvert($string, $type)
    {
        return $string;
    }

    /**
     * Returns the name of the engine to use or null if we are to use the default
     *
     * @param  object $bean SugarBean instance
     * @return string
     */

    protected function getEngine($bean)
    {
        global $dictionary;
        $engine = null;
        if (isset($dictionary[$bean->getObjectName()]['engine'])) {
            $engine = $dictionary[$bean->getObjectName()]['engine'];
        }
        return $engine;
    }

    /**
     * Returns true if the engine given is enabled in the backend
     *
     * @param  string $engine
     * @return bool
     */
    protected function isEngineEnabled($engine)
    {
        if(!is_string($engine)) return false;

        $engine = strtoupper($engine);

        $r = $this->query("SHOW ENGINES");

        while ( $row = $this->fetchByAssoc($r) )
            if ( strtoupper($row['Engine']) == $engine )
                return ($row['Support']=='YES' || $row['Support']=='DEFAULT');

        return false;
    }


    /**
     * Generates sql for create table statement for a bean.
     *
     * @param  string $tablename
     * @param  array  $fieldDefs
     * @param  array  $indices
     * @param  string $engine optional, MySQL engine to use
     * @return string SQL Create Table statement
     */

    public function createTableSQLParams($tablename, $fieldDefs, $indices, $engine = null)
    {
        if ( empty($engine) && isset($fieldDefs['engine']))
            $engine = $fieldDefs['engine'];
        if ( !$this->isEngineEnabled($engine) )
            $engine = '';

        $columns = $this->columnSQLRep($fieldDefs, false, $tablename);
        if (empty($columns))
            return false;

        $keys = $this->keysSQL($indices);
        if (!empty($keys))
            $keys = ",$keys";

        // cn: bug 9873 - module tables do not get created in utf8 with assoc collation
        $collation = $this->getOption('collation');
        // CR1000349 mysql8 compatibility: remove hardcoded charset
        $charset = $this->getOption('charset');
        if(empty($collation)) {
            $collation = 'utf8_general_ci';
            // $collation = 'utf8mb4_unicode_ci';
        }
        if(empty($charset)) {
            $charset = 'utf8';
            // $charset = 'utf8mb4';
        }

        $sql = "CREATE TABLE $tablename ($columns $keys) CHARACTER SET $charset COLLATE $collation";

        if (!empty($engine))
            $sql.= " ENGINE=$engine";

        return $sql;
    }

    /**
     * CR1000138 - add 2020-02-21
     * @param $fieldDef
     */
    public function normalizeVardefs(&$fieldDef){

        switch($fieldDef['type']) {
            case 'int':
                if( (is_string($fieldDef['len']) && intval($fieldDef['len']) > 0) || (is_int($fieldDef['len']) && $fieldDef['len'] > 0 ) ) {
                    if ($fieldDef['len'] > 0 && $fieldDef['len'] <= 4)
                        $fieldDef['dbType'] = 'tinyint';
                    elseif ($fieldDef['len'] > 4 && $fieldDef['len'] <= 6)
                        $fieldDef['dbType'] = 'smallint';
                    elseif ($fieldDef['len'] > 6 && $fieldDef['len'] <= 10)
                        $fieldDef['dbType'] = 'mediumint';
                    elseif ($fieldDef['len'] > 11 && $fieldDef['len'] <= 19)
                        $fieldDef['dbType'] = 'int';
                    elseif ($fieldDef['len'] > 19) {
                        $fieldDef['dbType'] = 'bigint';
                    }
                }
                break;
            case 'text':
                if( (is_string($fieldDef['len']) && intval($fieldDef['len']) > 0) || (is_int($fieldDef['len']) && $fieldDef['len'] > 0 ) ) {
                    if ($fieldDef['len'] > 0 && $fieldDef['len'] <= 255)
                        $fieldDef['dbType'] = 'varchar';
                    elseif ($fieldDef['len'] > 255 && $fieldDef['len'] <= 65535)
                        $fieldDef['dbType'] = 'text';
                    elseif ($fieldDef['len'] > 65535 && $fieldDef['len'] <= 16777215)
                        $fieldDef['dbType'] = 'mediumtext';
                    elseif ($fieldDef['len'] > 16777215 && $fieldDef['len'] <= 4294967295)
                        $fieldDef['dbType'] = 'longtext';
                    break;
                }
        }

    }

    /**
     * @see DBManager::changeColumnSQL()
     */
    protected function changeColumnSQL($tablename, $fieldDefs, $action, $ignoreRequired = false)
    {
        $columns = [];
        if ($this->isFieldArray($fieldDefs)){
            foreach ($fieldDefs as $def){
                if ($action == 'drop')
                    $columns[] = $def['name'];
                else
                    $columns[] = $this->oneColumnSQLRep($def, $ignoreRequired);
            }
        } else {
            if ($action == 'drop')
                $columns[] = $fieldDefs['name'];
            else
                $columns[] = $this->oneColumnSQLRep($fieldDefs);
        }

        return "ALTER TABLE $tablename $action COLUMN ".implode(",$action column ", $columns);
    }

    /**
     * Generates SQL for key specification inside CREATE TABLE statement
     *
     * The passes array is an array of field definitions or a field definition
     * itself. The keys generated will be either primary, foreign, unique, index
     * or none at all depending on the setting of the "key" parameter of a field definition
     *
     * @param  array  $indices
     * @param  bool   $alter_table
     * @param  string $alter_action
     * @return string SQL Statement
     */
    protected function keysSQL($indices, $alter_table = false, $alter_action = '')
    {
        // check if the passed value is an array of fields.
        // if not, convert it into an array
        if (!$this->isFieldArray($indices))
            $indices[] = $indices;

        $columns = [];
        foreach ($indices as $index) {
            if(!empty($index['db']) && $index['db'] != $this->dbType)
                continue;
            if (isset($index['source']) && $index['source'] != 'db')
                continue;

            $type = $index['type'];
            $name = $index['name'];

            if (is_array($index['fields']))
                $fields = '`'.implode("`, `", $index['fields']).'`';
            else
                $fields = '`'.$index['fields'].'`';

            switch ($type) {
                case 'unique':
                    $columns[] = " UNIQUE $name ($fields)";
                    break;
                case 'primary':
                    $columns[] = " PRIMARY KEY ($fields)";
                    break;
                case 'index':
                case 'foreign':
                case 'clustered':
                case 'alternate_key':
                    /**
                     * @todo here it is assumed that the primary key of the foreign
                     * table will always be named 'id'. It must be noted though
                     * that this can easily be fixed by referring to db dictionary
                     * to find the correct primary field name
                     */

                    if ( $alter_table )
                        $columns[] = " INDEX $name ($fields)";
                    else
                        $columns[] = " KEY $name ($fields)";
                    break;
                case 'fulltext':
                    if ($this->full_text_indexing_installed())
                        $columns[] = " FULLTEXT ($fields)";
                    else
                        LoggerManager::getLogger()->debug('MYISAM engine is not available/enabled, full-text indexes will be skipped. Skipping:',$name);
                    break;
            }
        }
        $columns = implode(", $alter_action ", $columns);
        if(!empty($alter_action)){
            $columns = $alter_action . ' '. $columns;
        }
        return $columns;
    }

    /**
     * @see DBManager::setAutoIncrement()
     */
    protected function setAutoIncrement($table, $field_name)
    {
        return "auto_increment";
    }

    /**
     * @see DBManager::get_indices()
     */

    public function get_indices($tablename)
    {
        //find all unique indexes and primary keys.
        $result = $this->query("SHOW INDEX FROM $tablename");

        $indices = [];
        while (($row=$this->fetchByAssoc($result)) !=null) {
            $index_type='index';
            if ($row['Key_name'] =='PRIMARY') {
                $index_type='primary';
            }
            elseif ( $row['Non_unique'] == '0' ) {
                $index_type='unique';
            }
            $name = strtolower($row['Key_name']);
            $indices[$name]['name']=$name;
            $indices[$name]['type']=$index_type;
            $indices[$name]['fields'][]=strtolower($row['Column_name']);
        }
        return $indices;
    }

    /**
     * @see DBManager::add_drop_constraint()
     */

    public function add_drop_constraint($table, $definition, $drop = false)
    {
        $type         = $definition['type'];
        $fields       = implode(',',$definition['fields']);
        $name         = $definition['name'];
        $sql          = '';

        switch ($type){
            // generic indices
            case 'index':
            case 'alternate_key':
            case 'clustered':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP INDEX {$name} ";
                else
                    $sql = "ALTER TABLE {$table} ADD INDEX {$name} ({$fields})";
                break;
            // constraints as indices
            case 'unique':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP INDEX $name";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT UNIQUE {$name} ({$fields})";
                break;
            case 'primary':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP PRIMARY KEY";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT PRIMARY KEY ({$fields})";
                break;
            case 'foreign':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP FOREIGN KEY ({$fields})";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT FOREIGN KEY {$name} ({$fields}) REFERENCES {$definition['foreignTable']}({$definition['foreignField']})";
                break;
        }
        return $sql;
    }

    /**
     * Runs a query and returns a single row
     *
     * @param  string   $sql        SQL Statement to execute
     * @param  bool     $dieOnError True if we want to call die if the query returns errors
     * @param  string   $msg        Message to log if error occurs
     * @param  bool     $suppress   Message to log if error occurs
     * @return array    single row from the query
     */
    public function fetchOne($sql, $dieOnError = false, $msg = '', $suppress = false)
    {
        if(stripos($sql, ' LIMIT ') === false) {
            // little optimization to just fetch one row
            $sql .= " LIMIT 0,1";
        }
        return parent::fetchOne($sql, $dieOnError, $msg, $suppress);
    }

    /**
     * @see DBManager::full_text_indexing_installed()
     */

    public function full_text_indexing_installed($dbname = null)
    {
        return $this->isEngineEnabled('MyISAM');
    }

    /**
     * (non-PHPdoc)
     * @see DBManager::renameColumnSQL()
     */

    public function renameColumnSQL($tablename, $column, $newname)
    {
        $field = $this->describeField($column, $tablename);
        $field['name'] = $newname;
        return "ALTER TABLE $tablename CHANGE COLUMN $column ".$this->oneColumnSQLRep($field);
    }

    /**
     * Quote MySQL search term
     * @param unknown_type $term
     */
    protected function quoteTerm($term)
    {
        if(strpos($term, ' ') !== false) {
            return '"'.$term.'"';
        }
        return $term;
    }

    /**
     * Generate fulltext query from set of terms
     * @param string $fields Field to search against
     * @param array $terms Search terms that may be or not be in the result
     * @param array $must_terms Search terms that have to be in the result
     * @param array $exclude_terms Search terms that have to be not in the result
     */

    public function getFulltextQuery($field, $terms, $must_terms = [], $exclude_terms = [])
    {
        $condition = [];
        foreach($terms as $term) {
            $condition[] = $this->quoteTerm($term);
        }
        foreach($must_terms as $term) {
            $condition[] = "+".$this->quoteTerm($term);
        }
        foreach($exclude_terms as $term) {
            $condition[] = "-".$this->quoteTerm($term);
        }
        $condition = $this->quoted(join(" ",$condition));
        return "MATCH($field) AGAINST($condition IN BOOLEAN MODE)";
    }

    public function validateQuery($query)
    {
        $res = $this->query("EXPLAIN $query");
        return !empty($res);
    }

    protected function makeTempTableCopy($table)
    {
        $this->log->debug("creating temp table for [$table]...");
        $result = $this->query("SHOW CREATE TABLE {$table}");
        if(empty($result)) {
            return false;
        }
        $row = $this->fetchByAssoc($result);
        if(empty($row) || empty($row['Create Table'])) {
            return false;
        }
        $create = $row['Create Table'];
        // rewrite DDL with _temp name
        $tempTableQuery = str_replace("CREATE TABLE `{$table}`", "CREATE TABLE `{$table}__uw_temp`", $create);
        $r2 = $this->query($tempTableQuery);
        if(empty($r2)) {
            return false;
        }

        // get sample data into the temp table to test for data/constraint conflicts
        $this->log->debug('inserting temp dataset...');
        $q3 = "INSERT INTO `{$table}__uw_temp` SELECT * FROM `{$table}` LIMIT 10";
        $this->query($q3, false, "Preflight Failed for: {$q3}");
        return true;
    }

    protected function verifyGenericReplaceQuery($querytype, $table, $query)
    {
        $this->log->debug("verifying $querytype statement");

        if(!$this->makeTempTableCopy($table)) {
            return 'Could not create temp table copy';
        }
        // test the query on the test table
        $this->log->debug('testing query: ['.$query.']');
        $tempTableTestQuery = str_replace("$querytype `{$table}`", "$querytype `{$table}__uw_temp`", $query);
        if(strpos($tempTableTestQuery, '__uw_temp') === false) {
            return 'Could not use a temp table to test query!';
        }

        $this->query($tempTableTestQuery, false, "Preflight Failed for: {$query}");
        $error = $this->lastError(); // empty on no-errors
        $this->dropTableName("{$table}__uw_temp"); // just in case
        return $error;
    }

    /**
     * Check if certain database exists
     * @param string $dbname
     */
    public function dbExists($dbname)
    {
        $db = $this->getOne("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ".$this->quoted($dbname));
        return !empty($db);
    }

    /**
     * Check if certain DB user exists
     * @param string $username
     */
    public function userExists($username)
    {
        $db = $this->getOne("SELECT DATABASE()");
        if(!$this->selectDb("mysql")) {
            return false;
        }
        $user = $this->getOne("select count(*) from user where user = ".$this->quoted($username));
        if(!$this->selectDb($db)) {
            $this->checkError("Cannot select database $db", true);
        }
        return !empty($user);
    }

    /**
     * Create DB user
     * @param string $database_name
     * @param string $host_name
     * @param string $user
     * @param string $password
     */
    public function createDbUser($database_name, $host_name, $user, $password)
    {
        $qpassword = $this->quote($password);
        $this->query("GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX
							ON `$database_name`.*
							TO \"$user\"@\"$host_name\"
							IDENTIFIED BY '{$qpassword}';", true);

        $this->query("SET PASSWORD FOR \"{$user}\"@\"{$host_name}\" = password('{$qpassword}');", true);
        if($host_name != 'localhost') {
            $this->createDbUser($database_name, "localhost", $user, $password);
        }
    }

    /**
     * Create a database
     * @param string $dbname
     */
    public function createDatabase($dbname)
    {
        $this->query("CREATE DATABASE `$dbname` CHARACTER SET utf8 COLLATE utf8_general_ci", true);
        //$this->query("CREATE DATABASE `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", true);
    }

    /**
     * Drop a database
     * @param string $dbname
     */
    public function dropDatabase($dbname)
    {
        return $this->query("DROP DATABASE IF EXISTS `$dbname`", true);
    }


    public function installConfig()
    {
        return [
            'LBL_DBCONFIG_MSG3' => [
                "setup_db_database_name" => ["label" => 'LBL_DBCONF_DB_NAME', "required" => true],
            ],
            'LBL_DBCONFIG_MSG2' =>  [
                "setup_db_host_name" => ["label" => 'LBL_DBCONF_HOST_NAME', "required" => true],
            ],
            'LBL_DBCONF_TITLE_USER_INFO' => [],
            'LBL_DBCONFIG_B_MSG1' => [
                "setup_db_admin_user_name" => ["label" => 'LBL_DBCONF_DB_ADMIN_USER', "required" => true],
                "setup_db_admin_password" => ["label" => 'LBL_DBCONF_DB_ADMIN_PASSWORD', "type" => "password"],
            ]
        ];
    }

    /**
     * Disable keys on the table
     * @abstract
     * @param string $tableName
     */
    public function disableKeys($tableName)
    {
        return $this->query('ALTER TABLE '.$tableName.' DISABLE KEYS');
    }


    /**
     * Returns a DB specific FROM clause which can be used to select against functions.
     * Note that depending on the database that this may also be an empty string.
     * @return string
     */
    public function getFromDummyTable()
    {
        return '';
    }

    /**
     * Returns a DB specific piece of SQL which will generate GUID (UUID)
     * This string can be used in dynamic SQL to do multiple inserts with a single query.
     * I.e. generate a unique Sugar id in a sub select of an insert statement.
     * @return string
     */

    public function getGuidSQL()
    {
        return 'UUID()';
    }

    /**
     * Returns a DB specific piece of SQL which will generate a datetiem repesenting now
     * @abstract
     * @return string
     */
    public function getNowSQL(){
        return 'NOW()';
    }

    /**
     * Starts a database transaction.
     * From now on all changes to the database won´t be established and can be discarded.
     * @return result set of the query
     */
    public function transactionStart()
    {
        $ret = $this->query('START TRANSACTION');
        $this->query('SET innodb_lock_wait_timeout = 120'); # temporary workaround
        return $ret;
    }

    /**
     * Rolls back a database transaction.
     * All changes of the database since transactionStart() are discarded.
     * @return result set of the query
     */
    public function transactionRollback()
    {
        return $this->query('ROLLBACK');
    }

    /**
     * Commits a database transaction.
     * All changes of the database since transactionStart() are commited.
     * @return result set of the query
     */
    public function transactionCommit()
    {
        return $this->query('COMMIT');
    }


    /**
     * @see DBManager::massageFieldDef()
     */
    public function massageFieldDef(&$fieldDef, $tablename)
    {
        parent::massageFieldDef($fieldDef,$tablename);

        if ( isset($fieldDef['default']) &&
            ($fieldDef['dbType'] == 'text'
                || $fieldDef['dbType'] == 'blob'
                || $fieldDef['dbType'] == 'longtext'
                || $fieldDef['dbType'] == 'longblob' ))
            unset($fieldDef['default']);
        if ($fieldDef['dbType'] == 'uint')
            $fieldDef['len'] = '10';
        if ($fieldDef['dbType'] == 'ulong')
            $fieldDef['len'] = '20';
        if ($fieldDef['dbType'] == 'bool')
            $fieldDef['type'] = 'tinyint';
        if ($fieldDef['dbType'] == 'bool' && empty($fieldDef['default']) )
            $fieldDef['default'] = '0';
        if (($fieldDef['dbType'] == 'varchar' || $fieldDef['dbType'] == 'enum') && empty($fieldDef['len']) )
            $fieldDef['len'] = '255';
        if ($fieldDef['dbType'] == 'uint')
            $fieldDef['len'] = '10';
        if ($fieldDef['dbType'] == 'int' && empty($fieldDef['len']) )
            $fieldDef['len'] = '11';

        if($fieldDef['dbType'] == 'decimal') {
            if(isset($fieldDef['len'])) {
                if(strstr($fieldDef['len'], ",") === false) {
                    $fieldDef['len'] .= ",0";
                }
            } else {
                $fieldDef['len']  = '10,0';
            }
        }
    }

    /**
     * CR1000138 - 2019-02-12
     * To ensure multiple database types support vardefs will sometimes be defined with a basic dbType and a specific length to match another column Type. Example dbType='text' and a len=4294967295. This definition creates a longtext column in mysql.
     * Column will be created properly in database but repair/rebuild will not recognize that vardef match with column type
     * This function matches definition with table column type for specific column types
     * @param $fielddef1 database field definition
     * @param $fielddef2 vardef
     * @return boolean
     */

    public function checkOnVarDefinition($fielddef1, $fielddef2)
    {
        $dbtype = $fielddef1['type'];
        switch($dbtype){
            case 'longtext':
            case 'mediumtext':
            case 'text':
            case 'tinytext':
                $fieldtype = $this->getFieldType($fielddef2);
                if(isset($fielddef2['len'])) {
                    switch ($fieldtype) {
                        case 'text':
                            if ($fielddef2['len'] > 0 && $fielddef2['len'] <= 255)
                                $fieldtype = 'varchar';
                            elseif($fielddef2['len'] > 255 && $fielddef2['len'] <= 65535)
                                $fieldtype =  'text';
                            elseif ($fielddef2['len'] > 65535 && $fielddef2['len'] <= 16777215)
                                $fieldtype = 'mediumtext';
                            elseif ($fielddef2['len'] > 16777215 &&  $fielddef2['len'] <= 4294967295)
                                $fieldtype = 'longtext';
                            break;
                    }
                }
                break;

            case 'bigint':
            case 'int':
            case 'mediumint':
            case 'smallint':
            case 'tinyint':
                $fieldtype = $this->getFieldType($fielddef2);
                switch ($fieldtype) {
                    case 'int':
                        if($fielddef2['len'] > 0 && $fielddef2['len'] <= 4)
                            $fieldtype =  'tinyint';
                        elseif($fielddef2['len'] > 4 && $fielddef2['len'] <= 6)
                            $fieldtype =  'smallint';
                        elseif($fielddef2['len'] > 6 && $fielddef2['len'] <= 10)
                            $fieldtype =  'mediumint';
                        elseif($fielddef2['len'] > 11 && $fielddef2['len'] <= 19)
                            $fieldtype =  'int';
                        elseif($fielddef2['len'] >  19){
                            $fieldtype =  'bigint';
                        }

                        break;
                }
                break;
        }

        return (strtolower($dbtype) == strtolower($fieldtype));

    }

    /**
     * @inheritDoc
     */
    public function convertDBCharset($charset, $collation): bool {
        $dbName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        $sql = "ALTER DATABASE {$dbName} CHARACTER SET {$charset} COLLATE {$collation}";
        $this->query($sql);

       return true;
    }

    /**
     * @inheritDoc
     */
    public function convertTableCharset($tableName, $charset, $collation): bool {
        $sql = "ALTER TABLE {$tableName} CONVERT TO CHARACTER SET {$charset} COLLATE {$collation}";
        $this->query($sql);

        return true;
    }

    /**
     * @inheritDoc
     */
    public function getDatabaseCharsetInfo(): array {
        return [
            'tables'   => $this->getTablesCharsetInfo(),
            'database' => $this->getDatabaseCharset(),
        ];
    }

    /**
     * Returns the charset and collation info for all tables
     *
     * @return array
     * @throws Exception
     */
    public function getTablesCharsetInfo(): array {
        $result = [];
        $dbName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        $sql = "SELECT table_name,CCSA.character_set_name, CCSA.collation_name FROM information_schema.TABLES T,
                information_schema.COLLATION_CHARACTER_SET_APPLICABILITY CCSA
                WHERE CCSA.collation_name = T.table_collation
                AND T.table_schema = '{$dbName}'";
        $query = $this->query($sql);

        while ($row = $this->fetchRow($query)) {
            $result[] = $row;
        }

        return $result;
    }

    /**
     * Returns the charset and collation info for the database
     *
     * @return array|false
     * @throws Exception
     */
    public function getDatabaseCharset(): array {
        $dbName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        $sql = "SELECT SCHEMA_NAME 'database', default_character_set_name 'charset', DEFAULT_COLLATION_NAME 'collation'
                FROM information_schema.SCHEMATA WHERE schema_name='{$dbName}';";
        $query = $this->query($sql);

        return $this->fetchRow($query);
    }
}
