<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
namespace SpiceCRM\includes\database;


use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * OCI8 driver
 */

/**
 * dbName should be oracle tns (Transparent Network Substrate) address to the DB
 * pattern is \\host:port\service_name\instance_name
 * the access address of oracle using TELNET service
 * need to have oracle libraries installed at server if the DB server is not localhost
 * one is oci8 lib and then need to have oracle smart client
 *
 * communication pattern from sugar to oracle
 * SUGAR->PHPLIB_OCI8->ORACLE_SMART_CLIENT->TELNET->ORACLE SERVER
 *
 * web server and oracle on SAME machine
 * SUGAR->PHPLIB_OCI8->LOCALHOST_ORACLE
 *
 * check this out:
 * http://docs.php.net/manual/en/oci8.requirements.php
 * http://docs.php.net/manual/en/book.oci8.php
 * http://docs.php.net/manual/en/function.oci-connect.php
 *
 */
class OCI8Manager extends DBManager
{

    /**
     * @see DBManager::$dbType
     */
    public $dbType = 'oci8';
    public $variant = 'oci8';

    /**
     * dbName should be oracle tns (Transparent Network Substrate) address to the DB
     * pattern is \\host:port\service_name\instance_name
     * the access address of oracle using TELNET service
     */
    public $dbName = 'Oracle';
    public $label = 'LBL_ORACLE';
    protected $configOptions;
// http://docs.oracle.com/cd/B19306_01/server.102/b14200/sql_elements008.htm#sthref723
    protected $maxNameLengths = [
        'table' => 30,
        'column' => 30,
        'index' => 30,
        'alias' => 30
    ];
    protected $date_formats = [
        '%Y-%m-%d' => 'YYYY-MM-DD',
        '%Y-%m' => 'YYYY-MM',
        '%Y' => 'YYYY',
    ];

    /**
     * Capabilities this DB supports. Supported list:
     * affected_rows    Can report query affected rows for UPDATE/DELETE
     *                    implement getAffectedRowCount()
     * select_rows        Can report row count for SELECT
     *                    implement getRowCount()
     * case_sensitive    Supports case-sensitive text columns
     * fulltext            Supports fulltext search indexes
     * inline_keys        Supports defining keys together with the table
     * auto_increment_sequence Autoincrement support implemented as sequence
     * limit_subquery   Supports LIMIT clauses in subqueries
     * create_user        Can create users for Sugar
     * create_db        Can create databases
     * collation        Supports setting collations
     * disable_keys     Supports temporarily disabling keys (for upgrades, etc.)
     *
     * @abstract
     * Special cases:
     * fix:expandDatabase - needs expandDatabase fix, see expandDatabase.php
     * TODO: verify if we need these cases
     */
    protected $capabilities = [
        "affected_rows" => true,
        "case_sensitive" => true,
        "fulltext" => true,
        "auto_increment_sequence" => true,
        'limit_subquery' => true,
        "recursive_query" => true,
    ];
    protected $user_privileges = [
        "CREATE TABLE" => "CREATE TABLE",
        "DROP TABLE" => "DROP ANY TABLE",
        "INSERT" => "INSERT ANY TABLE",
        "UPDATE" => "UPDATE ANY TABLE",
        "SELECT" => "SELECT ANY TABLE",
        "DELETE" => "DELETE ANY TABLE",
        "ADD COLUMN" => "ALTER ANY TABLE",
        "CHANGE COLUMN" => "ALTER ANY TABLE",
        "DROP COLUMN" => "ALTER ANY TABLE",
    ];
// maybe this can help http://ss64.com/ora/syntax-datatypes.html
    protected $type_map = [
        'int' => 'number',
        'double' => 'number(38,10)',
        'float' => 'number(30,6)',
        'uint' => 'number(15)',
        'ulong' => 'number(38)',
        'long' => 'number(38)',
        'short' => 'number(3)',
        'varchar' => 'varchar2',
        'enum' => 'varchar2(255)',
        'relate' => 'varchar2',
        'text' => 'clob',
        'shorttext'=> 'varchar2(2000)',
        'longtext' => 'clob',
        'mediumtext' => 'clob',
        'multienum' => 'clob',
        'html' => 'clob',
        'longhtml' => 'clob',
        'date' => 'date',
        'datetime' => 'date',
        'datetimecombo' => 'date',
        'time' => 'date',
        'bool' => 'number(1)',
        'tinyint' => 'number(3)',
        'char' => 'char',
        'id' => 'varchar2(36)',
        'blob' => 'blob',
        'longblob' => 'blob',
        'currency' => 'number(26,6)',
        'decimal' => 'number(20,2)',
        'decimal2' => 'number(30,6)',
        'url' => 'varchar2',
        'encrypt' => 'varchar2(255)',
        'file' => 'varchar2(255)',
        'decimal_tpl' => 'number(%d, %d)',
    ];

    /**
     * holds a list of all indices
     *
     * @var
     */
    private $allIndices = false;

    public $transactional = false;


    //--------------------------------------------------------------------------
    //   Extended the functionality of implemented functions in DB Manager
    //--------------------------------------------------------------------------

    public function repairTableParams($tablename, $fielddefs, $indices, $execute = true, $engine = null)
    {
        return parent::repairTableParams($tablename, $fielddefs, $indices, $execute, $engine);
    }

    public function getAffectedRowCount($result)
    {
        return oci_num_rows($result);
    }

    public function truncateTableSQL($name)
    {
        return "TRUNCATE TABLE " . $name;
    }

    public function renameIndexDefs($old_definition, $new_definition, $table_name)
    {
        $old_definition['name'] = $this->getValidDBName($old_definition['name'], false, 'index');
        $new_definition['name'] = $this->getValidDBName($new_definition['name'], false, 'index');

        return "ALTER INDEX {$old_definition['name']} RENAME TO {$new_definition['name']}";
    }

    public function checkPrivilege($privilege)
    {
        if (!isset($this->user_privileges[$privilege])) {
            return parent::checkPrivilege($privilege);
        }

        $res = $this->getOne("SELECT PRIVILEGE p FROM SESSION_PRIVS WHERE PRIVILEGE = '" . $this->user_privileges[$privilege] . "'", false);

        return !empty($res);
    }

    public function getScriptName()
    {
        return "oracle";
    }

    public function isDatabaseNameValid($name)
    {
        // No special  chars
        return true;
    }

    public function canInstall()
    {
        $version = $this->version();

        if (empty($version)) {
            return ['ERR_DB_VERSION_FAILURE'];
        }

        if (version_compare($version, '9', '<')) {
            return ['ERR_DB_OCI8_VERSION', $version];
        }

        return true;
    }

//--------------------------------------------------------------------------
//   Overridden abstract function of DB Manager
//--------------------------------------------------------------------------

    public function quote($string)
    {
        if (is_array($string)) {
            return $this->arrayQuote($string);
        }

        return str_replace("'", "''", $this->quoteInternal($string));
    }

    /**
     * converts a value from user format into valid oracle format
     *
     * @see DBManager::convert()
     */
    public function convert($string, $type, array $additional_parameters = [])
    {
        if (!empty($additional_parameters)) {
            $additional_parameters_string = ',' . implode(',', $additional_parameters);
        } else {
            $additional_parameters_string = '';
        }

        $all_parameters = $additional_parameters;
        if (is_array($string)) {
            $all_parameters = array_merge($string, $all_parameters);
        } elseif (!is_null($string)) {
            array_unshift($all_parameters, $string);
        }

        switch (strtolower($type)) {
            case 'time':
                return "TO_DATE($string, 'HH24:MI:SS')";
            case 'date':
            case 'datetime':
                return "TO_DATE($string, 'YYYY-MM-DD HH24:MI:SS'$additional_parameters_string)";
            case 'today':
                return "SYSDATE";
            case 'left':
                return "LTRIM($string$additional_parameters_string)";
            case 'concat':
                // This function is equivalent to the concatenation operator (||).
                return implode("||", $all_parameters);
            case 'text2char':
                return "TO_CHAR($string)";
            case 'quarter':
                return "TO_CHAR($string, 'Q')";
            case "length":
                return "LENGTH($string)";
            case 'month':
                return "TO_CHAR($string, 'MM')";
            case 'add_time':
                return "$string + {$additional_parameters[0]}/24 + {$additional_parameters[1]}/1440";
            case 'add_tz_offset' :
                $getUserUTCOffset = $GLOBALS['timedate']->getUserUTCOffset();
                $operation = $getUserUTCOffset < 0 ? '-' : '+';

                return $string . ' ' . $operation . ' ' . abs($getUserUTCOffset) . '/1440';
            case 'time_format':
                if (empty($additional_parameters_string)) {
                    $additional_parameters_string = ",'HH24:MI:SS'";
                }

                return "TO_CHAR($string" . $additional_parameters_string . ")";
            case 'ifnull':
                if (empty($additional_parameters_string)) {
                    $additional_parameters_string = ",''";
                }

                return "NVL($string$additional_parameters_string)";
            case 'date_format':
                if (!empty($additional_parameters[0]) && $additional_parameters[0][0] == "'") {
                    $additional_parameters[0] = trim($additional_parameters[0], "'");
                }

                if (!empty($additional_parameters) && isset($this->date_formats[$additional_parameters[0]])) {
                    $format = $this->date_formats[$additional_parameters[0]];
                    return "TO_CHAR($string, '$format')";
                } else {
                    return "TO_CHAR($string, 'YYYY-MM-DD')";
                }
            case 'add_date':
                switch (strtolower($additional_parameters[1])) {
                    case 'quarter':
                        $additional_parameters[0] .= "*3";
                    // break missing intentionally
                    case 'month':
                        return "ADD_MONTHS($string, {$additional_parameters[0]})";
                    case 'week':
                        $additional_parameters[0] .= "*7";
                    // break missing intentionally
                    case 'day':
                        return "($string + $additional_parameters[0])";
                    case 'year':
                        return "ADD_MONTHS($string, {$additional_parameters[0]}*12)";
                }
                break;
        }

        // eliminate quotes if im trying to insert a function
        if (strpos($string, '()')) {
            return str_replace("'", "", $string);
        }

        return $string;
    }

    public function fromConvert($string, $type)
    {
        // YYYY-MM-DD HH:MM:SS
        $tmp = explode(' ', $string);
        switch ($type) {
            case 'date':
                return $tmp[0];
            case 'time':
                return $tmp[1];
        }

        return $string;
    }

    /**
     * Parses and runs queries
     *
     * @param string $sql SQL Statement to execute
     * @param bool $dieOnError True if we want to call die if the query returns errors
     * @param string $msg Message to log if error occurs
     * @param bool $suppress Flag to suppress all error output unless in debug logging mode.
     * @param bool $endSessionOnError True if we want to end the session if the query returns errors
     * @return resource result set
     */
    public function query($sql, $dieOnError = false, $msg = '', $suppress = false, $keepResult = false)
    {
        if (is_array($sql)) {
            return $this->queryArray($sql, $dieOnError, $msg, $suppress);
        }

        parent::countQuery($sql);

        $this->checkConnection();
        $this->query_time = microtime(true);
        $this->lastQuery = $sql;

        $this->log->info('EXECUTING Query: ' . $sql);

        $stmt = $suppress ? @oci_parse($this->database, $sql) : oci_parse($this->database, $sql);
        $exec_result = $suppress ? @oci_execute($stmt, $this->transactional ? OCI_DEFAULT : OCI_COMMIT_ON_SUCCESS) : oci_execute($stmt, $this->transactional ? OCI_DEFAULT : OCI_COMMIT_ON_SUCCESS);

        $this->query_time = microtime(true) - $this->query_time;

        // write a global querytime
        $GLOBALS['totalquerytime'] += $this->query_time;
        if ($this->query_time > 1000)
            LoggerManager::getLogger()->fatal('SLOW QUERY ' . $sql);

        if (!$exec_result) {
            if (!empty($stmt)) {
                $err = oci_error($stmt);

                if ($GLOBALS['trackdberrors']) {
                    $GLOBALS['trackeddberrors'][] = $err;
                }

                if ($err) {
                    $this->registerError($msg . ' Query Failed: ' . $sql, $err['code'] . "-" . $err['message'], $dieOnError);
                }
            }
        }

        if ($keepResult)
            $this->lastResult = $stmt;

        return $stmt;
    }

    /**
     * Runs a limit query: one where we specify where to start getting records and how many to get
     *
     * @param string $sql
     * @param int $start
     * @param int $count
     * @param boolean $dieOnError
     * @param string $msg
     * @param bool $execute optional, false if we just want to return the query
     * @return resource query result
     */
    public function limitQuery($sql, $start, $count, $dieOnError = false, $msg = '', $execute = true)
    {
        $start = (int)$start;
        $count = (int)$count;

        if ($count < 0) {
            $count = 1;
        }

        if ($start < 0) {
            $start = 0;
        }
        $start++;

        /**
         * Pagination with ROWNUM, nice articel of oracle community
         * http://www.oracle.com/technetwork/issue-archive/2006/06-sep/o56asktom-086197.html
         */
        //select *
        //from ( select /*+ FIRST_ROWS(n) */
        //a.*, ROWNUM rnum
        //from ( your_query_goes_here,
        //with order by ) a
        //where ROWNUM <=
        //:MAX_ROW_TO_FETCH )
        //where rnum  >= :MIN_ROW_TO_FETCH;
        //where 

        /**
         * FIRST_ROWS(N) tells the optimizer, "Hey, I'm interested in getting the first rows, and I'll get N of them as fast as possible."
         * :MAX_ROW_TO_FETCH is set to the last row of the result set to fetch—if you wanted rows 50 to 60 of the result set, you would set this to 60.
         * :MIN_ROW_TO_FETCH is set to the first row of the result set to fetch, so to get rows 50 to 60, you would set this to 50.
         */
        $sql = "SELECT * FROM (
				SELECT /*+ FIRST_ROWS(" . ($count - 1) . ")*/ sorted_tmp.*, ROWNUM rnum FROM (" . $sql . ") sorted_tmp 
				WHERE ROWNUM <= " . ($start + $count - 1) . ") 
				WHERE rnum >= " . $start;
        $this->lastsql = $sql;

        if (!empty(SpiceConfig::getInstance()->config['check_query'])) {
            $this->checkQuery($sql);
        }

        if (!$execute) {
            return $sql;
        }

        return $this->query($sql, $dieOnError, $msg);
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
        return oci_num_rows($result);
    }

    protected function freeDbResult($dbResult)
    {
        if (!empty($dbResult))
            oci_free_statement($dbResult);
    }

    /**
     * @param unknown $tablename
     * @param unknown $column
     * @param unknown $newname
     * @return string
     * @see DBManager::renameColumnSQL()
     *
     */
    public function renameColumnSQL($tablename, $column, $newname)
    {
        return "ALTER TABLE " . $tablename . " RENAME COLUMN '" . $column . "' TO '" . $newname . "'";
    }


    /**
     * loads all indices
     */
    private function get_all_indices(){
        $this->allIndices = [];

        $result = $this->query("SELECT  ui.table_name, ui.index_name, uc.constraint_type, uic.column_name FROM user_indexes ui INNER JOIN user_ind_columns uic ON uic.index_name = ui.index_name LEFT JOIN user_constraints uc ON uc.constraint_name = ui.index_name AND uc.table_name=ui.table_name WHERE ui.index_type='NORMAL'");
        while ($row = $this->fetchRow($result)) {
            $this->allIndices[] = $row;
        }
    }

    /**
     * returns the indexes from the fetched indexes
     *
     * @param $table_name
     * @return array
     */
    private function get_table_indices($table_name, $index_name = null){
        if($this->allIndices === false){
            $this->get_all_indices();
        }

        $retRows = [];

        foreach($this->allIndices as $index){
            if($index['table_name'] == $table_name && (!$index_name || ($index_name && $index['index_name']))){
                $retRows[] = $index;
            }
        }

        return $retRows;
    }

    /**
     * @param string $tablename
     * @param string $indexname
     * @return Ambigous <multitype:, string>
     * @see DBManager::get_indices()
     *
     */
    public function get_indices($tablename, $indexname = null)
    {
        $tablename = strtoupper($tablename);
        $indexname = strtoupper($this->getValidDBName($indexname, false, 'index'));

        $dbIndexes = $this->get_table_indices($tablename, $indexname);

        $indices = [];
        foreach($dbIndexes as $dbIndex){
            $name = strtolower($dbIndex['index_name']);

            $indices[$name]['name'] = $name;
            $indices[$name]['type'] = 'index';

            if ($dbIndex['constraint_type'] == 'P') {
                $indices[$name]['type'] = 'primary';
            }

            if ($dbIndex['constraint_type'] == 'U') {
                $indices[$name]['type'] = 'unique';
            }

            $indices[$name]['fields'][] = strtolower($dbIndex['column_name']);
        }

        return $indices;
    }


    /**
     * @param string $tablename
     * @return Ambigous <multitype:, string, unknown>
     * @see DBManager::get_columns()
     *
     */
    public function get_columns($tablename)
    {

        // http://ss64.com/orad/USER_TAB_COLUMNS.html
        $result = $this->query("SELECT * FROM user_tab_columns WHERE TABLE_NAME = '" . strtoupper($tablename) . "'");

        $columns = [];
        while ($row = $this->fetchRow($result)) {
            $name = strtolower($row['column_name']);

            $columns[$name]['name'] = $name;
            $columns[$name]['type'] = strtolower($row['data_type']);

            if ($columns[$name]['type'] == 'number') {
                $columns[$name]['len'] = (!empty($row['data_precision']) ? $row['data_precision'] : '38');

                if (!empty($row['data_scale'])) {
                    $columns[$name]['len'] .= ',' . $row['data_scale'];
                }
            } elseif (in_array($columns[$name]['type'], ['date', 'clob', 'blob'])) {
                // do nothing
            } else {
                $columns[$name]['len'] = strtolower($row['char_length']);
            }

            if (!empty($row['data_default'])) {
                $matches = [];
                $row['data_default'] = html_entity_decode($row['data_default'], ENT_QUOTES);

                if (preg_match("/^'(.*)'$/i", $row['data_default'], $matches)) {
                    $columns[$name]['default'] = $matches[1];
                }
            }

            if ($row['nullable'] == 'N') {
                $columns[$name]['required'] = 'true';
            }
        }

        return $columns;
    }

    /**
     * @see DBManager::add_drop_constraint()
     */
    public function add_drop_constraint($table, $definition, $drop = false)
    {
        $fields = is_array($definition['fields']) ? implode(',', $definition['fields']) : $definition['fields'];
        $name = $this->getValidDBName($definition['name'], false, 'index');

//        if (!$drop && $this->indexExists($table, $name, $definition['fields'])) {
//            return "";
//        }
        $indices = $this->get_indices($table, $name);

        if (!$drop && !empty($indices)) {
            return "";
        }

        $sql = '';
        switch ($definition['type']) {
            case 'index':
            case 'alternate_key':
            case 'clustered':
                if ($drop)
                    $sql = "DROP INDEX {$name}";
                else
                    $sql = "CREATE INDEX {$name} ON {$table} ({$fields})";
                break;
            case 'unique':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP CONSTRAINT {$name}";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name} UNIQUE ({$fields})";
                break;
            case 'primary':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP PRIMARY KEY CASCADE";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name} PRIMARY KEY ({$fields})";
                break;
            case 'foreign':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP FOREIGN KEY ({$fields})";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name} FOREIGN KEY ({$fields}) REFERENCES {$definition['foreignTable']}({$definition['foreignField']})";
                break;
        }

        return $sql;
    }

    public function indexExists($tablename, $index_name, $fields)
    {
        //If index already exist with the same name on the table
        $res = $this->getOne("SELECT index_name FROM user_indexes WHERE index_name = '" . $index_name . "' AND table_name='" . $tablename . "' AND index_type='NORMAL'");

        if ($res) {
            return true;
        }

        //If any of the column is already indexed
        foreach ($fields as $field) {
            //If column is a number no need to create index.
            $res = $this->getOne("SELECT data_type FROM user_tab_columns WHERE TABLE_NAME = '" . strtoupper($tablename) . "' AND lower(data_type) like '%number%' AND lower(column_name) = '" . $field . "'");
            if ($res) {
                return true;
            }

            $res = $this->getOne("SELECT ui.index_name FROM user_indexes ui INNER JOIN user_ind_columns uic ON uic.index_name = ui.index_name AND uic.column_name = '" . $field . "' WHERE ui.table_name='" . $tablename . "' AND ui.index_type='NORMAL'");

            if ($res) {
                return true;
            }
        }

        return false;
    }

    public function getFieldsArray($result, $make_lower_case = false)
    {
        $field_array = [];

        $totalFields = oci_num_fields($result);

        for ($i = 1; $i <= $totalFields; $i++) {
            $fieldName = oci_field_name($result, $i);

            if ($make_lower_case) {
                $fieldName = strtolower($fieldName);
            }

            $field_array[] = $fieldName;
        }

        return $field_array;
    }

    public function getTablesArray()
    {
        return $this->getTableNames();
    }

    function getTableNames($where = '')
    {
        $res = $this->query('SELECT TABLE_NAME FROM USER_TABLES ' . $where);

        $tables = [];
        while ($row = $this->fetchRow($res)) {
            $table_name = '';

            if (isset($row['table_name'])) {
                $table_name = $row['table_name'];
            }

            if (isset($row['TABLE_NAME'])) {
                $table_name = $row['TABLE_NAME'];
            }

            $tables[] = $table_name;
        }

        return $tables;
    }

    public function version()
    {
        return $this->getOne("SELECT version FROM product_component_version WHERE product like '%Oracle%'");
    }

    public function tableExists($tableName)
    {
        $tables = $this->getTablesArray();

        if (in_array($tableName, $tables))
            return true;
        if (in_array(strtolower($tableName), $tables))
            return true;
        if (in_array(strtoupper($tableName), $tables))
            return true;

        return false;
    }

    //Changing to lower case to execute most cases as oracle converts everything to upper case
    //Should parse SQL and populate array of alias and then render proper row of case senstive
    public function fetchRow($result)
    {
        $row = oci_fetch_assoc($result);

        if ($row) {
            $new_row = [];

            foreach ($row as $k => $v) {
                if (is_object($v)) {
                    $v = $v->read($v->size());
                }
                $new_row[strtolower($k)] = $v;
            }

            return $new_row;
        }

        return $row;
    }

    public function fetchByAssoc($result, $encode = null)
    {
        $row = oci_fetch_assoc($result);

        if ($row) {
            $new_row = [];

            foreach ($row as $k => $v) {
                if (is_object($v)) {
                    $v = $v->read($v->size());
                }
                $new_row[strtolower($k)] = $v;
            }

            return $new_row;
        }

        return $row;
    }

    public function connect(array $configOptions = null, $dieOnError = false)
    {
        

        if (!$configOptions)
            $configOptions = SpiceConfig::getInstance()->config['dbconfig'];

        $this->configOptions = $configOptions;

        if (!empty($configOptions['charset'])) {
            $charset = $configOptions['charset'];
        } else {
            $charset = $this->getOption('charset');
        }

        if (empty($charset)) {
            $charset = "AL32UTF8";
        }

        if ($this->getOption('persistent')) {
            $this->database = oci_pconnect($configOptions['db_user_name'], $configOptions['db_password'], $configOptions['db_name'], $charset);
        }

        if (!$this->database) {
            $this->database = oci_connect($configOptions['db_user_name'], $configOptions['db_password'], $configOptions['db_name'], $charset);
            if (!$this->database) {
                if ($dieOnError) {
                    if (isset($GLOBALS['app_strings']['ERR_NO_DB'])) {
                        sugar_die($GLOBALS['app_strings']['ERR_NO_DB']);
                    } else {
                        sugar_die("Could not connect to the database. Please refer to sugarcrm.log for details.");
                    }
                } else {
                    return false;
                }
            }
            if ($this->database && $this->getOption('persistent')) {
                $_SESSION['administrator_error'] = "<B>Severe Performance Degradation: Persistent Database Connections not working.  Please set ". SpiceConfig::getInstance()->config['dbconfigoption']['persistent']." to false in your config.php file</B>";
            }
        }

        //Changing oracle Date formates to force sugar DB format
        $session_query = "ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD hh24:mi:ss' QUERY_REWRITE_INTEGRITY = TRUSTED	QUERY_REWRITE_ENABLED = TRUE NLS_LENGTH_SEMANTICS=CHAR";

        $collation = $this->getOption('collation');
        if (!empty($collation)) {
            $session_query .= " NLS_COMP=LINGUISTIC"; // NLS_SORT=" . $collation;
        } else if (!empty(SpiceConfig::getInstance()->config['oracle_enable_ci']) || $this->getOption('enable_ci')) {
            $session_query .= " NLS_COMP=LINGUISTIC NLS_SORT=BINARY_CI";
        }
        $this->query($session_query);

        if (!empty($configOptions['db_schema'])) {
            $session_query = "ALTER SESSION SET CURRENT_SCHEMA = " . $configOptions['db_schema'];
            $this->query($session_query);
        }

        $this->checkError('Could Not Connect', $dieOnError);

        return true;
    }

    protected function oneColumnSQLRep($fieldDef, $ignoreRequired = false, $table = '', $return_as_array = false)
    {
        $name = $fieldDef['name'];
        $type = $this->getFieldType($fieldDef);
        $colType = $this->getColumnType($type);

        if ($parts = $this->getTypeParts($colType)) {
            $colBaseType = $parts['baseType'];
            $defLen = isset($parts['len']) ? $parts['len'] : '255'; // Use the mappings length (precision) as default if it exists
        }

        // needed to be overwritten, because oracle has default the BYTE type for alpha numerical columns
        // UTF8 uses multibyte for characters, which can lead to overflow issues therefore the size must be mapped to CHAR
        if (!empty($fieldDef['len'])) {
            if (in_array($colBaseType, ['nvarchar', 'nchar', 'varchar', 'varchar2', 'char',
                'clob', 'blob', 'text'])) {
                $colType = "$colBaseType(${fieldDef['len']} CHAR)";
            } elseif (($colBaseType == 'decimal' || $colBaseType == 'float')) {
                if (!empty($fieldDef['precision']) && is_numeric($fieldDef['precision']))
                    if (strpos($fieldDef['len'], ',') === false) {
                        $colType = $colBaseType . "(" . $fieldDef['len'] . "," . $fieldDef['precision'] . ")";
                    } else {
                        $colType = $colBaseType . "(" . $fieldDef['len'] . ")";
                    } else
                    $colType = $colBaseType . "(" . $fieldDef['len'] . ")";
            }
        } else {
            if (in_array($colBaseType, ['nvarchar', 'nchar', 'varchar', 'varchar2', 'char'])) {
                $colType = "$colBaseType($defLen CHAR)";
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
        // If the field is marked both required & isnull=>false - always make it not null
        // Use this to ensure primary key fields never defined as null
        if (isset($fieldDef['isnull']) && (strtolower($fieldDef['isnull']) == 'false' || $fieldDef['isnull'] === false) && !empty($fieldDef['required'])) {
            $required = "NOT NULL";
        }
        if ($ignoreRequired)
            $required = "";

        if ($return_as_array) {
            return [
                'name' => $name,
                'colType' => $colType,
                'colBaseType' => $colBaseType, // Adding base type for easier processing in derived classes
                'default' => $default,
                'required' => $required,
                'auto_increment' => $auto_increment,
                'full' => "$name $colType $default $required $auto_increment",
            ];
        } else {
            return "$name $colType $default $required $auto_increment";
        }
    }

    public function createTableSQLParams($tablename, $fieldDefs, $indices)
    {
        $columns = $this->columnSQLRep($fieldDefs, false, $tablename);

        if (empty($columns))
            return false;
        //echo print_r(oci_error());
        //echo "CREATE TABLE $tablename ($columns)<hr><hr>";
        return "CREATE TABLE $tablename ($columns)";
    }

    protected function changeColumnSQL($tablename, $fieldDefs, $action, $ignoreRequired = false)
    {
        $action = strtoupper($action);

        $columns = "";

        //if the provided columns are more then one
        if ($this->isFieldArray($fieldDefs)) {
            foreach ($fieldDefs as $def) {
                if (!empty($columns) && trim($columns) != "")
                    $columns .= ",";

                $columns .= $this->buildAlterColumnSQL($tablename, $def, $action, $ignoreRequired);

                //removing spaces
                $columns = trim($columns);
            }
        } else {
            $columns = $this->buildAlterColumnSQL($tablename, $fieldDefs, $action, $ignoreRequired);
        }

        if ($action == 'DROP')
            $action = 'DROP COLUMN';

        return (!empty($columns) && trim($columns) != "") ? "ALTER TABLE $tablename $action ($columns)" : "";
    }

    protected function buildAlterColumnSQL($tablename, $fieldDef, $action, $ignoreRequired = false)
    {
        $fieldDef['isnull'] = $this->isNullable($fieldDef);

        //return column name in case of drop
        if (trim($action) == 'DROP') {
            return $fieldDef['name'];
        }

        $tableVals = $this->describeField($fieldDef['name'], $tablename);
        $retArr = $this->oneColumnSQLRep($fieldDef, $ignoreRequired, $tablename, true);

        if (trim($action) == 'MODIFY') {
            if ($retArr['colType'] == 'blob' || $retArr['colType'] == 'clob') {
                // we can not change the type of blob and clob
                $retArr['colType'] = '';
            }

            if ($fieldDef['required']) {
                $fieldDef['required'] = 'true';
            } else {
                $fieldDef['required'] = 'false';
            }

            if (!isset($tableVals['required']) || empty($tableVals['required'])) {
                $tableVals['required'] = 'false';
            }

            if (!isset($tableVals['default'])) {
                $tableVals['default'] = '';
            }

            //If required value does not change
            if ($fieldDef['required'] == $tableVals['required']) {
                $retArr['required'] = "";
            }

            //If default value is same
            if ($fieldDef['default'] == $tableVals['default']) {
                $retArr['default'] = "";
            }
        }

        //If default and required and type are empty
        if (trim($retArr['colType']) == "" && trim($retArr['default']) == "" && trim($retArr['required']) == "") {
            return "";
        }

        //return in this format (name varchar DEFAULT 0 NULL)
        return $retArr['name'] . " " . $retArr['colType'] . " " . $retArr['default'] . " " . $retArr['required'] . " " . $retArr['auto_increment'];
    }

    public function disconnect()
    {
        if (!empty($this->database)) {
            $this->freeResult();
            oci_close($this->database);
            $this->database = null;
        }
    }

    public function lastDbError($ressource = null)
    {
        if (!$ressource) $ressource = $this->db;

        $err = oci_error($ressource);

        if (is_array($err)) {
            return sprintf("Oracle ERROR %d: %s in %d of [%s]", $err['code'], $err['message'], $err['offset'], $err['sqltext']);
        }

        return false;
    }

    public function validateQuery($query)
    {
        $stmt = @oci_parse($this->database, $query);

        if (!$stmt)
            return false;

        return true;
    }

    public function valid()
    {
        return function_exists("oci_pconnect");
    }

    public function dbExists($dbname)
    {
        // Connection is made directly to DB
        return true;
    }

    public function tablesLike($like)
    {
        return $this->getTableNames('WHERE TABLE_NAME LIKE ' . $this->quoted(strtoupper($like)));
    }

    public function createDatabase($dbname)
    {
        //admin needs to do it
        return true;
    }

    public function dropDatabase($dbname)
    {
        //cannot drop DB
        return true;
    }

    public function getDbInfo()
    {
        return [
            "Server version" => @oci_server_version($this->database),
        ];
    }

    public function userExists($dbname)
    {
        // connection is made directly using user
        return true;
    }

    public function createDbUser($database_name, $host_name, $user, $password)
    {
        //Admin needs to do it
        return true;
    }

    public function full_text_indexing_installed()
    {
        //oracle support full text indexing by deafult
        return true;
    }

    /**
     * http://www.oracle-base.com/articles/9i/full-text-indexing-using-oracle-text-9i.php
     * http://docs.oracle.com/cd/B28359_01/text.111/b28304/cqoper.htm#CHDEGDDF
     * oracle online documentation
     *
     * Generate fulltext query from set of terms
     * @param string $field Field to search against
     * @param array $terms Search terms that may be or not be in the result
     * @param array $must_terms Search terms that have to be in the result
     * @param array $exclude_terms Search terms that have to be not in the result
     */
    public function getFulltextQuery($field, $terms, $must_terms = [], $exclude_terms = [], $label = 1)
    {
        $condition = $or_condition = [];
        foreach ($must_terms as $term) {
            $condition[] = $this->quoteTerm($term);
        }

        foreach ($terms as $term) {
            $or_condition[] = $this->quoteTerm($term);
        }

        if (!empty($or_condition)) {
            $condition[] = " & (" . join(" | ", $or_condition) . ")";
        }

        foreach ($exclude_terms as $term) {
            $condition[] = "~" . $this->quoteTerm($term);
        }

        $condition = $this->quoted(join(" & ", $condition));

        return "CONTAINS($field, $condition, $label) > 0";
    }

    /**
     * be aware: if u are searching for "*" it will be replaced as wel into wildcard "%" !!!
     * thats ugly, but right now I dont have any solution to search sth like "My 5*Hotel" instead of " My 5%Hotel"
     *
     * @param string $term
     * @return string
     */
    private function quoteTerm($term)
    {
        //oracle doesnot support *
        $term = str_replace("*", "%", $term);

        return "{" . $term . "}";
    }

    public function installConfig()
    {
        return [
            'LBL_DBCONFIG_ORACLE' => [
                "setup_db_database_name" => ["label" => 'LBL_DBCONF_DB_NAME', "required" => true],
                "setup_db_host_name" => false,
                'setup_db_create_sugarsales_user' => false,
            ],
            'LBL_DBCONFIG_B_MSG1' => [
                "setup_db_admin_user_name" => ["label" => 'LBL_DBCONF_DB_ADMIN_USER', "required" => true],
                "setup_db_admin_password" => ["label" => 'LBL_DBCONF_DB_ADMIN_PASSWORD', "type" => "password"],
            ],
        ];
    }

    /**
     * The DUAL table is a special one-column table present by default in all Oracle database installations.
     * It is suitable for use in selecting a pseudocolumn such as SYSDATE or USER.
     * The table has a single VARCHAR2(1) column called DUMMY that has a value of 'X'.
     * @return string
     * @see DBManager::getFromDummyTable()
     */
    public function getFromDummyTable()
    {
        return "FROM dual";
    }

    public function getGuidSQL()
    {
        return "'" . create_guid_section(3) . "-' || sys_guid()";
    }

    /**
     * Returns a DB specific piece of SQL which will generate a datetiem repesenting now
     * @abstract
     * @return string
     */
    public function getNowSQL(){
        return 'SYSDATE';
    }

    /**
     * @see DBHelper::getAutoIncrement()
     */
    public function getAutoIncrementSQL($table, $field_name)
    {
        return $this->_getSequenceName($table, $field_name, true) . '.nextval';
    }

    /**
     * Generate an Oracle SEQUENCE name. If the length of the sequence names exceeds a certain amount
     * we will use an md5 of the field name to shorten.
     *
     * @param string $table
     * @param string $field_name
     * @param boolean $upper_case
     * @return string
     */
    protected function _getSequenceName($table, $field_name, $upper_case = true)
    {
        $sequence_name = $this->getValidDBName($table . '_' . $field_name . '_seq', false, 'index');
        if ($upper_case) {
            $sequence_name = strtoupper($sequence_name);
        }
        return $sequence_name;
    }

    /**
     * Returns true if the sequence name given is found
     *
     * @param string $name
     * @return bool   true if the sequence is found, false otherwise
     */
    private function _findSequence($name)
    {
        
        $db_user_name = isset(SpiceConfig::getInstance()->config['dbconfig']['db_user_name']) ? SpiceConfig::getInstance()->config['dbconfig']['db_user_name'] : '';
        $db_user_name = strtoupper($db_user_name);
        $uname = strtoupper($name);
        $result = $this->query("SELECT SEQUENCE_NAME FROM ALL_SEQUENCES WHERE SEQUENCE_OWNER='$db_user_name' AND SEQUENCE_NAME = '$uname'");
        if (empty($result)) {
            return false;
        }
        $row = $this->fetchByAssoc($result);
        return !empty($row);
    }

    /**
     * @see DBHelper::getAutoIncrement()
     */
    public function getAutoIncrement($table, $field_name)
    {
        $result = $this->query("SELECT max($field_name) currval FROM $table");
        $row = $this->fetchByAssoc($result);
        if (!empty($row['currval'])) {
            return $row['currval'] + 1;
        }
        return "";
    }

    /**
     * @see DBHelper::setAutoIncrement()
     */
    protected function setAutoIncrement($table, $field_name)
    {
        $this->deleteAutoIncrement($table, $field_name);
        $this->query(
            'CREATE SEQUENCE ' . $this->_getSequenceName($table, $field_name, true) .
            ' START WITH 1 increment by 1 nomaxvalue minvalue 1');
        $this->query(
            'SELECT ' . $this->_getSequenceName($table, $field_name, true) .
            '.NEXTVAL FROM DUAL');
        return "";
    }

    /**
     * Sets the next auto-increment value of a column to a specific value.
     *
     * @param string $table tablename
     * @param string $field_name
     */
    public function setAutoIncrementStart($table, $field_name, $start_value)
    {
        $sequence_name = $this->_getSequenceName($table, $field_name, true);
        $result = $this->query("SELECT {$sequence_name}.NEXTVAL currval FROM DUAL");
        $row = $this->fetchByAssoc($result);
        $current = $row['currval'];
        $change = $start_value - $current - 1;
        $this->query("ALTER SEQUENCE {$sequence_name} INCREMENT BY $change");
        $this->query("SELECT {$sequence_name}.NEXTVAL FROM DUAL");
        $this->query("ALTER SEQUENCE {$sequence_name} INCREMENT BY 1");
        return true;
    }

    /**
     * @see DBHelper::deleteAutoIncrement()
     */
    public function deleteAutoIncrement($table, $field_name)
    {
        $sequence_name = $this->_getSequenceName($table, $field_name, true);
        if ($this->_findSequence($sequence_name)) {
            $this->query('DROP SEQUENCE ' . $sequence_name);
        }
    }

    /**
     * @see DBManager::insert()
     */
    public function insert(SugarBean $bean)
    {

        // clone the bean for kicking out text fields and other potential LOB candidates
        $tmp = clone($bean);
        $tmp2 = clone($bean);
        foreach ($bean->field_defs as $field => $def) {

            if (!empty($bean->{$field})) {
                if (isset($def['source']) && $def['source'] != 'db') {
                    continue;
                }

                if ($this->isTextType($def['type'])) {
                    // clean the incoming value...
                    // actually was a bug before, because sugar took the direct bean value and opened everything instead of escaping
                    $tmp2->{$field} = from_html($bean->{$field});
                    $tmp->{$field} = $this->getEmptyClob();
                    $lob_fields[$field] = ":" . $field;
                    $lob_dataType[$field] = OCI_B_CLOB;
                } else if ($this->getColumnType($def['type']) == 'blob') {
                    $tmp2->{$field} = from_html($bean->{$field});
                    $tmp->{$field} = $this->getEmptyBlob();
                    $lob_fields[$field] = ":" . $field;
                    $lob_dataType[$field] = OCI_B_BLOB;
                } else {
                    // we just need lob fields
                    unset($tmp2->{$field});
                    continue;
                }
            }
        }

        $sql = $this->insertSQL($tmp);
        $this->tableName = $bean->getTableName();
        // now prepare the final sql and set back any LOB candidate field by cached tmp bean
        $result = $this->oracleLOBBackDoor($sql, get_object_vars($tmp2), $lob_fields, $lob_dataType);

        if (!$result) {
            $this->log->error("Oracle INSERT RAISED result error: " . $sql);
        }


        $msg = "Error inserting into table Oracle: " . $this->tableName;
        $this->checkError($msg . ' Query Failed: ' . $sql, true);
    }

    /**
     * @see DBManager::update()
     */
    public function update(SugarBean $bean, array $where = [])
    {

        // clone the bean for kicking out text fields and other potential LOB candidates
        $tmp = clone($bean);
        $tmp2 = clone($bean);
        $lob_fields = [];
        $lob_dataType = [];
        foreach ($bean->field_defs as $field => $def) {

            if (!empty($bean->{$field})) {
                if (isset($def['source']) && $def['source'] != 'db') {
                    continue;
                }
                //generate lob
                if ($this->isTextType($def['type'])) {
                    // clean the incoming value...
                    // actually was a bug before, because sugar took the direct bean value and opened everything instead of escaping
                    $tmp2->{$field} = from_html($bean->{$field});
                    $tmp->{$field} = $this->getEmptyClob();
                    $lob_fields[$field] = ":" . $field;
                    $lob_dataType[$field] = OCI_B_CLOB; // value is 112
                } else if ($this->getColumnType($def['type']) == 'blob') {
                    $tmp2->{$field} = from_html($bean->{$field});
                    $tmp->{$field} = $this->getEmptyBlob();
                    $lob_fields[$field] = ":" . $field;
                    $lob_dataType[$field] = OCI_B_BLOB; // value is 113
                } else {
                    // we just need lob fields
                    unset($tmp2->{$field});
                    continue;
                }
            }
        }

        $sql = $this->updateSQL($tmp, $where);
        $this->tableName = $bean->getTableName();
        $result = $this->oracleLOBBackDoor($sql, get_object_vars($tmp2), $lob_fields, $lob_dataType);

        if (!$result) {
            $this->log->error("Oracle UPDATE RAISED result error: " . $sql);
        }

        $msg = "Error updating table Oracle: " . $this->tableName;
        $this->checkError($msg . ' Query Failed: ' . $sql, true);
    }

    /**f
     * (non-PHPdoc)
     * @see DBManager::insertParams()
     */
    public
    function insertParams($table, $field_defs, $data, $field_map = null, $execute = true)
    {
        //  $execute = false; // always false, becasue direct execute is forbidden here
        $sql = parent::insertParams($table, $field_defs, $data, $field_map, false);
        return $sql;
    }

    /**
     * @see DBManager::deleteParams()
     */
    public
    function deleteParams($table, $where, $execute = true)
    {
        if (empty($where))
            return false;

        // get the entire sql
        if (is_array($where)) {
            foreach ($where as $key => $val) {
                $pks[] = "$key = '{$this->quote($val)}'";
            }
            $where = implode(' AND ', $pks);
        }
        $query = "DELETE FROM $table WHERE " . $where;

        return $execute ? $this->query($query) : $query;
    }

    /**
     * @see DBManager::insertQuery()
     */
    public function insertQuery($table, array $data, $execute = true)
    {
        global $dictionary;
        $copy = array_merge([], $data);
        $lob_fields = [];
        $lob_dataType = [];
        // find the dictionary table
        foreach ($dictionary as $dictionaryName => $dictionaryDefs) {
            if ($dictionaryDefs['table'] == $table) {
                foreach ($dictionaryDefs['fields'] as $field => $vardef) {
                    if ($this->type_map[$vardef['type']] == 'clob') {
                        $copy[$field] = from_html($data[$field]);
                        $data[$field] = $this->getEmptyClob();
                        $lob_fields[$field] = ":" . $field;
                        $lob_dataType[$field] = OCI_B_CLOB;
                    } elseif ($vardef['type'] == 'blob') {
                        $data[$field] = $this->getEmptyBlob();
                        $lob_fields[$field] = ":" . $field;
                        $lob_dataType[$field] = OCI_B_CLOB;
                    }
                }
                $sql = $this->insertParams($table, $dictionaryDefs['fields'], $data, null, $execute);
                $res = $this->oracleLOBBackDoor($sql, $copy, $lob_fields, $lob_dataType);
                if (!$res) {
                    $this->log->error("Oracle INSERT RAISED result error: " . $sql);
                }
            }
        }

        return $data['id'];
    }

    /**
     * custom function, to update an existing record in db, no warranty
     * created by sebastian franz
     * @param string $table the table name
     * @param array $pks key/value pairs of primary/unique keys
     * @param array $data key/values of fields to update
     * @return bool query result
     */
    public function updateQuery($table, array $pks, array $data, $execute = true)
    {
        global $dictionary;
        $retVal = false;

        $copy = array_merge([], $data);
        $lob_fields = [];
        $lob_dataType = [];

        foreach ($dictionary as $dictionaryName => $dictionaryDefs) {
            if ($dictionaryDefs['table'] == $table) {


                foreach ($data as $key => $val) {
                    // get the vardefs
                    $vardef = $dictionaryDefs['fields'][$key];
                    if(!$vardef) continue;

                    if (!empty($val) && $this->type_map[$vardef['type']] == 'clob') {
                        $copy[$key] = from_html($val);
                        $sets[] = "$key = {$this->getEmptyClob()}";
                        $lob_fields[$key] = ":" . $key;
                        $lob_dataType[$key] = OCI_B_CLOB;
                    } elseif (!empty($val) && $vardef['type'] == 'blob') {
                        $sets[] = "$key = {$this->getEmptyBlob()}";
                        $lob_fields[$key] = ":" . $key;
                        $lob_dataType[$key] = OCI_B_CLOB;
                    } else {
                        $sets[] = "$key = '{$this->quote($val)}'";
                    }
                }

                foreach ($pks as $key => $val) {
                    $wheres[] = "$key = '{$this->quote($val)}'";
                }

                $query = "UPDATE $table SET " . implode(',', $sets) . " WHERE " . implode(' AND ', $wheres);
                $retVal = $this->oracleLOBBackDoor($query, $copy, $lob_fields, $lob_dataType);

            }
        }
        return $retVal;
    }

    /**
     * @see DBManager::upsertQuery()
     */
    public function upsertQuery($table, array $pks, array $data, bool $execute = true)
    {

        $query = $this->query("SELECT id FROM " . $table . " WHERE id = '" . $pks['id'] . "'");
        while ($row = $this->fetchByAssoc($query)) {
            $id = $row['id'];
        }

        if (!empty($id)) {
            foreach ($data as $col => $val) {
                $sets[] = "$col = '{$this->quote($val)}'";
            }
            return $this->updateQuery($table, $pks, $data);
            // $this->query("UPDATE " . $table . " SET " . implode(',', $sets) . " WHERE id = '" . $pks['id'] . "'");
        } else {
            return $this->insertQuery($table, $data, $execute);
        }
    }

    /**
     * Does this type represent text (i.e., non-varchar) value?
     * @param string $type
     */
    public
    function isTextType($type)
    {
        $type = strtolower($type);
        return ($type == 'clob' || $this->getColumnType($type) == 'clob');
    }

    protected
    function isNullable($vardef)
    {
        // text is blank in oracle
        if (!empty($vardef['type']) && $this->isTextType($vardef['type'])) {
            return false;
        }
        return parent::isNullable($vardef);
    }

    /**
     * Executes a query, with special handling for Oracle CLOB and BLOB field type
     *
     * Oracle seems to need special treatment for BLOB/CLOB insertion, so this method
     * inserts BLOB data properly.
     *
     * @param string $sql
     * @param array $lob_data
     * @param array $lob_fields
     * @param array $lob_dataType
     * @return boolean
     */
    protected
    function oracleLOBBackDoor($sql, $lob_data, $lob_fields = [], $lob_dataType = [])
    {

        $this->checkConnection();
        if (empty($sql)) {
            return false;
        }

        if (count($lob_fields) > 0) {
            // perform the sql and return the wanted column into an oracle variable represented by ":" in order to use it later on
            $sql .= " RETURNING " . implode(",", array_keys($lob_fields)) . ' INTO ' . implode(",", array_values($lob_fields));
        }

        $this->log->info("Oracle Execute: $sql");
        $stmt = oci_parse($this->database, $sql);
        if ($this->checkError("Update parse failed: $sql", false)) {
            $this->log->info("Oracle Execute ERROR RAISED !!!");
            return false;
        }

        $lobs = [];
        if (count($lob_fields) > 0) {
            foreach ($lob_fields as $field => $descriptor) {
                if (isset($lob_dataType[$field])) {
                    $newlob = oci_new_descriptor($this->database, OCI_DTYPE_LOB);
                    /* from which oracle resource, which oracle variable, into which php variable, maxlength, which oracel datatype
                     *
                     * If you need to bind an abstract datatype (CLOB/NCLOB/BLOB/ROWID/BFILE) you need to allocate it first using the
                     * oci_new_descriptor function. They are located inside the temporary tablespace and should receive an uniqe resource identifier.
                     * The length is not used for abstract datatypes and should be set to -1.
                     */
                    oci_bind_by_name($stmt, $descriptor, $newlob, -1, $lob_dataType[$field]);
                    $lobs[$field] = $newlob;
                }
            }
        }

        $result = false;
        oci_execute($stmt, OCI_DEFAULT);
        if (!$this->checkError("Update execute failed: $sql", false, $stmt)) {

            if (count($lobs) > 0) {
                foreach ($lobs as $field => $lob) {
                    // deprecated previous alias ocisavelob($lob, $val);
                    // save the actual value stored inside the orcale variable reference by reassigning it
                    // because we returned the values before into heap, we can now overwrite them and did a backdoor to the 1k signs cap
                    if ($lob->save($lob_data[$field])) {
                        $this->log->info("saved LOB content of " . $field . " directly: " . $lob_data[$field]);
                    } else {
                        $this->log->info("not saved LOB content of " . $field . " directly: " . $lob_data[$field]);
                    }
                }
            }
            if(!$this->transactional) {
                $result = oci_commit($this->database);
            } else {
                $result = true;
            }
            $this->checkError();
            $this->log->info("Oracle Execute COMMITTED");
        }

        // free all the lobs.
        if (count($lobs) > 0) {
            foreach ($lobs as $lob) {
                $lob->free();
            }
        }
        oci_free_statement($stmt);

        return $result;
    }

    /**
     * Checks for error happening in the database
     *
     * @param string $msg message to prepend to the error message
     * @param bool $dieOnError true if we want to die immediately on error
     * @return bool True if there was an error
     */
    public
    function checkError($msg = '', $dieOnError = false, $ressource = null)
    {

        $dberror = $this->lastDbError($ressource);
        if ($dberror === false) {
            $this->last_error = false;
            return false;
        }

        $this->registerError($msg, $dberror, $dieOnError);

        return true;
    }


    public
    function queryOnly($sql, $suppress = false)
    {
        // TODO: Implement queryOnly() method.
    }

    public
    function get_columns_list($tablename, $delimiter = ', ', $fallback = '*')
    {
        // TODO: Implement get_columns_list() method.
    }

    /**
     * getter for empty blob
     * @return string
     */
    public
    function getEmptyBlob()
    {
        return "EMPTY_BLOB()";
    }

    /**
     * getter for empty clob
     * @return string
     */
    public
    function getEmptyClob()
    {
        return "EMPTY_CLOB()";
    }

    /**
     * @return resource
     */
    public
    function transactionStart()
    {
        return $this->transactional = true;
    }

    /**
     * @return resource
     */
    public
    function transactionCommit()
    {
        return $this->query('COMMIT');
    }

    /**
     * @return resource
     */
    public
    function transactionRollback()
    {
        return $this->query('ROLLBACK');
    }

    /**
     * @inheritDoc
     */
    public function convertDBCharset(string $charset, string $collation): bool {
        throw new Exception('Database charset conversion not available for OCI8.');
    }

    /**
     * @inheritDoc
     */
    public function convertTableCharset(string $tableName, string $charset, string $collation): bool {
        throw new Exception('Table charset conversion not available for OCI8.');
    }

    /**
     * @inheritDoc
     */
    public function getDatabaseCharsetInfo(): array {
        throw new Exception('Retrieving database charset not available for OCI8.');
    }
}

?>
