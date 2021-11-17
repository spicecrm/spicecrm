<?php
namespace SpiceCRM\modules\Trackers\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\authentication\AuthenticationController;

class TrackersController
{

    /**
     * called from the REST loader to load the recent items initially
     *
     * @return array
     */
    public function loadRecent(): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $moduleHandler = new ModuleHandler();

        $tracker = BeanFactory::getBean('Trackers');
        $history = $tracker->get_recently_viewed($current_user->id, '', 50);
        $recentItems = [];
        foreach ($history as $key => $row) {
            if (empty($history[$key]['module_name']) || empty($row['item_summary'])) {
                unset($history[$key]);
                continue;
            }
            try {
                $seed = BeanFactory::getBean($row['module_name'], $row['item_id'], ['relationships' => false]);
                if ($seed) {
                    $row['data'] = $moduleHandler->mapBeanToArray($row['module_name'], $seed);
                    $recentItems[] = $row;
                }
            } catch(exception $e){

            }
        }
        return $recentItems;
    }

    /**
     * returns the recent items. Accepts as call parameters the module and the limit of records to be retrieved. If no module is sent in the params this is a global request
     */

    public function getRecent(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $getParams = $req->getQueryParams();

        $moduleHandler = new ModuleHandler();

        $tracker = BeanFactory::getBean('Trackers');
        $history = $tracker->get_recently_viewed($current_user->id, $getParams['module'] ? [$getParams['module']] : '', $getParams['limit']);
        $recentItems = [];
        foreach ($history as $key => $row) {
            if (empty($history[$key]['module_name']) || empty($row['item_summary'])) {
                unset($history[$key]);
                continue;
            }

            $seed = BeanFactory::getBean($row['module_name'], $row['item_id']);
            if($seed){
                $row['data'] = $moduleHandler->mapBeanToArray($row['module_name'], $seed);
                $recentItems[] = $row;
            }
        }
        return $res->withJson($recentItems);
    }
}
