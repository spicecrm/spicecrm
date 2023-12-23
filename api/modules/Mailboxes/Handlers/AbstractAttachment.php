<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Mailboxes\Handlers;

use Exception;
use SpiceCRM\includes\DataStreams\StreamFactory;

abstract class AbstractAttachment
{
    public $filename;
    public $filesize;
    public $filemd5;
    public $mime_type;
    public $content;

    /**
     * saveFile
     *
     * Saves the attachment in the file system
     */
    public function saveFile() {
        $prefix = StreamFactory::getPathPrefix('upload');

        if (!is_writable($prefix)) {
            throw new Exception($prefix . ' is not writable.');
        }

        file_put_contents($prefix . $this->filename, $this->content);

        if(file_exists($prefix . $this->filename)) {
            $this->initMD5();

            rename($prefix . $this->filename,
                $prefix . $this->filemd5);

            $this->initFilesize();
        }
    }

    /**
     * initMd5
     *
     * Initializes the md5 attribute.
     */
    protected function initMd5() {
        $this->filemd5 = md5_file(StreamFactory::getPathPrefix('upload') . $this->filename);
    }

    /**
     * initFilesize
     *
     * Initializes the file size attribute.
     */
    protected function initFilesize() {
        $this->filesize = filesize(StreamFactory::getPathPrefix('upload') . $this->filemd5);
    }
}
