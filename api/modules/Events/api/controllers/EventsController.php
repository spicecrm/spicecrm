<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Events\api\controllers;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class EventsController
{
    /**
     * create eventregistrations for given records related to a prospectlist
     * In case the prospect already has an eventregistration record no further eventregistration will be created for that prospect.
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function createEventRegistrations(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();
        $prospectListIds = $body['targetListIds'];
        $registrationData = $body['registrationData'];
        $event = BeanFactory::getBean('Events', $args['id']);
        $existingEventRegistrations = $event->get_linked_beans('eventregistrations');
        $participants = [];
        foreach ($existingEventRegistrations as $existingEventRegistration){
            $participants[] = $existingEventRegistration->parent_id;
        }
        foreach ($prospectListIds as $prospectListId) {
            $prospectList = BeanFactory::getBean('ProspectLists', $prospectListId);
            if(!$prospectList) continue;

            $prospects = [];
            // get related beans - we consider only Person extended beans
            $prospects = array_merge($prospects, $prospectList->get_linked_beans('contacts'));
            if($prospectList->load_relationship('consumers')){
                $prospects = array_merge($prospects, $prospectList->get_linked_beans('consumers'));
            }
            if($prospectList->load_relationship('users')){
                $prospects = array_merge($prospects, $prospectList->get_linked_beans('users'));
            }
            if($prospectList->load_relationship('leads')){
                $prospects = array_merge($prospects, $prospectList->get_linked_beans('leads'));
            }
            // $prospects = array_merge($prospects, $allProspectList->get_linked_beans('accounts'));

            // initiate counter for new records
            $addedProspects = [];

            // loop the prospects
            foreach ($prospects as $prospect) {
                if(empty($prospect->id)) continue;
                if (!in_array($prospect->id, $participants)) {
                    // map personal data
                    $eventRegistration = BeanFactory::getBean('EventRegistrations');
                    // set additional values common to all registrations first!
                    if(is_array($registrationData)){
                        foreach($registrationData as $property => $value){
                            if(!in_array($eventRegistration->field_defs[$property]['type'], ['link', 'linked', 'relate'])){
                                $eventRegistration->$property = $value;
                            }
                        }
                    }

                    $eventRegistration->salutation = $prospect->salutation;
                    $eventRegistration->first_name = $prospect->first_name;
                    $eventRegistration->last_name = $prospect->last_name;
                    $eventRegistration->parent_id = $prospect->id;
                    $eventRegistration->parent_type = $prospect->_module;
                    $eventRegistration->event_id = $event->id;
                    if(empty($eventRegistration->assigned_user_id))
                        $eventRegistration->assigned_user_id = AuthenticationController::getInstance()->getCurrentUser()->id;

                    // save
                    $eventRegistration->save();
                    // update counter
                    $addedProspects[] = $prospect->id;
                }
            }
        }
        return $res->withJson(['success' => true, 'added_prospects_count' => count($addedProspects)]);
    }

    /**
     * Load the Event.
     * @param $id The ID of the Event.
     */
    private function loadEvent( $id ): void
    {
        $this->event = BeanFactory::getBean('Events', $id );
        if ( !$this->event ) throw ( new NotFoundException('Event not found.'))->setLookedFor([ 'id' => $id, 'module' => 'Events' ]);
    }

    /**
     * get event with calculated timeslots and slots (for landingpage)
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    /* necessary? */
    /*
    public function getCapacitiesWithSlots(Request $req, Response $res, array $args): Response
    {
        $this->loadEvent( $args['id'] );
        $result = $this->event->getCapacitiesWithSlots();

        return $res->withJson($result);
    }
    */

    /**
     * get all EventCapacityTypes with the related EventCapacities and all its slots
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function getBookingTable_forEvent( Request $req, Response $res, array $args ): Response
    {
        $this->loadEvent( $args['id'] );
        $result = $this->event->getBookingTable( null );
        return $res->withJson([ 'status' => 'success', 'data' =>  $result ]);
    }

    /**
     * get all events with their capacities and the available timeslots
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    public function getBookingTable_forCapacity( Request $req, Response $res, array $args ): Response
    {
        $eventcapacity = BeanFactory::getBean('EventCapacities', $args['id'] );
        if ( !$eventcapacity ) throw ( new NotFoundException('EventCapacity not found.'))->setLookedFor([ 'id' => $args['id'], 'module' => 'EventCapacities' ]);

        $event = BeanFactory::getBean('Events', $eventcapacity->event_id );
        if ( !$event ) throw new Exception('Event of EventCapacity not found.');

        $result = $event->getBookingTable( $eventcapacity->id );

        return $res->withJson([ 'status' => 'success', 'data' =>  $result ]);
    }

    /**
     * create new booking without capacity
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     */
    /* necessary? */
    /*
    public function saveEventBookingWithoutCapacity(Request $req, Response $res, array $args): Response
    {
        $bodyParams = $req->getParsedBody();

        $event = BeanFactory::getBean('Events', $bodyParams['event_id']);

        $eventbooking = BeanFactory::getBean('EventBookings');
        $eventbooking->id = $args['id'];

        return $res->withJson(['status' => 'success', 'data' =>  $eventbooking->saveFromLandingPage($bodyParams, $event)]);
    }
    */

    /* necessary? */
    /*
    / **
     * set event favorite to consumer
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     * /
    public function setFavoriteEvent(Request $req, Response $res, array $args): Response
    {
        $event = BeanFactory::getBean('Events', $args['event_id']);
        $consumer = BeanFactory::getBean('Consumers', $args['id']);

        if ( $event and $consumer ) {

            $consumer->fav_event_id = $event->id;
            $consumer->save();

            return $res->withJson(['status' => 'success']);
        } else {
            return $res->withJson(['status' => 'error', 'message' => 'Event or Consumer does not exist']); // todo: throw exception
        }
    }

    / **
     * delete event favorite from consumer
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     * /
    public function deleteFavoriteEvent(Request $req, Response $res, array $args): Response
    {
        $consumer = BeanFactory::getBean('Consumers', $args['id']);
        $consumer->fav_event_id = '';
        $consumer->save();
        return $res->withJson(['status' => 'success']);
    }
    */

}
