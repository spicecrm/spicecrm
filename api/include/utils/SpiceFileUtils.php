<?php
namespace SpiceCRM\includes\utils;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceFileUtils
{
    /**
     * Call this function instead of mkdir to apply preconfigured permission
     * settings when creating the directory.  This method is basically
     * a wrapper to the PHP mkdir function except that it supports setting
     * the mode value by using the configuration file (if set).  The mode is
     * 0777 by default.
     *
     * @param $pathname - String value of the directory to create
     * @param $mode - The integer value of the permissions mode to set the created directory to
     * @param bool $recursive - boolean value indicating whether or not to create recursive directories if needed
     * @param string $context
     * @return boolean - Returns true on success false on failure
     */
    public static function spiceMkdir($pathname, $mode = null, bool $recursive = false, string $context = ''): bool {
        $mode = self::getMode('dir_mode', $mode);

        if (self::spiceIsDir($pathname,$mode)) {
            return true;
        }

        $result = false;
        if (empty($mode)) {
            $mode = 0777;
        }
        if (empty($context)) {
            $result = @mkdir($pathname, $mode, $recursive);
        } else {
            $result = @mkdir($pathname, $mode, $recursive, $context);
        }

        if ($result) {
            if (!self::spiceChmod($pathname, $mode)) {
                return false;
            }
            if (!empty(SpiceConfig::getInstance()->config['default_permissions']['user'])) {
                if (!self::spiceChown($pathname)) {
                    return false;
                }
            }
            if (!empty(SpiceConfig::getInstance()->config['default_permissions']['group'])) {
                if (!self::spiceChgrp($pathname)) {
                    return false;
                }
            }
        } else {
            LoggerManager::getLogger()->error("Cannot create directory $pathname cannot be touched");
        }

        return $result;
    }

    /**
     * Convert all \ to / in path, remove multiple '/'s and '/./'
     * @param string $path
     * @return string
     */
    public static function cleanPath(string $path): string {
        // clean directory/file path with a functional equivalent
        $appendpath = '';
        if (SpiceUtils::isWindows() && strlen($path) >= 2 && $path[0].$path[1] == "\\\\") {
            $path = substr($path,2);
            $appendpath = "\\\\";
        }
        $path = str_replace( "\\", "/", $path );
        $path = str_replace( "//", "/", $path );
        $path = str_replace( "/./", "/", $path );
        return $appendpath.$path;
    }

    /**
     * Call this function instead of fopen to apply preconfigured permission
     * settings when creating the the file.  This method is basically
     * a wrapper to the PHP fopen function except that it supports setting
     * the mode value by using the configuration file (if set).  The mode is
     * 0777 by default.
     *
     * @param $filename - String value of the file to create
     * @param $mode - The integer value of the permissions mode to set the created file to
     * @param $use_include_path - boolean value indicating whether or not to search the the included_path
     * @param $context
     * @return boolean - Returns a file pointer on success, false otherwise
     */
    public static function spiceFopen($filename, $mode, $use_include_path = false, $context = null):bool {
        //check to see if the file exists, if not then use touch to create it.
        if (!file_exists($filename)) {
            self::spiceTouch($filename);
        }

        if (empty($context)) {
            return fopen($filename, $mode, $use_include_path);
        } else {
            return fopen($filename, $mode, $use_include_path, $context);
        }
    }

    /**
     * Call this function instead of file_put_contents to apply preconfigured permission
     * settings when creating the the file.  This method is basically
     * a wrapper to the PHP file_put_contents function except that it supports setting
     * the mode value by using the configuration file (if set).  The mode is
     * 0777 by default.
     *
     * @param $filename - String value of the file to create
     * @param $data - The data to be written to the file
     * @param $flags - int as specifed by file_put_contents parameters
     * @param $context
     * @return int - Returns the number of bytes written to the file, false otherwise.
     */
    public static function spiceFilePutContents($filename, $data, $flags = null, $context = null) {
        //check to see if the file exists, if not then use touch to create it.
        if (!file_exists($filename)) {
            self::spiceTouch($filename);
        }

        if (!is_writable($filename)) {
            LoggerManager::getLogger()->error("File $filename cannot be written to");
            return false;
        }

        if (empty($flags)) {
            return file_put_contents($filename, $data);
        } elseif (empty($context)) {
            return file_put_contents($filename, $data, $flags);
        } else {
            return file_put_contents($filename, $data, $flags, $context);
        }
    }

    /**
     * This is an atomic version of sugar_file_put_contents.  It attempts to circumvent the shortcomings of file_put_contents
     * by creating a temporary unique file and then doing an atomic rename operation.
     *
     * @param $filename - String value of the file to create
     * @param $data - The data to be written to the file
     * @param string $mode String value of the parameter to specify the type of access you require to the file stream
     * @param boolean $use_include_path set to '1' or TRUE if you want to search for the file in the include_path too
     * @param context $context Context to pass into fopen operation
     * @return boolean - Returns true if $filename was created, false otherwise.
     */
    public static function spiceFilePutContentsAtomic($filename, $data, $mode = 'wb', $use_include_path = false, $context = null): bool {
        $dir = dirname($filename);
        $temp = tempnam($dir, 'temp');

        if (!($f = @fopen($temp, $mode))) {
            $temp =  $dir . DIRECTORY_SEPARATOR . uniqid('temp');
            if (!($f = @fopen($temp, $mode))) {
                //trigger_error("sugar_file_put_contents_atomic() : error writing temporary file '$temp'", E_USER_WARNING);
                return false;
            }
        }

        fwrite($f, $data);
        fclose($f);

        if (!@rename($temp, $filename)) {
            @unlink($filename);
            if (!@rename($temp, $filename)) {
                // cleaning up temp file to avoid filling up temp dir
                @unlink($temp);
                //trigger_error("sugar_file_put_contents_atomic() : fatal rename failure '$temp' -> '$filename'", E_USER_WARNING);
            }
        }

        if (file_exists($filename)) {
            return self::spiceChmod($filename, 0655);
        }

        return false;
    }

    /**
     * @param $filename - String value of the file to create
     * @param bool $use_include_path - boolean value indicating whether or not to search the the included_path
     * @param $context
     * @return string|boolean - Returns a file data on success, false otherwise
     */
    public static function spiceFileGetContents($filename, bool $use_include_path = false, $context = null) {
        //check to see if the file exists, if not then use touch to create it.
        if (!file_exists($filename)) {
            self::spiceTouch($filename);
        }

        if (!is_readable($filename)) {
            LoggerManager::getLogger()->error("File $filename cannot be read");
            return false;
        }

        if (empty($context)) {
            return file_get_contents($filename, $use_include_path);
        } else {
            return file_get_contents($filename, $use_include_path, $context);
        }
    }

    /**
     * Attempts to set the access and modification times of the file named in the filename
     * parameter to the value given in time . Note that the access time is always modified,
     * regardless of the number of parameters.  If the file does not exist it will be created.
     * This method is basically a wrapper to the PHP touch method except that created files
     * may be set with the permissions specified in the configuration file (if set).
     *
     * @param $filename - The name of the file being touched.
     * @param $time - The touch time. If time  is not supplied, the current system time is used.
     * @param $atime - If present, the access time of the given filename is set to the value of atime
     * @return boolean - Returns TRUE on success or FALSE on failure.
     *
     */
    public static function spiceTouch($filename, $time = null, $atime = null): ?bool {
        $result = false;

        if (!empty($atime) && !empty($time)) {
            $result = @touch($filename, $time, $atime);
        } elseif (!empty($time)) {
            $result = @touch($filename, $time);
        } else {
            $result = @touch($filename);
        }

        if (!$result) {
            LoggerManager::getLogger()->error("File $filename cannot be touched");
            return $result;
        }
        if (!empty(SpiceConfig::getInstance()->config['default_permissions']['file_mode'])) {
            self::spiceChmod($filename, SpiceConfig::getInstance()->config['default_permissions']['file_mode']);
        }
        if (!empty(SpiceConfig::getInstance()->config['default_permissions']['user'])) {
            self::spiceChown($filename);
        }
        if (!empty(SpiceConfig::getInstance()->config['default_permissions']['group'])) {
            self::spiceChgrp($filename);
        }

        return true;
    }

    /**
     * Attempts to change the permission of the specified filename to the mode value specified in the
     * default_permissions configuration; otherwise, it will use the mode value.
     *
     * @param  string    filename - Path to the file
     * @param  int $mode The integer value of the permissions mode to set the created directory to
     * @return boolean   Returns TRUE on success or FALSE on failure.
     */
    public static function spiceChmod($filename, $mode = null): bool {
        if (!is_int($mode)) {
            $mode = (int) $mode;
        }
        if (!SpiceUtils::isWindows()) {
            if (!isset($mode)) {
                $mode = self::getMode('file_mode', $mode);
            }
            if (isset($mode) && $mode > 0) {
                return @chmod($filename, $mode);
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Attempts to change the owner of the file filename to the user specified in the
     * default_permissions configuration; otherwise, it will use the user value.
     *
     * @param filename - Path to the file
     * @param user - A user name or number
     * @return boolean - Returns TRUE on success or FALSE on failure.
     */
    public static function spiceChown($filename, $user = ''): bool {
        if (!SpiceUtils::isWindows()) {
            if (strlen($user)) {
                return chown($filename, $user);
            } else {
                if (strlen(SpiceConfig::getInstance()->config['default_permissions']['user'])) {
                    $user = SpiceConfig::getInstance()->config['default_permissions']['user'];
                    return chown($filename, $user);
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Attempts to change the group of the file filename to the group specified in the
     * default_permissions configuration; otherwise it will use the group value.
     *
     * @param filename - Path to the file
     * @param group - A group name or number
     * @return boolean - Returns TRUE on success or FALSE on failure.
     */
    public static function spiceChgrp($filename, $group = ''): bool {
        if (!SpiceUtils::isWindows()) {
            if (!empty($group)) {
                return chgrp($filename, $group);
            } else {
                if (!empty(SpiceConfig::getInstance()->config['default_permissions']['group'])) {
                    $group = SpiceConfig::getInstance()->config['default_permissions']['group'];
                    return chgrp($filename, $group);
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Will check to see if there is a default mode defined in the config file, otherwise return the
     * $mode given as input
     *
     * @param int|null $mode - the mode being passed by the calling function. This value will be overridden by a value
     * defined in the config file.
     * @return int - the mode either found in the config file or passed in via the input parameter
     */
    public static function getMode($key = 'dir_mode', ?int $mode = null): int {
        if (!is_int($mode)) {
            $mode = (int) $mode;
        }

        if (!SpiceUtils::isWindows()) {
            $conf_inst = SpiceConfig::getInstance();
            $mode = $conf_inst->get('default_permissions.'.$key, $mode);
        }
        return $mode;
    }

    /**
     * @param $path
     * @param string $mode
     * @return bool
     */
    public static function spiceIsDir($path, string $mode = 'r'): bool {
        if (defined('TEMPLATE_URL')) {
            return is_dir($path, $mode);
        }
        return is_dir($path);
    }

    /**
     * @param $path
     * @param string $mode
     * @return bool
     */
    public static function spiceIsFile($path, string $mode = 'r'): bool {
        if (defined('TEMPLATE_URL')) {
            return is_file($path, $mode);
        }
        return is_file($path);
    }

    /**
     * Get filename in cache directory
     * @api
     * @param string $file
     */
    public static function spiceCached($file): string {
        static $cdir = null;
        if (empty($cdir) && !empty(SpiceConfig::getInstance()->config['cache_dir'])) {
            $cdir = rtrim(SpiceConfig::getInstance()->config['cache_dir'], '/\\');
        }
        if (empty($cdir)) {
            $cdir = "cache";
        }
        return "$cdir/$file";
    }
}