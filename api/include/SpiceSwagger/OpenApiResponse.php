<?php

namespace SpiceCRM\includes\SpiceSwagger;

use SpiceCRM\includes\Middleware\ValidationMiddleware;

class OpenApiResponse
{
    /**
     * generate a JSON response by the api builder
     * @param string $description
     * @param int $code
     * @return OpenApiBuilder
     */
    public function json(string $description, int $code = 200): OpenApiBuilder
    {
        return new OpenApiBuilder($description, $code);
    }

    /**
     * generate a JSON response with a bean schema
     * @param string|null $description
     * @param int $code
     * @return array[]
     */
    public function beanAsJson(?string $description = null, int $code = 200): array
    {
        return [
            $code => [
                'description' => $description ?: 'Object of bean data',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => ValidationMiddleware::TYPE_BEAN_SCHEMA
                        ]

                    ]
                ]
            ]
        ];
    }

    /**
     * define a property
     * @param string $name
     * @param string $type
     * @param string $example
     * @param array $settings
     * @param bool $required
     * @return array
     */
    public function property(string $name, string $type, string $example, array $settings = [], bool $required = false): array
    {
        if ($required) {
            $settings['required'] = true;
        }

        $schema = [
            'type' => $type, 'example' => $example
        ];

        if (isset($settings['options'])) {
            $settings['enum'] = $settings['options'];
            unset($settings['options']);
        }

        return [$name => array_merge($schema, $settings)];
    }

    /**
     * generate a property of type "object"
     * @param string $name
     * @param array ...$properties
     * @return array
     */
    public function propertyObject(string $name, array ...$properties): array
    {
        return [$name => OpenApiBuilder::extractSchema(array_merge(...$properties))];
    }

    /**
     * generate a property of type "array of objects"
     * @param string $name
     * @param array ...$itemProperties
     * @return array[]
     */
    public function propertyArrayOfObjects(string $name, array ...$itemProperties): array
    {
        return [$name => [
            'type' => 'array',
            'items' => OpenApiBuilder::extractSchema(array_merge(...$itemProperties))
        ]];
    }

    /**
     * generate a property of type "array" of the given type
     * @param string $name
     * @param string $itemType
     * @param array $settings
     * @param bool $required
     * @return array
     */
    public function propertyArrayOf(string $name, string $itemType, array $settings = [], bool $required = false): array
    {
        if ($required) {
            $settings['required'] = true;
        }

        return [$name => array_merge([
            'type' => 'array',
            'items' => ['type' => $itemType]
        ], $settings)];
    }
}