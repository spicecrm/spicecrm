<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\SpiceReminders\api\controllers;

use SpiceCRM\includes\SpiceReminders\SpiceReminders;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceRemindersController
{

    static function getReminders(Request $req, Response $res, $args): Response
    {
        return $res->withJson(SpiceReminders::getRemindersRaw('', 0));
    }

    static function addReminder(Request $req, Response $res, $args): Response
    {
        SpiceReminders::setReminderRaw($args['id'], $args['module'], $args['date']);
        return $res->withJson(['status' => 'success']);
    }

    static function deleteReminder(Request $req, Response $res, $args): Response
    {
        SpiceReminders::removeReminder($args['id']);
        return $res->withJson(['status' => 'success']);
    }
}
