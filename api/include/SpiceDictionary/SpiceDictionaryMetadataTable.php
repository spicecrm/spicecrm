<?php

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceSingleton;

abstract class SpiceDictionaryMetadataTable extends SpiceSingleton
{
    protected static string $tableName = "";

    protected static string $cacheName = "";

    protected array $data;

    public function __construct() {
        $cached = SpiceCache::get(static::$cacheName);
        if ($cached) {
            $this->data = $cached;
        }

        $db = DBManagerFactory::getInstance();
        $this->data = [];
        $sql = "SELECT * FROM " . static::$tableName;
        $dataQuery = $db->query($sql);
        while ($item = $db->fetchByAssoc($dataQuery)) {
            $this->data[$item['id']] = array_merge($item, ['scope' => 'g']);
        }

        $this->writeCache();
    }

    public function writeCache(): void {
        SpiceCache::set(static::$cacheName, $this->data);
    }

    public function getData(): array {
        return array_values($this->data);
    }

    public function getItemById($id): ?array {
        return $this->data[$id];
    }

    public function addItem(array $definition): void {
        DBManagerFactory::getInstance()->insertQuery(static::$tableName, $definition);

        $this->data[$definition['id']] = $definition;

        $this->writeCache();
    }

    public static function getTableName(): string {
        return static::$tableName;
    }

    public function getItemByLabel(string $label): mixed {
        foreach ($this->data as $item) {
            if (strtolower($item['label']) == strtolower($label)) {
                return new $item['class']();
            }
        }

        return null;
    }
}
