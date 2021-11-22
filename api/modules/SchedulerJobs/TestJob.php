<?php


namespace SpiceCRM\modules\SchedulerJobs;


class TestJob
{
    function test($params) {
        return ['success' => false, 'message' => 'Oops could not do it'];
    }
    function test2($params) {
        return ['success' => true, 'message' => 'hey I did it 2'];
    }
}