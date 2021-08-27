<?php
namespace SpiceCRM\modules\Mailboxes\processors;

use SpiceCRM\includes\database\DBManagerFactory;

class MailboxProcessor {
    public $id;
    public $mailbox_id;
    public $processor_file = '';
    public $processor_class;
    public $processor_method;
    public $priority;
    public $stop_on_success;
    public $deleted;

    private $table = 'mailbox_processors';

    protected $attributes = [
        'id',
        'mailbox_id',
        'processor_file',
        'processor_class',
        'processor_method',
        'priority',
        'stop_on_success',
    ];

    public function __construct($processorData) {
        foreach ($processorData as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function primaryKeys() {
        return [
            'id' => $this->id,
        ];
    }

    public function toArray() {
        $attributeArray = [];

        foreach ($this->attributes as $attribute) {
            $attributeArray[$attribute] = $this->$attribute;
        }

        return $attributeArray;
    }

    public function save() {
        if ($this->exists()) {
            // $this->processor_class = str_replace('\\', '\\\\', $this->processor_class);

            return $this->update();
        }

        return $this->insert();
    }

    private function update() {
        $db = DBManagerFactory::getInstance();

        return $db->updateQuery(
            $this->table,
            $this->primaryKeys(),
            $this->toArray()
        );
    }

    private function insert() {
        $db = DBManagerFactory::getInstance();

        return $db->insertQuery(
            $this->table,
            $this->toArray()
        );
    }

    public function delete() {
        $db = DBManagerFactory::getInstance();

        $q = "DELETE FROM " . $this->table . " WHERE id = '" . $this->id . "'";
        $result = $db->query($q);

        return $result;
    }

    /**
     * all
     *
     * Returns all processors from the $processor_directory that are not on the $excluded_files list
     * It assumes, that the classname is equal to the filename
     *
     * @return array
     */
    public static function all() {
        $processors = [];
        $processor_directories = [
            'custom' => __DIR__ . '/../../../custom/modules/Mailboxes/processors',
            'master' => __DIR__ . '/../../../modules/Mailboxes/processors',
        ];
        $excluded_files = ['.', '..', 'Processor.php', 'MailboxProcessor.php'];
        $excluded_methods = ['__construct'];

        foreach ($processor_directories as $type => $processor_directory) {
            // todo check if directory exists
            if (!file_exists($processor_directory)) {
                continue;
            }

            foreach (scandir($processor_directory) as $file) {
                if (!in_array($file, $excluded_files)) {
                    $filename  = explode('.', $file);
                    $classname = 'SpiceCRM\\'
                        . ($type == 'master' ? '' : 'custom\\')
                        . 'modules\\Mailboxes\\processors\\' . $filename[0];

                    if (class_exists($classname)) {
                        array_push($processors, [
                            'name'    => $filename[0],
                            'processor_class'   => $classname,
                            'methods' => array_diff(get_class_methods($classname), $excluded_methods),
                        ]);
                    }
                }
            }
        }

        return $processors;
    }

    public function validate() {
        if (!isset($this->mailbox_id)) {
            return false;
        }

        if (!isset($this->processor_class)) {
            return false;
        }

        if (!class_exists($this->processor_class)) {
            return false;
        }

        if (!isset($this->processor_method)) {
            return false;
        }

        if (!method_exists($this->processor_class, $this->processor_method)) {
            return false;
        }

        if (!isset($this->priority)) {
            return false;
        }

        if (!isset($this->stop_on_success)) {
            return false;
        }

        return true;
    }

    private function exists() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT id FROM " . $this->table
            . " WHERE id = '" . $this->id . "'"
        //    . " WHERE mailbox_id = '" . $this->mailbox_id . "'"
        //    . " AND processor_class = '" . $this->processor_class . "'"
        //    . " AND processor_method = '" . $this->processor_method . "'"
        //   . " AND processor_file = '" . $this->processor_file . "'"
        ;

        $q = $db->query($query);

        if ($db->fetchRow($q)) {
            return true;
        } else {
            return false;
        }
    }
}