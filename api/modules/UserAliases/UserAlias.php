<?php

namespace SpiceCRM\modules\UserAliases;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\modules\Users\User;

class UserAlias extends SpiceBean
{
    /** @var string|null options: Active, Inactive */
    public ?string $status = null;

    /**
     * save the alias
     * @param $check_notify
     * @param $fts_index_bean
     * @return int|string
     * @throws Exception
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if (!AuthenticationController::getInstance()->isAdmin()) {
            throw new Exception("Admin access only");
        }

        if ($this->isNew() && BeanFactory::newBean('Users')->findByUserName($this->alias_name)) {
            throw new Exception("Alias already exists in users");
        }

        if ($this->isNew() && BeanFactory::newBean('UserAliases')->retrieve_by_string_fields(['alias_name' => $this->alias_name])) {
            throw new Exception("Alias already exists");
        }

        return parent::save($check_notify, $fts_index_bean);
    }

    /**
     * check if is admin before delete
     * @param $id
     * @return void
     * @throws Exception
     */
    public function mark_deleted($id)
    {
        if (!AuthenticationController::getInstance()->isAdmin()) {
            throw new Exception("Admin access only");
        }

        parent::mark_deleted($id);
    }

    /**
     * find user by alias
     * @param string $aliasName
     * @return object|null
     */
    public static function findUser(string $aliasName): ?User
    {
        static $alias = null;

        if (!$alias) {
            $alias = BeanFactory::newBean('UserAliases')->retrieve_by_string_fields(['alias_name' => $aliasName, 'status' => 'Active']);
        }
        return !$alias ? null : BeanFactory::getBean('Users', $alias->user_id);
    }
}