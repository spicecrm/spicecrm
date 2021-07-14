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

    private $maxLength;

    # Constructor. Reads settings from config file.
    public function __construct() {

        # Accessing the log file is allowed only for admins:
        if ( !AuthenticationController::getInstance()->getCurrentUser()->isAdmin() )
            throw ( new ForbiddenException('Forbidden to view the CRM log. Only for admins.'))->setErrorCode('noCRMlogView');

        $config = SpiceConfig::getInstance();
        $this->maxLength = $config->get( 'logger.view.truncateText', 500 ) * 1;

    }

    public function getEntries($queryParams, $period = null ) {
        $db = DBManagerFactory::getInstance();
        $response = ['entries'=>[]];

        $loglevels = ( isset( $queryParams['loglevels'][0] ) ? json_decode( $queryParams['loglevels'] ) : [] );

        $whereClauseParts = [];
        if ( isset( $queryParams['end'][0] )) $whereClauseParts[] = "l.date_entered <= '{$db->quote($queryParams['end'])}'";
        if ( isset( $queryParams['user_id'][0])) $whereClauseParts[] = "l.created_by = '".$db->quote($queryParams['user_id'])."'";
        if ( count( $loglevels )) $whereClauseParts[] = "',".$db->quote( implode(',', $loglevels )).",' like CONCAT('%,',l.log_level,',%')";
        if ( isset( $queryParams['pid'][0])) $whereClauseParts[] = "l.pid = ".( $queryParams['pid']*1 );
        if ( isset( $queryParams['text'][0])) $whereClauseParts[] = "l.description like '%".$db->quote($queryParams['text'])."%'";
        if ( isset( $queryParams['transaction_id'][0])) $whereClauseParts[] = "l.transaction_id = '".$db->quote($queryParams['transaction_id'])."'";
        $whereClause = count( $whereClauseParts ) ? 'WHERE '.implode( ' AND ', $whereClauseParts ):'';
        if ( isset( $queryParams['limit'][0] )) $limit = ( @$queryParams['limit'] * 1 );
        else $limit = 250;

        $sql = 'SELECT u.id as user_id, l.date_entered, l.id, l.pid, l.log_level, l.transaction_id, SUBSTR( l.description, 1, '.$this->maxLength.' ) AS description, l.created_by, u.user_name, if ( LENGTH( l.description ) <> LENGTH( SUBSTR( l.description, 1, '.$this->maxLength.' )), 1, 0 ) AS descriptionTruncated FROM syslogs l LEFT JOIN users u ON u.id = l.created_by '.$whereClause.' ORDER BY l.date_entered DESC';
        $sqlResult = $db->limitQuery( $sql, 0, $limit );

        while ( $row = $db->fetchByAssoc( $sqlResult )) {
            $row['descriptionTruncated'] = (boolean)$row['descriptionTruncated'];
            $row['pid'] = isset( $row['pid'][0]) ? (int)$row['pid']:null;
            $response['entries'][] = $row;
        }

        $response['totalCount'] = $db->getOne('SELECT COUNT(*) FROM syslogs AS l LEFT JOIN users AS u ON l.created_by = u.id '.$whereClause ) * 1;

        return $response;
    }

    function getFullEntry($entryId ) {
        $db = DBManagerFactory::getInstance();

        $sql = 'SELECT id, pid, log_level, description, created_by, transaction_id FROM syslogs WHERE id = \''.$db->quote( $entryId ).'\'';

        $entry = $db->fetchOne( $sql );
        if ( $entry === false )
            throw ( new NotFoundException( 'Log entry not found.'))->setLookedFor( $entryId );

        return $entry;

    }

}
