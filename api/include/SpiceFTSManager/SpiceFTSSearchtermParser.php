<?php

namespace SpiceCRM\includes\SpiceFTSManager;

use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceFTSSearchtermParser
{
    public function sanitizteSearchTerm($searchTerm)
    {
        $sanitizedTerms = [];
        $terms = explode('OR', $searchTerm);
        foreach ($terms as $term) {
            $sanitizedTerms[] = mb_strtolower(trim((string)$term), (SpiceConfig::getInstance()->config['fts']['searchterm_encoding'] ? SpiceConfig::getInstance()->config['fts']['searchterm_encoding'] : 'UTF-8'));
        }
        return implode(' OR ', $sanitizedTerms);
    }

    public function parse($searchTerm, $indexSettings, $fields)
    {
        // split the string by OR
        $termParts = explode("OR", $searchTerm);
        if (count($termParts) == 1) {
            /*
            return [
                'bool' => [
                    'must' => [$this->parseElement($searchTerm, $indexSettings, $fields)]
                ]
            ];
            */
            return $this->parseElement($searchTerm, $indexSettings, $fields);
        } else {
            $queries = [];
            foreach ($termParts as $termPart) {
                $queries[] = $this->parseElement($termPart, $indexSettings, $fields);
            }
            return [
                'bool' => [
                    'should' => $queries,
                    'minimum_should_match' => 1
                ]
            ];
        }

    }

    private function parseElement($element, $indexSettings, $fields)
    {
        $matches = [];
        if (preg_match_all('/-?[a-zA-Z0-9_]+:"(.*?)"|-?"(.*?)"|-(\w+)/', $element, $matches)) {
            $query = [
                'must' => [],
                'must_not' => []
            ];

            // the exact term matches
            foreach ($matches[2] as $index => $match) {
                if (empty($match)) continue;

                if(strpos($matches[0][$index], '-') === 0){
                    foreach ($fields as $field) {
                        $fv = explode('^', $field);
                        $queryType =  preg_match("/\*/", $matches[2][$index]) ? 'wildcard' : 'term';
                        $query['must_not'][] = [$queryType => [
                            "{$fv[0]}.raw" => [
                                'value' => trim($matches[2][$index], '"'),
                                "case_insensitive" => true
                            ]
                        ]];
                    }
                } else {
                    $query['must'][] = [
                        'bool' => $this->buildTermsWildcardQuery(trim($matches[2][$index], '"'), $fields)
                    ];
                }

                $element = str_replace($matches[0][$index], '', $element);
            }


            // the Must not multi matches
            foreach ($matches[3] as $index => $match) {
                if (empty($match)) continue;
                $query['must_not'][] = ['multi_match' => $this->buildMultiMatchQuery(trim($matches[3][$index], '"'), $indexSettings, $fields)];
                $element = str_replace($matches[0][$index], '', $element);
            }

            // the Field Matches
            foreach ($matches[1] as $index => $match) {
                if (empty($match)) continue;

                // extract the field
                $fieldname = explode(':', $matches[0][$index])[0];
                // check if we have a minus in front of the field
                if(strpos($fieldname, '-') === 0) $fieldname = substr($fieldname, 1);

                // build the matched fields
                $matchedFields = [];
                foreach ($fields as $field){
                    if(strpos($field, $fieldname) !== false) $matchedFields[] = $field;
                }

                if(count($matchedFields) > 0) {
                    if(strpos($matches[0][$index], '-') === 0){
                        foreach ($matchedFields as $field) {
                            $fv = explode('^', $field);
                            $queryType =  preg_match("/\*/", $matches[1][$index]) ? 'wildcard' : 'term';
                            $query['must_not'][] = [$queryType => [
                                "{$fv[0]}.raw" => [
                                    'value' => trim($matches[1][$index], '"'),
                                    "case_insensitive" => true
                                ]
                            ]];
                        }
                    } else {
                        $query['must'][] = [
                            'bool' => $this->buildTermsWildcardQuery(trim($matches[1][$index], '"'), $matchedFields)
                        ];
                    }
                } else {
                    throw new BadRequestException('no matching fields found for field ' .$fieldname);
                }

                $element = str_replace($matches[0][$index], '', $element);
            }
        }

        $element = trim($element);

        if($element) {
            $query['must'][] = ['multi_match' => $this->buildMultiMatchQuery($element, $indexSettings, $fields)];
        }

        return ['bool' => $query];

    }

    /**
     * builds a multimatch Query
     *
     * @param $element
     * @param $indexSettings
     * @param $fields
     * @return array
     */
    private function buildMultiMatchQuery($term, $indexSettings, $fields){
        $subquery = [
            "query" => "$term",
            'analyzer' => 'spice_standard_all',
            //'analyzer' => $indexSettings['search_analyzer'] ?: 'spice_standard',
            'fields' => $fields,
        ];

        if ($indexSettings['operator'])
            $subquery['operator'] = $indexSettings['operator'];

        if ($indexSettings['fuzziness'])
            $subquery['fuzziness'] = $indexSettings['fuzziness'];

        if ($indexSettings['multimatch_type'])
            $subquery['type'] = $indexSettings['multimatch_type'];

        return $subquery;
    }

    /**
     * builds a multimatch Query
     *
     * @param $element
     * @param $indexSettings
     * @param $fields
     * @return array
     */
    private function buildTermsWildcardQuery($term, $fields){
        $subQuery = [
            'should' => [],
            'minimum_should_match' => 1
        ];

        $queryType =  preg_match("/\*/", $term) ? 'wildcard' : 'term';

        foreach ($fields as $field) {
            $fv = explode('^', $field);
            $subQuery['should'][] = [$queryType => [
                "{$fv[0]}.raw" => [
                    'value' => $term,
                    "case_insensitive" => true
                ]
            ]];
        }

        return $subQuery;
    }
}