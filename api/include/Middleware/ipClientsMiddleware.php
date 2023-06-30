<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Routing\RouteContext;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;

class ipClientsMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler)
    {
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $requestPattern = $route->getPattern();
        $routeDefinition = RESTManager::getInstance()->getRoute( $route->getIdentifier(), strtolower( $request->getMethod() ));

        if ( is_string( $routeDefinition['options']['ipClients'] )) $ipClientNames = [ $routeDefinition['options']['ipClients'] ];
        else if ( is_array( $routeDefinition['options']['ipClients'] )) $ipClientNames = $routeDefinition['options']['ipClients'];
        else $ipClientNames = [];
        $ipClientNames = array_merge( $ipClientNames, self::loadIpClientNames()[$requestPattern][strtolower( $request->getMethod() )] );

        $ipClients = self::loadIpClients();

        if ( count( $ipClientNames ) > 0 and self::checkIpClients( $ipClientNames, $ipClients ) ) return $handler->handle($request);
        else throw new ForbiddenException('Not from this IP address.');
    }

    public static function loadIpClients()
    {
        $ipClients = SpiceCache::get('ipClients');
        if ( $ipClients === false or $ipClients === null ) {
            $db = DBManagerFactory::getInstance();
            $ipClients = [];
            $sqlResult = $db->query("SELECT name, address, address_range_end FROM sysipclients WHERE active = 1");
            while ( $row = $db->fetchByAssoc( $sqlResult )) $ipClients[$row['name']][] = $row;
            SpiceCache::set('ipClients', $ipClients );
        }
        return $ipClients;
    }

    public static function loadIpClientNames()
    {
        $ipClientNames = SpiceCache::get('ipClientNames');
        if ( $ipClientNames === false or $ipClientNames === null ) {
            $db = DBManagerFactory::getInstance();
            $ipClientNames = [];
            $sqlResult = $db->query("SELECT DISTINCT ip_client_name, route_pattern, request_method FROM sysipclientroutes WHERE active = 1");
            while ( $item = $db->fetchByAssoc( $sqlResult )) $ipClientNames[$item['route_pattern']][strtolower( $item['request_method'] )][] = $item['ip_client_name'];
            SpiceCache::set('ipClientNames', $ipClientNames );
        }
        return $ipClientNames;
    }

    public static function checkIpClients( $ipClientNames, $ipClients ): bool
    {
        $currentClientIP = ( $_SERVER['REMOTE_ADDR'] === '::1' ? '127.0.0.1' : $_SERVER['REMOTE_ADDR'] );
        foreach ( $ipClientNames as $ipClientName )
        {
            foreach ( $ipClients[$ipClientName] as $ipClient )
            {
                if ( !empty( $ipClient['address'] )) {
                    if ( !isset( $ipClient['address_range_end'][0] )) $ipClient['address_range_end'] = $ipClient['address'];
                    $ipClient['address__long'] = ip2long( $ipClient['address'] );
                    $ipClient['address_range_end__long'] = ip2long( $ipClient['address_range_end'] );
                    $currentClientIP_long = ip2long( $currentClientIP );
                    if ( $currentClientIP_long >= $ipClient['address__long'] and $currentClientIP_long <= $ipClient['address_range_end__long'] ) return true;
                }
            }
        }
        return false;
    }
}
