<?php
namespace SpiceCRM\includes\SugarObjects\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class GdprController {

    /*
     * Get the GDPR consent text for portal user from the CRM configuration.
     */
    function getPortalGDPRconsentText( Request $req, Response $res, $args ): Response {
        if ( empty( SpiceConfig::getInstance()->config['portal_gdpr']['consent_text'] ) or empty( SpiceConfig::getInstance()->config['portal_gdpr']['obtain_consent'] ))
            throw ( new Exception('GDPR consent is not configured (yet).'))->setErrorCode('consentNotDefined');

        return $res->withJson([ 'portalGDPRconsentText' => SpiceConfig::getInstance()->config['portal_gdpr']['consent_text'] ]);
    }

    /*
     * Saves the GDPR consent of a portal user.
     */
    function setPortalGDPRconsent( Request $req, Response $res, $args ): Response {
        $consentText = $req->getParsedBody()['consentText'];

        if ( !AuthenticationController::getInstance()->getCurrentUser()->portal_only )
            throw ( new BadRequestException('User is not a portal user.'))->setErrorCode('notPortalUser');

        $contactOfPortalUser = BeanFactory::getBean('Contacts');
        $contactOfPortalUser->retrieve_by_string_fields([ 'portal_user_id' => AuthenticationController::getInstance()->getCurrentUser()->id ]);

        if ( empty( $contactOfPortalUser->id ))
            throw ( new Exception('Contact of portal user not found.'))->setErrorCode('noContactForPortalUser');

        if ( empty( $consentText ))
            throw ( new BadRequestException('Missing consent text.'))->setErrorCode('missingConsentText');

        if ( !empty( $contactOfPortalUser->gdpr_data_source ))
            throw ( new BadRequestException('Consent already set.'))->setErrorCode('consentAlreadySet');

        if ( SpiceConfig::getInstance()->config['portal_gdpr']['consent_text'] !== $consentText )
            throw ( new BadRequestException('Wrong consent text.'))->setErrorCode('wrongConsentText')->setDetails(['properConsentText' => SpiceConfig::getInstance()->config['portal_gdpr']['consent_text'] ]);

        $contactOfPortalUser->gdpr_data_agreement = true;
        $contactOfPortalUser->gdpr_data_source = gmdate('Y-m-d H:i:s').' (UTC); '.$consentText;
        $contactOfPortalUser->save();

        return $res->withJson(['success' => true, 'text' => $consentText ]);
    }

    public function getGdprReleases( Request $req, Response $res, $args ): Response {
        $seed = BeanFactory::getBean($args['module'], $args['id']);
        if(!$seed){
            throw new NotFoundException();
        }

        if(!$seed->ACLAccess('detail')){
            throw new ForbiddenException();
        }

        if(method_exists($seed, 'getGDPRRelease')){
            return $res->withJson($seed->getGDPRRelease());
        } else {
            return $res->withJson([]);
        }

    }

}
