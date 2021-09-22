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
use SpiceCRM\includes\ErrorHandlers\Exception;
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
* getTableName()	        	Returns table name of the object.
* getFieldDefinitions()	    	Returns a collection of field definitions in order.
* getFieldDefintion(name)		Return field definition for the field.
* getFieldValue(name)	    	Returns the value of the field identified by name.
*                           	If the field is not set, the function will return boolean FALSE.
* getPrimaryFieldDefinition()	Returns the field definition for primary key
*
* The field definition is an array with the following keys:
*
* name 		This represents name of the field. This is a required field.
* type 		This represents type of the field. This is a required field and valid values are:
*      		int
*      		long
*      		varchar
*      		text
*      		date
*      		datetime
*      		double
*      		float
*      		uint
*      		ulong
*      		time
*      		short
*      		enum
* length	This is used only when the type is varchar and denotes the length of the string.
*  			The max value is 255.
* enumvals  This is a list of valid values for an enum separated by "|".
*			It is used only if the type is ?enum?;
* required	This field dictates whether it is a required value.
*			The default value is ?FALSE?.
* isPrimary	This field identifies the primary key of the table.
*			If none of the fields have this flag set to ?TRUE?,
*			the first field definition is assume to be the primary key.
*			Default value for this field is ?FALSE?.
* default	This field sets the default value for the field definition.
*
*
* Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
* All Rights Reserved.
* Contributor(s): ______________________________________..
********************************************************************************/

/**
 * SQL Server (sqlsrv) manager
 */
class SqlsrvManager extends DBManager
{
    /**
     * @see DBManager::$dbType
     */

    public $dbType = 'mssql';
    public $dbName = 'SQL Server';
    public $variant = 'sqlsrv';
    public $priority = 10;
    public $label = 'LBL_MSSQL_SQLSRV';

    protected $capabilities = [
        "affected_rows" => true,
        'fulltext' => true,
        'limit_subquery' => true,
        'create_user' => true,
        "create_db" => true,
    ];

    protected $type_map = [
            'int'      => 'int',
            'double'   => 'float',
            'float'    => 'float',
            'uint'     => 'int',
            'ulong'    => 'int',
            'long'     => 'bigint',
            'short'    => 'smallint',
            'varchar'  => 'nvarchar',
            'text'     => 'nvarchar(max)',
            'shorttext'=> 'nvarchar(max)',
            'longtext' => 'nvarchar(max)',
            'date'     => 'datetime',
            'enum'     => 'nvarchar',
            'relate'   => 'nvarchar',
            'multienum'=> 'nvarchar(max)',
            'html'     => 'nvarchar(max)',
            'longhtml' => 'nvarchar(max)',
            'datetime' => 'datetime',
            'datetimecombo' => 'datetime',
            'time'     => 'datetime',
            'bool'     => 'bit',
            'tinyint'  => 'tinyint',
            'char'     => 'char',
            'blob'     => 'nvarchar(max)',
            'longblob' => 'nvarchar(max)',
            'currency' => 'decimal(26,6)',
            'decimal'  => 'decimal',
            'decimal2' => 'decimal',
            'id'       => 'varchar(36)',
            'url'      => 'nvarchar',
            'encrypt'  => 'nvarchar',
            'file'     => 'nvarchar',
	        'decimal_tpl' => 'decimal(%d, %d)',
    ];

    protected $connectOptions = null;

	/**
     * @see DBManager::connect()
     */
    public function connect(array $configOptions = null, $dieOnError = false)
    {


        if (is_null($configOptions))
            $configOptions = SpiceConfig::getInstance()->config['dbconfig'];

        //set the connections parameters
        $connect_param = '';
        $configOptions['db_host_instance'] = trim($configOptions['db_host_instance']);
        if (empty($configOptions['db_host_instance']))
            $connect_param = $configOptions['db_host_name'];
        else
            $connect_param = $configOptions['db_host_name']."\\".$configOptions['db_host_instance'];

        /*
         * Don't try to specifically use a persistent connection
         * since the driver will handle that for us
         */
        $options = [
                    "UID" => $configOptions['db_user_name'],
                    "PWD" => $configOptions['db_password'],
                    "CharacterSet" => "UTF-8",
                    "ReturnDatesAsStrings" => true,
                    "MultipleActiveResultSets" => true,
        ];
        if(!empty($configOptions['db_name'])) {
            $options["Database"] = $configOptions['db_name'];
        }
        $this->database = sqlsrv_connect($connect_param,$options);
        if(empty($this->database)) {
            LoggerManager::getLogger()->fatal("Could not connect to server ".$configOptions['db_host_name']." as ".$configOptions['db_user_name'].".");
            if($dieOnError) {
                    if(isset($GLOBALS['app_strings']['ERR_NO_DB'])) {
                        sugar_die($GLOBALS['app_strings']['ERR_NO_DB']);
                    } else {
                        sugar_die("Could not connect to the database. Please refer to spicecrm.log for details.");
                    }
            } else {
                return false;
            }
        }

        if($this->checkError('Could Not Connect:', $dieOnError))
            LoggerManager::getLogger()->info("connected to db");

        sqlsrv_query($this->database, 'SET DATEFORMAT mdy');

        $this->connectOptions = $configOptions;

        LoggerManager::getLogger()->info("Connect:".$this->database);
        return true;
    }



    /**
     * @see DBManager::query()
	 */
	public function query($sql, $dieOnError = false, $msg = '', $suppress = false, $keepResult = false)
    {
        if(is_array($sql)) {
            return $this->queryArray($sql, $dieOnError, $msg, $suppress);
        }
        $sql = $this->_appendN($sql);

        $this->countQuery($sql);
        LoggerManager::getLogger()->info('Query:' . $sql);
        $this->checkConnection();
        $this->query_time = microtime(true);

        $result = $suppress?@sqlsrv_query($this->database, $sql):sqlsrv_query($this->database, $sql);

        $this->query_time = microtime(true) - $this->query_time;
        LoggerManager::getLogger()->info('Query Execution Time:'.$this->query_time);


        $this->checkError($msg.' Query Failed:' . $sql . '::', $dieOnError);

        //suppress non error messages
        sqlsrv_configure('WarningsReturnAsErrors',false);

        return $result;
    }

    /**
     * just execute query
     * introduced 2018-06-06
     * @param  string   $sql        SQL Statement to execute
     * @param  bool     $suppress   Flag to suppress all error output unless in debug logging mode.
     */
    public function queryOnly($sql, $suppress = true){
        $this->checkConnection();
        $result = $suppress?@sqlsrv_query($this->database, $sql):sqlsrv_query($this->database, $sql);
        return $result;
    }



    /**
     * @see DBManager::getFieldsArray()
     */
	public function getFieldsArray($result, $make_lower_case = false)
	{
        $field_array = [];

        if ( !$result ) {
        	return false;
        }

        foreach ( sqlsrv_field_metadata($result) as $fieldMetadata ) {
            $key = $fieldMetadata['Name'];
            if($make_lower_case==true)
                $key = strtolower($key);

            $field_array[] = $key;
        }

        return $field_array;
	}

	/**
	 * @see DBManager::fetchRow()
	 */
	public function fetchRow($result)
	{
		if (empty($result))	return false;

	    $row = sqlsrv_fetch_array($result,SQLSRV_FETCH_ASSOC);
        if (empty($row)) {
            return false;
        }

        foreach($row as $key => $column) {
            // MSSQL returns a space " " when a varchar column is empty ("") and not null.
            // We need to strip empty spaces
            // notice we only strip if one space is returned.  we do not want to strip
            // strings with intentional spaces (" foo ")
            if (!empty($column) && $column == " ") {
                $row[$key] = '';
            }
        }

        return $row;
	}

    /**
     * @see DBManager::convert()
     */
    public function convert($string, $type, array $additional_parameters = [])
    {
        if ( $type == 'datetime')
        // see http://msdn.microsoft.com/en-us/library/ms187928.aspx for details
            return "CONVERT(datetime,$string,120)";
        else
          #return $this->convert($string, $type, $additional_parameters);
        return $string;
    }

	/**
     *
     * Compares two vardefs. Overriding 39098  due to bug: 39098 . IN 6.0 we changed the id columns to dbType = 'id'
     * for example emails_beans.  In 554 the field email_id was nvarchar but in 6.0 since it id dbType = 'id' we would want to alter
     * it to varchar. This code will prevent it.
     *
     * @param  array  $fielddef1
     * @param  array  $fielddef2
     * @return bool   true if they match, false if they don't
     */

    /**
     * Disconnects from the database
     *
     * Also handles any cleanup needed
     */
    public function disconnect()
    {
    	LoggerManager::getLogger()->debug('Calling Mssql::disconnect()');
        if(!empty($this->database)){
            $this->freeResult();
            sqlsrv_close($this->database);
            $this->database = null;
        }
    }

    /**
     * @see DBManager::freeDbResult()
     */
    protected function freeDbResult($dbResult)
    {
        if(!empty($dbResult))
            sqlsrv_free_stmt($dbResult);
    }

    /**
     * @see DBManager::version()
     */
    public function version()
    {
        return $this->getOne("SELECT @@VERSION as version");
    }

    /**
     * This function take in the sql for a union query, the start and offset,
     * and wraps it around an "mssql friendly" limit query
     *
     * @param  string $sql
     * @param  int    $start record to start at
     * @param  int    $count number of records to retrieve
     * @return string SQL statement
     */
    private function handleUnionLimitQuery($sql, $start, $count)
    {
        //set the start to 0, no negs
        if ($start < 0)
            $start=0;
        LoggerManager::getLogger()->debug(print_r(func_get_args(),true));
        #$GLOBALS['log']->debug(print_r(func_get_args(),true));

        $this->lastsql = $sql;

        //change the casing to lower for easier string comparison, and trim whitespaces
        $sql = strtolower(trim($sql)) ;

        //set default sql
        $limitUnionSQL = $sql;
        $order_by_str = 'order by';

        //make array of order by's.  substring approach was proving too inconsistent
        $orderByArray = explode($order_by_str, $sql);
        $unionOrderBy = '';
        $rowNumOrderBy = '';

        //count the number of array elements
        $unionOrderByCount = count($orderByArray);
        $arr_count = 0;

        //process if there are elements
        if ($unionOrderByCount){
            //we really want the last order by, so reconstruct string
            //adding a 1 to count, as we dont wish to process the last element
            $unionsql = '';
            while ($unionOrderByCount>$arr_count+1) {
                $unionsql .= $orderByArray[$arr_count];
                $arr_count = $arr_count+1;
                //add an "order by" string back if we are coming into loop again
                //remember they were taken out when array was created
                if ($unionOrderByCount>$arr_count+1) {
                    $unionsql .= "order by";
                }
            }
            //grab the last order by element, set both order by's'
            $unionOrderBy = $orderByArray[$arr_count];
            $rowNumOrderBy = $unionOrderBy;

            //if last element contains a "select", then this is part of the union query,
            //and there is no order by to use
            if (strpos($unionOrderBy, "select")) {
                $unionsql = $sql;
                //with no guidance on what to use for required order by in rownumber function,
                //resort to using name column.
                $rowNumOrderBy = 'id';
                $unionOrderBy = "";
            }
        }
        else {
            //there are no order by elements, so just pass back string
            $unionsql = $sql;
            //with no guidance on what to use for required order by in rownumber function,
            //resort to using name column.
            $rowNumOrderBy = 'id';
            $unionOrderBy = '';
        }
        //Unions need the column name being sorted on to match across all queries in Union statement
        //so we do not want to strip the alias like in other queries.  Just add the "order by" string and
        //pass column name as is
        if ($unionOrderBy != '') {
            $unionOrderBy = ' order by ' . $unionOrderBy;
        }

        //Bug 56560, use top query in conjunction with rownumber() function
        //to create limit query when paging is needed. Otherwise,
        //it shows duplicates when paging on activities subpanel.
        //If not for paging, no need to use rownumber() function
        if ($count == 1 && $start == 0)
        {
            $limitUnionSQL = "SELECT TOP $count * FROM (" .$unionsql .") as top_count ".$unionOrderBy;
        }
        else
        {
            $limitUnionSQL = "SELECT TOP $count * FROM( select ROW_NUMBER() OVER ( order by "
                .$rowNumOrderBy.") AS row_number, * FROM ("
                .$unionsql .") As numbered) "
                . "As top_count_limit WHERE row_number > $start "
                .$unionOrderBy;
        }

        return $limitUnionSQL;
    }

    /**
     * FIXME: verify and thoroughly test this code, these regexps look fishy
     * @see DBManager::limitQuery()
     */

    public function limitQuery($sql, $start, $count, $dieOnError = false, $msg = '', $execute = true)
    {
        $start = (int)$start;
        $count = (int)$count;
        $newSQL = $sql;
        $distinctSQLARRAY = [];
        if (strpos($sql, "UNION") && !preg_match("/(')(UNION).?(')/i", $sql))
            $newSQL = $this->handleUnionLimitQuery($sql,$start,$count);
        else {
            if ($start < 0)
                $start = 0;
            LoggerManager::getLogger()->debug(print_r(func_get_args(),true));

#            $GLOBALS['log']->debug(print_r(func_get_args(),true));
            $this->lastsql = $sql;
            $matches = [];
            preg_match('/^(.*SELECT\b)(.*?\bFROM\b.*\bWHERE\b)(.*)$/isU',$sql, $matches);
            if (!empty($matches[3])) {
                if ($start == 0) {
                    $match_two = strtolower($matches[2]);
                    if (!strpos($match_two, "distinct")> 0 && strpos($match_two, "distinct") !==0) {
                        $orderByMatch = [];
                        preg_match('/^(.*)(\bORDER BY\b)(.*)$/is',$matches[3], $orderByMatch);
                        if (!empty($orderByMatch[3])) {
                            $selectPart = [];
                            preg_match('/^(.*)(\bFROM\b.*)$/isU', $matches[2], $selectPart);
                            $newSQL = "SELECT TOP $count * FROM
                                (
                                    " . $matches[1] . $selectPart[1] . ", ROW_NUMBER()
                                    OVER (ORDER BY " . $this->returnOrderBy($sql, $orderByMatch[3]) . ") AS row_number
                                    " . $selectPart[2] . $orderByMatch[1]. "
                                ) AS a
                                WHERE row_number > $start";
                        }
                        else {
                            $newSQL = $matches[1] . " TOP $count " . $matches[2] . $matches[3];
                        }
                    }
                    else {
                        $distinct_o = strpos($match_two, "distinct");
                        $up_to_distinct_str = substr($match_two, 0, $distinct_o);
                        //check to see if the distinct is within a function, if so, then proceed as normal
                        if (strpos($up_to_distinct_str,"(")) {
                            //proceed as normal
                            $newSQL = $matches[1] . " TOP $count " . $matches[2] . $matches[3];
                        }
                        else {
                            //if distinct is not within a function, then parse
                            //string contains distinct clause, "TOP needs to come after Distinct"
                            //get position of distinct
                            $match_zero = strtolower($matches[0]);
                            $distinct_pos = strpos($match_zero , "distinct");
                            //get position of where
                            $where_pos = strpos($match_zero, "where");
                            //parse through string
                            $beg = substr($matches[0], 0, $distinct_pos+9 );
                            $mid = substr($matches[0], strlen($beg), ($where_pos+5) - (strlen($beg)));
                            $end = substr($matches[0], strlen($beg) + strlen($mid) );
                            //repopulate matches array
                            $matches[1] = $beg; $matches[2] = $mid; $matches[3] = $end;

                            $newSQL = $matches[1] . " TOP $count " . $matches[2] . $matches[3];
                        }
                    }
                } else {
                    $orderByMatch = [];
                    preg_match('/^(.*)(\bORDER BY\b)(.*)$/is',$matches[3], $orderByMatch);

                    //if there is a distinct clause, parse sql string as we will have to insert the rownumber
                    //for paging, AFTER the distinct clause
                    $grpByStr = '';
                    $hasDistinct = strpos(strtolower($matches[0]), "distinct");

                    require_once('include/php-sql-parser.php');
                    $parser = new PHPSQLParser();
                    $sqlArray = $parser->parse($sql);

                    if ($hasDistinct) {
                        $matches_sql = strtolower($matches[0]);
                        //remove reference to distinct and select keywords, as we will use a group by instead
                        //we need to use group by because we are introducing rownumber column which would make every row unique

                        //take out the select and distinct from string so we can reuse in group by
                        $dist_str = 'distinct';
                        preg_match('/\b' . $dist_str . '\b/simU', $matches_sql, $matchesPartSQL, PREG_OFFSET_CAPTURE);
                        $matches_sql = trim(substr($matches_sql,$matchesPartSQL[0][1] + strlen($dist_str)));
                        //get the position of where and from for further processing
                        preg_match('/\bfrom\b/simU', $matches_sql, $matchesPartSQL, PREG_OFFSET_CAPTURE);
                        $from_pos = $matchesPartSQL[0][1];
                        preg_match('/\where\b/simU', $matches_sql, $matchesPartSQL, PREG_OFFSET_CAPTURE);
                        $where_pos = $matchesPartSQL[0][1];
                        //split the sql into a string before and after the from clause
                        //we will use the columns being selected to construct the group by clause
                        if ($from_pos>0 ) {
                            $distinctSQLARRAY[0] = substr($matches_sql, 0, $from_pos);
                            $distinctSQLARRAY[1] = substr($matches_sql, $from_pos);
                            //get position of order by (if it exists) so we can strip it from the string
                            $ob_pos = strpos($distinctSQLARRAY[1], "order by");
                            if ($ob_pos) {
                                $distinctSQLARRAY[1] = substr($distinctSQLARRAY[1],0,$ob_pos);
                            }

                            // strip off last closing parentheses from the where clause
                            $distinctSQLARRAY[1] = preg_replace('/\)\s$/',' ',$distinctSQLARRAY[1]);
                        }

                        $grpByStr = [];
                        foreach ($sqlArray['SELECT'] as $record) {
                            if ($record['expr_type'] == 'const') {
                                continue;
                            }
                            $grpByStr[] = trim($record['base_expr']);
                        }
                        $grpByStr = implode(', ', $grpByStr);
                    }

                    if (!empty($orderByMatch[3])) {
                        //if there is a distinct clause, form query with rownumber after distinct
                        if ($hasDistinct) {
                            $newSQL = "SELECT TOP $count * FROM
                                        (
                                            SELECT ROW_NUMBER()
                                                OVER (ORDER BY " . preg_replace('/^' . $dist_str . '\s+/', '', $this->returnOrderBy($sql, $orderByMatch[3])) . ") AS row_number,
                                                count(*) counter, " . $distinctSQLARRAY[0] . "
                                                " . $distinctSQLARRAY[1] . "
                                                group by " . $grpByStr . "
                                        ) AS a
                                        WHERE row_number > $start";
                        }
                        else {
                            $newSQL = "SELECT TOP $count * FROM
                                    (
                                        " . $matches[1] . " ROW_NUMBER()
                                        OVER (ORDER BY " . $this->returnOrderBy($sql, $orderByMatch[3]) . ") AS row_number,
                                        " . $matches[2] . $orderByMatch[1]. "
                                    ) AS a
                                    WHERE row_number > $start";
                        }
                    }else{
                        //if there is a distinct clause, form query with rownumber after distinct
                        if ($hasDistinct) {
                            $newSQL = "SELECT TOP $count * FROM
                                            (
                            SELECT ROW_NUMBER() OVER (ORDER BY ".$grpByStr.") AS row_number, count(*) counter, " . $distinctSQLARRAY[0] . "
                                                        " . $distinctSQLARRAY[1] . "
                                                    group by " . $grpByStr . "
                                            )
                                            AS a
                                            WHERE row_number > $start";
                        }
                        else {
                            $newSQL = "SELECT TOP $count * FROM
                                           (
                                  " . $matches[1] . " ROW_NUMBER() OVER (ORDER BY " . $sqlArray['FROM'][0]['alias'] . ".id) AS row_number, " . $matches[2] . $matches[3]. "
                                           )
                                           AS a
                                           WHERE row_number > $start";
                        }
                    }
                }
            }
        }
        LoggerManager::getLogger()->debug('Limit Query: ' . $newSQL);
#        $GLOBALS['log']->debug('Limit Query: ' . $newSQL);
        if($execute) {
            $result =  $this->query($newSQL, $dieOnError, $msg);
            $this->dump_slow_queries($newSQL);
            return $result;
        } else {
            return $newSQL;
        }
    }

    /**
     * Searches for begginning and ending characters.  It places contents into
     * an array and replaces contents in original string.  This is used to account for use of
     * nested functions while aliasing column names
     *
     * @param  string $p_sql     SQL statement
     * @param  string $strip_beg Beginning character
     * @param  string $strip_end Ending character
     * @param  string $patt      Optional, pattern to
     */
    private function removePatternFromSQL($p_sql, $strip_beg, $strip_end, $patt = 'patt')
    {
        //strip all single quotes out
        $count = substr_count ( $p_sql, $strip_beg);
        $increment = 1;
        if ($strip_beg != $strip_end)
            $increment = 2;

        $i=0;
        $offset = 0;
        $strip_array = [];
        while ($i<$count && $offset<strlen($p_sql)) {
            if ($offset > strlen($p_sql))
            {
                break;
            }

            $beg_sin = strpos($p_sql, $strip_beg, $offset);
            if (!$beg_sin)
            {
                break;
            }
            $sec_sin = strpos($p_sql, $strip_end, $beg_sin+1);
            $strip_array[$patt.$i] = substr($p_sql, $beg_sin, $sec_sin - $beg_sin +1);
            if ($increment > 1) {
                //we are in here because beginning and end patterns are not identical, so search for nesting
                $exists = strpos($strip_array[$patt.$i], $strip_beg );
                if ($exists>=0) {
                    $nested_pos = (strrpos($strip_array[$patt.$i], $strip_beg ));
                    $strip_array[$patt.$i] = substr($p_sql,$nested_pos+$beg_sin,$sec_sin - ($nested_pos+$beg_sin)+1);
                    $p_sql = substr($p_sql, 0, $nested_pos+$beg_sin) . " ##". $patt.$i."## " . substr($p_sql, $sec_sin+1);
                    $i = $i + 1;
                    continue;
                }
            }
            $p_sql = substr($p_sql, 0, $beg_sin) . " ##". $patt.$i."## " . substr($p_sql, $sec_sin+1);
            //move the marker up
            $offset = $sec_sin+1;

            $i = $i + 1;
        }
        $strip_array['sql_string'] = $p_sql;

        return $strip_array;
    }

    /**
     * adds a pattern
     *
     * @param  string $token
     * @param  array  $pattern_array
     * @return string
     */
    private function addPatternToSQL($token, array $pattern_array)
    {
        //strip all single quotes out
        $pattern_array = array_reverse($pattern_array);

        foreach ($pattern_array as $key => $replace) {
            $token = str_replace( " ##".$key."## ", $replace,$token);
        }

        return $token;
    }

    /**
     * gets an alias from the sql statement
     *
     * @param  string $sql
     * @param  string $alias
     * @return string
     */

    private function getAliasFromSQL($sql, $alias)
    {
        $matches = [];
        preg_match('/^(.*SELECT)(.*?FROM.*WHERE)(.*)$/isU',$sql, $matches);
        //parse all single and double  quotes out of array
        $sin_array = $this->removePatternFromSQL($matches[2], "'", "'","sin_");
        $new_sql = array_pop($sin_array);
        $dub_array = $this->removePatternFromSQL($new_sql, "\"", "\"","dub_");
        $new_sql = array_pop($dub_array);

        //search for parenthesis
        $paren_array = $this->removePatternFromSQL($new_sql, "(", ")", "par_");
        $new_sql = array_pop($paren_array);

        //all functions should be removed now, so split the array on commas
        $mstr_sql_array = explode(",", $new_sql);
        foreach($mstr_sql_array as $token ) {
            if (strpos($token, $alias)) {
                //found token, add back comments
                $token = $this->addPatternToSQL($token, $paren_array);
                $token = $this->addPatternToSQL($token, $dub_array);
                $token = $this->addPatternToSQL($token, $sin_array);

                //log and break out of this function
                return $token;
            }
        }
        return null;
    }


    /**
     * @see DBManager::get_columns()
     */
    public function get_columns($tablename)
    {
        //find all unique indexes and primary keys.
        $result = $this->query("sp_columns_90 $tablename");

        $columns = [];
        while (($row=$this->fetchByAssoc($result)) !=null) {
            $column_name = strtolower($row['COLUMN_NAME']);
            $columns[$column_name]['name']=$column_name;
            $columns[$column_name]['type']=strtolower($row['TYPE_NAME']);
            if ( $row['TYPE_NAME'] == 'decimal' ) {
                $columns[$column_name]['len']=strtolower($row['PRECISION']);
                $columns[$column_name]['len'].=','.strtolower($row['SCALE']);
            }
			elseif ( in_array($row['TYPE_NAME'], ['nchar','nvarchar']) ) {
				$columns[$column_name]['len']=strtolower($row['PRECISION']);
				if ( $row['TYPE_NAME'] == 'nvarchar' && $row['PRECISION'] == '0' ) {
				    $columns[$column_name]['len']='max';
				}
			}
            elseif ( !in_array($row['TYPE_NAME'], ['datetime','text']) ) {
                $columns[$column_name]['len']=strtolower($row['LENGTH']);
            }
            if ( stristr($row['TYPE_NAME'],'identity') ) {
                $columns[$column_name]['auto_increment'] = '1';
                $columns[$column_name]['type']=str_replace(' identity','',strtolower($row['TYPE_NAME']));
            }

            if (!empty($row['IS_NULLABLE']) && $row['IS_NULLABLE'] == 'NO' && (empty($row['KEY']) || !stristr($row['KEY'],'PRI')))
                $columns[strtolower($row['COLUMN_NAME'])]['required'] = 'true';

            $column_def = 1;
            if ( strtolower($tablename) == 'relationships' ) {
                $column_def = $this->getOne("select cdefault from syscolumns where id = object_id('relationships') and name = '$column_name'");
            }
            if ( $column_def != 0 && ($row['COLUMN_DEF'] != null)) {	// NOTE Not using !empty as an empty string may be a viable default value.
                $matches = [];
                $row['COLUMN_DEF'] = html_entity_decode($row['COLUMN_DEF'],ENT_QUOTES);
                if ( preg_match('/\([\(|\'](.*)[\)|\']\)/i',$row['COLUMN_DEF'],$matches) )
                    $columns[$column_name]['default'] = $matches[1];
                elseif ( preg_match('/\(N\'(.*)\'\)/i',$row['COLUMN_DEF'],$matches) )
                    $columns[$column_name]['default'] = $matches[1];
                else
                    $columns[$column_name]['default'] = $row['COLUMN_DEF'];
            }
        }
        return $columns;
    }

    /**
     * Finds the alias of the order by column, and then return the preceding column name
     *
     * @param  string $sql
     * @param  string $orderMatch
     * @return string
     */
    private function findColumnByAlias($sql, $orderMatch)
    {
        //change case to lowercase
        $sql = strtolower($sql);
        $patt = '/\s+'.trim($orderMatch).'\s*(,|from)/';

        //check for the alias, it should contain comma, may contain space, \n, or \t
        $matches = [];
        preg_match($patt, $sql, $matches, PREG_OFFSET_CAPTURE);
        $found_in_sql = isset($matches[0][1]) ? $matches[0][1] : false;


        //set default for found variable
        $found = $found_in_sql;

        //if still no match found, then we need to parse through the string
        if (!$found_in_sql){
            //get count of how many times the match exists in string
            $found_count = substr_count($sql, $orderMatch);
            $i = 0;
            $first_ = 0;
            $len = strlen($orderMatch);
            //loop through string as many times as there is a match
            while ($found_count > $i) {
                //get the first match
                $found_in_sql = strpos($sql, $orderMatch,$first_);
                //make sure there was a match
                if($found_in_sql){
                    //grab the next 2 individual characters
                    $str_plusone = substr($sql,$found_in_sql + $len,1);
                    $str_plustwo = substr($sql,$found_in_sql + $len+1,1);
                    //if one of those characters is a comma, then we have our alias
                    if ($str_plusone === "," || $str_plustwo === ","){
                        //keep track of this position
                        $found = $found_in_sql;
                    }
                }
                //set the offset and increase the iteration counter
                $first_ = $found_in_sql+$len;
                $i = $i+1;
            }
        }
        //return $found, defaults have been set, so if no match was found it will be a negative number
        return $found;
    }


    /**
     * Return the order by string to use in case the column has been aliased
     *
     * @param  string $sql
     * @param  string $orig_order_match
     * @return string
     */
    private function returnOrderBy($sql, $orig_order_match)
    {
        $sql = strtolower($sql);
        $orig_order_match = trim($orig_order_match);
        if (strpos($orig_order_match, ".") != 0)
            //this has a tablename defined, pass in the order match
            return $orig_order_match;

        // If there is no ordering direction (ASC/DESC), use ASC by default
        if (strpos($orig_order_match, " ") === false) {
            $orig_order_match .= " ASC";
        }

        //grab first space in order by
        $firstSpace = strpos($orig_order_match, " ");

        //split order by into column name and ascending/descending
        $orderMatch = " " . strtolower(substr($orig_order_match, 0, $firstSpace));
        $asc_desc = trim(substr($orig_order_match,$firstSpace));

        //look for column name as an alias in sql string
        $found_in_sql = $this->findColumnByAlias($sql, $orderMatch);

        if (!$found_in_sql) {
            //check if this column needs the tablename prefixed to it
            $orderMatch = ".".trim($orderMatch);
            $colMatchPos = strpos($sql, $orderMatch);
            if ($colMatchPos !== false) {
                //grab sub string up to column name
                $containsColStr = substr($sql,0, $colMatchPos);
                //get position of first space, so we can grab table name
                $lastSpacePos = strrpos($containsColStr, " ");
                //use positions of column name, space before name, and length of column to find the correct column name
                $col_name = substr($sql, $lastSpacePos, $colMatchPos-$lastSpacePos+strlen($orderMatch));
                //bug 25485. When sorting by a custom field in Account List and then pressing NEXT >, system gives an error
                $containsCommaPos = strpos($col_name, ",");
                if($containsCommaPos !== false) {
                    $col_name = substr($col_name, $containsCommaPos+1);
                }
                //add the "asc/desc" order back
                $col_name = $col_name. " ". $asc_desc;

                //return column name
                return $col_name;
            }
            //break out of here, log this
            LoggerManager::getLogger()->debug("No match was found for order by, pass string back untouched as: $orig_order_match");
 #           $GLOBALS['log']->debug("No match was found for order by, pass string back untouched as: $orig_order_match");
            return $orig_order_match;
        }
        else {
            //if found, then parse and return
            //grab string up to the aliased column
            LoggerManager::getLogger()->debug("order by found, process sql string");

 #           $GLOBALS['log']->debug("order by found, process sql string");

            $psql = (trim($this->getAliasFromSQL($sql, $orderMatch )));
            if (empty($psql))
                $psql = trim(substr($sql, 0, $found_in_sql));

            //grab the last comma before the alias
            preg_match('/\s+' . trim($orderMatch). '/', $psql, $match, PREG_OFFSET_CAPTURE);
            $comma_pos = $match[0][1];
            //substring between the comma and the alias to find the joined_table alias and column name
            $col_name = substr($psql,0, $comma_pos);

            //make sure the string does not have an end parenthesis
            //and is not part of a function (i.e. "ISNULL(leads.last_name,'') as name"  )
            //this is especially true for unified search from home screen

            $alias_beg_pos = 0;
            if(strpos($psql, " as "))
                $alias_beg_pos = strpos($psql, " as ");

            // Bug # 44923 - This breaks the query and does not properly filter isnull
            // as there are other functions such as ltrim and rtrim.
            /* else if (strncasecmp($psql, 'isnull', 6) != 0)
                $alias_beg_pos = strpos($psql, " "); */

            if ($alias_beg_pos > 0) {
                $col_name = substr($psql,0, $alias_beg_pos );
            }
            //add the "asc/desc" order back
            $col_name = $col_name. " ". $asc_desc;

            //pass in new order by
            LoggerManager::getLogger()->debug("order by being returned is " . $col_name);

    #        $GLOBALS['log']->debug("order by being returned is " . $col_name);
            return $col_name;
        }
    }


    /**
     * protected function to return true if the given tablename has any fulltext indexes defined.
     *
     * @param  string $tableName
     * @return bool
     */
    protected function doesTableHaveAFulltextIndexDefined($tableName)
    {
        $query = <<<EOSQL
SELECT 1
    FROM sys.fulltext_indexes i
        JOIN sys.objects o ON i.object_id = o.object_id
    WHERE o.name = '{$tableName}'
EOSQL;

        $result = $this->getOne($query);
        if ( !$result ) {
            return false;
        }

        return true;
    }

    /**
     * Override method to add support for detecting and dropping fulltext indices.
     *
     * @see DBManager::changeColumnSQL()
     * @see MssqlHelper::changeColumnSQL()
     */
    protected function changeColumnSQL($tablename,$fieldDefs, $action, $ignoreRequired = false)
    {
        $sql = '';
        if ( $action == 'drop' && $this->doesTableHaveAFulltextIndexDefined($tablename) ) {
            $sql .= "DROP FULLTEXT INDEX ON {$tablename}";
        }

        $sql .= $this->changeColumnSQL($tablename, $fieldDefs, $action, $ignoreRequired);

        return $sql;
    }

    /**
     * Truncate table
     * @param  $name
     * @return string
     */
    public function truncateTableSQL($name)
    {
        return "TRUNCATE TABLE $name";
    }

	/**
	 * (non-PHPdoc)
	 * @see DBManager::lastDbError()
	 */
    public function lastDbError()
    {
        $errors = sqlsrv_errors(SQLSRV_ERR_ERRORS);
        if(empty($errors)) return false;
        global $app_strings;
        if (empty($app_strings)
		    or !isset($app_strings['ERR_MSSQL_DB_CONTEXT'])
			or !isset($app_strings['ERR_MSSQL_WARNING']) ) {
        //ignore the message from sql-server if $app_strings array is empty. This will happen
        //only if connection if made before languge is set.
		    return false;
        }
        $messages = [];
        foreach($errors as $error) {
            $sqlmsg = $error['message'];
            $sqlpos = strpos($sqlmsg, 'Changed database context to');
            $sqlpos2 = strpos($sqlmsg, 'Warning:');
            $sqlpos3 = strpos($sqlmsg, 'Checking identity information:');
            if ( $sqlpos !== false || $sqlpos2 !== false || $sqlpos3 !== false ) {
                continue;
            }
            $sqlpos = strpos($sqlmsg, $app_strings['ERR_MSSQL_DB_CONTEXT']);
            $sqlpos2 = strpos($sqlmsg, $app_strings['ERR_MSSQL_WARNING']);
    		if ( $sqlpos !== false || $sqlpos2 !== false) {
                    continue;
            }
            $messages[] = $sqlmsg;
        }

        if(!empty($messages)) {
            return join("\n", $messages);
        }
        return false;
    }



    /**
     * (non-PHPdoc)
     * @see DBManager::getDbInfo()
     * @return array
     */
    public function getDbInfo()
    {
        $info = array_merge(sqlsrv_client_info(), sqlsrv_server_info());
        return $info;
    }

    /**
     * Execute data manipulation statement, then roll it back
     * @param  $type
     * @param  $table
     * @param  $query
     * @return string
     */
    protected function verifyGenericQueryRollback($type, $table, $query)
    {
        $this->log->debug("verifying $type statement");
        if(!sqlsrv_begin_transaction($this->database)) {
            return "Failed to create transaction";
        }
        $this->query($query, false);
        $error = $this->lastError();
        sqlsrv_rollback($this->database);
        return $error;
    }


    /**
     * @see DBManager::getAffectedRowCount()
     */
    public function getAffectedRowCount($result)
    {
        return $this->getOne("SELECT @@ROWCOUNT");
    }

    /**
     * @see DBManager::quote()
     */
    public function quote($string)
    {
        if(is_array($string)) {
            return $this->arrayQuote($string);
        }
        return str_replace("'","''", $this->quoteInternal($string));
    }

    /**
     * @see DBManager::tableExists()
     */
    public function tableExists($tableName)
    {
        LoggerManager::getLogger()->info("tableExists: $tableName");
 #       $GLOBALS['log']->info("tableExists: $tableName");

        $this->checkConnection();
        $result = $this->getOne(
            "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_NAME=".$this->quoted($tableName));

        return !empty($result);
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
            $r = $this->query('SELECT TABLE_NAME tn FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\' AND TABLE_NAME LIKE '.$this->quoted($like));
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
     * Select database
     * @param string $dbname
     */
    protected function selectDb($dbname)
    {
        return $this->query("USE ".$this->quoted($dbname));
    }

    /**
     * Check if this driver can be used
     * @return bool
     */
    public function valid()
    {
        return function_exists("sqlsrv_connect");
    }

    /**
     * @see DBManager::getTablesArray()
     */
    public function getTablesArray()
    {
        LoggerManager::getLogger()->debug('MSSQL fetching table list');
 #       $GLOBALS['log']->debug('MSSQL fetching table list');

        if($this->getDatabase()) {
            $tables = [];
            $r = $this->query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES');
            if (is_resource($r)) {
                while ($a = $this->fetchByAssoc($r))
                    $tables[] = $a['TABLE_NAME'];

                return $tables;
            }
        }

        return false; // no database available
    }

    /**
     * This call is meant to be used during install, when Full Text Search is enabled
     * Indexing would always occur after a fresh sql server install, so this code creates
     * a catalog and table with full text index.
     */
/*
    public function full_text_indexing_setup()
    {
        $GLOBALS['log']->debug('MSSQL about to wakeup FTS');

        if($this->getDatabase()) {
            //create wakeup catalog
            $FTSqry[] = "if not exists(  select * from sys.fulltext_catalogs where name ='wakeup_catalog' )
                CREATE FULLTEXT CATALOG wakeup_catalog
                ";

            //drop wakeup table if it exists
            $FTSqry[] = "IF EXISTS(SELECT 'fts_wakeup' FROM sysobjects WHERE name = 'fts_wakeup' AND xtype='U')
                    DROP TABLE fts_wakeup
                ";
            //create wakeup table
            $FTSqry[] = "CREATE TABLE fts_wakeup(
                    id varchar(36) NOT NULL CONSTRAINT pk_fts_wakeup_id PRIMARY KEY CLUSTERED (id ASC ),
                    body text NULL,
                    kb_index int IDENTITY(1,1) NOT NULL CONSTRAINT wakeup_fts_unique_idx UNIQUE NONCLUSTERED
                )
                ";
            //create full text index
            $FTSqry[] = "CREATE FULLTEXT INDEX ON fts_wakeup
                (
                    body
                    Language 0X0
                )
                KEY INDEX wakeup_fts_unique_idx ON wakeup_catalog
                WITH CHANGE_TRACKING AUTO
                ";

            //insert dummy data
            $FTSqry[] = "INSERT INTO fts_wakeup (id ,body)
                VALUES ('".create_guid()."', 'SugarCRM Rocks' )";


            //create queries to stop and restart indexing
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup STOP POPULATION';
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup DISABLE';
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup ENABLE';
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup SET CHANGE_TRACKING MANUAL';
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup START FULL POPULATION';
            $FTSqry[] = 'ALTER FULLTEXT INDEX ON fts_wakeup SET CHANGE_TRACKING AUTO';

            foreach($FTSqry as $q){
                sleep(3);
                $this->query($q);
            }
            $this->create_default_full_text_catalog();
        }

        return false; // no database available
    }*/

    protected $date_formats = [
        '%Y-%m-%d' => 10,
        '%Y-%m' => 7,
        '%Y' => 4,
    ];
    /**
     * @see DBManager::fromConvert()
     */
    public function fromConvert($string, $type)
    {
        switch($type) {
            case 'datetimecombo':
            case 'datetime': return substr($string, 0,19);
            case 'date': return substr($string, 0, 10);
            case 'time': return substr($string, 11);
        }
        return $string;
    }

    /**
     * @see DBManager::createTableSQLParams()
     */
    public function createTableSQLParams($tablename, $fieldDefs, $indices)
    {
        if (empty($tablename) || empty($fieldDefs))
            return '';

        $columns = $this->columnSQLRep($fieldDefs, false, $tablename);
        if (empty($columns))
            return '';

        return "CREATE TABLE $tablename ($columns)";
    }

    /**
     * Does this type represent text (i.e., non-varchar) value?
     * @param string $type
     */
    public function isTextType($type)
    {
        $type = strtolower($type);
        if(!isset($this->type_map[$type])) return false;
        return in_array($this->type_map[$type], ['ntext','text','image', 'nvarchar(max)']);
    }

    public function renameColumnSQL($tablename, $column, $newname)
    {
        return "SP_RENAME '$tablename.$column', '$newname', 'COLUMN'";
    }


    /**
     * @see DBManager::get_indices()
     */
    public function get_indices($tableName)
    {
        //find all unique indexes and primary keys.
        $query = <<<EOSQL
        SELECT sys.tables.object_id, sys.tables.name as table_name, sys.columns.name as column_name,
                        sys.indexes.name as index_name, sys.indexes.is_unique, sys.indexes.is_primary_key
                    FROM sys.tables, sys.indexes, sys.index_columns, sys.columns
                    WHERE (sys.tables.object_id = sys.indexes.object_id
                            AND sys.tables.object_id = sys.index_columns.object_id
                            AND sys.tables.object_id = sys.columns.object_id
                            AND sys.indexes.index_id = sys.index_columns.index_id
                            AND sys.index_columns.column_id = sys.columns.column_id)
                        AND sys.tables.name = '$tableName'
EOSQL;
        $result = $this->query($query);

        $indices = [];
        while (($row=$this->fetchByAssoc($result)) != null) {
            $index_type = 'index';
            if ($row['is_primary_key'] == '1')
                $index_type = 'primary';
            elseif ($row['is_unique'] == 1 )
                $index_type = 'unique';
            $name = strtolower($row['index_name']);
            $indices[$name]['name']     = $name;
            $indices[$name]['type']     = $index_type;
            $indices[$name]['fields'][] = strtolower($row['column_name']);
        }
        return $indices;
    }

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
     * Get FTS catalog name for current DB
     */
    protected function ftsCatalogName()
    {
        if(isset($this->connectOptions['db_name'])) {
            return $this->connectOptions['db_name']."_fts_catalog";
        }
        return 'sugar_fts_catalog';
    }

    /**
     * @see DBManager::add_drop_constraint()
     */
    public function add_drop_constraint($table, $definition, $drop = false)
    {
        $type         = $definition['type'];
        $fields       = is_array($definition['fields'])?implode(',',$definition['fields']):$definition['fields'];
        $name         = $definition['name'];
        $sql          = '';

        switch ($type){
            // generic indices
            case 'index':
            case 'alternate_key':
                if ($drop)
                    $sql = "DROP INDEX {$name} ON {$table}";
                else
                    $sql = "CREATE INDEX {$name} ON {$table} ({$fields})";
                break;
            case 'clustered':
                if ($drop)
                    $sql = "DROP INDEX {$name} ON {$table}";
                else
                    $sql = "CREATE CLUSTERED INDEX $name ON $table ($fields)";
                break;
            // constraints as indices
            case 'unique':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP CONSTRAINT $name";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name} UNIQUE ({$fields})";
                break;
            case 'primary':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP CONSTRAINT {$name}";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name} PRIMARY KEY ({$fields})";
                break;
            case 'foreign':
                if ($drop)
                    $sql = "ALTER TABLE {$table} DROP FOREIGN KEY ({$fields})";
                else
                    $sql = "ALTER TABLE {$table} ADD CONSTRAINT {$name}  FOREIGN KEY ({$fields}) REFERENCES {$definition['foreignTable']}({$definition['foreignFields']})";
                break;
            case 'fulltext':
                if ($this->full_text_indexing_enabled() && $drop) {
                    $sql = "DROP FULLTEXT INDEX ON {$table}";
                } elseif ($this->full_text_indexing_enabled()) {
                    $catalog_name=$this->ftsCatalogName();
                    if ( isset($definition['catalog_name']) && $definition['catalog_name'] != 'default')
                        $catalog_name = $definition['catalog_name'];

                    $language = "Language 1033";
                    if (isset($definition['language']) && !empty($definition['language']))
                        $language = "Language " . $definition['language'];

                    $key_index = $definition['key_index'];

                    $change_tracking = "auto";
                    if (isset($definition['change_tracking']) && !empty($definition['change_tracking']))
                        $change_tracking = $definition['change_tracking'];

                    $sql = " CREATE FULLTEXT INDEX ON $table ($fields $language) KEY INDEX $key_index ON $catalog_name WITH CHANGE_TRACKING $change_tracking" ;
                }
                break;
        }
        return $sql;
    }

    /**
     * Returns true if Full Text Search is installed
     *
     * @return bool
     */
    public function full_text_indexing_installed()
    {
        $ftsChckRes = $this->getOne("SELECT FULLTEXTSERVICEPROPERTY('IsFulltextInstalled') as fts");
        return !empty($ftsChckRes);
    }

    protected function full_text_indexing_enabled($dbname = null)
    {
        // check to see if we already have install setting in session
        if(!isset($_SESSION['IsFulltextInstalled']))
            $_SESSION['IsFulltextInstalled'] = $this->full_text_indexing_installed();

        // check to see if FTS Indexing service is installed
        if(empty($_SESSION['IsFulltextInstalled']))
            return false;

        // grab the dbname if it was not passed through
        if (empty($dbname)) {
            global $sugar_config;
            $dbname = $sugar_config['dbconfig']['db_name'];
        }
        //we already know that Indexing service is installed, now check
        //to see if it is enabled
        $res = $this->getOne("SELECT DATABASEPROPERTY('$dbname', 'IsFulltextEnabled') ftext");
        return !empty($res);
    }



    /**
     * (non-PHPdoc)
     * @see DBManager::validateQuery()
     */
    public function validateQuery($query)
    {
        if(!$this->isSelect($query)) {
            return false;
        }
        $this->query("SET SHOWPLAN_TEXT ON");
        $res = $this->getOne($query);
        $this->query("SET SHOWPLAN_TEXT OFF");
        return !empty($res);
    }

    /**
     * This is a utility function to prepend the "N" character in front of SQL values that are
     * surrounded by single quotes.
     *
     * @param  $sql string SQL statement
     * @return string SQL statement with single quote values prepended with "N" character for nvarchar columns
     */
    protected function _appendN($sql)
    {
        // If there are no single quotes, don't bother, will just assume there is no character data
        if (strpos($sql, "'") === false)
            return $sql;

        // Flag if there are odd number of single quotes, just continue without trying to append N
        if ((substr_count($sql, "'") & 1)) {
            LoggerManager::getLogger()->error("SQL statement[" . $sql . "] has odd number of single quotes.");
 #           $GLOBALS['log']->error("SQL statement[" . $sql . "] has odd number of single quotes.");
            return $sql;
        }

        //The only location of three subsequent ' will be at the beginning or end of a value.
        $sql = preg_replace('/(?<!\')(\'{3})(?!\')/', "'<@#@#@PAIR@#@#@>", $sql);

        // Remove any remaining '' and do not parse... replace later (hopefully we don't even have any)
        $pairs        = [];
        $regexp       = '/(\'{2})/';
        $pair_matches = [];
        preg_match_all($regexp, $sql, $pair_matches);
        if ($pair_matches) {
            foreach (array_unique($pair_matches[0]) as $key=>$value) {
                $pairs['<@PAIR-'.$key.'@>'] = $value;
            }
            if (!empty($pairs)) {
                $sql = str_replace($pairs, array_keys($pairs), $sql);
            }
        }

        $regexp  = "/(N?'.+?')/is";
        $matches = [];
        preg_match_all($regexp, $sql, $matches);
        $replace = [];
        if (!empty($matches)) {
            foreach ($matches[0] as $value) {
                // We are assuming that all nvarchar columns are no more than 200 characters in length
                // One problem we face is the image column type in reports which cannot accept nvarchar data
                if (!empty($value) && !is_numeric(trim(str_replace(["'", ","], "", $value))) && !preg_match('/^\'[\,]\'$/', $value)) {
                    $replace[$value] = 'N' . trim($value, "N");
                }
            }
        }

        if (!empty($replace))
            $sql = str_replace(array_keys($replace), $replace, $sql);

        if (!empty($pairs))
            $sql = str_replace(array_keys($pairs), $pairs, $sql);

        if(strpos($sql, "<@#@#@PAIR@#@#@>"))
            $sql = str_replace(['<@#@#@PAIR@#@#@>'], ["''"], $sql);

        return $sql;
    }

    /**
     * Quote SQL Server search term
     * @param string $term
     * @return string
     */
    protected function quoteTerm($term)
    {
        $term = str_replace("%", "*", $term); // Mssql wildcard is *
        return '"'.str_replace('"', '', $term).'"';
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
        $condition = $or_condition = [];
        foreach($must_terms as $term) {
            $condition[] = $this->quoteTerm($term);
        }

        foreach($terms as $term) {
            $or_condition[] = $this->quoteTerm($term);
        }

        if(!empty($or_condition)) {
            $condition[] = "(".join(" | ", $or_condition).")";
        }

        foreach($exclude_terms as $term) {
            $condition[] = " NOT ".$this->quoteTerm($term);
        }
        $condition = $this->quoted(join(" AND ",$condition));
        return "CONTAINS($field, $condition)";
    }

    /**
     * Check if certain database exists
     * @param string $dbname
     */
    public function dbExists($dbname)
    {
        $db = $this->getOne("SELECT name FROM master..sysdatabases WHERE name = N".$this->quoted($dbname));
        return !empty($db);
    }

    /**
     * Check if certain DB user exists
     * @param string $username
     */
    public function userExists($username)
    {
        $this->selectDb("master");
        $user = $this->getOne("select count(*) from sys.sql_logins where name =".$this->quoted($username));
        // FIXME: go back to the original DB
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
        $this->selectDb($database_name);
        $this->query("CREATE LOGIN $user WITH PASSWORD = '$qpassword'", true);
        $this->query("CREATE USER $user FOR LOGIN $user", true);
        $this->query("EXEC sp_addRoleMember 'db_ddladmin ', '$user'", true);
        $this->query("EXEC sp_addRoleMember 'db_datareader','$user'", true);
        $this->query("EXEC sp_addRoleMember 'db_datawriter','$user'", true);
    }

    /**
     * Create a database
     * @param string $dbname
     */
    public function createDatabase($dbname)
    {
        return $this->query("CREATE DATABASE $dbname", true);
    }

    /**
     * Drop a database
     * @param string $dbname
     */
    public function dropDatabase($dbname)
    {
        return $this->query("DROP DATABASE $dbname", true);
    }

    /**
     * Check if this DB name is valid
     *
     * @param string $name
     * @return bool
     */
    public function isDatabaseNameValid($name)
    {
        // No funny chars, does not begin with number
        return preg_match('/^[0-9#@]+|[\"\'\*\/\\?\:\\<\>\ \&\!\(\)\[\]\{\}\;\,\.\`\~\|\\\\]+/', $name)==0;

    }
    public function installConfig()
    {
        return [
            'LBL_DBCONFIG_MSG3' =>  [
                "setup_db_database_name" => ["label" => 'LBL_DBCONF_DB_NAME', "required" => true],
            ],
            'LBL_DBCONFIG_MSG2' =>  [
                "setup_db_host_name" => ["label" => 'LBL_DBCONF_HOST_NAME', "required" => true],
                "setup_db_host_instance" => ["label" => 'LBL_DBCONF_HOST_INSTANCE'],
            ],
            'LBL_DBCONF_TITLE_USER_INFO' => [],
            'LBL_DBCONFIG_B_MSG1' => [
                "setup_db_admin_user_name" => ["label" => 'LBL_DBCONF_DB_ADMIN_USER', "required" => true],
                "setup_db_admin_password" => ["label" => 'LBL_DBCONF_DB_ADMIN_PASSWORD', "type" => "password"],
            ]
        ];
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
        return 'NEWID()';
    }

    /**
     * Returns a DB specific piece of SQL which will generate a datetiem repesenting now
     * @abstract
     * @return string
     */
    public function getNowSQL(){
        return 'GETDATE()';
    }

    /**
     * Starts a database transaction.
     * From now on all changes to the database won´t be established and can be discarded.
     * @return result set of the query
     */
    public function transactionStart()
    {
        return $this->query('BEGIN TRANSACTION');
    }

    /**
     * Rolls back a database transaction.
     * All changes of the database since transactionStart() are discarded.
     * @return result set of the query
     */
    public function transactionRollback()
    {
        return $this->query('ROLLBACK TRANSACTION');
    }

    /**
     * Commits a database transaction.
     * All changes of the database since transactionStart() are commited.
     * @return result set of the query
     */
    public function transactionCommit()
    {
        return $this->query('COMMIT TRANSACTION');
    }

    /**
     * @inheritDoc
     */
    public function convertDBCharset(string $charset, string $collation): bool {
        throw new Exception('Database charset conversion not available for MS SQL.');
    }

    /**
     * @inheritDoc
     */
    public function convertTableCharset(string $tableName, string $charset, string $collation): bool {
        throw new Exception('Table charset conversion not available for MS SQL.');
    }

    /**
     * @inheritDoc
     */
    public function getDatabaseCharsetInfo(): array {
        throw new Exception('Retrieving database charset not available for MS SQL.');
    }
}
