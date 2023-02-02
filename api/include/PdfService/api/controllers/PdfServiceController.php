<?php
namespace SpiceCRM\includes\PdfService\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\PdfService\PdfService;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class PdfServiceController {

    public static function getPdf( Request $req, Response $res, array $args ): Response
    {
        $parsedBody = $req->getParsedBody();
        if ( !SpiceACL::getInstance()->checkAccess('OutputTemplates', 'HTML2PDF')) {
            throw ( new ForbiddenException('Forbidden to use the HTML to PDF Service.'))->setErrorCode('noHTML2PDF');
        } else {
            return $res->withJson(['document' => base64_encode( PdfService::getPdfDocument( $parsedBody['html'] ))]);
        }
    }

}
