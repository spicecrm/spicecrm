<?php

class ElasticHandler
{
    var $indexName = 'spicecrm';
    var $indexPrefix = 'spicecrm';
    var $server = '127.0.0.1';
    var $port = '9200';

    var $standardSettings = array(
        "analysis" => array(
            "filter" => array(
                "spice_email" => array(
                    "type" => "pattern_capture",
                    "preserve_original" => 1,
                    "patterns" => array(
                        "([^@]+)",
                        "(\\p{L}+)",
                        "(\\d+)",
                        "@(.+)"
                    )
                ),
                "spice_ngram" => array(
                    "type" => "nGram",
                    "min_gram" => "3",
                    "max_gram" => "20",
                    //   "token_chars" => ["letter", "digit"]
                ),
                "spice_edgengram" => array(
                    "type" => "edgeNGram",
                    "min_gram" => "2",
                    "max_gram" => "20",
                    //   "token_chars" => ["letter", "digit"]
                )
            ),
            "tokenizer" => array(
                "spice_ngram" => array(
                    "type" => "nGram",
                    "min_gram" => "3",
                    "max_gram" => "20",
                    //   "token_chars" => ["letter", "digit"]
                )
            ),
            "analyzer" => array(
                "spice_ngram" => array(
                    "type" => "custom",
                    "tokenizer" => "spice_ngram"
                    //"tokenizer" => "standard",
                    // "filter" => ["standard", "lowercase","spice_ngram"]
                ),
                "spice_edgengram" => array(
                    "type" => "custom",
                    // "tokenizer" => "spice_ngram",
                    "tokenizer" => "standard",
                    "filter" => ["standard", "lowercase","spice_edgengram"]
                ),
                "spice_email" => array(
                    "tokenizer" => "uax_url_email",
                    "filter" => ["spice_email", "lowercase", "unique"]
                )
            )
        )
    );

    function __construct()
    {
        global $sugar_config;
        $this->server = $sugar_config['fts']['server'];
        $this->port = $sugar_config['fts']['port'];
        $this->indexPrefix = $sugar_config['fts']['prefix'];
    }

    private function getAllIndexes(){
        global $db;

        $indexes = array();

        $indexObjects = $db->query("SELECT module FROM sysfts");
        while($indexObject = $db->fetchByAssoc($indexObjects)){
            $indexes[] = $this->indexPrefix . strtolower($indexObject['module']);
        }

        return $indexes;
    }

    function document_index($module, $data)
    {
        $response = $this->query('POST', $this->indexPrefix . strtolower($module) . '/' . $module . '/' . $data['id'], array(), $data);
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
        foreach($modules as $module) {
            if($modString !== '') $modString .= ',';
            $modString .= $this->indexPrefix . strtolower($module);
        }

        $response = json_decode($this->query('POST', $modString . '/_search', array(), $queryParam), true);
        return $response;
    }

    function filter($filterfield, $filtervalue)
    {
        $response = json_decode($this->query('POST', '/' . implode(',',$this->getAllIndexes()) . '/_search', array(), array('filter' => array('term' => array($filterfield => $filtervalue)))), true);
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
        $response = $this->query('GET');
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
        $data_string = !empty($body) ? json_encode($body) : '';

        $cURL = 'http://'.$this->server.':' . $this->port . '/';
        if (!empty($url)) $cURL .= '/' . $url;

        $ch = curl_init($cURL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string))
        );

        return curl_exec($ch);
    }
}