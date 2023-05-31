<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Routing\RouteContext;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\RESTManager;

class ipClientsMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler)
    {
        $db = DBManagerFactory::getInstance();
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $requestPattern = $route->getPattern();
        $routeDefinition = RESTManager::getInstance()->getRoute($route->getIdentifier(), strtolower($request->getMethod()));

        if ( is_string( $routeDefinition['options']['ipClients'] )) $ipClientNames = [ $routeDefinition['options']['ipClients'] ];
        else if ( is_array( $routeDefinition['options']['ipClients'] )) $ipClientNames = $routeDefinition['options']['ipClients'];
        else $ipClientNames = [];

        $found = [];
        $sqlResult = $db->query("SELECT ip_client_name FROM sysipclientroutes WHERE route_pattern = '".$requestPattern."' AND request_method = '".$request->getMethod()."' AND active = 1");
        while ( $item = $db->fetchByAssoc( $sqlResult )) $found[$item['ip_client_name']] = true;
        $found = array_keys( $found );

        $ipClientNames = array_merge( $ipClientNames, $found );

        if ( count( $ipClientNames ) > 0 and self::checkIpClients( $ipClientNames ) ) return $handler->handle($request);
        else throw new ForbiddenException('Not from this IP address.');
    }

    public static function loadIpClients( $ipClientNames )
    {
        $db = DBManagerFactory::getInstance();
        $ipClients = [];
        foreach ( $ipClientNames as $ipClientName )
        {
            $sqlResult = $db->query("SELECT address, address_range_end FROM sysipclients WHERE name = '".$ipClientName."' AND active = 1");
            while ( $row = $db->fetchByAssoc( $sqlResult )) $ipClients[] = $row;
        }
        return $ipClients;
    }

    public static function checkIpClients( $ipClientNames ): bool
    {
        $currentClientIP = ( $_SERVER['REMOTE_ADDR'] === '::1' ? '127.0.0.1' : $_SERVER['REMOTE_ADDR'] );
        foreach ( self::loadIpClients( $ipClientNames ) as $ipClient )
        {
            if ( !empty( $ipClient['address'] )) {
                if ( !isset( $ipClient['address_range_end'][0] )) $ipClient['address_range_end'] = $ipClient['address'];
                $ipClient['address__long'] = ip2long( $ipClient['address'] );
                $ipClient['address_range_end__long'] = ip2long( $ipClient['address_range_end'] );
                $currentClientIP_long = ip2long( $currentClientIP );
                if ( $currentClientIP_long >= $ipClient['address__long'] and $currentClientIP_long <= $ipClient['address_range_end__long'] ) return true;
            }
        }
        return false;
    }
}
