<?php

require_once('include/SpiceFTSManager/SpiceFTSUtils.php');
require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
require_once('include/SpiceFTSManager/ElasticHandler.php');

class SpiceFTSearch
{
    function search($searchTerm)
    {

        // do the search
        // $ftsHandler = new SpiceFTSHandler();
        // $results = $ftsHandler->searchTerm($searchTerm, array(), 100, 0);

        // prepare the aggregates
        $resSmarty = new Sugar_Smarty();
        $resSmarty->assign('searchterm', $searchTerm);

        /*
        foreach ($results['hits']['hits'] as $hitindex => &$hit) {
            if (!isset($listViewDefs[$hit['_type']])) {
                $metadataFile = null;
                $foundViewDefs = false;
                if (file_exists('custom/modules/' . $hit['_type'] . '/metadata/listviewdefs.php')) {
                    $metadataFile = 'custom/modules/' . $hit['_type'] . '/metadata/listviewdefs.php';
                    $foundViewDefs = true;
                } else {
                    if (file_exists('custom/modules/' . $hit['_type'] . '/metadata/metafiles.php')) {
                        require_once('custom/modules/' . $hit['_type'] . '/metadata/metafiles.php');
                        if (!empty($metafiles[$hit['_type']]['listviewdefs'])) {
                            $metadataFile = $metafiles[$hit['_type']]['listviewdefs'];
                            $foundViewDefs = true;
                        }
                    } elseif (file_exists('modules/' . $hit['_type'] . '/metadata/metafiles.php')) {
                        require_once('modules/' . $hit['_type'] . '/metadata/metafiles.php');
                        if (!empty($metafiles[$hit['_type']]['listviewdefs'])) {
                            $metadataFile = $metafiles[$hit['_type']]['listviewdefs'];
                            $foundViewDefs = true;
                        }
                    }
                }
                if (!$foundViewDefs && file_exists('modules/' . $hit['_type'] . '/metadata/listviewdefs.php')) {
                    $metadataFile = 'modules/' . $hit['_type'] . '/metadata/listviewdefs.php';
                }
                require_once($metadataFile);
            }


            foreach ($listViewDefs[$hit['_type']] as $fieldName => $fieldData) {
                if ($results['hits']['hits'][$hitindex]['listviewdata'] != '' && $hit['_source'][strtolower($fieldName)] != '')
                    $results['hits']['hits'][$hitindex]['listviewdata'] .= '&nbsp|&nbsp;';

                $results['hits']['hits'][$hitindex]['listviewdata'] .= $hit['_source'][strtolower($fieldName)];
            }
        }
        $resSmarty->assign('searchresults', $results['hits']);

        */

        $resResult = $resSmarty->fetch('include/SpiceFTSManager/tpls/globalfts.tpl');

        echo $resResult;
    }


}