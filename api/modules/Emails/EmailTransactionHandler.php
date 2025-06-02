<?php

namespace SpiceCRM\modules\Emails;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSingleton;

class EmailTransactionHandler extends SpiceSingleton
{
    /**
     * flag for transaction
     * @var bool
     */
    public bool $transactionStarted = false;
    /**
     * holds the transaction requests
     * @var array
     */
    public array $plannedEmailIds = [];
    /**
     * start transaction flag
     * @return void
     */
    public function startTransaction(): void
    {
        $this->transactionStarted = true;
    }

    /**
     * commit transaction by sending the http requests
     * @return void
     * @throws \Exception
     */
    public function commitTransaction(): void
    {
        $this->transactionStarted = false;

        foreach ($this->plannedEmailIds as $id) {
            /** @var Email $email */
            $email = BeanFactory::getBean('Emails', $id);
            $email->to_be_sent_now = true;
            $email->save();
        }
    }

    /**
     * push email id to the transaction requests array
     * @param string $id
     * @return void
     */
    public function push(string $id): void
    {
        $this->plannedEmailIds[] = $id;
    }

}