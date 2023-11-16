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

namespace SpiceCRM\includes\DataStreams\wrappers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\DataStreams\interfaces\StreamWrapperRegisterI;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceFileUtils;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

/**
 * @internal
 * Upload/read file stream handler
 */
class UploadStream extends StreamWrapperAbstract implements StreamWrapperRegisterI
{
    /**
     * holds the upload dir
     * @var ?string
     */
    protected static ?string $upload_dir;
    /**
     * @var false | resource
     */
    private $fp;
    /**
     * @var false | resource
     */
    private $dirp;

    /**
     * todo check if needed
     * Get upload directory
     * @return string
     */
    public static function getDir()
    {
        if (empty(self::$upload_dir)) {
            // if we have a tenantid add the tenant to the file
            $tenantid = AuthenticationController::getInstance()->systemtenantid;
            self::$upload_dir = rtrim(SpiceConfig::getInstance()->config['upload_dir'] . ($tenantid ? "/{$tenantid}" : ''), '/\\');
            if (empty(self::$upload_dir)) {
                self::$upload_dir = "upload";
            }
            if (!file_exists(self::$upload_dir)) {
                SpiceFileUtils::spiceMkdir(self::$upload_dir, 0755, true);
            }
        }
        return self::$upload_dir;
    }

    /**
     * Check if upload dir is writable
     * @return bool
     */
    public static function writable(): bool
    {
        return is_writable(self::getDir());
    }

    /**
     * handle registering the stream wrapper
     * set the streamName from the $name param
     * @param string $name
     * @param object|null $config
     */
    public static function register(string $name, ?object $config = null)
    {
        self::$streamName = $name;
        stream_register_wrapper($name, __CLASS__);
    }

    /**
     * Get real FS path of the upload stream file
     * @param string $path Upload stream path (with upload://)
     * @return string|null FS path
     */
    public static function path(string $path): ?string
    {
        $path = substr($path, strlen(self::$streamName) + 3); // cut off upload://
        $path = str_replace("\\", "/", $path); // canonicalize path
        if ($path == ".." || substr($path, 0, 3) == "../" || substr($path, -3, 3) == "/.." || strstr($path, "/../")) {
            return null;
        }
        return self::getDir() . "/" . $path;
    }

    /**
     * Close directory handle
     * @return bool
     */
    public function dir_closedir(): bool
    {
        closedir($this->dirp);
        return true;
    }

    /**
     * Open directory handle
     * @param string $path
     * @param int $options
     * @return bool
     */
    public function dir_opendir(string $path, int $options): bool
    {
        $this->dirp = opendir(self::path($path));
        return !empty($this->dirp);
    }

    /**
     * Read entry from directory handle
     * @return string
     */
    public function dir_readdir(): string
    {
        return readdir($this->dirp);
    }

    /**
     * Rewind directory handle
     * @return bool
     */
    public function dir_rewinddir(): bool
    {
        return rewinddir($this->dirp);
    }

    /**
     * Create a directory
     * @param string $path
     * @param int $mode
     * @param int $options
     * @return bool
     */
    public function mkdir(string $path, int $mode, int $options): bool
    {
        return mkdir(self::path($path), $mode, ($options & STREAM_MKDIR_RECURSIVE) != 0);
    }

    /**
     * Renames a file or directory
     * @param string $path_from
     * @param string $path_to
     * @return bool
     */
    public function rename(string $path_from, string $path_to): bool
    {
        return rename(self::path($path_from), self::path($path_to));
    }

    /**
     * Removes a directory
     * @param string $path
     * @param int $options
     * @return bool
     */
    public function rmdir(string $path, int $options): bool
    {
        return rmdir(self::path($path));
    }

    /**
     * Retrieve the underlying resource
     * @param int $cast_as
     * @return false | resource
     */
    public function stream_cast($cast_as)
    {
        return $this->fp;
    }

    /**
     * Close a resource
     * @return void
     */
    public function stream_close(): void
    {
        fclose($this->fp);
    }

    /**
     * Tests for end-of-file on a file pointer
     * @return bool
     */
    public function stream_eof(): bool
    {
        return feof($this->fp);
    }

    /**
     * Flushes the output
     * @return bool
     */
    public function stream_flush(): bool
    {
        return fflush($this->fp);
    }

    /**
     * Advisory file locking
     * @param int $operation
     * @return bool
     */
    public function stream_lock(int $operation): bool
    {
        return flock($this->fp, $operation);
    }

    /**
     * Opens file or URL
     * @param string $path
     * @param string $mode
     * @param int $options
     * @param string|null $opened_path
     * @return bool
     */
    public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool
    {
        $fullpath = self::path($path);
        if (empty($fullpath)) return false;
        if ($mode == 'r') {
            $this->fp = fopen($fullpath, $mode);
        } else {
            // if we will be writing, try to transparently create the directory
            $this->fp = @fopen($fullpath, $mode);
            if (!$this->fp && !file_exists(dirname($fullpath))) {
                mkdir(dirname($fullpath), 0755, true);
                $this->fp = fopen($fullpath, $mode);
            }
        }
        return !empty($this->fp);
    }

    /**
     * Read from stream
     * @param int $count
     * @return string|false
     */
    public function stream_read(int $count)
    {
        return fread($this->fp, $count);
    }

    /**
     * Seeks to specific location in a stream
     * @param int $offset
     * @param int $whence
     * @return bool
     */
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool
    {
        return fseek($this->fp, $offset, $whence) == 0;
    }

    /**
     * Retrieve information about a file resource
     * @return array|false
     */
    public function stream_stat()
    {
        return fstat($this->fp);
    }

    /**
     * Retrieve the current position of a stream
     * @return int
     */
    public function stream_tell(): int
    {
        return ftell($this->fp);
    }

    /**
     * Write to stream
     * @param string $data
     * @return int
     */
    public function stream_write(string $data): int
    {
        return fwrite($this->fp, $data);
    }

    /**
     * Delete a file
     * @param string $path
     * @return bool
     */
    public function unlink(string $path): bool
    {
        unlink(self::path($path));
        return true;
    }

    /**
     * Retrieve information about a file
     * @param string $path
     * @param int $flags
     * @return array|false
     */
    public function url_stat(string $path, int $flags)
    {
        return @stat(self::path($path));
    }

    public function getStats(string $name, ?object $config = null, $path){
        $size = 0;
        $count = 0;
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator(self::getDir())) as $file) {
            $size += $file->getSize();
            $count++;
        }
        return ['size' => $size, 'count' => $count];
    }
}


