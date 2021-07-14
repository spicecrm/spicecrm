<?php
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
    public function KRESTGetCalendar(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        return $res->withJson($restHandler->getCalendars());
    }

    /**
     * get other calendars depending on an id
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function KRESTGetOtherCalendars(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getOtherCalendars($args['calendarId'], $params));
    }

    /**
     * gets a calender depending on the user
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getUserCalendar(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getUserCalendar($args['userId'], $params));
    }

    /**
     * gget all calendars assigned to an user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getUsersCalendar(Request $req, Response $res, array $args): Response {
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getUsersCalendar($args['userId'], $params));
    }

}
