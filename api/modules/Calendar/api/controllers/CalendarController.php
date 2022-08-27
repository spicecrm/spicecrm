<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 * 
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 * 
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/



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
