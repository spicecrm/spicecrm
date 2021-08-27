<?php
namespace SpiceCRM\includes\utils;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceFileUtils;

class FileUtils
{
    /**
     * @param $file
     * @return string
     */
    public static function createCacheDirectory($file): string {
        $paths = explode('/',$file);
        $dir = rtrim(SpiceConfig::getInstance()->config['cache_dir'], '/\\');
        if (!file_exists($dir)) {
            SpiceFileUtils::spiceMkdir($dir, 0775);
        }
        for ($i = 0; $i < sizeof($paths) - 1; $i++) {
            $dir .= '/' . $paths[$i];
            if (!file_exists($dir)) {
                SpiceFileUtils::spiceMkdir($dir, 0775);
            }
        }
        return $dir . '/'. $paths[sizeof($paths) - 1];
    }

    /**
     * @param $baseDir
     * @param string $prefix
     * @return false|string
     */
    public static function mkTempDir($baseDir, string $prefix = "" ) {
        $tempDir = tempnam( $baseDir, $prefix );
        if (!$tempDir || !unlink($tempDir)) {
            return false;
        }

        if (SpiceFileUtils::spiceMkdir($tempDir)) {
            return $tempDir;
        }

        return false;
    }

    /**
     * @param $the_name
     * @param $the_array
     * @param $the_file
     * @param string $mode
     * @param string $header
     * @return bool
     */
    public static function writeArrayToFile( $the_name, $the_array, $the_file, $mode="w", $header='' ): bool {
        if (!empty($header) && ($mode != 'a' || !file_exists($the_file))) {
            $the_string = $header;
        } else {
            $the_string =   "<?php\n" .
                '// created: ' . date('Y-m-d H:i:s') . "\n";
        }
        $exp = var_export($the_array, TRUE);
        $the_string .= "\$$the_name = " .
            $exp .
            ";";

        return SpiceFileUtils::spiceFilePutContents($the_file, $the_string, LOCK_EX) !== false;
    }

    /**
     * @param $path
     * @return bool
     */
    public static function mkdirRecursive($path): bool {
        if (SpiceFileUtils::spiceIsDir($path, 'instance')) {
            return(true);
        }
        if (SpiceFileUtils::spiceIsFile($path, 'instance')) {
            if (!empty(LoggerManager::getLogger())) {
                LoggerManager::getLogger()->fatal("ERROR: mkdir_recursive(): argument $path is already a file.");
            }
            return false;
        }

        //make variables with file paths
        $pathcmp = $path = rtrim(SpiceFileUtils::cleanPath($path), '/');
        $basecmp = $base = rtrim(SpiceFileUtils::cleanPath(getcwd()), '/');
        if (SpiceUtils::isWindows()) {
            //make path variable lower case for comparison in windows
            $pathcmp = strtolower($path);
            $basecmp = strtolower($base);
        }

        if ($basecmp == $pathcmp) {
            return true;
        }
        $base .= "/";
        if (strncmp($pathcmp, $basecmp, strlen($basecmp)) == 0) {
            /* strip current path prefix */
            $path = substr($path, strlen($base));
        }
        $thePath = '';
        $dirStructure = explode("/", $path);
        if ($dirStructure[0] == '') {
            // absolute path
            $base = '/';
            array_shift($dirStructure);
        }
        if (SpiceUtils::isWindows()) {
            if (strlen($dirStructure[0]) == 2 && $dirStructure[0][1] == ':') {
                /* C: prefix */
                $base = array_shift($dirStructure)."\\";
            } elseif ($dirStructure[0][0].$dirStructure[0][1] == "\\\\") {
                /* UNC absolute path */
                $base = array_shift($dirStructure)."\\".array_shift($dirStructure)."\\"; // we won't try to mkdir UNC share name
            }
        }
        foreach ($dirStructure as $dirPath) {
            $thePath .= $dirPath."/";
            $mkPath = $base.$thePath;

            if (!is_dir($mkPath )) {
                if (!SpiceFileUtils::spiceMkdir($mkPath)) {
                    return false;
                }
            }
        }
        return true;
    }
}