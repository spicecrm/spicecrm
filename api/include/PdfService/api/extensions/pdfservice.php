<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use \SpiceCRM\includes\PdfService\api\controllers\PdfServiceController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/common/pdfservice',
        'class'       => PdfServiceController::class,
        'function'    => 'getPdf',
        'description' => 'Take HTML code and generate a PDF file.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'   => [
            'html' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the HTML code',
                'example' => '<html><body>asdf</body></html>',
                'required' => true,
            ],
        ]
    ]];

/**
 * register the Extension
 */
$RESTManager->registerExtension('pdfservice', '1.0', [], $routes);
