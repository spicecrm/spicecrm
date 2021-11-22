<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\SpiceFTSManager;

use SpiceCRM\includes\database\DBManagerFactory;

use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\TimeDate;

class ElasticHandler
{
    var $indexName = 'spicecrm';
    var $indexPrefix = 'spicecrm';
    var $server = '127.0.0.1';
    var $port = '9200';
    var $protocol = 'http';
    var $ssl_verifyhost = 2;
    var $ssl_verifypeer = 1;

    var $version = '7';

    var $standardSettings = [
        "analysis" => [
            "filter" => [],
            "tokenizer" => [],
            "analyzer" => []
        ],
        'index' => [
            'max_ngram_diff' => 20,
            'number_of_shards' => 2,
            'number_of_replicas' => 1
        ]
    ];

    function __construct()
    {

        $this->server = SpiceConfig::getInstance()->config['fts']['server'];
        $this->port = SpiceConfig::getInstance()->config['fts']['port'];
        $this->indexPrefix = SpiceConfig::getInstance()->config['fts']['prefix'];

        if (AuthenticationController::getInstance()->systemtenantid) {
            $this->indexPrefix .= AuthenticationController::getInstance()->systemtenantid . '_';
        }

        if (isset(SpiceConfig::getInstance()->config['fts']['protocol'])) {
            $this->protocol = SpiceConfig::getInstance()->config['fts']['protocol'];
        }
        if (isset(SpiceConfig::getInstance()->config['fts']['ssl_verifyhost'])) {
            $this->ssl_verifyhost = SpiceConfig::getInstance()->config['fts']['ssl_verifyhost'];
        }
        if (isset(SpiceConfig::getInstance()->config['fts']['ssl_verifypeer'])) {
            $this->ssl_verifypeer = SpiceConfig::getInstance()->config['fts']['ssl_verifypeer'];
        }

        if (isset(SpiceConfig::getInstance()->config['fts']['number_of_shards'])) {
            $this->standardSettings['index']['number_of_shards'] = SpiceConfig::getInstance()->config['fts']['fts']['number_of_shards'];
        }
        if (isset(SpiceConfig::getInstance()->config['fts']['number_of_replicas'])) {
            $this->standardSettings['index']['number_of_replicas'] = SpiceConfig::getInstance()->config['fts']['fts']['number_of_replicas'];
        }


        // get the elastic version - only themajor number is important
        //$version = $this->getVersion();
        //$this->version = substr($version, 0, 1);

        $this->buildSettings();
    }

    /**
     * returns the current elastic version
     */
    function getVersion()
    {
        if (!isset($_SESSION['SpiceFTS']['elastic'])) {
            $response = json_decode($this->query('GET', ''));
            $_SESSION['SpiceFTS']['elastic'] = $response;
        }

        return $_SESSION['SpiceFTS']['elastic']->version->number;
    }

    function getMajorVersion()
    {
        $fullVersion = $this->getVersion();
        return substr($fullVersion, 0, 1);
    }

    /**
     * returns the current status of the elastic cluster
     */
    function getStatus()
    {
        return json_decode($this->query('GET', ''));
    }

    /**
     * returns the module for the hit
     * this is for 6 and 7 compatibility as the type has been removed with 7 and is no kept in teh source in attribute _module
     *
     * @param $hit
     * @return mixed
     */
    function getHitModule($hit)
    {
        if ($hit['_type'] != '_doc') {
            return $hit['_type'];
        } else {
            return $hit['_source']['_module'];
        }
    }

    /**
     * returns the vale for aggs.module.terms.field
     * this is for 6 and 7 compatibility as _type has been replaced by _module in 7
     *
     * @param $hit
     * @return mixed
     */
    function gettModuleTermFieldName()
    {
        if ($this->getMajorVersion() == '6') {
            return '_type';
        }
        return '_module';
    }

    /**
     * returns the total for hits
     * this is for 6 and 7 compatibility
     * Elastic 6 returns hits total as $response['hits']['total'] OR  $response['total']
     * Elastic 7 returns hits total as $response['hits']['total']['value']
     * This function will extract the value from proper array structure
     * @param $queryResponse Array
     * @return mixed
     */
    public function getHitsTotalValue($queryResponse)
    {
        if (is_integer($queryResponse['hits']['total'])) {
            return $queryResponse['hits']['total'];
        }
        return $queryResponse['hits']['total']['value'] ?: 0;
    }

    /**
     * correct total hits
     * not sure it's a good idea because of debugging since "correct total" doesn't point to problem
     * meant to be used in SpiceFTSActivityHandler::loadActivities()
     * @param $queryResponse
     * @param $newtotal
     * @return int|mixed
     */
    public function setHitsTotalValue(&$queryResponse, $newtotal)
    {
        if (is_integer($queryResponse['hits']['total'])) {
            $queryResponse['hits']['total'] = $newtotal;
        } else {
            $queryResponse['hits']['total']['value'] = $newtotal;
        }
    }

    /**
     * builds the settings based ont eh various files defined
     */
    function buildSettings()
    {
        $elasticAnalyzers = [];
        if (file_exists('custom/include/SpiceFTSManager/analyzers/spice_analyzers.php'))
            include 'custom/include/SpiceFTSManager/analyzers/spice_analyzers.php';
        else
            include 'include/SpiceFTSManager/analyzers/spice_analyzers.php';
        $this->standardSettings['analysis']['analyzer'] = $elasticAnalyzers;

        $elasticNormalizers = [];
        if (file_exists('custom/include/SpiceFTSManager/normalizers/spice_normalizers.php'))
            include 'custom/include/SpiceFTSManager/normalizers/spice_normalizers.php';
        else
            include 'include/SpiceFTSManager/normalizers/spice_normalizers.php';
        $this->standardSettings['analysis']['normalizer'] = $elasticNormalizers;


        $elasticTokenizers = [];
        if (file_exists('custom/include/SpiceFTSManager/tokenizers/spice_tokenizers.php'))
            include 'custom/include/SpiceFTSManager/tokenizers/spice_tokenizers.php';
        else
            include 'include/SpiceFTSManager/tokenizers/spice_tokenizers.php';
        $this->standardSettings['analysis']['tokenizer'] = $elasticTokenizers;

        $elasticFilters = [];
        if (file_exists('custom/include/SpiceFTSManager/filters/spice_filters.php'))
            include 'custom/include/SpiceFTSManager/filters/spice_filters.php';
        else
            include 'include/SpiceFTSManager/filters/spice_filters.php';
        $this->standardSettings['analysis']['filter'] = $elasticFilters;
    }

    private function getAllIndexes()
    {
        $db = DBManagerFactory::getInstance();

        $indexes = [];

        //catch installation process and abort. table sysfts will not exist at the point during installation
        if (!empty($GLOBALS['installing']))
            return [];

        $indexObjects = $db->query("SELECT module FROM sysfts");
        while ($indexObject = $db->fetchByAssoc($indexObjects)) {
            $indexes[] = $this->indexPrefix . strtolower($indexObject['module']);
        }

        return $indexes;
    }

    /**
     * returns the stats for the index with the current prefix
     *
     * @return mixed
     */
    function getStats()
    {
        $response = json_decode($this->query('GET', $this->indexPrefix . '*/_stats'), true);
        $response['_prefix'] = $this->indexPrefix;
        return $response;
    }


    /**
     * returns the settings for the index with the current prefix
     *
     * @return mixed
     */
    function getSettings()
    {
        $response = json_decode($this->query('GET', $this->indexPrefix . '*/_settings'), true);
        $response['_prefix'] = $this->indexPrefix;
        return $response;
    }

    /**
     * returns the settings for the index with the current prefix
     *
     * @return mixed
     */
    function unblock()
    {
        $response = json_decode($this->query('PUT', $this->indexPrefix . '*/_settings', [], ['index.blocks.read_only_allow_delete' => null]), true);
        $response['_prefix'] = $this->indexPrefix;
        return $response;
    }


    /**
     * index a document - create or update
     *
     * @param $module
     * @param $data
     * @return bool|string
     */
    function document_index($module, $data)
    {
        // determein if we send the wait_for param .. for activity stream
        $params = [];
        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);
        if ($indexSettings['waitfor']) $params['refresh'] = 'wait_for';
        if ($this->getMajorVersion() == '6') {
            $response = $this->query('POST', $this->indexPrefix . strtolower($module) . '/' . $module . '/' . $data['id'], $params, $data);
        } else {
            $response = $this->query('POST', $this->indexPrefix . strtolower($module) . '/_doc/' . $data['id'], $params, $data);
        }
        return $response;
    }

    /**
     * delete a document from the index
     *
     * @param $module
     * @param $id
     * @return bool|string
     */
    function document_delete($module, $id)
    {
        $params = [];
        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);
        if ($indexSettings['waitfor']) $params['refresh'] = 'wait_for';

        if ($this->getMajorVersion() == '6') {
            $response = $this->query('DELETE', $this->indexPrefix . strtolower($module) . '/' . $module . '/' . $id, $params);
        } else {
            $response = $this->query('DELETE', $this->indexPrefix . strtolower($module) . '/_doc/' . $id, $params);
        }
        return $response;
    }

    function search($module, $indexProperties = [], $searchterm = '', $size = 25, $from = 0)
    {

        $db = DBManagerFactory::getInstance();

        $queryParam = [];

        if (!empty($size)) $queryParam['size'] = $size;
        if (!empty($from)) $queryParam['from'] = $from;
        if (!empty($searchterm)) {
            $queryParam['query'] = [
                "bool" => [
                    "should" => [
                        "wildcard" => [
                            "_all" => "*$searchterm*"
                        ]
                    ]
                ]
            ];
        }

        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['aggregate'])
                $queryParam['aggs'][$indexProperty['fieldname']] = [
                    'terms' => [
                        'field' => $indexProperty['indexfieldname']
                    ]
                ];
        }

        $response = json_decode($this->query('POST', $this->indexPrefix . strtolower($module) . '/_search', [], $queryParam), true);
        return $response;
    }

    function searchModule($module, $queryParam, $size = 25, $from = 0)
    {

        $db = DBManagerFactory::getInstance();

        $response = json_decode($this->query('POST', $this->indexPrefix . strtolower($module) . '/_search', [], $queryParam), true);
        return $response;
    }

    function searchModules($modules, $queryParam, $size = 25, $from = 0)
    {
        $db = DBManagerFactory::getInstance();

        $modString = '';
        foreach ($modules as $module) {
            if ($modString !== '') $modString .= ',';
            $modString .= $this->indexPrefix . strtolower($module);
        }

        $response = json_decode($this->query('POST', $modString . '/_search', [], $queryParam), true);
        return $response;
    }

    function filter($filterfield, $filtervalue)
    {
        $response = json_decode($this->query('POST', $this->indexPrefix . '*/_search', [], ['query' => ['bool' => ['filter' => ['term' => [$filterfield => $filtervalue]]]]]), true);
        return $response;
    }

    function createIndex()
    {
        $response = $this->query('PUT', '', [], ['settings' => $this->standardSettings]);
        return $response;
    }


    /**
     * checks the index and returns true or false if the index xists or does not exist
     *
     * @param $module
     * @return bool
     */
    function checkIndex($module, $force = false)
    {
        if (!isset($_SESSION['SpiceFTS']['indexes'][$module]['exists'])) {
            $response = json_decode($this->query('GET', $this->indexPrefix . strtolower($module)));
            $_SESSION['SpiceFTS']['indexes'][$module]['exists'] = $response->{$this->indexPrefix . strtolower($module)} ? true : false;
        }
        return $_SESSION['SpiceFTS']['indexes'][$module]['exists'];
    }

    function deleteIndex($module)
    {
        $response = $this->query('DELETE', $this->indexPrefix . strtolower($module));
        return $response;
    }

    function getIndex()
    {
        $response = $this->query('GET', '_cat/indices?v'); //PHP7.1 compatibility: 2 parameters expected!
        return $response;
    }

    function getMapping($module)
    {
        $response = $this->query('GET', '_mapping/' . $this->indexPrefix . strtolower($module));
        return $response;
    }

    /**
     * puts the mapping for a module and creates the index
     * contains elastic 6 compatibility .. to be removed in future version
     *
     * @param $module
     * @param $properties
     * @return bool|string
     */
    function putMapping($module, $properties)
    {
        if ($this->getMajorVersion() == '6') {
            $mapping = [
                '_all' => [
                    'analyzer' => 'spice_ngram'
                ],
                'properties' => $properties
            ];
            $response = $this->query('PUT', SpiceFTSUtils::getIndexNameForModule($module), [], [
                    'settings' => $this->standardSettings,
                    'mappings' => [
                        $module => $mapping
                    ]
                ]
            );
        } else {
            $mapping = [
                'properties' => $properties
            ];
            $response = $this->query('PUT', SpiceFTSUtils::getIndexNameForModule($module), [], [
                    'settings' => $this->standardSettings,
                    'mappings' => $mapping
                ]
            );
        }
        return $response;
    }

    /**
     * exeutes the query on the elastic index
     *
     * @param $method
     * @param $url
     * @param array $params
     * @param array $body
     * @return bool|string
     */
    function query($method, $url, $params = [], $body = [])
    {

        $data_string = !empty($body) ? json_encode($body) : '';

        $cURL = $this->protocol . '://' . $this->server . ':' . $this->port . '/';
        if (!empty($url)) $cURL .= $url;

        if (!empty($params)) {
            if (substr($cURL, -1) != '?')
                $cURL .= '?';
            $cURL .= http_build_query($params);
        }

        $ch = curl_init($cURL);

        $curlOptions = [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $data_string,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string)
            ]
        ];
        curl_setopt_array($ch, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        switch (SpiceConfig::getInstance()->config['fts']['loglevel']) {
            case '1':
            case '2':
                $logEntryHandler->generateOutgoingLogEntry($curlOptions, "/elasticsearch/$url");
                break;
        }

        $result = curl_exec($ch);

        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $resultdec = json_decode(substr($result, $header_size));

        switch (SpiceConfig::getInstance()->config['fts']['loglevel']) {
            case '2':
                $logEntryHandler->updateOutgoingLogEntry($ch, $result);
                $logEntryHandler->writeOutogingLogEntry(true);
                break;
            case '1':
                if (@$resultdec->status > 0) {
                    $logEntryHandler->updateOutgoingLogEntry($ch, $result);
                    $logEntryHandler->writeOutogingLogEntry(true);
                }
                break;
        }
        return substr($result, $header_size);
    }

    function bulk($lines = [], $params = [])
    {
        $body = implode("\n", $lines) . "\n";

        $cURL = $this->protocol . '://' . $this->server . ':' . $this->port . '/_bulk';

        // check if we have params for the synchronous processing
        if (!empty($params)) {
            if (substr($cURL, -1) != '?')
                $cURL .= '?';
            $cURL .= http_build_query($params);
        }

        $ch = curl_init($cURL);
        $curlOptions = [
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-ndjson',
                'Content-Length: ' . strlen($body)
            ]
        ];
        curl_setopt_array($ch, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        switch (SpiceConfig::getInstance()->config['fts']['loglevel']) {
            case '1':
            case '2':
                $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/elasticsearch/_bulk');
                break;
        }

        $result = curl_exec($ch);
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $resultdec = json_decode(substr($result, $header_size));

        switch (SpiceConfig::getInstance()->config['fts']['loglevel']) {
            case '2':
                $logEntryHandler->updateOutgoingLogEntry($ch, $result);
                $logEntryHandler->writeOutogingLogEntry(true);
                break;
            case '1':
                if (@$resultdec->status > 0) {
                    $logEntryHandler->updateOutgoingLogEntry($ch, $result);
                    $logEntryHandler->writeOutogingLogEntry(true);
                }
                break;
        }

        return $resultdec;
    }

    /**
     * adds a log entry to the fts log
     *
     * @param $method
     * @param $url
     * @param null $status
     * @param $request
     * @param $response
     * @return bool
     */
    private function addLogEntry($method, $url, $status = null, $request, $response) # , $rtlocal, $rtremote )
    {
        $timedate = TimeDate::getInstance();
        $db = DBManagerFactory::getInstance('spicelogger');
        //catch installation process and abort. table sysftslog will not exist at the point during installation
        if (!empty($GLOBALS['installing']))
            return false;
        $db->query(sprintf("INSERT INTO sysftslog ( id, date_created, request_method, request_url, response_status, index_request, index_response ) values( '%s', '" . TimeDate::getInstance()->nowDb() . "', '%s', '%s', '%s', '%s', '%s')", create_guid(), $db->quote($method), $db->quote($url), $db->quote($status), $db->quote(str_replace("\\n", "", $request)), $db->quote($response)));
    }
}
