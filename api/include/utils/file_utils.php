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


use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

require_once('include/utils/array_utils.php');
require_once('include/utils/sugar_file_utils.php');

/**
 * @deprecated moved to FileUtils
 */
function create_cache_directory($file)
{
    $paths = explode('/',$file);
    $dir = rtrim(SpiceConfig::getInstance()->config['cache_dir'], '/\\');
    if(!file_exists($dir))
    {
        sugar_mkdir($dir, 0775);
    }
    for($i = 0; $i < sizeof($paths) - 1; $i++)
    {
        $dir .= '/' . $paths[$i];
        if(!file_exists($dir))
        {
            sugar_mkdir($dir, 0775);
        }
    }
    return $dir . '/'. $paths[sizeof($paths) - 1];
}

/**
 * @deprecated moved to FileUtils
 */
function mk_temp_dir( $base_dir, $prefix="" )
{
    $temp_dir = tempnam( $base_dir, $prefix );
    if( !$temp_dir || !unlink( $temp_dir ) )
    {
        return( false );
    }

    if( sugar_mkdir( $temp_dir ) ){
        return( $temp_dir );
    }

    return( false );
}

/**
 * @deprecated moved to FileUtils
 * @param $the_name
 * @param $the_array
 * @param $the_file
 * @param string $mode
 * @param string $header
 * @return bool
 */
function write_array_to_file( $the_name, $the_array, $the_file, $mode="w", $header='' )
{
    if(!empty($header) && ($mode != 'a' || !file_exists($the_file))){
        $the_string = $header;
    }else{
        $the_string =   "<?php\n" .
            '// created: ' . date('Y-m-d H:i:s') . "\n";
    }
    $exp = var_export($the_array, TRUE);
    $the_string .= "\$$the_name = " .
        $exp .
        ";";

    return sugar_file_put_contents($the_file, $the_string, LOCK_EX) !== false;
}

/**
 * @deprecated moved to FileUtils
 * @param $file
 * @return string
 */
function create_custom_directory($file)
{
    $paths = explode('/',$file);
    $dir = 'custom';
    if(!file_exists($dir))
    {
        sugar_mkdir($dir, 0755);
    }
    for($i = 0; $i < sizeof($paths) - 1; $i++)
    {
        $dir .= '/' . $paths[$i];
        if(!file_exists($dir))
        {
            sugar_mkdir($dir, 0755);
        }
    }
    return $dir . '/'. $paths[sizeof($paths) - 1];
}

/**
 * @deprecated moved to FileUtils
 * Renames a file. If $new_file already exists, it will first unlink it and then rename it.
 * used in SugarLogger.php
 * @param string $old_filename
 * @param string $new_filename
 */
function sugar_rename( $old_filename, $new_filename){
    if (empty($old_filename) || empty($new_filename)) return false;
    $success = false;
    if(file_exists($new_filename)) {
        unlink($new_filename);
        $success = rename($old_filename, $new_filename);
    }
    else {
        $success = rename($old_filename, $new_filename);
    }

    return $success;
}

/**
 * @deprecated moved to FileUtils
 * @param $path
 * @param false $check_is_parent_dir
 * @return bool
 */
function mkdir_recursive($path, $check_is_parent_dir = false)
{
    if(sugar_is_dir($path, 'instance')) {
        return(true);
    }
    if(sugar_is_file($path, 'instance')) {
        if(!empty(LoggerManager::getLogger())) {
            LoggerManager::getLogger()->fatal("ERROR: mkdir_recursive(): argument $path is already a file.");
        }
        return false;
    }

    //make variables with file paths
    $pathcmp = $path = rtrim(clean_path($path), '/');
    $basecmp =$base = rtrim(clean_path(getcwd()), '/');
    if(is_windows()) {
        //make path variable lower case for comparison in windows
        $pathcmp = strtolower($path);
        $basecmp = strtolower($base);
    }

    if($basecmp == $pathcmp) {
        return true;
    }
    $base .= "/";
    if(strncmp($pathcmp, $basecmp, strlen($basecmp)) == 0) {
        /* strip current path prefix */
        $path = substr($path, strlen($base));
    }
    $thePath = '';
    $dirStructure = explode("/", $path);
    if($dirStructure[0] == '') {
        // absolute path
        $base = '/';
        array_shift($dirStructure);
    }
    if(is_windows()) {
        if(strlen($dirStructure[0]) == 2 && $dirStructure[0][1] == ':') {
            /* C: prefix */
            $base = array_shift($dirStructure)."\\";
        } elseif ($dirStructure[0][0].$dirStructure[0][1] == "\\\\") {
            /* UNC absolute path */
            $base = array_shift($dirStructure)."\\".array_shift($dirStructure)."\\"; // we won't try to mkdir UNC share name
        }
    }
    foreach($dirStructure as $dirPath) {
        $thePath .= $dirPath."/";
        $mkPath = $base.$thePath;

        if(!is_dir($mkPath )) {
            if(!sugar_mkdir($mkPath)) return false;
        }
    }
    return true;
}



