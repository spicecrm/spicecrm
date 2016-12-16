<?php

function post_install() {
    global $db;

    // check if metadata needs to be updated
    if (file_exists($_SESSION['unzip_dir'] . '/scripts/dbdefinitions.php')) {
        include($_SESSION['unzip_dir'] . '/scripts/dbdefinitions.php');
        foreach ($dbdefinitions as $tableName => $tableData) {
            switch ($tableData['type']) {
                case 'bean':
                    $focus = BeanFactory::getBean($tableData['bean']);
                    if ($focus instanceOf SugarBean)
                        _logThis($db->repairTable($focus, true));
                    else
                        _logThis("could not load bean " . $tableData['bean']);
                    break;
                case 'meta':
                    _logThis($db->repairTableParams($tableName, $tableData['fields'], $tableData['indices'], true));
                    break;
            }
        }
    }

    // chek for records
    if (file_exists($_SESSION['unzip_dir'] . '/scripts/dbrecords.php')) {
        include($_SESSION['unzip_dir'] . '/scripts/dbrecords.php');
        foreach ($dbrecords as $recordHash => $recordData) {
            $sql = '';
            // check if the entry exixts
            $dbRecord = $db->fetchByAssoc($db->query("SELECT id FROM " . $recordData['table_name'] . " WHERE id = '" . $recordData['id'] . "'"));
            if ($dbRecord) {
                $setString = '';

                foreach ($recordData['data'] as $fieldName => $fieldValue) {
                    if ($fieldName == 'id')
                        continue;

                    if ($setString != '')
                        $setString .= ', ';

                    $setString .= $fieldName . " = '" . $fieldValue . "'";
                }

                $sql = "UPDATE " . $recordData['table_name'] . " SET " . $setString . " WHERE id ='" . $recordData['id'] . "'";
            }
            else {
                $fieldString = ''; $valueString = '';
                foreach ($recordData['data'] as $fieldName => $fieldValue) {

                    if ($fieldString != '')
                        $fieldString .= ', ';
                    
                    $fieldString .= $fieldName;
                    
                    if ($valueString != '')
                        $valueString .= ', ';

                    $valueString .= "'" . $fieldValue . "'";
                    
                    $sql = "INSERT INTO " . $recordData['table_name'] . " (" . $fieldString . ") VALUES (" . $valueString . ")";
                }
            }
            
            _logThis($sql); 
            
            $db->query($sql);
        }
    }
}

function _logThis($entry) {
	if(function_exists('logThis')) {
		logThis($entry);
	} else {

		$log = clean_path(getcwd().'/upgradeWizard.log');
		// create if not exists
		if(!file_exists($log)) {
			$fp = fopen($log, 'w+'); // attempts to create file
			if(!is_resource($fp)) {
				$GLOBALS['log']->fatal('UpgradeWizard could not create the upgradeWizard.log file');
			}
		} else {
			$fp = fopen($log, 'a+'); // write pointer at end of file
			if(!is_resource($fp)) {
				$GLOBALS['log']->fatal('UpgradeWizard could not open/lock upgradeWizard.log file');
			}
		}

		$line = date('r').' [UpgradeWizard] - '.$entry."\n";

		if(fwrite($fp, $line) === false) {
			$GLOBALS['log']->fatal('UpgradeWizard could not write to upgradeWizard.log: '.$entry);
		}

		fclose($fp);
	}
}