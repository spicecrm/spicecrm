<?php
namespace SpiceCRM\includes\SpiceSwagger;

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainLoader;

class SpiceSwaggerParameter
{
    private $swaggerParameter = [];
    private $parameterName;
    private $parameterArray   = [];

    const TYPE_ARRAY   = 'array';
    const TYPE_BOOLEAN = 'boolean';
    const TYPE_INTEGER = 'integer';
    const TYPE_NUMBER  = 'number';
    const TYPE_OBJECT  = 'object';
    const TYPE_STRING  = 'string';

    public function __construct(string $parameterName, array $parameterArray) {
        $this->parameterName  = $parameterName;
        $this->parameterArray = $parameterArray;
    }

    public function generateSwaggerParameter() {
        try {
            $this->generateIn();
            $this->swaggerParameter['name'] = $this->parameterName;
            $this->swaggerParameter['required'] = $this->parameterArray['required'] ?? false;

            if ($this->swaggerParameter['in'] === 'path') {
                $this->swaggerParameter['required'] = true;
            }

            $this->swaggerParameter['description'] = $this->parameterArray['description'] ?? "";
            $this->generateSchema();
        }catch(\Exception $e){
            error_log('Error generating path for route: '. json_encode($this->parameterArray));
            error_log('Exception: '. $e->getMessage());
        }

        return $this->swaggerParameter;
    }

    private function generateIn() {
        switch ($this->parameterArray['in']) {
            case 'path':
                $this->swaggerParameter['in'] = 'path';
                break;
            case 'query':
                $this->swaggerParameter['in'] = 'query';
                break;
            case 'body':
                break;
        }
    }

    public function generateSwaggerSchemaParameter() {
        try {
            $schemaParameter = [
                'type' => 'object',
                'properties' => [],
                'required' => []
            ];

            if (!empty($this->parameterArray['description'])) {
                $schemaParameter['description'] = $this->parameterArray['description'];
            }

            $propertySchema = $this->resolveType($this->parameterArray['type'], $this->parameterArray['subtype'] ?? null);
            $schemaParameter['properties'][$this->parameterName] = $propertySchema;

            if ($this->parameterArray['required'] ?? false) {
                $schemaParameter['required'][] = $this->parameterName;
            }

            if (empty($schemaParameter['required'])) {
                unset($schemaParameter['required']);
            }

            return $schemaParameter;
        }catch(\Exception $e){
            error_log('Error generating schema parameter for: '. json_encode($this->parameterArray));
            error_log('Exception: '. $e->getMessage());
            return null;
        }

    }

    private function generateSchema() {
        if (!empty($this->parameterArray['subtype'])) { // arrays
            $this->swaggerParameter['schema'] = $this->resolveType($this->parameterArray['type'], $this->parameterArray['subtype']);
        } else { // other types
            $this->swaggerParameter['schema'] = $this->resolveType($this->parameterArray['type']);
        }


        $this->swaggerParameter['schema']['example'] = $this->parameterArray['example'];
    }

    private function resolveType(string|null $type, /*?string*/ $subtype = null): ?array {
        switch ($type) {
            case 'alphanumeric':
            case 'module':
            case 'extension':
            case 'string':
                return [
                    'type' => self::TYPE_STRING,
                ];
            case 'enum':
                return [
                    'type' => self::TYPE_STRING,
                    'enum' => $this->generateEnumOptions(),
                ];
            case 'guid':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'guid',
                ];
            case 'date':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'date',
                ];
            case 'datetime':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'date-time',
                ];
            case 'bool':
                return [
                    'type'   => self::TYPE_BOOLEAN,
                ];
            case 'numeric':
                return [
                    'type'   => self::TYPE_NUMBER,
                    'format' => 'guid',
                ];
            case 'email':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'email',
                ];
            case 'json':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'json',
                ];
            case 'base64':
                return [
                    'type'   => self::TYPE_STRING,
                    'format' => 'byte',
                ];
            case 'array':
                if (is_string($subtype)) {
                    return [
                        'type'  => self::TYPE_ARRAY,
                        'items' => $this->resolveType($subtype),
                    ];
                } elseif (is_array($subtype) && isset($subtype['type'])) {
                    return [
                        'type'  => self::TYPE_ARRAY,
                        'items' => $this->resolveType($subtype['type']),
                    ];
                } else {
                    return [
                        'type'  => self::TYPE_ARRAY,
                        'items' => ['type' => 'string'], // default to string if no subtype
                    ];
                }
            case ValidationMiddleware::TYPE_OBJECT:
            // todo add schemas for objects
            case ValidationMiddleware::TYPE_COMPLEX:
                if (isset($this->parameterArray['schema'])) {
                    return $this->parameterArray['schema'];
                } else {
                    return [
                        'type' => self::TYPE_OBJECT,
                        'additionalProperties' => true,
                        'description' => 'A complex object structure'
                    ];
                }

            default:
                return null;
        }
    }

    private function generateEnumOptions() {
        if ($this->parameterArray['type'] == 'enum' && isset($this->parameterArray['options'])) {
            if (is_array($this->parameterArray['options'])) {
                return $this->parameterArray['options'];
            } elseif (is_string($this->parameterArray['options'])) {
                $domainLoader = new SpiceDictionaryDomainLoader();
                return $domainLoader->loadValidationValuesForDomain($this->parameterArray['options']);
            }
        }
    }
}