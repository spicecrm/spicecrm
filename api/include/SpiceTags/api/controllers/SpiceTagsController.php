<?php

namespace SpiceCRM\includes\SpiceTags\api\controllers;

use SpiceCRM\includes\SpiceFTSManager\ElasticHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceTagsController
{

    static function searchTags(Request $req, Response $res, $args): Response {
        $tag = base64_decode($args['query']);

        $query = [
            "size" => 0,
            "_source" => 'tags',
            "query" => [
                "match" => [
                    "tags" => $tag
                ]
            ],
            "aggs" => [
                "tags" => [
                    "terms" => [
                        "field" => "tags.agg",
                        // hack to get the search and filter case insensitive
                        "script" => [
                            "source" => "_value + ';' + _value.toLowerCase()",
                            "lang" => "painless"
                        ],
                        "include" => ".*". strtolower($tag).".*",
                        "order" => [
                            "_key" => 'asc'
                        ],
                        "size" => 100
                    ]
                ]
            ],
            "suggest" => [
                "tags" => [
                    "prefix" => $tag,
                    "completion" => [
                        "field" => "tags.suggester",
                        "size" => 25,
                        "skip_duplicates" => true
                    ]
                ]
            ]
        ];

        $handler = new ElasticHandler();
        $response = json_decode($handler->query('POST', $handler->indexPrefix . '*/_search', [], $query), true);

        $suggestions = [];

        /*
        foreach($response['suggest']['tags'] as $tagsuggestion){
            foreach($tagsuggestion['options'] as $suggestOption) {
                $suggestions[] = $suggestOption['text'];
            }
        }
        */

        foreach($response['aggregations']['tags']['buckets'] as $bucket){
            $key = explode(';', $bucket['key']);
            // slpit the bucket again
            $suggestions[] = $key[0];
        }

        return $res->withJson($suggestions);
    }

    static function searchPostTags(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();

        $tag = base64_decode($args['query']);

        $query = [
            "size" => 0,
            "_source" => 'tags',
            "query" => [
                "match" => [
                    "tags" => $postBody['search']
                ]
            ],
            "aggs" => [
                "tags" => [
                    "terms" => [
                        "field" => "tags.agg",
                        // hack to get the search and filter case insensitive
                        "script" => [
                            "source" => "_value + ';' + _value.toLowerCase()",
                            "lang" => "painless"
                        ],
                        "include" => ".*". strtolower($postBody['search']).".*",
                        "order" => [
                            "_key" => 'asc'
                        ],
                        "size" => 100
                    ]
                ]
            ]
        ];

        $handler = new ElasticHandler();
        $response = json_decode($handler->query('POST', $handler->indexPrefix . '*/_search', [], $query), true);

        $suggestions = [];

        /*
        foreach($response['suggest']['tags'] as $tagsuggestion){
            foreach($tagsuggestion['options'] as $suggestOption) {
                $suggestions[] = $suggestOption['text'];
            }
        }
        */

        foreach($response['aggregations']['tags']['buckets'] as $bucket){
            $key = explode(';', $bucket['key']);
            // slpit the bucket again
            $suggestions[] = $key[0];
        }

        return $res->withJson($suggestions);
    }

}