<?php

namespace SpiceCRM\includes\SpiceBeanGuides\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceBeanGuidesKanbanMigrationController
{

    public function migrateKanban(Request $req, Response $res, $args): Response {

        $this->moveRelatedCustomEntries();
        $this->generateSpiceTexts();
        $this->updateBeanGuides();

        return $res->withJson(true, 200);
    }
    public function updateBeanGuides()
    {
        $db = DBManagerFactory::getInstance();

        $db->query("update spicebeanguides set name = 'migrated' where name is null or name = ''", true);
        $db->query("update spicebeancustomguides set name = 'migrated' where name is null or name = ''", true);

        $kanbanModules = $db->fetchAll("SELECT DISTINCT module, 'g' scope FROM spicebeanguides WHERE is_default != 1 UNION SELECT DISTINCT module, 'c' scope FROM spicebeancustomguides WHERE is_default != 1");

        foreach ($kanbanModules as $row) {
            $table = $row['scope'] == 'c' ? 'spicebeancustomguides' : 'spicebeanguides';

            $db->query("update $table set is_default = 1 WHERE module = '{$row['module']}' limit 1");
        }
    }

    public function moveRelatedCustomEntries(): void
    {
        $db = DBManagerFactory::getInstance();
        $stageFields = [
            "spicebeanguidestages_checks" => "id, spicebeanguide_id, stage_id, check_sequence, check_include, check_class, check_method, check_label",
            "spicebeanguidestages" => "id, spicebeanguide_id, stage, secondary_stage, stage_sequence, stage_bucket, stage_color, stage_add_data, stage_label, stage_componentset, not_in_kanban, spicebeanguide_status",
        ];

        $tables = [
            "spicebeanguidestages_checks" => "spicebeancustomguidestages_checks",
            "spicebeanguidestages" => "spicebeancustomguidestages"
        ];

        foreach ($tables as $tableGlobal => $tableCustom) {

            $db->query("replace into $tableCustom ($stageFields[$tableGlobal])
                  select $stageFields[$tableGlobal] from $tableGlobal WHERE spicebeanguide_id in 
                  (SELECT id from spicebeancustomguides cg where cg.id = spicebeanguide_id)", true);

            $db->query("delete from $tableGlobal WHERE spicebeanguide_id in (SELECT id from spicebeancustomguides cg where cg.id = spicebeanguide_id)", true);
        }
    }

    public function generateSpiceTexts()
    {
        $db = DBManagerFactory::getInstance();

        # global texts
        $db->query("insert into systextids (id, text_id, name) select uuid(), CONCAT('kanban-', id), 'migrated' from spicebeanguides where systextid is null or systextid = ''", true);

        # custom texts
        $db->query("insert into syscustomtextids (id, text_id, name) select uuid(), CONCAT('kanban-', id), 'migrated' from spicebeancustomguides where systextid is null or systextid = ''", true);

        # global update
        $db->query("update spicebeanguides set systextid = CONCAT('kanban-', id)where systextid is null or systextid = ''", true);

        # custom update
        $db->query("update spicebeancustomguides set systextid = CONCAT('kanban-', id) where systextid is null or systextid = ''", true);

        # spice texts
        $db->query("insert into spicetexts (id, name, description, parent_id, parent_type, text_id, text_language, deleted)
                    select uuid(), txt.stage_name, txt.stage_description, st.id, 'SpiceBeanGuideStages', gu.systextid, txt.`language`, 0 from spicebeanguidestages_texts txt, spicebeanguidestages st, spicebeanguides gu 
                    where txt.stage_id = st.id and st.spicebeanguide_id = gu.id and gu.systextid is not null and (txt.stage_description is not null and txt.stage_description != '') 
                    union select uuid(), txt.stage_name, txt.stage_description, st.id, 'SpiceBeanGuideStages', gu.systextid, txt.`language`, 0 from spicebeanguidestages_texts txt, spicebeancustomguidestages st, spicebeancustomguides gu 
                    where txt.stage_id = st.id and st.spicebeanguide_id = gu.id and gu.systextid is not null and (txt.stage_description is not null and txt.stage_description != '')", true);

    }
}