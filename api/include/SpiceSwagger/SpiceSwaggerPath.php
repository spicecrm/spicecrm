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
        try{
            $this->generateRouteParameters();
            $this->generateSummaryDescription();
//        $this->pathArray['consumes']    = ['application/json'];
//        $this->pathArray['produces']    = ['application/json'];
            $this->getRouteTags();
            $this->getRouteResponses();
            $this->getRouteRequestBody();
        }catch(\Exception $e){
            error_log('Error generating path for route: '. json_encode($this->route));
            error_log('Exception: '. $e->getMessage());
        }
        return $this->pathArray;
    }

    /**
     * Generates an array with the route parameters.
     *
     * @return void
     */
    private function generateRouteParameters(): void {
        $parameters = [];

        // First, handle explicitly defined parameters
        if (!empty($this->route['parameters'])) {
            foreach ($this->route['parameters'] as $name => $parameter) {
                if (!is_array($parameter)) {
                    error_log("Parameter $name is not an array: " . gettype($parameter));
                    continue;
                }

                if ($parameter['in'] != 'body') {
                    try {
                        $currentParameter = new SpiceSwaggerParameter($name, $parameter);
                        $parameters[] = $currentParameter->generateSwaggerParameter();
                    } catch(\Exception $e) {
                        error_log('Exception: ' . $e->getMessage());
                    }
                }

            }
        }

        if (!empty($parameters)) {
            $this->pathArray['parameters'] = $parameters;
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
            '500' => [
                'description' => 'Server error',
            ],
            '200' => [
                'description' => 'OK',
            ],
        ];

        if (isset($this->route['parameters'])) {
            $responses['404'] = [
                'description' => 'Not Found',
            ];
        }

        if (!empty($this->route['responses'])) {
            foreach ($this->route['responses'] as $httpCode => $response) {
                $responses[(string)$httpCode] = $response;
            }
        }

        $this->pathArray['responses'] = $responses;
    }

    /**
     * Generates an array with the route response body.
     */
    private function getRouteRequestBody(): void {
        if ($this->route['method'] == 'get' || $this->route['method'] == 'delete') {
            return;
        }

        $bodyParameters = array_filter($this->route['parameters'] ?? [], function($param) {
            return ($param['in'] ?? '') == 'body';
        });

        if (!empty($bodyParameters)) {
            $requestBody = [
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [],
                            'required' => []
                        ]
                    ]
                ]
            ];

            foreach ($bodyParameters as $paramName => $paramDefinition) {
                $swaggerParameter = new SpiceSwaggerParameter($paramName, $paramDefinition);
                $paramSchema = $swaggerParameter->generateSwaggerSchemaParameter();

                $requestBody['content']['application/json']['schema']['properties'][$paramName] = $paramSchema['properties'][$paramName];

                if (!empty($paramSchema['required'])) {
                    $requestBody['content']['application/json']['schema']['required'] = array_merge(
                        $requestBody['content']['application/json']['schema']['required'],
                        $paramSchema['required']
                    );
                }
            }

            if (empty($requestBody['content']['application/json']['schema']['required'])) {
                unset($requestBody['content']['application/json']['schema']['required']);
            }

            // Only add the requestBody if there are actually properties in the schema
            if (!empty($requestBody['content']['application/json']['schema']['properties'])) {
                $this->pathArray['requestBody'] = $requestBody;
            }
        }
    }

    private function extractPathParameters(): array
    {
        preg_match_all('/{([^}]+)}/', $this->route['route'], $matches);
        return $matches[1];
    }
}