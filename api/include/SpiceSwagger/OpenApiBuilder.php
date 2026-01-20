<?php

namespace SpiceCRM\includes\SpiceSwagger;

class OpenApiBuilder
{
    /**
     * @var string $description the description of the response
     */
    private string $description;
    /**
     * @var string $code the http code of the response
     */
    private string $code;

    public function __construct(string $description, int $code)
    {
        $this->description = $description;
        $this->code = (string) $code;
    }

    /**
     * build an object and pass the properties of the object as ...args
     * @param array ...$properties
     * @return array[]
     */
    public function object(array ...$properties): array
    {
        return $this->buildResponse(self::extractSchema(array_merge(...$properties)));
    }

    /**
     * build an array of objects and pass the properties of the object as ...args
     * @param array ...$itemProperties
     * @return array[]
     */
    public function arrayOfObjects(array ...$itemProperties): array
    {
        return $this->buildResponse([
            'type' => 'array',
            'items' => self::extractSchema(array_merge(...$itemProperties))
        ]);
    }

    /**
     * Static helper to transform the flat property list into a Swagger Object
     * It pulls 'required' flags out of properties and puts them into the parent's required list.
     * @param array $properties
     * @return array
     */
    public static function extractSchema(array $properties): array
    {
        $schema = ['type' => 'object', 'properties' => []];
        $requiredList = [];

        foreach ($properties as $name => $details) {
            if (isset($details['required']) && $details['required'] === true) {
                $requiredList[] = $name;
                unset($details['required']); // Remove from the property itself per Swagger spec
            }
            $schema['properties'][$name] = $details;
        }

        if (!empty($requiredList)) {
            $schema['required'] = $requiredList;
        }

        return $schema;
    }

    /**
     * build the response bases on the schema
     * @param array $schema
     * @return array[]
     */
    private function buildResponse(array $schema): array
    {
        return [
            $this->code => [
                'description' => $this->description,
                'content' => [
                    'application/json' => [
                        'schema' => $schema
                    ]
                ]
            ]
        ];
    }
}