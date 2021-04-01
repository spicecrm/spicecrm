<?php
namespace SpiceCRM\modules\Calendar\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\modules\Calendar\KREST\handlers\CalendarRestHandler;
use Slim\Routing\RouteCollectorProxy;

class KRESTCalendarController{

    /**
     * gets a calendar module
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function KRESTGEtCalendarModules($req,$res,$args){
        $restHandler = new  CalendarRestHandler();
        return $res->withJson($restHandler->getCalendarModules());
    }

    /**
     * gets a calendar
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function KRESTGetCalendar($req,$res,$args){
        $restHandler = new  CalendarRestHandler();
        return $res->withJson($restHandler->getCalendars());
    }

    /**
     * get other calendars depending on an id
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function KRESTGetOtherCalendars($req,$res,$args){
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getOtherCalendars($args['calendarid'], $params));
    }

    /**
     * gets a calender depending on the user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function KRESTGEtUserCalendar($req,$res,$args){
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getUserCalendar($args['user'], $params));
    }

    /**
     * gget all calendars assigned to an user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function KRESTGetUsersCalendar($req,$res,$args){
        $restHandler = new  CalendarRestHandler();
        $params = $req->getQueryParams();
        return $res->withJson($restHandler->getUsersCalendar($args['user'], $params));
    }

}
