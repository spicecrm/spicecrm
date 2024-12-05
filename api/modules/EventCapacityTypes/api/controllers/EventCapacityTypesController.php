<?php

namespace SpiceCRM\modules\EventCapacityTypes\api\controllers;

use SpiceCRM\data\BeanFactory;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\EventCapacityTypes\EventCapacityType;

class EventCapacityTypesController
{

    /**
     * Check if participant is allowed for eventcapacitytype
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function callEventCapacityTypeMethod(Request $req, Response $res, array $args): Response {
        $eventcapacitytype = BeanFactory::getBean('EventCapacityTypes', $args['id']);

        if( !EventCapacityType::participantIsBlocked( $args['date_start'], $eventcapacitytype, [ 'participantType' => $args['participant_type'], 'participantId' => $args['participant_id'] ] )) {
            return $res->withJson( $eventcapacitytype->callCapacityTypeMethod($args['participant_type'], $args['participant_id'] ));
        } else {
            throw (new BadRequestException('Consumer is blocked'))->setErrorCode('consumerIsBlocked')->setLbl('LBL_BLOCKED_FOR_THIS_EVENT');
        }
    }
}
