<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\Emails\api\controllers\EmailsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    'method'      => 'post',
    'route'       => '/module/Emails/{id}/downloadlink/validate',
    'class'       => EmailsController::class,
    'function'    => '',
    'description' => 'Validates the email address, checks if the downloadlink button has been clicked and if the downloadlink counter is less than the maximum downloads allowed',
    'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
    'parameters'  => [
        'id'     => [
            'in'          => 'path',
            'type'        => ValidationMiddleware::TYPE_GUID,
            'required'    => true,
            'description' => 'ID of the email',
        ],
        'emailaddress' => [
            'in'          => 'body',
            'type'        => ValidationMiddleware::TYPE_EMAIL,
            'required'    => true,
        ]
    ]
];