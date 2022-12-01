<?php

namespace SpiceCRM\includes\SpiceNumberRanges;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\TimeDate;

/**
 * Class SpiceNumberRanges
 *
 * general class to handle number ranges
 *
 * @package SpiceCRM\includes\SpiceNumberRanges
 */
class SpiceNumberRanges
{
    /**
     * returns the next number for a given range id
     *
     * @param $range
     * @return false|string
     */
    public static function getNextNumber($range)
    {
        $db = DBManagerFactory::getInstance('numberrange');
        $db->transactionStart();
        $numberRange = $db->fetchByAssoc($db->query(sprintf("SELECT * FROM sysnumberranges WHERE id = '%s' FOR UPDATE", $db->quote($range))));
        if (!$numberRange) {
            LoggerManager::getLogger()->error('Number range (ID: ' . $range . ' not found');
            $db->transactionRollback();
            DBManagerFactory::disconnectInstance('numberrange');
            return false;
        }

        # get the next number and increment it;
        $nextNumber = (int)($numberRange['next_number'] ?: $numberRange['range_from']);
        $nextNumber++;

        # Does the next created number exceed the maximum?
        if ($nextNumber > $numberRange['range_to']) {
            LoggerManager::getLogger()->error('Created next number (' . $nextNumber . ') exceeds the maxium (' . $numberRange['range_to'] . ') of number range (ID: ' . $range . ').');
            $db->transactionRollback();
            DBManagerFactory::disconnectInstance('numberrange');
            return false; # Why?! We still have a valid number. Only one, but at least one.
        }

        // Note the next number to be used in the database:
        // update and commit the query so we release the log and then disconnect
        $db->query("UPDATE sysnumberranges SET next_number='$nextNumber' WHERE id='$range'");
        $db->transactionCommit();
        DBManagerFactory::disconnectInstance('numberrange');

        $number = $numberRange['next_number'] ?: $numberRange['range_from'];

        # set a padding to the number:
        if (!empty($numberRange['length'])) {
            $length = !empty($numberRange['prefix']) ? $numberRange['length'] - strlen($numberRange['prefix']) : $numberRange['length'];
            $number = str_pad($number, $length, '0', STR_PAD_LEFT);
        }

        # Uses the prefix defined in the db table "sysnumberranges".
        if (!empty($numberRange['prefix'])) $number = $numberRange['prefix'] . $number;

        return $number;
    }

    /**
     * returns the next number for a given module and field
     *
     * @param $module
     * @param $field
     * @return false|int
     */
    public static function getNextNumberForField($module, $field)
    {
        $db = DBManagerFactory::getInstance('numberrange');
        $db->transactionStart();
        $numberRange = $db->fetchByAssoc($db->query("SELECT sysnumberranges.* FROM sysnumberranges, sysnumberrangeallocation WHERE sysnumberranges.id = sysnumberrangeallocation.numberrange AND sysnumberrangeallocation.module = '$module' AND sysnumberrangeallocation.field = '$field' AND sysnumberrangeallocation.valid_from <= '".TimeDate::getInstance()->nowDbDate()."' AND sysnumberrangeallocation.valid_to >= '".TimeDate::getInstance()->nowDbDate()."' FOR UPDATE"));
        if (!$numberRange) {
            $db->transactionRollback();
            DBManagerFactory::disconnectInstance('numberrange');
            LoggerManager::getLogger()->error('Number range (module: ' . $module . ', field: ' . $field . ' not found.');
            return false;
        }

        # get the next number and increment it;
        $nextNumber = (int)($numberRange['next_number'] ?: $numberRange['range_from']);
        $nextNumber++;

        # Does the created number exceed the maximum?
        if ($nextNumber > $numberRange['range_to']) {
            $db->transactionRollback();
            DBManagerFactory::disconnectInstance('numberrange');
            LoggerManager::getLogger()->error('Created next number (' . $nextNumber . ') exceeds the maxium (' . $numberRange['range_to'] . ') of number range (module: ' . $module . ', field: ' . $field . ').');
            return false; # Why?! We still have a valid number. Only one, but at least one.
        }

        // update and commit the query so we release the log and then disconnect
        $db->query("UPDATE sysnumberranges SET next_number = '$nextNumber' WHERE id = '{$numberRange['id']}'");
        $db->transactionCommit();
        DBManagerFactory::disconnectInstance('numberrange');

        $number = $numberRange['next_number'] ?: $numberRange['range_from'];

        # set a padding to the number:
        if (!empty($numberRange['length'])) {
            $length = !empty($numberRange['prefix']) ? $numberRange['length'] - strlen($numberRange['prefix']) : $numberRange['length'];
            $number = str_pad($number, $length, '0', STR_PAD_LEFT);
        }

        # Uses the prefix defined in the db table "sysnumberranges".
        if (!empty($numberRange['prefix'])) $number = $numberRange['prefix'] . $number;

        return $number;
    }
}
