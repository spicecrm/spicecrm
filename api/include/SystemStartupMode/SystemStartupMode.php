<?php

namespace SpiceCRM\includes\SystemStartupMode;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceSingleton;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SystemStartupMode extends SpiceSingleton
{
    /**
     * get the startup mode
     * @return string|null
     */
    public static function getMode(): ?string
    {
        return SpiceConfig::getInstance()->get('system.startup_mode');
    }

    /**
     * check if the system has dictionary and set recovery mode
     * @throws Exception
     */
    public static function checkDictionary()
    {
        if (SpiceCache::get(SpiceDictionary::cachename)) {
            return;
        }

        $db = DBManagerFactory::getInstance();

        $hasDBCache = $db->tableExists(SpiceDictionary::table) && $db->getOne("SELECT id FROM " . SpiceDictionary::table);

        if (!$hasDBCache) {
            SystemStartupMode::setRecoveryMode(true);
        }
    }

    /**
     * if the system is in recovery mode
     * @return bool
     */
    public static function recoveryModeEnabled(): bool
    {
        return self::getMode() === 'recovery';
    }

    /**
     * if the system is in recovery mode
     * @return bool
     */
    public static function maintenanceModeEnabled(): bool
    {
        return self::getMode() === 'maintenance';
    }

    /**
     * set the recovery mode flag
     * @throws Exception
     */
    public static function setRecoveryMode(bool $value): void
    {
        SpiceConfig::getInstance()->set('system', 'startup_mode', $value ? 'recovery' : 'normal');
    }

    /**
     * set the recovery mode flag
     * @throws Exception
     */
    public static function setMaintenanceMode(bool $value): void
    {
        SpiceConfig::getInstance()->set('system', 'startup_mode', $value ? 'maintenance' : 'normal');
    }
}