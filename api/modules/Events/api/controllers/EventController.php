<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Events\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;

class EventController
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
        $event = BeanFactory::getBean('Events', $body['eventId']);
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
                    $eventRegistration->salutation = $prospect->salutation;
                    $eventRegistration->first_name = $prospect->first_name;
                    $eventRegistration->last_name = $prospect->last_name;
                    $eventRegistration->parent_id = $prospect->id;
                    $eventRegistration->parent_type = $prospect->_module;
                    $eventRegistration->event_id = $body['eventId'];
                    $eventRegistration->assigned_user_id = AuthenticationController::getInstance()->getCurrentUser()->id;
                    // set additional values common to all registrations
                    if(is_array($registrationData)){
                        foreach($registrationData as $property => $value){
                            if(!in_array($eventRegistration->field_defs[$property]['type'], ['link', 'linked', 'relate'])){
                                $eventRegistration->$property = $value;
                            }
                        }
                    }
                    // save
                    $eventRegistration->save();
                    // update counter
                    $addedProspects[] = $prospect->id;
                }
            }
        }
        return $res->withJson(['success' => true, 'added_prospects_count' => count($addedProspects)]);
    }
}
