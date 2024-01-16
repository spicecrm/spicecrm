<?php

namespace SpiceCRM\includes\SpiceFTSManager;

use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;


/**
 * a class that is capable of parsing a searchterm and returning a query that macthes the searchterm to be used for the FTS search accodingly
 * the language allows more specific paramaters to be passed to the search engine to get even better proper results
 * this works from the frontend and also from the API
 */
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

    /**
     * parses the searchterm breaking it in logical pieces and processing each piece
     *
     * @param $searchTerm
     * @param $indexSettings
     * @param $fields
     * @return array[]
     */
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

    /**
     * parses one of the logical connected elements
     *
     * @param $element
     * @param $indexSettings
     * @param $fields
     * @return array[]
     * @throws BadRequestException
     */
    private function parseElement($element, $indexSettings, $fields)
    {
        $query = [
            'must' => [],
            'must_not' => []
        ];

        // do the various matchings
        $this->matchFieldTerms($element, $query, $fields, $indexSettings);
        $this->matchFields($element, $query, $fields, $indexSettings);
        $this->matchTerms($element, $query, $fields, $indexSettings);
        $this->matchExcludedWords($element, $query, $fields, $indexSettings);

        // trim the elements
        $element = trim($element);

        if($element) {
            $query['must'][] = ['multi_match' => $this->buildMultiMatchQuery($element, $indexSettings, $fields)];
        }

        return ['bool' => $query];

    }

    /**
     * matches fieldnames and the expressions
     *
     * this identifies entries like
     *
     *  email:"gmail.com" to match exact
     *  email:"*gmail.com" to match a wildcard
     * -email:"*gmail.com" to exclude values matched by the wildcard if preceede d by a '-'
     *
     * @param $element
     * @param $query
     * @param $fields
     * @param $indexSettings
     * @return void
     * @throws BadRequestException
     */
    private function matchFieldTerms(&$element, &$query, $fields, $indexSettings){
        $matches = [];
        if (preg_match_all('/-?[a-zA-Z0-9_]+:"(.*?)"/', $element, $matches)) {
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
                        $this->buildExcludeTermsWildcardQuery(trim($matches[1][$index], '"'), $matchedFields, $query);
                    } else {
                        $query['must'][] = [
                            'bool' => $this->buildTermsWildcardQuery(trim($matches[1][$index], '"'), $matchedFields)
                        ];
                    }
                } else {
                    // throw new BadRequestException('no matching fields found for field ' .$fieldname);
                }

                $element = str_replace($matches[0][$index], '', $element);
            }
        }
    }

    /**
     * matches fieldnames and the expressions
     *
     * this identifies entries like
     *
     *  email:"gmail.com" to match exact
     *  email:"*gmail.com" to match a wildcard
     * -email:"*gmail.com" to exclude values matched by the wildcard if preceede d by a '-'
     *
     * @param $element
     * @param $query
     * @param $fields
     * @param $indexSettings
     * @return void
     * @throws BadRequestException
     */
    private function matchFields(&$element, &$query, $fields, $indexSettings){
        $matches = [];
        if (preg_match_all('/-?[a-zA-Z0-9_]+:(\w+)/', $element, $matches)) {
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
                        $query['must_not'][] = [
                            'multi_match' => $this->buildMultiMatchQuery(trim($matches[1][$index], '"'), $indexSettings, $matchedFields)
                        ];
                    } else {
                        $query['must'][] = [
                            'multi_match' => $this->buildMultiMatchQuery(trim($matches[1][$index], '"'), $indexSettings, $matchedFields)
                        ];
                    }
                } else {
                    // throw new BadRequestException('no matching fields found for field ' .$fieldname);
                }

                $element = str_replace($matches[0][$index], '', $element);
            }
        }
    }

    /**
     * this matches specific Terms to follow exact or wildcard matches
     *
     * @param $element
     * @param $query
     * @param $fields
     * @param $indexSettings
     * @return void
     */
    private function matchTerms(&$element, &$query, $fields, $indexSettings){
        $matches = [];
        if (preg_match_all('/-?"(.*?)"/', $element, $matches)) {
            foreach ($matches[1] as $index => $match) {
                if (empty($match)) continue;

                if(strpos($matches[0][$index], '-') === 0){
                    $this->buildExcludeTermsWildcardQuery(trim($matches[1][$index], '"'), $fields, $query);
                } else {
                    $query['must'][] = [
                        'bool' => $this->buildTermsWildcardQuery(trim($matches[1][$index], '"'), $fields)
                    ];
                }

                $element = str_replace($matches[0][$index], '', $element);
            }
        }
    }

    /**
     * tries to find excluded words
     *
     *  -xxx will exclude all matches that hit xxx
     *
     * @param $element
     * @param $query
     * @param $fields
     * @param $indexSettings
     * @return void
     */
    private function matchExcludedWords(&$element, &$query, $fields, $indexSettings)
    {
        $matches = [];
        if (preg_match_all('/ -(\w+)/', $element, $matches)) {
            // the Must not multi matches
            foreach ($matches[1] as $index => $match) {
                if (empty($match)) continue;
                $query['must_not'][] = ['multi_match' => $this->buildMultiMatchQuery(trim($matches[1][$index], '"'), $indexSettings, $fields)];
                $element = str_replace($matches[0][$index], '', $element);
            }
        }
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
            //'analyzer' => 'spice_standard_all',
            'analyzer' => $indexSettings['search_analyzer'] ?: 'spice_standard',
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

    private function buildExcludeTermsWildcardQuery($term, $fields, &$query){
        foreach ($fields as $field) {
            $fv = explode('^', $field);
            $queryType =  preg_match("/\*/", $term) ? 'wildcard' : 'term';
            $query['must_not'][] = [$queryType => [
                "{$fv[0]}.raw" => [
                    'value' => $term,
                    "case_insensitive" => true
                ]
            ]];
        }
    }
}