<?php
namespace SpiceCRM\includes\SpiceSwagger;

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
                $currentParameters = [
                    'in'          => $parameter['in'],
                    'name'        => $name,
                    'required'    => true,
                    'description' => $parameter['description'],
                    'schema'      => [
                        'type'    => $parameter['type'],
                        'example' => $parameter['example'],
                    ],
                ];
                 if ($parameter['type'] == 'enum' && isset($parameter['options'])) {
                     if (is_array($parameter['options'])) {
                         $currentParameters['schema']['type'] = 'string';
                         $currentParameters['schema']['enum'] = $parameter['options'];
                         unset($currentParameters['schema']['example']);
                     } elseif (is_string($parameter['options'])) {
                         $domainLoader = new SpiceDictionaryDomainLoader();
                         $currentParameters['schema']['type'] = 'string';
                         $currentParameters['schema']['enum'] = $domainLoader->loadValidationValuesForDomain($parameter['options']);
                     }
                 }

                $parameters[] = $currentParameters;
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
     * todo add schemas for the reponses later on
     */
    private function getRouteRequestBody(): void {
        if ($this->route['method'] == 'get') {
            return;
        }

        if (!empty($this->route['requestBody'])) {
            $requestBody = [];

            if (!empty($this->route['requestBody']['description'])) {
                $requestBody['description'] = $this->route['requestBody']['description'];
            }
//            if (!empty($this->route['requestBody']['example'])) {
//                $requestBody['example'] = $this->route['requestBody']['example'];
//            }
            // todo in getParsedBody validate post body against the definition from the routes array
        if (!empty($this->route['requestBody']['content'])) {
            $bodyContent = [
                'schema' => [
                    '$ref' => '#/components/schemas/GenericSchema',
                ],
            ];

            if (isset($this->route['requestBody']['example'])) {
                $bodyContent['example'] = $this->route['requestBody']['example'];
            } else {
                $bodyContent['example'] = "{key: 'value'}";
            }

            $requestBody['content']['application/json'] = $bodyContent;
        }

            $this->pathArray['requestBody'] = $requestBody;
        }
    }
}