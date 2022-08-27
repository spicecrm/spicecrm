<?php
namespace SpiceCRM\includes\SpiceSubscriptions;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;

class SpiceSubscriptionsLoader
{
    /**
     * Returns all the subscriptions for the current user.
     *
     * @return array
     * @throws \Exception
     */
    public function loadSubscriptions(): array {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $moduleHandler = new SpiceBeanHandler();

        $subscriptions = [];

        $sql = "SELECT * FROM spicesubscriptions WHERE user_id='{$currentUser->id}'";
        $query = $db->query($sql);
        while ($row = $db->fetchRow($query)) {
            // check that the bean exists
            $seed = BeanFactory::getBean($row['bean_module'], $row['bean_id'], ['relationships' => false]);

            // in case bean cannot be found remove subscription
            if(!$seed){
                $this->deleteSubscription($row['bean_module'], $row['bean_id']);
                continue;
            }

            // map the bean
            $row['data'] = $moduleHandler->mapBean($seed, false);

            // add to the result
            $subscriptions[$row['bean_id']] = $row;
        }

        return $subscriptions;
    }

    /**
     * Adds a subscription on a given bean for the current user.
     *
     * @param SpiceBean $bean
     * @throws \Exception
     */
    public function addSubscription(SpiceBean $bean): void {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $sql = "INSERT INTO spicesubscriptions (user_id, bean_id, bean_module) VALUES ('{$currentUser->id}', '{$bean->id}', '{$bean->_module}')";
        $db->query($sql, true);
    }

    /**
     * Permanently deletes a subscription on a bean for the current user.
     *
     * @param string $beanId
     * @throws \Exception
     */
    public function deleteSubscription(string $beanModule, string $beanId): void {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $sql = "DELETE FROM spicesubscriptions WHERE user_id='{$currentUser->id}' AND bean_module='{$beanModule}' AND bean_id='{$beanId}'";
        $db->query($sql, true);
    }

    /**
     * Checks if the current user is subscribed to a bean.
     *
     * @param string $beanId
     * @return bool
     * @throws \Exception
     */
    public function hasSubscription(string $beanId): bool {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT COUNT(*) AS cnt FROM spicesubscriptions WHERE user_id!='{$currentUser->id}' AND bean_id='{$beanId}'";
        $query = $db->query($sql, true);
        $cnt = $db->fetchRow($query)['cnt'];

        if ($cnt > 0) {
            return true;
        }

        return false;
    }

    /**
     * Returns all the subscriptions on a bean except for the current user.
     *
     * @param string $beanId
     * @return array
     * @throws \Exception
     */
    public function loadSubscriptionsForBean(string $beanId): array {
        $subscriptions = [];
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT * FROM spicesubscriptions WHERE user_id!='{$currentUser->id}' AND bean_id='{$beanId}'";
        $query = $db->query($sql, true);

        while ($row = $db->fetchRow($query)) {
            $subscriptions[] = $row;
        }

        return $subscriptions;
    }
}