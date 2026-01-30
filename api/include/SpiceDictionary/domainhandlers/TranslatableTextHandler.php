<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use Exception;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class TranslatableTextHandler extends SpiceDictionaryDomainHandler
{
    /**
     * retrieve the translations and push them to the non-db field on the bean
     * @param array $item
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws DatabaseException
     */
    public function onRetrieve(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if (!SpiceConfig::getInstance()->get('translatable_fields')) {
            return true;
        }

        $translations = [];

        $db = DBManagerFactory::getInstance();

        $query = $db->query("SELECT * FROM spicemodulefieldtranslations WHERE bean_id = '$bean->id' AND bean_module = '$bean->_module' AND field_name = '{$item['name']}'");

        while ($row = $db->fetchByAssoc($query)) {
            $translations[$row['translation_language']] = (object) $row;
        }

        $fields[$item['name'] . '_translations'] = (object) $translations;

        return true;
    }

    /**
     * get the translations from the array in the non-db JSON field and write them to the translations table
     * previous translations will be deleted before writing new ones
     * @param array $item
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws Exception
     */
    public function beforeSave(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if (!SpiceConfig::getInstance()->get('translatable_fields')) {
            return true;
        }

        $translations = $bean->{$item['name'] . '_translations'};

        if (!is_object($translations) && !is_array($translations)) return true;

        $db = DBManagerFactory::getInstance();

        $db->deleteQuery('spicemodulefieldtranslations', [
            'bean_id' => $bean->id, 'bean_module' => $bean->_module, 'field_name' => $item['name']
        ]);

        foreach ($translations as $translation) {

            $translation = (array) $translation;

            if (empty($translation['translation_text'])) continue;

            $db->insertQuery('spicemodulefieldtranslations', $translation);
        }

        return true;
    }
}