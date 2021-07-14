<?php
namespace SpiceCRM\includes\SpiceSwagger;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainLoader;

class SpiceSwaggerPath
{
    private $route;
    private $pathArray = [];

    public function __construct(array $route) {
        $this->route = $route;
    }

    /**
     * Generates the array with path information.
     *
     * @return array
     */
    public function generatePathArray(): array {
        $this->generateRouteParameters();
        $this->generateSummaryDescription();
//        $this->pathArray['consumes']    = ['application/json'];
//        $this->pathArray['produces']    = ['application/json'];
        $this->getRouteTags();
        $this->getRouteResponses();
        $this->getRouteRequestBody();


        return $this->pathArray;
    }

    /**
     * Generates an array with the route parameters.
     *
     * @return void
     */
    private function generateRouteParameters(): void {
        if (!empty($this->route['parameters'])) {
            $parameters = [];

            foreach ($this->route['parameters'] as $name => $parameter) {
                if ($parameter['in'] != 'body') {
                    $currentParameter = new SpiceSwaggerParameter($name, $parameter);
                    $parameters[] = $currentParameter->generateSwaggerParameter();
                }
            }

            if (!empty($parameters)) {
                $this->pathArray['parameters'] = $parameters;
            }
        }
    }

    /**
     * Generates the summary and description fields.
     * If only one of them is set in the route array it will be used in both fields.
     */
    private function generateSummaryDescription(): void {
        $this->pathArray['summary']     = $this->route['summary'] ?: $this->route['description']?: '';
        $this->pathArray['description'] = $this->route['description'] ?: $this->route['summary'] ?: '';
    }

    /**
     * Generates tags for a route.
     * The extension name is used as a tag.
     *
     * @return void
     */
    private function getRouteTags(): void {
        if (!empty($this->route['extension'])) {
            $this->pathArray['tags'][] = $this->route['extension'];
        }
        if (!empty($this->route['custom']) && $this->route['custom'] == true) {
            $this->pathArray['tags'][] = 'custom';
        }
    }

    /**
     * Generates an array with the endpoint responses.
     * 200 and 500 will always be generated even if none are set in the extension.
     * 404 will always be generated if the route has parameters.
     *
     * @return void
     */
    private function getRouteResponses(): void {
        $responses = [
            500 => [
                'description' => 'Server error',
            ],
            200 => [
                'description' => 'OK',
            ],
        ];

        if (isset($this->route['parameters'])) {
            $responses[404] = [
                'description' => 'Not Found',
            ];
        }

        if (!empty($this->route['responses'])) {
            foreach ($this->route['responses'] as $httpCode => $response) {
                $responses[$httpCode] = $response;
            }
        }

        $this->pathArray['responses'] = $responses;
    }

    /**
     * Generates an array with the route response body.
     * todo add schemas for the responses later on
     */
    private function getRouteRequestBody(): void {
        if ($this->route['method'] == 'get') {
            return;
        }

        if (!empty($this->route['parameters'])) {
            $requestBody = [];

            foreach ($this->route['parameters'] as $paramName => $paramDefinition) {
                if ($paramDefinition['in'] != 'body') {
                    continue;
                }
                $swaggerParameter = new SpiceSwaggerParameter($paramName, $paramDefinition);
                $requestBody['content']['application/json']['schema']['properties'][$paramName] =
                    $swaggerParameter->generateSwaggerParameter();
            }
//            if (!empty($this->route['requestBody']['content'])) {
//                $bodyContent = [
//                    'schema' => [
//                        '$ref' => '#/components/schemas/GenericSchema',
//                    ],
//                ];
//
//                if (isset($this->route['requestBody']['example'])) {
//                    $bodyContent['example'] = $this->route['requestBody']['example'];
//                } else {
//                    $bodyContent['example'] = "{key: 'value'}";
//                }
//
//                $requestBody['content']['application/json'] = $bodyContent;
//            }

            $this->pathArray['requestBody'] = $requestBody;
        }
    }
}