<?php

class SpiceFTSFilters
{
    static function buildFiltersFromAggregate($aggregatesFilter, $aggregateData)
    {
        $aggregateFilterKeys = array();

        $queryType = 'terms';

        foreach ($aggregateData as $aggregatesFilterValue) {
            $filterData = json_decode(html_entity_decode(base64_decode($aggregatesFilterValue)), true);
            $aggregateFilterKeys[] = $filterData['key'];
            if (isset($filterData['from'])) {
                $queryType = 'range';
                $ranges[] = array(
                    $aggregatesFilter => array(
                        'gte' => $filterData['from'],
                        'lt' => $filterData['to']
                    )
                );
            }
        }

        switch ($queryType) {

            case 'terms';
                return array(
                    'terms' => array(
                        $aggregatesFilter . '.raw' => $aggregateFilterKeys
                    )
                );
                break;
            case 'range':
                if (count($ranges) > 1) {
                    $rangesArray = array();
                    foreach ($ranges as $range)
                        $rangesArray[] = array('range' => $range);
                    return array(
                        'or' => $rangesArray
                    );
                } else
                    return array("range" => reset($ranges));
                break;
        }
    }
}