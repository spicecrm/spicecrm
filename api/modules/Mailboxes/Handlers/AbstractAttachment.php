<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use Exception;

abstract class AbstractAttachment
{
    public $filename;
    public $filesize;
    public $filemd5;
    public $mime_type;
    public $content;

    const ATTACHMENT_DIR = "upload://";

    /**
     * saveFile
     *
     * Saves the attachment in the file system
     */
    public function saveFile() {
        if (!is_writable(self::ATTACHMENT_DIR)) {
            throw new Exception(self::ATTACHMENT_DIR . ' is not writable.');
        }

        file_put_contents(self::ATTACHMENT_DIR . $this->filename, $this->content);

        if(file_exists(self::ATTACHMENT_DIR . $this->filename)) {
            $this->initMD5();

            rename(self::ATTACHMENT_DIR . $this->filename,
                self::ATTACHMENT_DIR . $this->filemd5);

            $this->initFilesize();
        }
    }

    /**
     * initMd5
     *
     * Initializes the md5 attribute.
     */
    protected function initMd5() {
        $this->filemd5 = md5_file(self::ATTACHMENT_DIR . $this->filename);
    }

    /**
     * initFilesize
     *
     * Initializes the file size attribute.
     */
    protected function initFilesize() {
        $this->filesize = filesize(self::ATTACHMENT_DIR . $this->filemd5);
    }
}
