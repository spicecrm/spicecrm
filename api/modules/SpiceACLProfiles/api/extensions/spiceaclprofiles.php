<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SpiceACLProfiles\api\controllers\SpiceACLProfilesController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('aclmanager', '1.0');

/**
 * fill in routes array
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Users/{id}/related/spiceaclprofiles',
        'oldroute'    => '/spiceaclprofiles/foruser/{userrid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'getACLProfilesForUser',
        'description' => 'Get SpiceACL Profiles for user',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a user id',
                'example' => 'fe475f76-9455-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLProfiles/{id}/activation',
        'oldroute'    => '/spiceaclprofiles/{id}/activate',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'activateProfile',
        'description' => 'SpiceACL Profile Activate',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLProfiles/{id}/activation',
        'oldroute'    => '/spiceaclprofiles/{id}/deactivate', // by post
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'deactivateProfile',
        'description' => 'SpiceACL Profile Deactivate',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLProfiles/{id}/related/spiceaclobjects',
        'oldroute'    => '/spiceaclprofiles/{id}/aclobjects',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'getProfileObjects',
        'description' => 'get SpiceACLObjects allocated to specified Profile',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLProfiles/{id}/related/spiceaclobjects/{objectid}',
        'oldroute'    => '/spiceaclprofiles/{id}/aclobjects/{objectid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'addProfileObject',
        'description' => 'add a SpiceACLObject to a specified Profile',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ],
            'objectid' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a spice acl object id',
                'example' => '32712d30-9458-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLProfiles/{id}/related/spiceaclobjects/{objectid}',
        'oldroute'    => '/spiceaclprofiles/{id}/aclobjects/{objectid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'deleteProfileObject',
        'description' => 'remove allocation of a SpiceACLObject from specified Profile',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ],
            'objectid' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a spice acl object id',
                'example' => '32712d30-9458-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLProfiles/{id}/related/users',
        'oldroute'    => '/spiceaclprofiles/{id}/aclusers',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'getUsersHavingProfile',
        'description' => 'get list of users having specified profile',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLProfiles/{id}/related/users',
        'oldroute'    => '/spiceaclprofiles/{id}/aclusers',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'addProfileUsers',
        'description' => 'add specified profile to user list',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ],
            'userids' => [
                'in' => 'body',
                'type' => 'array',
                'description' => 'an array of user Ids',
                'example' => ['e493a427-945b-11eb-ac92-00fffe0c4f07', 'ebb23322-945b-11eb-ac92-00fffe0c4f07']
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLProfiles/{id}/related/users/{userid}',
        'oldroute'    => '/spiceaclprofiles/{id}/aclusers/{userid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'addProfileUser',
        'description' => 'allocate a profile to specified user',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a user id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ],
            'userid' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => 'fe475f76-9455-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLProfiles/{id}/related/users/{userid}',
        'oldroute'    => '/spiceaclprofiles/{id}/aclusers/{userid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'deleteProfileUser',
        'description' => 'remove a profile allocation for specified user',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a user id',
                'example' => '8571a91c-9456-11eb-ac92-00fffe0c4f07'
            ],
            'userid' => [
                'in' => 'path',
                'type' => 'guid',
                'description' => 'a profile id',
                'example' => 'fe475f76-9455-11eb-ac92-00fffe0c4f07'
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
