<?php
namespace SpiceCRM\modules\Trackers\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\authentication\AuthenticationController;

class TrackersController
{

    /**
     * load the recent items
     * @return Response
     */
    public function loadRecent(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $moduleHandler = new SpiceBeanHandler();

        $tracker = BeanFactory::getBean('Trackers');
        $history = $tracker->get_recently_viewed($current_user->id, '', 50);
        $recentItems = [];
        foreach ($history as $row) {
            try {
                $seed = BeanFactory::getBean($row['module_name'], $row['item_id'], ['relationships' => false]);
                if ($seed) {
                    $seed->retrieveViewDetails();
                    $row['data'] = $moduleHandler->mapBeanToArray($row['module_name'], $seed);
                    $row['summary_text'] = $seed->get_summary_text();
                    $recentItems[] = $row;
                }
            } catch(\Exception $e) {
                LoggerManager::getLogger()->error("Unable to load recently viewed items: ".$e->getMessage());
            }
        }
        return $res->withJson($recentItems);
    }

    /**
     * returns the recent items. Accepts as call parameters the module and the limit of records to be retrieved. If no module is sent in the params this is a global request
     */
    public function getRecent(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $getParams = $req->getQueryParams();

        $moduleHandler = new SpiceBeanHandler();

        $tracker = BeanFactory::getBean('Trackers');
        $history = $tracker->get_recently_viewed($current_user->id, $getParams['module'] ? [$getParams['module']] : '', $getParams['limit']);

        $recentItems = [];
        foreach($history as $row){
            $seed = BeanFactory::getBean($row['module_name'], $row['item_id']);
            if($seed){
                $seed->retrieveViewDetails();
                $row['data'] = $moduleHandler->mapBeanToArray($row['module_name'], $seed);
                $row['summary_text'] = $seed->get_summary_text();
                $recentItems[] = $row;
            }
        }
        return $res->withJson($recentItems);
    }
}
