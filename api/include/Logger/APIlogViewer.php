<?php
namespace SpiceCRM\includes\Logger;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinitions;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItems;

/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

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
     * Returns the API-log-tables.
     * API-log-tables are all tables similar to the table "sysapilog".
     *
     * @return array
     */
    public static function getAdditionalLogTables()
    {
        $sysapilogItems = [];
        foreach ( SpiceDictionaryItems::getInstance()->getItemsForDictionary( SpiceDictionaryDefinitions::getInstance()->getDefinitionByName('sysapilog')['id'] ) as $item )
            if ( $item['non_db'] == 0 ) $sysapilogItems[$item['name']] = $item;

        $tables = [];
        foreach ( SpiceDictionaryDefinitions::getInstance()->getDefinitions('a') as $definition )
        {
            if ( $definition['name'] === 'sysapilog' ) continue;
            if ( $definition['sysdictionary_contenttype'] != 'logs' ) continue;
            $items = [];
            foreach( SpiceDictionaryItems::getInstance()->getItemsForDictionary( $definition['id'] ) as $v ) if ( $item['non_db'] == 0 ) $items[$v['name']] = $v;
            if ( count( $items ) !== count( $sysapilogItems )) continue;
            foreach( $items as $item )
            {
                if ( !isset( $sysapilogItems[$item['name']] ) ) continue 2;
                if ( !SpiceDictionaryItems::compareItems( $sysapilogItems[$item['name']], $item )) continue 2;
            }
            $tables[] = $definition['tablename'];
        }
        return $tables;
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

        // check if we have a specific log table
        $logtable = 'sysapilog';
        if($queryParams['logtable'] && $queryParams['logtable'] != 'sysapilog'){
            $logtables = self::getAdditionalLogTables();
            if(array_search($queryParams['logtable'], $logtables) === false){
                throw (new NotFoundException("Logtable not found"))->setLookedFor($logtable);
            }
            $logtable = $queryParams['logtable'];
        }

        $filter = [];
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
        if ( !empty( $queryParams['start'])) $filter[] = "a.date_entered >= '{$db->quote($queryParams['start'])}'";
        if ( !empty( $queryParams['pinned'])) $filter[] = "a.pinned = 1";

        $whereClause = ( count( $filter) > 0 ) ? 'WHERE ' . implode(' AND ', $filter ) : '';

        $sql = "SELECT a.id, a.runtime, a.route, a.method, a.request_args , a.request_params, a.user_id , u.user_name, a.date_entered, a.http_status_code, a.transaction_id, a.direction, a.pinned FROM {$logtable} a LEFT JOIN users u ON a.user_id = u.id {$whereClause} ORDER BY a.date_timestamp DESC";

        $dbResult = $db->limitQuery( $sql, 0, $queryParams['limit'] ?: 100);

        while ( $row = $db->fetchByAssoc( $dbResult )) {
            $response[] = $row;
        }

        return $response;
    }

    function getFullEntry($entryId, $logtable = null) {
        $db = DBManagerFactory::getInstance();

        // check if we have a specific log table
        if($logtable && $logtable != 'sysapilog'){
            $logtables = self::getAdditionalLogTables();
            if(array_search($logtable, $logtables) === false){
                throw (new NotFoundException("Logtable not found"))->setLookedFor($logtable);
            }
        } else {
            $logtable = 'sysapilog';
        }

        // run the query
        $sql = "SELECT *  FROM {$logtable} WHERE id = '{$db->quote( $entryId )}'";

        $entry = $db->fetchOne( $sql );
        if ( $entry === false ) {
            throw (new NotFoundException('Log entry not found.'))->setLookedFor($entryId);
        }

        return $entry;
    }

    function getTotalCount(): int
    {
        $db = DBManagerFactory::getInstance();
        return (int)$db->getOne('SELECT COUNT(*) FROM sysapilog');
    }

}
