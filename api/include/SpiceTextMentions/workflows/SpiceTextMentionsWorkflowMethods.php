<?php

namespace SpiceCRM\includes\SpiceTextMentions\workflows;

use SpiceCRM\extensions\modules\WorkflowTasks\WorkflowTask;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceTextMentions\SpiceTextMentions;

class SpiceTextMentionsWorkflowMethods
{
    /**
     * check if the text contains mentions
     * @param string|null $methodParams
     * @param WorkflowTask $task
     * @return bool
     * @throws \Exception
     */
    public function hasMentions(?string $methodParams, WorkflowTask $task): bool
    {
        $params = json_decode($methodParams);

        if (!$params) {
            throw new \Exception('SpiceTextMentionsWorkflowMethods::hasMentions Invalid params');
        }

        return SpiceTextMentions::hasMentions($task->bean->{$params->field});
    }

    /**
     * get the recipients from the mentioned beans in the text field
     * @param string|null $params
     * @param string $parentType
     * @param string $parentId
     * @return array
     * @throws \Exception
     */
    public function getRecipients(?string $params, string $parentType, string $parentId): array
    {
        $params = json_decode($params);

        if (!$params) {
            throw new \Exception('SpiceTextMentionsWorkflowMethods::hasMentions Invalid params');
        }

        $bean = BeanFactory::getBean($parentType, $parentId);

        if (!$bean->{$params->field}) return [];

        $recipients = [];

        $mentions = SpiceTextMentions::extractMentionedBeans($bean->{$params->field});

        foreach ($mentions as $mention) {

            $bean = BeanFactory::getBean($mention->module, $mention->id);

            if (!$bean?->email1) continue;

            $recipients[] = $bean->email1;
        }

        return $recipients;
    }
}