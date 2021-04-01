<?php

use SpiceCRM\includes\Evalanche\Evalanche;

class EvalancheHooks
{
    public function handlerHooks(&$bean, $event, $arguments)
    {
        switch ($event) {
            case 'after_save':
                if ($bean->gdpr_marketing_agreement != 'g') {
                    $evalanche = new Evalanche();
                    $evalanche->deleteFromEvalanche($bean->id, $bean->module_name);
                } else {
                    $evalanche = new Evalanche();
                    $evalanche->createProfileFromBean($bean->id, $bean->module_name);
                }
                break;
            case 'before_delete':
                $evalanche = new Evalanche();
                $evalanche->deleteFromEvalanche($bean->id, $bean->module_name);
                break;
        }

    }

}
