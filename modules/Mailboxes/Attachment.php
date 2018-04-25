<?php
namespace SpiceCRM\modules\Mailboxes;

class Attachment
{
    public $filename;
    public $filesize;
    public $filemd5;
    public $mime_type;
    public $path;
    private $part;

    const TYPE_TEXT        = 0;
    const TYPE_MULTIPART   = 1;
    const TYPE_MESSAGE     = 2;
    const TYPE_APPLICATION = 3;
    const TYPE_AUDIO       = 4;
    const TYPE_IMAGE       = 5;
    const TYPE_VIDEO       = 6;
    const TYPE_OTHER       = 7;

    const ATTACHMENT_DIR = "upload://";

    public function __construct($part)
    {
        $this->part     = $part;

        if ($this->part->ifdparameters) { // attachments
            $this->filename = $this->part->dparameters[0]->value;
        } elseif ($this->part->ifparameters) { // inline images
            $this->filename = str_replace('>', '', str_replace('<', '', $this->part->id));
        }
    }

    /**
     * saveFile
     *
     * Saves the attachment in the file system
     *
     * @param $file_body
     */
    public function saveFile($file_body)
    {
        file_put_contents(self::ATTACHMENT_DIR . $this->filename, $file_body);

        if(file_exists(self::ATTACHMENT_DIR . $this->filename)) {
            $this->initMD5();

            rename(self::ATTACHMENT_DIR . $this->filename,
                self::ATTACHMENT_DIR . $this->filemd5);

            $this->initFilesize();
            $this->initMimeType();
        }
    }

    /**
     * initFilesize
     *
     * Initializes the file size attribute
     */
    private function initFilesize()
    {
        $this->filesize = filesize(self::ATTACHMENT_DIR . $this->filemd5);
    }

    /**
     * initMD5
     *
     * Initializes the md5 attribute
     */
    private function initMD5()
    {
        $this->filemd5 = md5_file(self::ATTACHMENT_DIR . $this->filename);
    }

    /**
     * initMimeType
     *
     * Initializes the mime type attribute
     */
    private function initMimeType()
    {
        switch ($this->part->type) {
            case self::TYPE_TEXT:
                $mime_type = 'TEXT';
                break;
            case self::TYPE_MULTIPART:
                $mime_type = 'MULTIPART';
                break;
            case self::TYPE_MESSAGE:
                $mime_type = 'MESSAGE';
                break;
            case self::TYPE_APPLICATION:
                $mime_type = 'APPLICATION';
                break;
            case self::TYPE_AUDIO:
                $mime_type = 'AUDIO';
                break;
            case self::TYPE_IMAGE:
                $mime_type = 'IMAGE';
                break;
            case self::TYPE_VIDEO:
                $mime_type = 'VIDEO';
                break;
            case self::TYPE_OTHER:
            default:
                $mime_type = 'OTHER';
                break;
        }

        $this->mime_type = $mime_type . '/' . $this->part->subtype;
    }
}