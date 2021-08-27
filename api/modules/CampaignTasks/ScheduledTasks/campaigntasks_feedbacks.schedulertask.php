<?php


use SpiceCRM\data\BeanFactory;

$job_strings[] = 'sendCampaignTaskFeedbacks';

function sendCampaignTaskFeedbacks()
{
    $campaignTask = BeanFactory::getBean('CampaignTasks');
    return $campaignTask->genereateServiceFeedbacks();
}

