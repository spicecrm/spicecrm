<?php

namespace SpiceCRM\includes\SpiceUrls;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceUrls
{
    /**
     * get all urls for a bean
     * @param string $beanName
     * @param string $beanId
     * @param bool $json_encode
     * @return array|false|string
     */
    public static function getUrlsForBean(string $beanName, string $beanId, $lastN = 25, bool $json_encode = true)
    {
        $db = DBManagerFactory::getInstance();

        $urls = [];

        $urlResult = $db->limitQuery("SELECT * FROM spiceurls WHERE bean_id='{$beanId}' AND bean_type='{$beanName}' AND deleted = 0 ORDER BY date_entered DESC", 0, $lastN);

        while ($thisUrl = $db->fetchByAssoc($urlResult)) {
            $urls[] = [
                'id' => $thisUrl['id'],
                'user_id' => $thisUrl['user_id'],
                'date' => $thisUrl['date_entered'],
                'description' => nl2br($thisUrl['description']),
                'url' => $thisUrl['url'],
                'url_name' => $thisUrl['url_name'],
                'external_id' => $thisUrl['external_id']
            ];
        }

        if ($json_encode) {
            return json_encode($urls);
        } else {
            return $urls;
        }
    }

    /**
     * Returns a json encoded array with url data for a given url ID.
     *
     * @param $urlId
     * @param bool $json_encode
     * @return false|string
     * @throws NotFoundException|\Exception
     */
    public static function getUrl(string $urlId, bool $json_encode = true)
    {
        $db = DBManagerFactory::getInstance();

        $thisUrl = $db->fetchByAssoc($db->query("SELECT * FROM spiceurls WHERE id = '$urlId'"));

        $url = [
            'id' => $thisUrl['id'],
            'user_id' => $thisUrl['user_id'],
            'user_name' => $thisUrl['user_name'],
            'date' => $thisUrl['date_entered'],
            'description' => nl2br($thisUrl['description']),
            'url' => $thisUrl['url'],
            'url_name' => $thisUrl['url_name'],
            'deleted' => $thisUrl['deleted'],
            'external_id' => $thisUrl['external_id']
        ];

        return $json_encode ? json_encode($url) : $url;
    }

    /**
     * Returns the number of urls linked to a bean.
     *
     * @param string $beanName
     * @param string $beanId
     * @return int
     * @throws Exception|\Exception
     */
    public static function getUrlsCount(string $beanName, string $beanId): int
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT count(id) urlcount FROM spiceurls WHERE bean_id='{$beanId}' AND bean_type='{$beanName}' AND deleted = 0");
        $res = $db->fetchByAssoc($query);

        return (int)$res['urlcount'];
    }

    /**
     * saves a single url in the db
     * @param $urlData
     * @param $seed
     * @return array
     * @throws Exception|\Exception
     */
    public static function saveUrl($urlData, $seed): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $db = DBManagerFactory::getInstance();
        $guid = SpiceUtils::createGuid();

        if ($seed['beanName'] && $seed['beanId']) {
            // add the url
            $db->insertQuery('spiceurls', [
                'id' => $guid,
                'bean_type' => $seed['beanName'],
                'bean_id' => $seed['beanId'],
                'user_id' => $current_user->id,
                'date_entered' => TimeDate::getInstance()->nowDb(),
                'url' => $urlData['data']['url'],
                'url_name' => $urlData['data']['url_name'],
                'description' => $urlData['data']['description'],
                'external_id' => $urlData['data']['external_id']
            ]);
        }

        $urls[] = [
            'id' => $guid,
            'user_id' => $current_user->id,
            'user_name' => $current_user->user_name,
            'url' => $urlData['data']['url'],
            'url_name' => $urlData['data']['url_name'],
            'description' => $urlData['data']['description'],
            'external_id' => $urlData['data']['external_id']
        ];

        return $urls;
    }

    /**
     * Deletes an url
     *
     * @param string $urlId
     * @return bool[]
     * @throws ForbiddenException
     * @throws NotFoundException
     * @throws Exception
     */
    public static function deleteUrl(string $urlId): array
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $urlResult = $db->query("UPDATE spiceurls SET deleted = 1 WHERE id='{$urlId}'" . (!$current_user->is_admin ? " AND user_id='" . $current_user->id . "'" : ""));

        if ($db->getAffectedRowCount($urlResult)) return ['success' => true];

        else {
            $sql = sprintf('SELECT * FROM spiceurls WHERE deleted = 0 AND id = "%s"', $db->quote($urlId));

            $url = $db->fetchOne($sql);
            if ($url === false) {
                throw (new NotFoundException('Url not found.'))->setLookedFor(['id' => $urlId])->setErrorCode('notFound');
            } elseif (($current_user->id !== $url['user_id']) and !$current_user->is_admin) {
                throw (new ForbiddenException('Forbidden to delete the url. Belongs to user with ID ' . $url['user_id'] . '.'))->setErrorCode('noDelete');
            } else {
                throw new Exception('Unknown error deleting the url.');
            }
        }

    }


    /**
     * update url display name, text and category
     * @param string $urlId
     * @param $data
     * @return array
     * @throws \Exception
     */
    public static function updateUrlData(string $urlId, $data): array
    {
        $db = DBManagerFactory::getInstance();

        $description = $db->quote($data['description']);
        $urlName = $db->quote($data['url_name']);

        $res = $db->query("UPDATE spiceurls SET description= '$description', url_name = '$urlName' WHERE id = '$urlId'");
        return ['success' => $res];
    }


}
