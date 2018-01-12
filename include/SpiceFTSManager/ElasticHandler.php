<?php

class ElasticHandler
{
    var $indexName = 'spicecrm';
    var $indexPrefix = 'spicecrm';
    var $server = '127.0.0.1';
    var $port = '9200';

    var $standardSettings = array(
        "analysis" => array(
            "filter" => array(),
            "tokenizer" => array(),
            "analyzer" => array()
        )
    );

    function __construct()
    {
        global $sugar_config;
        $this->server = $sugar_config['fts']['server'];
        $this->port = $sugar_config['fts']['port'];
        $this->indexPrefix = $sugar_config['fts']['prefix'];
        $this->buildSettings();
    }

    function buildSettings()
    {
        $elasticAnalyzers = array();
        if (file_exists('custom/include/SpiceFTSManager/analyzers/spice_analyzers.php'))
            include 'custom/include/SpiceFTSManager/analyzers/spice_analyzers.php';
        else
            include 'include/SpiceFTSManager/analyzers/spice_analyzers.php';
        $this->standardSettings['analysis']['analyzer'] = $elasticAnalyzers;

        $elasticTokenizers = array();
        if (file_exists('custom/include/SpiceFTSManager/tokenizers/spice_tokenizers.php'))
            include 'custom/include/SpiceFTSManager/tokenizers/spice_tokenizers.php';
        else
            include 'include/SpiceFTSManager/tokenizers/spice_tokenizers.php';
        $this->standardSettings['analysis']['tokenizer'] = $elasticTokenizers;

        $elasticFilters = array();
        if (file_exists('custom/include/SpiceFTSManager/filters/spice_filters.php'))
            include 'custom/include/SpiceFTSManager/filters/spice_filters.php';
        else
            include 'include/SpiceFTSManager/filters/spice_filters.php';
        $this->standardSettings['analysis']['tokenizer'] = $elasticFilters;
    }

    private function getAllIndexes()
    {
        global $db;

        $indexes = array();

        //catch installation process and abort. table sysfts will not exist at the point during installation
        if($GLOBALS['installing'] === true)
            return array();

        $indexObjects = $db->query("SELECT module FROM sysfts");
        while ($indexObject = $db->fetchByAssoc($indexObjects)) {
            $indexes[] = $this->indexPrefix . strtolower($indexObject['module']);
        }

        return $indexes;
    }

    function document_index($module, $data)
    {
        $response = $this->query('POST', $this->indexPrefix . strtolower($module) . '/' . $module . '/' . $data['id'], array(), $data);
        return $response;
    }

    function document_delete($module, $id)
    {
        $response = $this->query('DELETE', $this->indexPrefix . strtolower($module) . '/' . $module . '/' . $id);
        return $response;
    }

    function search($module, $indexProperties = array(), $searchterm = '', $size = 25, $from = 0)
    {

        global $db;

        $queryParam = array();

        if (!empty($size)) $queryParam['size'] = $size;
        if (!empty($from)) $queryParam['from'] = $from;
        if (!empty($searchterm)) {
            $queryParam['query'] = array(
                "bool" => array(
                    "should" => array(
                        "wildcard" => array(
                            "_all" => "*$searchterm*"
                        )
                    )
                )
            );
        }

        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['aggregate'])
                $queryParam{'aggs'}{$indexProperty['fieldname']} = array(
                    'terms' => array(
                        'field' => $indexProperty['indexfieldname']
                    )
                );
        }

        $response = json_decode($this->query('POST', $this->indexPrefix . strtolower($module) . '/_search', array(), $queryParam), true);
        return $response;
    }

    function searchModule($module, $queryParam, $size = 25, $from = 0)
    {

        global $db;

        $response = json_decode($this->query('POST', $this->indexPrefix . strtolower($module) . '/_search', array(), $queryParam), true);
        return $response;
    }

    function searchModules($modules, $queryParam, $size = 25, $from = 0)
    {
        global $db;

        $modString = '';
        foreach ($modules as $module) {
            if ($modString !== '') $modString .= ',';
            $modString .= $this->indexPrefix . strtolower($module);
        }

        $response = json_decode($this->query('POST', $modString . '/_search', array(), $queryParam), true);
        return $response;
    }

    function filter($filterfield, $filtervalue)
    {
        $response = json_decode($this->query('POST', '/' . implode(',', $this->getAllIndexes()) . '/_search', array(), array('filter' => array('term' => array($filterfield => $filtervalue)))), true);
        return $response;
    }

    function createIndex()
    {
        $response = $this->query('PUT', '', array(), array('settings' => $this->standardSettings));
        return $response;
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
        $response = $this->query('GET', '_mapping/' . $module);
        return $response;
    }

    function putMapping($module, $properties)
    {
        $mapping = array(
            '_all' => array(
                'analyzer' => 'spice_ngram'
            ),
            'properties' => $properties
        );
        $response = $this->query('PUT', $this->indexPrefix . strtolower($module), array(), array(
                'settings' => $this->standardSettings,
                'mappings' => array(
                    $module => $mapping
                )
            )
        );
        return $response;
    }

    function query($method, $url, $params = array(), $body = array())
    {
        global $sugar_config;

        $data_string = !empty($body) ? json_encode($body) : '';

        $cURL = 'http://' . $this->server . ':' . $this->port . '/';
        if (!empty($url)) $cURL .=  $url;
//        file_put_contents("sugarcrm.log", print_r($cURL, true)."\n", FILE_APPEND);
        $ch = curl_init($cURL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string))
        );

        $start = microtime();
        $result = curl_exec($ch);
        $end = microtime();

        $rt_local = microtime_diff($start, $end) * 1000;
        $resultdec = json_decode($result);

        switch ($sugar_config['fts']['loglevel']) {
            case '2':
                $this->addLogEntry($method, $cURL, $resultdec->status, $data_string, $result, $rt_local, $resultdec->took);
                break;
            case '1':
                if ($resultdec->status > 0)
                    $this->addLogEntry($method, $cURL, $resultdec->status, $data_string, $result, $rt_local, $resultdec->took);
                break;
        }

        return $result;
    }

    private function addLogEntry($method, $url, $status, $request, $response, $rtlocal, $rtremote)
    {
        global $db, $timedate;
        //catch installation process and abort. table sysftslog will not exist at the point during installation
        if($GLOBALS['installing'] === true)
            return false;
        $db->query("INSERT INTO sysftslog (id, date_created, request_method, request_url, response_status, index_request, index_response) values('" . create_guid() . "', '" . $timedate->nowDb() . "', '$method', '$url', '$status', '$request', '$response')");
    }
}