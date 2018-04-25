<?php
require_once 'modules/SpiceUIGenerator/SpiceUIGenerator.php';
$gen = new SpiceUIGenerator();
$module = "Accounts";
$gen->exportModuleConfiguration($module);
