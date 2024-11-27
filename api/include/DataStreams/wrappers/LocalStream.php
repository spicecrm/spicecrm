<?php

namespace SpiceCRM\includes\DataStreams\wrappers;

use SpiceCRM\includes\DataStreams\interfaces\StreamWrapperRegisterI;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\utils\SpiceFileUtils;

/**
 * local stream handler
 */
class LocalStream extends StreamWrapperAbstract implements StreamWrapperRegisterI
{
    /**
     * holds the stream config object which will be set by the register method
     * {baseDir: string the base dir for the stream}
     */
    protected static ?object $config;
    /**
     * resource instance of the specified dir in the stream
     * @var resource | false
     */
    private $dirResource;
    /**
     * resource instance of the specified file in the stream
     * @var resource | false
     */
    private $filePointerResource;

    /**
     * handle registering the stream wrapper
     * set the streamName from the $name param
     * @param string $name
     * @param object|null $config
     * @throws Exception
     */
    public static function register(string $name, ?object $config = null): void
    {
        self::$streamName = $name;
        self::$config = $config;

        if (empty(self::$config->baseDir)) {
            throw new Exception("LocalStream $name missing config class_config.baseDir");
        }

        SpiceFileUtils::spiceMkdir(self::$config->baseDir, 0777, true);

        stream_register_wrapper($name, __CLASS__);
    }

    /**
     * get the full path with base dir
     * @param string $path
     * @return string
     */
    public static function path(string $path): string
    {
        # remove stream name from the path
        $path = str_replace(self::$streamName . '://', '', $path);
        return self::$config->baseDir . "/" . $path;
    }

    /**
     * Close directory handle
     * @return bool
     */
    public function dir_closedir(): bool
    {
        closedir($this->dirResource);
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
        $this->dirResource = opendir(self::path($path));
        return !empty($this->dirResource);
    }

    /**
     * Read entry from directory handle
     * @return string
     */
    public function dir_readdir(): string
    {
        return readdir($this->dirResource);
    }

    /**
     * Rewind directory handle
     * @return bool
     */
    public function dir_rewinddir(): bool
    {
        rewinddir($this->dirResource);

        return true;
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
        return $this->filePointerResource;
    }

    /**
     * Close a resource
     * @return void
     */
    public function stream_close(): void
    {
        fclose($this->filePointerResource);
    }

    /**
     * Tests for end-of-file on a file pointer
     * @return bool
     */
    public function stream_eof(): bool
    {
        return feof($this->filePointerResource);
    }

    /**
     * Flushes the output
     * @return bool
     */
    public function stream_flush(): bool
    {
        return fflush($this->filePointerResource);
    }

    /**
     * Advisory file locking
     * @param int $operation
     * @return bool
     */
    public function stream_lock(int $operation): bool
    {
        return flock($this->filePointerResource, $operation);
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
        $fullPath = self::path($path);

        if (empty($fullPath)) return false;

        if ($mode == 'r') {
            $this->filePointerResource = fopen($fullPath, $mode);
        } else {
            // if we will be writing, try to transparently create the directory
            $this->filePointerResource = @fopen($fullPath, $mode);
            if (!$this->filePointerResource && !file_exists(dirname($fullPath))) {
                mkdir(dirname($fullPath), 0755, true);
                $this->filePointerResource = fopen($fullPath, $mode);
            }
        }

        return !empty($this->filePointerResource);
    }

    /**
     * Read from stream
     * @param int $count
     * @return string|false
     */
    public function stream_read(int $count)
    {
        return fread($this->filePointerResource, $count);
    }

    /**
     * Seeks to specific location in a stream
     * @param int $offset
     * @param int $whence
     * @return bool
     */
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool
    {
        return fseek($this->filePointerResource, $offset, $whence) == 0;
    }

    /**
     * Retrieve information about a file resource
     * @return array|false
     */
    public function stream_stat()
    {
        return fstat($this->filePointerResource);
    }

    /**
     * Retrieve the current position of a stream
     * @return int
     */
    public function stream_tell(): int
    {
        return ftell($this->filePointerResource);
    }

    /**
     * Write to stream
     * @param string $data
     * @return int
     */
    public function stream_write(string $data): int
    {
        return fwrite($this->filePointerResource, $data);
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
}


