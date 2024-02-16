<?php

namespace SpiceCRM\includes\DataStreams\wrappers;


abstract class StreamWrapperAbstract
{
    /**
     * holds the stream config object which will be set by the register method
     */
    protected static ?object $config;
    /**
     * holds the stream protocol name
     */
    protected static ?string $streamName;
    /**
     * The current context, or null if no context was passed to the caller function.
     * @var resource
     */
    public $context;

    /**
     * Constructs a new stream wrapper
     *
     */
    public function __construct() {}

    /**
     * Close directory handle
     * @return bool
     */
    abstract public function dir_closedir(): bool;

    /**
     * Open directory handle
     * @param string $path
     * @param int $options
     * @return bool
     */
    abstract public function dir_opendir(string $path, int $options): bool;

    /**
     * Read entry from directory handle
     * @return string
     */
    abstract public function dir_readdir(): string;

    /**
     * Rewind directory handle
     * @return bool
     */
    abstract public function dir_rewinddir(): bool;

    /**
     * Create a directory
     * @param string $path
     * @param int $mode
     * @param int $options
     * @return bool
     */
    abstract public function mkdir(string $path, int $mode, int $options): bool;

    /**
     * Renames a file or directory
     * @param string $path_from
     * @param string $path_to
     * @return bool
     */
    abstract public function rename(string $path_from, string $path_to): bool;

    /**
     * Removes a directory
     * @param string $path
     * @param int $options
     * @return bool
     */
    abstract public function rmdir(string $path, int $options): bool;

    /**
     * Retrieve the underlying resource
     * @param int $cast_as
     * @return false | resource
     */
    abstract public function stream_cast(int $cast_as);

    /**
     * Close a resource
     * @return void
     */
    abstract public function stream_close(): void;

    /**
     * Tests for end-of-file on a file pointer
     * @return bool
     */
    abstract public function stream_eof(): bool;

    /**
     * Flushes the output
     * @return bool
     */
    abstract public function stream_flush(): bool;

    /**
     * Advisory file locking
     * @param int $operation
     * @return bool
     */
    abstract public function stream_lock(int $operation): bool;

    /**
     * Change stream metadata
     * @param string $path
     * @param int $option
     * @param mixed $value
     * @return bool
     */
    public function stream_metadata(string $path, int $option, $value): bool
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
    abstract public function stream_open(string $path, string $mode, int $options, ?string &$opened_path): bool;

    /**
     * Read from stream
     * @param int $count
     * @return string|false
     */
    abstract public function stream_read(int $count);

    /**
     * Seeks to specific location in a stream
     * @param int $offset
     * @param int $whence
     * @return bool
     */
    abstract public function stream_seek(int $offset, int $whence = SEEK_SET): bool;


    /**
     * Change stream options
     * @param int $option
     * @param int $arg1
     * @param int $arg2
     * @return bool
     */
    public function stream_set_option(int $option, int $arg1, int $arg2): bool
    {
        return true;
    }

    /**
     * Retrieve information about a file resource
     * @return array|false
     */
    abstract public function stream_stat();

    /**
     * Retrieve the current position of a stream
     * @return int
     */
    abstract public function stream_tell(): int;

    /**
     * Truncate stream
     * @param int $new_size
     * @return bool
     */
    public function stream_truncate(int $new_size): bool
    {
        return false;
    }

    /**
     * Write to stream
     * @param string $data
     * @return int
     */
    abstract public function stream_write(string $data): int;

    /**
     * Delete a file
     * @param string $path
     * @return bool
     */
    abstract public function unlink(string $path): bool;

    /**
     * Retrieve information about a file
     * @param string $path
     * @param int $flags
     * @return array|false
     */
    abstract public function url_stat(string $path, int $flags);

    /**
     * Destructs an existing stream wrapper
     */
    public function __destruct() {}
}
