<?php
namespace SpiceCRM\includes\Logger;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

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
 * Viewing/Selecting from KREST log (database)
 */
class RESTLogViewer {

    private $maxLength;

    private $dbTableName = 'syskrestlog';

    # Constructor. Reads settings from config file.
    public function __construct() {

        # Accessing the log file is allowed only for admins:
        if ( !AuthenticationController::getInstance()->getCurrentUser()->isAdmin() )
            throw ( new ForbiddenException('Forbidden to view the KREST log. Only for admins.'))->setErrorCode('noKRESTlogView');

        $config = SpiceConfig::getInstance();
        $this->maxLength = $config->get( 'logger.view.truncateText', 500 ) * 1;

    }

    public function getRoutes() {
        $db = DBManagerFactory::getInstance();
        $response = [];
        $dbResult = $db->query( 'SELECT DISTINCT route FROM syskrestlog ORDER BY route' );
        while ( $row = $db->fetchByAssoc( $dbResult )) $response[] = array_shift( $row );
        return $response;
    }

    public function getLines( $queryParams, $period = null ) {
        $db = DBManagerFactory::getInstance();
        $response = [];

        $whereClauseParts = [];

        if ( $period ) {

            $begin = gmmktime( $period['begin']['hour'], 0, 0, $period['begin']['month'], $period['begin']['day'], $period['begin']['year'] );
            $end = gmmktime( $period['end']['hour'], 0, 0, $period['end']['month'], $period['end']['day'], $period['end']['year'] );

            $whereClauseParts[] = 'UNIX_TIMESTAMP( CONVERT_TZ( requested_at, "+00:00", @@SESSION.time_zone )) >= '.$begin.' AND UNIX_TIMESTAMP( CONVERT_TZ( requested_at, "+00:00", @@SESSION.time_zone )) < '.$end;

        }

        $filter = [];
        if ( isset( $queryParams['method'][0])) $filter[] = 'method = "'.$db->quote($queryParams['method']).'"';
        if ( isset( $queryParams['route'][0])) $filter[] = 'route = "'.$db->quote($queryParams['route']).'"';
        if ( isset( $queryParams['postParams'][0])) $filter[] = 'post_params like "%'.$db->quote($queryParams['postParams']).'%"';
        if ( isset( $queryParams['urlParams'][0])) $filter[] = 'get_params like "%'.$db->quote($queryParams['urlParams']).'%"';
        if ( isset( $queryParams['routeArgs'][0])) $filter[] = 'args like "%'.$db->quote($queryParams['routeArgs']).'%"';
        if ( isset( $queryParams['response'][0])) $filter[] = 'response like "%'.$db->quote($queryParams['response']).'%"';
        if ( isset( $queryParams['theUrl'][0])) $filter[] = 'url like "%'.$db->quote($queryParams['theUrl']).'%"';
        if ( isset( $queryParams['ipAddress'][0])) $filter[] = 'ip like "%'.$db->quote($queryParams['ipAddress']).'%"';
        if ( isset( $queryParams['userId'][0])) $filter[] = 'user_id = "'.$db->quote($queryParams['userId']).'"';
        if ( isset( $queryParams['status'][0])) $filter[] = 'http_status_code = "'.$db->quote($queryParams['status']).'"';
        if ( isset( $queryParams['transactionId'][0])) $filter[] = 'transaction_id = "'.$db->quote($queryParams['transactionId']).'"';
        if ( count( $filter )) $whereClauseParts[] = implode( ' AND ', $filter );

        $whereClause = count( $whereClauseParts ) ? 'WHERE '.implode( ' AND ', $whereClauseParts ):'';

        $limitClause = '';
        if ( isset( $queryParams['limit'][0])) {
            $queryParams['limit'] *= 1;
            $limitClause = 'LIMIT '.$queryParams['limit'];
        }

        $sql = 'SELECT k.id, route, method, args as routeArgs, get_params as urlParams, k.user_id as uid, UNIX_TIMESTAMP( CONVERT_TZ( requested_at, "+00:00", @@SESSION.time_zone )) as dtx, http_status_code as status, k.transaction_id as tid, count(s.id) AS clr FROM '.$this->dbTableName.' AS k LEFT JOIN syslogs AS s ON k.transaction_id = s.transaction_id '.$whereClause.' GROUP BY k.id ORDER BY requested_at DESC '.$limitClause;

        $dbResult = $db->query( $sql );
        while ( $row = $db->fetchByAssoc( $dbResult )) {
            $row['pid'] = isset( $row['pid'][0]) ? (int)$row['pid']:null;
            $row['dtx'] = (float)$row['dtx'];
            $row['status'] = isset( $row['status'] ) ? (integer)$row['status']:$row['status'];
            $row['clr'] = (integer)$row['clr'];
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

        $sql = 'SELECT id, route, method, headers, args as routeArgs, get_params as urlParams, post_params as postParams, response, user_id as uid, UNIX_TIMESTAMP(requested_at) as dtx, http_status_code as status, transaction_id as tid FROM '.$this->dbTableName.' WHERE id = "'.$db->quote( $lineId ).'"';

        $line = $db->fetchOne( $sql );
        if ( $line === false )
            throw ( new NotFoundException( 'Log line not found.'))->setLookedFor( $lineId );

        return $line;

    }

    function getAllUser() {
        $db = DBManagerFactory::getInstance();
        $list = [];
        $sql = 'SELECT id,user_name as name FROM users WHERE is_group = 0 AND deleted = 0 ORDER BY user_name';
        $dbResult = $db->query( $sql );
        while ( $row = $db->fetchByAssoc( $dbResult )) $list[] = $row;
        return $list;
    }

}
