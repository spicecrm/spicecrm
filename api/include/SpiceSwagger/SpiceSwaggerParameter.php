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
        $this->generateIn();
        $this->swaggerParameter['name']        = $this->parameterName;
        $this->swaggerParameter['required']    = $this->parameterArray['required'] ?: true;
        $this->swaggerParameter['description'] = $this->parameterArray['description'];
        $this->generateSchema();

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

    private function generateSchema() {
        if (!empty($this->parameterArray['subtype'])) { // arrays
            $this->swaggerParameter['schema'] = $this->resolveType($this->parameterArray['type'], $this->parameterArray['subtype']);
        } else { // other types
            $this->swaggerParameter['schema'] = $this->resolveType($this->parameterArray['type']);
        }


        $this->swaggerParameter['schema']['example'] = $this->parameterArray['example'];
    }

    private function resolveType(string $type, /*?string*/ $subtype = null): ?array {
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
                        'items' => [
                            $this->resolveType($subtype['type']),
                        ],
                    ];
                }

            case ValidationMiddleware::TYPE_OBJECT:
            // todo add schemas for objects
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