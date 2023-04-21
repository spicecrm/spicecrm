<?php

namespace SpiceCRM\includes\DataStreams\wrappers;

use SpiceCRM\includes\DataStreams\interfaces\StreamWrapperRegisterI;
use SpiceCRM\includes\Logger\LoggerManager;

/**
 * this stream only writes data to a cdn server
 */
class CDNStream extends StreamWrapperAbstract implements StreamWrapperRegisterI
{
    /**
     * holds the file content appended by stream_write
     * @var string
     */
    private string $fileContent;

    /**
     * handle registering the stream wrapper
     * set the streamName from the $name param
     * @param string $name
     * @param object|null $config
     */
    public static function register(string $name, ?object $config = null)
    {
        self::$streamName = $name;
        self::$config = $config;
        stream_register_wrapper($name, __CLASS__);
    }

    /**
     * Close directory handle
     * @return bool
     */
    public function dir_closedir(): bool
    {
        return false;
    }

    /**
     * Open directory handle
     * @param string $path
     * @param int $options
     * @return bool
     */
    public function dir_opendir(string $path, int $options): bool
    {
        return false;
    }

    /**
     * Read entry from directory handle
     * @return string
     */
    public function dir_readdir(): string
    {
        return '';
    }

    /**
     * Rewind directory handle
     * @return bool
     */
    public function dir_rewinddir(): bool
    {
        return false;
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
        return false;
    }

    /**
     * Renames a file or directory
     * @param string $path_from
     * @param string $path_to
     * @return bool
     */
    public function rename(string $path_from, string $path_to): bool
    {
        return false;
    }

    /**
     * Removes a directory
     * @param string $path
     * @param int $options
     * @return bool
     */
    public function rmdir(string $path, int $options): bool
    {
        return false;
    }

    /**
     * Retrieve the underlaying resource
     * @param int $cast_as
     * @return false | resource
     */
    public function stream_cast(int $cast_as)
    {
        return false;
    }

    /**
     * Close a resource
     * @return void
     */
    public function stream_close(): void
    {
        if (!$this->fileContent || !self::$config->cdnurl || !self::$config->cdnuser || !self::$config->cdnsecret || !self::$fileName) {
            return;
        }

        $fileName = self::$fileName;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_POSTFIELDS, base64_encode($this->fileContent));
        curl_setopt($curl, CURLOPT_URL, self::$config->cdnurl. "/$fileName");
        curl_setopt($curl, CURLOPT_USERPWD, self::$config->cdnuser . ":" . self::$config->cdnsecret);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_exec($curl);

        $info = curl_getinfo($curl);

        curl_close($curl);

        if ($info['http_code'] > 300 || $info['http_code'] < 200) {
            LoggerManager::getLogger()->error("MediaFile: Could not upload file ($fileName) to the CDN server ");
        }
    }

    /**
     * Tests for end-of-file on a file pointer
     * @return bool
     */
    public function stream_eof(): bool
    {
        return false;
    }

    /**
     * Flushes the output
     * @return bool
     */
    public function stream_flush(): bool
    {
        return false;
    }

    /**
     * Advisory file locking
     * @param int $operation
     * @return bool
     */
    public function stream_lock(int $operation): bool
    {
        return false;
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
        self::$fileName = pathinfo($path)['basename'];
        return true;
    }

    /**
     * holds the file name extracted from the path in stream_open
     * @var string|null
     */
    private static ?string $fileName;

    /**
     * Read from stream
     * @param int $count
     * @return string|false
     */
    public function stream_read(int $count)
    {
        return false;
    }

    /**
     * Seeks to specific location in a stream
     * @param int $offset
     * @param int $whence
     * @return bool
     */
    public function stream_seek(int $offset, int $whence = SEEK_SET): bool
    {
        return false;
    }

    /**
     * Retrieve information about a file resource
     * @return array|false
     */
    public function stream_stat()
    {
        return false;
    }

    /**
     * Retrieve the current position of a stream
     * @return int
     */
    public function stream_tell(): int
    {
        return 0;
    }

    /**
     * Write to stream over https
     * @param string $data
     * @return int
     */
    public function stream_write(string $data): int
    {
        if (empty($this->fileContent)) {
            $this->fileContent = '';
        }

        $this->fileContent .= $data;

        return strlen($data);
    }

    /**
     * Delete a file
     * @param string $path
     * @return bool
     */
    public function unlink(string $path): bool
    {
        return false;
    }

    /**
     * Retrieve information about a file
     * @param string $path
     * @param int $flags
     * @return array|false
     */
    public function url_stat(string $path, int $flags)
    {
        return false;
    }
}