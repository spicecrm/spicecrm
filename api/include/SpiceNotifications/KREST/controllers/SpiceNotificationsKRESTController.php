<?php


namespace SpiceCRM\includes\SpiceNotifications\KREST\controllers;


use Slim\Psr7\Request;
use Slim\Psr7\Response;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceNotifications\SpiceNotificationsLoader;

class SpiceNotificationsKRESTController
{
    /**
     * mark the notification as read in the database
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return false
     * @throws \Exception
     */
    public function markAllAsRead(Request $req, Response $res, array $args)
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("UPDATE spicenotifications SET notification_read = 1 WHERE notification_read <> 1");
        return $res->withJson(['success' => !$query ? 0 : 1]);
    }
    /**
     * mark the notification as read in the database
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return false
     * @throws \Exception
     */
    public function markAsRead(Request $req, Response $res, array $args)
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("UPDATE spicenotifications SET notification_read = 1 WHERE id = '{$args['id']}'");
        return $res->withJson(['success' => !$query ? 0 : 1]);
    }

    /**
     * save the notification
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @throws \Exception
     */
    public function save(Request $req, Response $res, array $args)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $params = $req->getParsedBody();

        $db->query("INSERT INTO spicenotifications (id, bean_module, bean_id, created_by, user_id, notification_date, notification_type)
                VALUES ('{$args['id']}', '{$params['beanModule']}', '{$params['beanId']}', '{$current_user->id}', '{$params['userId']}', '{$params['notificationDate']}', '{$params['notificationType']}')");
    }

    /**
     * Loads user notifications.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function loadNotifications(Request $req, Response $res, array $args): Response {
        $queryParams = $req->getQueryParams();
        $offset = $queryParams['offset'] ?: 0;
        $limit  = $queryParams['limit'] ?: 50;

        $loader = new SpiceNotificationsLoader();

        return $res->withJson($loader->loadUserNotificationsAndCount($offset, $limit));
    }
}