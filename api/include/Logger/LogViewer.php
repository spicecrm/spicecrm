<?php
namespace SpiceCRM\includes\Logger;
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

/**
 * Viewing/Selecting from database based SugarCRM Log
 */

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

class LogViewer {

    private static $levelMapping = [
        'debug'      => 100,
        'info'       => 70,
        'warn'       => 50,
        'deprecated' => 40,
        'login'      => 30,
        'error'      => 25,
        'fatal'      => 10,
        'security'   => 5
    ];

    private $maxLength;

    private $dbTableName = 'syslogs';

    # Constructor. Reads settings from config file.
    public function __construct() {

        # Accessing the log file is allowed only for admins:
        if ( !AuthenticationController::getInstance()->getCurrentUser()->isAdmin() )
            throw ( new ForbiddenException('Forbidden to view the CRM log. Only for admins.'))->setErrorCode('noCRMlogView');

        $config = SpiceConfig::getInstance();
        $this->maxLength = $config->get( 'logger.view.truncateText', 500 ) * 1;

    }

    private function updateLevelValues() {
        $db = DBManagerFactory::getInstance();
        if ( $wert=$db->getOne('SELECT count(*) FROM '.$this->dbTableName.' WHERE level_value IS NULL')) {
            foreach ( self::$levelMapping as $level => $value ) {
                $db->query( $s='UPDATE '.$this->dbTableName.' SET level_value = '.$value.' WHERE level_value IS NULL AND log_level = "'.$level.'"' );
            }
        }
    }

    public function getLines( $queryParams, $period = null ) {
        $db = DBManagerFactory::getInstance();
        $response = [];

        $this->updateLevelValues();

        $whereClauseParts = [];

        if ( $period ) {

            $begin = gmmktime( $period['begin']['hour'], 0, 0, $period['begin']['month'], $period['begin']['day'], $period['begin']['year'] );
            $end = gmmktime( $period['end']['hour'], 0, 0, $period['end']['month'], $period['end']['day'], $period['end']['year'] );

            $whereClauseParts[] = 'FLOOR( microtime ) >= '.$begin.' AND FLOOR( microtime ) < '.$end;

        }

        $filter = [];
        if ( isset( $queryParams['userId'][0])) $filter[] = 'created_by = "'.$db->quote($queryParams['userId']).'"';
        if ( isset( $queryParams['level'][0])) $filter[] = 'level_value <= '.self::$levelMapping[$queryParams['level']];
        if ( isset( $queryParams['processId'][0])) $filter[] = 'pid = "'.$db->quote($queryParams['processId']).'"';
        if ( isset( $queryParams['text'][0])) $filter[] = 'description like "%'.$db->quote($queryParams['text']).'%"';
        if ( isset( $queryParams['transactionId'][0])) $filter[] = 'transaction_id = "'.$db->quote($queryParams['transactionId']).'"';
        if ( count( $filter )) $whereClauseParts[] = implode( ' AND ', $filter );

        $whereClause = count( $whereClauseParts ) ? 'WHERE '.implode( ' AND ', $whereClauseParts ):'';

        $limitClause = '';
        if ( isset( $queryParams['limit'][0])) {
            $queryParams['limit'] *= 1;
            $limitClause = 'LIMIT '.$queryParams['limit'];
        }

        $sql = 'SELECT id, pid, log_level as lev, transaction_id as tid, LEFT( description, '.$this->maxLength.' ) AS txt, created_by as uid, if ( LENGTH( description ) <> LENGTH( LEFT( description, '.$this->maxLength.' )), 1, 0 ) AS txtTruncated, microtime as dtx FROM '.$this->dbTableName.' '.$whereClause.' ORDER BY microtime DESC '.$limitClause;

        $sqlResult = $db->query( $sql );
        while ( $row = $db->fetchByAssoc( $sqlResult )) {
            $row['txtTruncated'] = (boolean)$row['txtTruncated'];
            $row['pid'] = isset( $row['pid'][0]) ? (int)$row['pid']:null;
            $row['dtx'] = (float)$row['dtx'];
            $response[] = $row;
        }

        return $response;
    }

    public function getLinesOfPeriod( $begin, $end, $queryParams ) {
        $period = [];
        $period['begin']['year'] = substr( $begin, 0, 4 );
        $period['begin']['month'] = substr( $begin, 4, 2 );
        $period['begin']['day'] = substr( $begin, 6, 2 );
        $period['begin']['hour'] = substr( $begin, 8, 2 );
        $period['end']['year'] = substr( $end, 0, 4 );
        $period['end']['month'] = substr( $end, 4, 2 );
        $period['end']['day'] = substr( $end, 6, 2 );
        $period['end']['hour'] = substr( $end, 8, 2 );
        return $this->getLines( $queryParams, $period );
    }

    function getFullLine( $lineId ) {
        $db = DBManagerFactory::getInstance();

        $sql = 'SELECT id, pid, log_level as lev, description AS txt, created_by as uid, microtime as dtx, transaction_id as tid FROM '.$this->dbTableName.' WHERE id = "'.$db->quote( $lineId ).'"';

        $line = $db->fetchOne( $sql );
        if ( $line === false )
            throw ( new NotFoundException( 'Log line not found.'))->setLookedFor( $lineId );

        return $line;

    }

}
