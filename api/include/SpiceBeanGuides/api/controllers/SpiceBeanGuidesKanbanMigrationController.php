<?php

namespace SpiceCRM\includes\SpiceBeanGuides\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceBeanGuidesKanbanMigrationController
{
    private array $definitionsArray = [
        [
            'tableName'     => 'sysuicomponentmoduleconf',
            'componentName' => 'SpiceKanban',
        ],
        [
            'tableName'     => 'sysuicustomcomponentmoduleconf',
            'componentName' => 'SpiceKanban',
        ],
        [
            'tableName'     => 'sysuicomponentsetscomponents',
            'componentName' => 'SpicePathWithCoaching',
        ],
        [
            'tableName'     => 'sysuicustomcomponentsetscomponents',
            'componentName' => 'SpicePathWithCoaching',
        ],
    ];

    public function migrateKanban(Request $req, Response $res, $args): Response {
        foreach ($this->definitionsArray as $definition) {
            $itemsForMigration = $this->getMigrationItems($definition);

            if (empty($itemsForMigration)) {
                continue;
            }

            $this->updateDb($itemsForMigration, $definition);
        }

        return $res->withJson(true, 200);
    }

    private function getMigrationItems(array $definition): array {
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT * FROM " . $definition['tableName'] . " WHERE
                    component = '" . $definition['componentName'] . "'
                    AND componentconfig NOT LIKE '%kanban%'";

        $query = $db->query($sql);

        return $db->fetchAll($query);
    }

    private function updateDb(array $itemsForMigration, array $definition): void {
        $db = DBManagerFactory::getInstance();

        foreach ($itemsForMigration as $item) {
            $componentConfig = json_decode($item['componentconfig'], true);
            $componentConfig['kanban'] = "kanban-" . SpiceUtils::createGuid();

            $sql = "UPDATE " . $definition['tableName'] . " SET componentconfig = '" . json_encode($componentConfig) . "'"
                    . " WHERE id = " . $item['id'];
            $db->query($sql);
        }
    }
}