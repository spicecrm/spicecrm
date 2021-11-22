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
 * Viewing/Selecting from API log (database)
 */
class APIlogViewer {

    # Constructor. Reads settings from config file.
    public function __construct() {

        # Accessing the log file is allowed only for admins:
        if ( !AuthenticationController::getInstance()->getCurrentUser()->isAdmin() )
            throw ( new ForbiddenException('Forbidden to view the API log. Only for admins.'))->setErrorCode('noAPIlogView');
    }

    public function getRoutes() {
        $db = DBManagerFactory::getInstance();
        $response = [];
        $dbResult = $db->query("SELECT DISTINCT route FROM sysapilog ORDER BY route");
        while ( $row = $db->fetchByAssoc( $dbResult )) $response[] = array_shift( $row );
        return $response;
    }

    /**
     * retrieves the entries in the log
     *
     * @param $queryParams
     * @param null $period
     * @return array
     */
    public function getEntries($queryParams, $period = null ) {
        $db = DBManagerFactory::getInstance();
        $response = [];


        if ( isset( $queryParams['method'][0])) $filter[] = "a.method = '{$db->quote($queryParams['method'])}'";
        if ( !empty($queryParams['filter'])){
            $subFilter = [];
            $subFilter[] = "a.request_headers like '%{$db->quote($queryParams['filter'])}%'";
            $subFilter[] = "a.request_params like '%{$db->quote($queryParams['filter'])}%'";
            $subFilter[] = "a.request_body like '%{$db->quote($queryParams['filter'])}%'";
            $subFilter[] = "a.response_headers like '%{$db->quote($queryParams['filter'])}%'";
            $subFilter[] = "a.response_body like '%{$db->quote($queryParams['filter'])}%'";
            $filter[] = '(' . join(' OR ', $subFilter) . ')';
        }
        if ( !empty($queryParams['route'])){
            $subFilter = [];
            $subFilter[] = "a.url like '%{$db->quote($queryParams['route'])}%'";
            $subFilter[] = "a.route like '%{$db->quote($queryParams['route'])}%'";
            $filter[] = '(' . join(' OR ', $subFilter) . ')';
        }
        if ( !empty($queryParams['session_id'])){
            $subFilter = [];
            $subFilter[] = "a.session_id = '{$db->quote($queryParams['session_id'])}'";
            $subFilter[] = "a.transaction_id = '{$db->quote($queryParams['session_id'])}'";
            $filter[] = '(' . join(' OR ', $subFilter) . ')';
        }
        if ( !empty( $queryParams['ip'])) $filter[] = "a.ip like '%{$db->quote($queryParams['ip'])}%'";
        if ( !empty( $queryParams['user_id'])) $filter[] = "a.user_id = '{$db->quote($queryParams['user_id'])}'";
        if ( !empty( $queryParams['status'])) $filter[] = "a.http_status_code = '{$db->quote($queryParams['status'])}'";
        if ( !empty( $queryParams['direction'])) $filter[] = "a.direction = '{$db->quote($queryParams['direction'])}'";
        if ( !empty( $queryParams['end'])) $filter[] = "a.date_entered <= '{$db->quote($queryParams['end'])}'";

        if ( count( $filter ) > 0) {
            $whereClause = 'WHERE ' . implode(' AND ', $filter);
        }

        $sql = "SELECT a.id, a.runtime, a.route, a.method, a.request_args , a.request_params, a.user_id , u.user_name, a.date_entered, a.http_status_code, a.transaction_id, a.direction FROM sysapilog a LEFT JOIN users u ON a.user_id = u.id {$whereClause} ORDER BY a.date_timestamp DESC";

        $dbResult = $db->limitQuery( $sql, 0, $queryParams['limit'] ?: 100);

        while ( $row = $db->fetchByAssoc( $dbResult )) {
            $response[] = $row;
        }

        return $response;
    }

    function getFullEntry($entryId ) {
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT *  FROM sysapilog WHERE id = '{$db->quote( $entryId )}'";

        $entry = $db->fetchOne( $sql );
        if ( $entry === false )
            throw ( new NotFoundException( 'Log entry not found.'))->setLookedFor( $entryId );

        return $entry;
    }

}
