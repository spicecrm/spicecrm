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
     * returns registartions in the linked event
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getEventRegistrations(Request $req, Response $res, array $args): Response
    {
        $body = $req->getParsedBody();
        $listDataIds = $body['targetListIds'];
//        $listData [] = $body['listData'][is_integer()];
        $registrationData = $body['registrationData'];
        foreach ($listDataIds as $idx => $targetlistId) {
            $allProspectList = BeanFactory::getBean('ProspectLists', $targetlistId);
            $prospects = [];
            $prospects = array_merge($prospects, $allProspectList->get_linked_beans('contacts'));
            $prospects = array_merge($prospects, $allProspectList->get_linked_beans('consumers'));
            $prospects = array_merge($prospects, $allProspectList->get_linked_beans('users'));

            foreach ($prospects as $prospect) {
                $eventRegistration = BeanFactory::getBean('EventRegistrations');
                $eventRegistration -> salutation = $prospect -> salutation;
                $eventRegistration -> first_name = $prospect -> first_name;
                $eventRegistration -> last_name = $prospect -> last_name;
                $eventRegistration -> parent_id = $prospect -> relid;
                $eventRegistration -> parent_type = $prospect -> module_dir;
                $eventRegistration -> registration_status = $registrationData['registration_status'];
                $eventRegistration -> description = $registrationData['description'];
                $eventRegistration -> save();
            }
        }
        return $res->withJson('succes');
    }
}
