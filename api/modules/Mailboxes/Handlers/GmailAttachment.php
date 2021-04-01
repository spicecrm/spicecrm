<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\authentication\AuthenticationController;

/*
 * todo move this into spiceattachments
 */
class GmailAttachment
{
    public $id;
    public $fileName;
    public $fileSize;
    public $fileMd5;
    public $mimeType;
    public $externalId;
    public $emailId;
    public $userId;
    public $content;
    public $thumbnail;
    public $deleted;
    public $trdate;

    private $table = 'spiceattachments';

    public function __construct() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $this->id      = create_guid();
        $this->userId  = $current_user->id;
        $this->deleted = 0;
        $this->trdate  = date('Y-m-d H:i:s');
    }

    public function saveFile() {
        $filepath = 'upload://' . $this->fileMd5;
        touch($filepath);

        file_put_contents($filepath, $this->content);
        $this->thumbnail = SpiceAttachments::createThumbnail($this->fileMd5, $this->mimeType);
    }

    public function save() {
        $db = DBManagerFactory::getInstance();

        $insertQuery = "INSERT INTO {$this->table} (id, bean_type, bean_id, user_id, trdate, filename,
             filesize, filemd5, file_mime_type, text, thumbnail, deleted) VALUES (
             '{$this->id}', 'Emails', '{$this->emailId}', '{$this->userId}', '{$this->trdate}',
             '{$this->fileName}', '{$this->fileSize}', '{$this->fileMd5}', '{$this->mimeType}', '',
             '{$this->thumbnail}', '{$this->deleted}')";

        $db->query($insertQuery);

        // todo add some return value
    }
}
