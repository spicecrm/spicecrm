<?php
namespace SpiceCRM\includes\SpiceSwagger;

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use Symfony\Component\Yaml\Yaml;

/**
 * Class SpiceSwaggerGenerator
 *
 * Generates a swagger file for the given routes.
 *
 * @package SpiceCRM\includes\SpiceSwagger
 */
class SpiceSwaggerGenerator
{
    private $routes;
    private $allRoutes;
    private $extensions;
    private $allExtensions;
    private $structureArray = [];

    /**
     * SpiceSwaggerGenerator constructor.
     * @param array $allRoutes
     * @param array $allExtensions
     * @param array|null $extensions
     * @param array|null $modules
     */
    public function __construct(array $allRoutes, array $allExtensions, ?array $extensions, ?array $modules) {
        $this->allRoutes     = $allRoutes;
        $this->routes        = $allRoutes;
        $this->extensions    = $allExtensions;
        $this->allExtensions = $allExtensions;

        if ($modules) {
            $this->instantiateGenericRoutes($modules);
        }

        if ($extensions) {
            $this->filterRoutes($extensions);
            $this->filterExtensions($extensions);
        }
    }

    /**
     * Generates all the necessary parts for the swagger file and converts it into the yaml format.
     *
     * @return string
     */
    public function generateSwaggerFile(): string {
        $this->generateStructure();
        $this->generateInfo();
        $this->generateTags();
//        $this->generateSchemes();
        $this->generatePaths();
//        $this->generateSecurityDefinitions();
//        $this->generateDefinitions();
        $this->generateComponents();
        $this->generateExternalDocs();

        return $this->convertToYaml();
    }

    /**
     * Sets up the main structure of data needed by swagger.
     */
    private function generateStructure(): void {
        $this->structureArray['openapi']  = '3.0.0';
        $this->structureArray['info']     = [];
//        $this->structureArray['host']     = 'slim4.local'; SpiceConfig::getInstance()->get('site_url'); // todo fix it
//        $this->structureArray['basePath'] = SpiceUtils::determineAppBasePath();
        $this->structureArray['tags']     = [];
//        $this->structureArray['schemes']  = [];
        $this->structureArray['paths']    = [];
//        $this->structureArray['securityDefinitions'] = [];
//        $this->structureArray['definitions']  = [];
        $this->structureArray['externalDocs'] = [];
    }

    private function generateInfo():void {
        $infoArray = [];
        // todo what is exactly supposed to be in the description?
        $infoArray['description']    = 'Lorem ipsum dolor sit amet';
        $infoArray['version']        = SpiceConfig::getInstance()->get('sugar_version');
        // todo is the title ok?
        $infoArray['title']          = 'SpiceCRM';
        // todo is this necessary?
        $infoArray['termsOfService'] = '';
        $infoArray['contact']        = [
            // todo is this ok?
            'email' => 'office@twentyreasons.com',
        ];
        $infoArray['license']        = [
            'name' => 'AGPL-3.0',
            'url'  => 'https://github.com/spicecrm/spicecrm_be_release_core/blob/master/LICENSE',
        ];

        $this->structureArray['info'] = $infoArray;
    }

    /**
     * Generates tags.
     * Tags are extension names.
     */
    private function generateTags(): void {
        $tags = [];
        foreach ($this->extensions as $extensionName => $extension) {
            $tags[] = [
                'name'        => $extensionName,
                'description' => $extensionName . ' v' . $extension['version'],
            ];
        }

        $this->structureArray['tags'] = $tags;
    }

    /**
     * Generates schemes.
     */
    private function generateSchemes(): void {
        // todo always both?
        $this->structureArray['schemes'][] = 'https';
        $this->structureArray['schemes'][] = 'http';
    }

    /**
     * Generates paths.
     */
    private function generatePaths(): void {
        $pathsArray = [];

        foreach ($this->routes as $route) {
            $path = new SpiceSwaggerPath($route);
            $pathsArray[$route['route']][$route['method']] = $path->generatePathArray();
        }

        $this->structureArray['paths'] = $pathsArray;
    }

    /**
     * Generates security definitions.
     */
    private function generateSecurityDefinitions(): void {
        $secDefsArray = [];
        $secDefsArray['basicAuth'] = [
            'type' => 'basic',
        ];
        // todo add all the other auth types
//        $secDefsArray['OAuth'] = [
//            'type' => 'oauth2',
//        ];

        $this->structureArray['securityDefinitions'] = $secDefsArray;
    }

    /**
     * Generates definitions.
     */
    private function generateDefinitions(): void {

    }

    /**
     * Generates components.
     */
    private function generateComponents(): void {
        $this->structureArray['components']['schemas']['GenericSchema'] = [
            'type'   => 'string',
            'format' => 'json',
        ];
    }

    /**
     * Generates external docs.
     */
    private function generateExternalDocs(): void {
        // todo what is supposed to be here?
        $this->structureArray['externalDocs']['description'] = 'Find out more about SpiceCRM';
        $this->structureArray['externalDocs']['url']         = 'https://www.spicecrm.io/';
    }

    /**
     * Generates a YAML out of the structure array.
     *
     * @return string
     */
    private function convertToYaml(): string {
        return Yaml::dump($this->structureArray);
    }

    /**
     * Filters the routes.
     * Only the routes belonging to the $extensions will be added to the swagger file output.
     *
     * @param array $extensions
     */
    private function filterRoutes(array $extensions): void {
        $routes = [];
        foreach ($extensions as $extensionName) {
            if ($this->extensionExists($extensionName)) {
                foreach ($this->allRoutes as $route) {
                    if ($route['extension'] == $extensionName) {
                        $routes[] = $route;
                    }
                }
            }
        }
        $this->routes = $routes;
    }

    /**
     * Checks if an extension with the given name exists.
     *
     * @param $searchedExtension
     * @return bool
     */
    private function extensionExists($searchedExtension): bool {
        foreach ($this->extensions as $extensionName => $extension) {
            if ($extensionName == $searchedExtension) {
                return true;
            }
        }

        return false;
    }

    /**
     * Filters the extensions
     *
     * @param array $extensions
     */
    private function filterExtensions(array $extensions): void {
        $this->extensions = [];
        foreach ($extensions as $extensionName) {
            if ($extensionName == '' || !isset($this->allExtensions[$extensionName])) {
                continue;
            }
            $this->extensions[$extensionName] = $this->allExtensions[$extensionName];
        }
    }

    /**
     * Appends the route list with module generic routes
     * eg. instead of {beanName} generate Accounts/Contacts etc
     *
     * @param array $modules
     */
    private function instantiateGenericRoutes(array $modules): void {
        foreach ($this->allRoutes as $route) {
            if (strpos($route['route'], '{beanName}') !== false) {
                foreach ($modules as $moduleName) {
                    // todo first of all check if it's a valid module

                    $routeCopy = $route;
                    $routeCopy['route'] = str_replace('{beanName}', $moduleName, $route['route']);

                    $this->allRoutes[$routeCopy['method'].':'.$routeCopy['route']] = $routeCopy;
                    $this->routes[$routeCopy['method'].':'.$routeCopy['route']] = $routeCopy;
                }
            }
        }

    }
}