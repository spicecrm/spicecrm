<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Calendar\api\controllers;

use SpiceCRM\modules\Calendar\api\handlers\CalendarRestHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class CalendarController
{
    /**
     * gets a calendar module
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getCalendarModules(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        return $res->withJson($restHandler->getCalendarModules());
    }

    /**
     * gets a calendar
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getOtherCalendars(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        return $res->withJson($restHandler->getCalendars());
    }

    /**
     * gets a calender depending on the user
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUserCalendarEvents(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getUserCalendarEvents($args['userId'], $args['calendarId'], $params));
    }
}
