<?php
namespace SpiceCRM\includes\SpiceSwagger;

use SpiceCRM\includes\ErrorHandlers\Exception;
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
    private $selectedRoute;
    private $includeSubroutes;

    /**
     * SpiceSwaggerGenerator constructor.
     * @param array $allRoutes
     * @param array $allExtensions
     * @param array|null $extensions
     * @param array|null $modules
     * @param string|null $node
     */
    public function __construct(string $selectedRoute, bool $includeSubroutes, array $allRoutes, array $allExtensions, ?array $extensions, ?array $modules, string $node = "/") {
        $this->allRoutes     = $allRoutes;
        $this->routes        = $allRoutes;
        $this->extensions    = $allExtensions;
        $this->allExtensions = $allExtensions;
        $this->selectedRoute = $selectedRoute;
        $this->includeSubroutes = $includeSubroutes;


        if ($modules) {
            $this->instantiateGenericRoutes($modules);
        }

        $this->filterRoutes($extensions, $node);

        if ($extensions) {
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
        $infoArray['description']    = 'Lorem ipsum dolor sit amet';
        $infoArray['version']        = '2021.03.001';
        $infoArray['title']          = 'SpiceCRM';
        $infoArray['termsOfService'] = '';
        $infoArray['contact']        = [
            'email' => 'info@spicecrm.io',
        ];
        /*$infoArray['license']        = [
            'name' => 'AGPL-3.0',
            'url'  => 'https://github.com/spicecrm/spicecrm_be_release_core/blob/master/LICENSE',
        ];*/

        $this->structureArray['info'] = $infoArray;
    }

    /**
     * Generates tags.
     * Tags are extension names.
     */
    private function generateTags(): void {
        $usedExtensions = [];

        // Collect used extensions from the filtered routes
        foreach ($this->routes as $route) {
            if (!empty($route['extension'])) {
                $usedExtensions[$route['extension']] = true;
            }
        }

        // Only add tags for extensions that are actually used
        foreach ($usedExtensions as $extensionName => $used) {
            if (isset($this->extensions[$extensionName])) {
                $tags[] = [
                    'name' => $extensionName,
                    'description' => $extensionName . ' v' . $this->extensions[$extensionName]['version'],
                ];
            }
        }

        // Add 'custom' tag only if there are custom routes
        $hasCustomRoutes = array_reduce($this->routes, function($carry, $route) {
            return $carry || (!empty($route['custom']) && $route['custom'] === true);
        }, false);

        if ($hasCustomRoutes) {
            $tags[] = [
                'name' => 'custom',
                'description' => 'Customer specific routes',
            ];
        }

        $this->structureArray['tags'] = $tags;
    }

    /**
     * Generates schemes.
     */
    private function generateSchemes(): void {
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
                $pathRoute = $route['route'];
                $pathMethod = $route['method'];
                $pathsArray[$pathRoute][$pathMethod] = $path->generatePathArray();
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
        $this->structureArray['externalDocs']['description'] = 'Find out more about SpiceCRM';
        $this->structureArray['externalDocs']['url']         = 'https://www.spicecrm.io/';
    }

    /**
     * Generates a YAML out of the structure array.
     *
     * @return string
     */
    private function convertToYaml(): string {
        $yaml = Yaml::dump($this->structureArray, 12, 2, Yaml::DUMP_MULTI_LINE_LITERAL_BLOCK);

        //This is used to find the response codes and turn them into strings instead of leaving them as numbers
        $yaml = preg_replace_callback(
            '/^(\s+)(\d{3}):$/m',
            function($matches) {
                return $matches[1] . "'" . $matches[2] . "':";
            },
            $yaml
        );

        return $yaml;
    }

    /**
     * Filters the routes.
     * Only the routes belonging to the $extensions will be added to the swagger file output.
     *
     * @param string $node
     * @param array $extensions
     */
    private function filterRoutes(?array $extensions, string $node = "/"): void {
        $routes = [];

        foreach ($this->allRoutes as $route) {
            if ($this->belongsToNode($route, $node) && $this->belongsToExtensions($route, $extensions)) {
                if ($this->includeSubroutes && strpos($route['route'], $this->selectedRoute) === 0) {
                    $routes[] = $route;
                } elseif ($route['route'] === $this->selectedRoute) {
                    $routes[] = $route;
                }
            }
        }

        $this->routes = $routes;
    }

    /**
     * Checks if a given route belongs to the node.
     *
     * @param array $route
     * @param string $node
     * @return bool
     */
    private function belongsToNode(array $route, string $node): bool {
        if (strpos($route['route'], $node) === 0) {
            return true;
        }

        return false;
    }

    /**
     * Checks if a given route belongs to any of the given extensions.
     *
     * @param array $route
     * @param array $extensions
     * @return bool
     */
    private function belongsToExtensions(array $route, ?array $extensions): bool {
        // Empty extension array means that there is no extension filtering
        if (empty($extensions)) {
            return true;
        }

        foreach ($extensions as $extensionName) {
            if ($route['extension'] == $extensionName) {
                return true;
            }
        }

        return false;
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
                    if (!SpiceUtils::isValidModule($moduleName)) {
//                        throw new Exception('Invalid module name ' . $moduleName);
                        continue;
                    }

                    $routeCopy = $route;
                    $routeCopy['route'] = str_replace('{beanName}', $moduleName, $route['route']);
                    unset($routeCopy['parameters']['beanName']);
                    $this->allRoutes[$routeCopy['method'].':'.$routeCopy['route']] = $routeCopy;
                    $this->routes[$routeCopy['method'].':'.$routeCopy['route']] = $routeCopy;
                }
            }
        }

    }
}