<?php

namespace SpiceCRM\modules\JourFixes\api\controllers;

use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;

class JourFixeController
{

    public function getNextOccurrence($req, $res, $args)
    {
        $id = $args['id'];

        // load parent bean
        $bean = BeanFactory::getBean('JourFixes', $id);
        if (!$bean) {
            throw new NotFoundException('Bean not found');
        }

        // get recurrence definition
        $repeat = $bean->recurrence;
        $startTime = date('H:i:s', strtotime($bean->time_start));
        $endTime = date('H:i:s', strtotime($bean->time_end));

        // find latest occurrence
        $lastOccurrenceDate = $this->getLastOccurrenceDate($id);

        // if none exists → use date_start as base
        $baseDate = $lastOccurrenceDate ?: date('Y-m-d', strtotime($bean->time_start));

        // calculate next occurrence
        $nextDate = $this->calculateNextDate($repeat, $baseDate);

        // return for modal prefill
        return $res->withJson([
            "date_start" => $nextDate . ' ' . $startTime,
            "date_end"   => $nextDate . ' ' . $endTime,
        ]);
    }

    private function getLastOccurrenceDate($jourfixeId)
    {
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT date_start FROM jourfixeoccurrences WHERE jourfixe_id = '{$jourfixeId}' AND deleted = 0 ORDER BY date_start DESC";

        $row = $db->fetchOne($sql);

        return $row['date_start'] ?? null;
    }

    private function calculateNextDate($repeat, $baseDate)
    {
        $d = new \DateTime($baseDate);

        switch ($repeat) {
            case 'Daily':
                $d->modify('+1 day');
                break;

            case 'Weekly':
                $d->modify('+1 week');
                break;

            case 'Monthly':
                $d->modify('+1 month');
                break;

            case 'Yearly':
                $d->modify('+1 year');
                break;

            default:
                $d->modify('+1 day');
                break;
        }

        return $d->format('Y-m-d');
    }
}