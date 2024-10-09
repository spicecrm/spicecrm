<?php

namespace SpiceCRM\includes\SpiceBeanGuides;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use stdClass;

class SpiceBeanGuideRestHandler
{
    /**
     * get guides with stages
     * @param $module
     * @return array
     * @throws \Exception
     */
    public function getStageDefs()
    {

        $db = DBManagerFactory::getInstance();

        $fields = "id, name, status_field, systextid, module, is_default";
        $query = $db->query("SELECT $fields, 'custom' as scope FROM spicebeancustomguides UNION SELECT $fields, 'global' as scope FROM spicebeanguides");

        $guides = [];

        while ($guide = $db->fetchByAssoc($query)) {

            $bean = BeanFactory::getBean($guide['module']);

            if (!$bean) continue;

            if (!$guides[$guide['module']]) $guides[$guide['module']] = [];

            $guides[$guide['module']][] = [
                'id' => $guide['id'],
                'name' => $guide['name'],
                'type' => $guide['scope'],
                'is_default' => $guide['is_default'],
                'statusfield' => $guide['status_field'],
                'stages' => $this->getBeanGuideStages($guide, $bean)
            ];
        }

        return $guides;
    }

    /**
     * get bean guide stages
     * @param array $guide
     * @param SpiceBean $bean
     * @return array
     * @throws \Exception
     */
    public function getBeanGuideStages(array $guide, SpiceBean $bean): array
    {
        $db = DBManagerFactory::getInstance();

        $statusField = $guide['status_field'];
        $table = $guide['scope'] == 'global' ? 'spicebeanguidestages' : 'spicebeancustomguidestages';
        $stagesObj = $db->query("SELECT * FROM $table WHERE spicebeanguide_id = '{$guide['id']}' ORDER BY stage_sequence;");

        $stages = [];

        while ($stage = $db->fetchByAssoc($stagesObj)) {

            // set the stage - for multi-stage take the first or the one that is active if it is not the first
            if (!isset($stages[$stage['stage']]) || $stage['stage'] . $stage['secondary_stage'] == $bean->$statusField) {

                $stage['statusfield'] = $statusField;
                $stage['checks'] = $this->getStageChecks($guide['id'], $stage['id'], $bean);
                $stage['texts'] = $this->getStageTexts($stage['id'], $guide['systextid']);

                $stages[] = [
                    'stage' => $stage['stage'],
                    'stagedata' => $stage
                ];
            }
        }

        return $stages;
    }

    /**
     * get stage texts
     * @param string $stageId
     * @param string|null $sysTextId
     * @return array
     * @throws \Exception
     */
    private function getStageTexts(string $stageId, ?string $sysTextId = null): array
    {
        if (empty($sysTextId)) return [];

        $db = DBManagerFactory::getInstance();
        $texts = $db->fetchAll("SELECT text_language, description FROM spicetexts WHERE parent_id = '$stageId' AND parent_type = 'SpiceBeanGuideStages' AND text_id = '$sysTextId'") ?: [];

        $textsByLanguage = [];

        foreach ($texts as $text) {
            $textsByLanguage[$text['text_language']] = $text['description'];
        }

        return $textsByLanguage;
    }

    /**
     * get stage checks 
     * @param string $guidId
     * @param string $stageId
     * @param SpiceBean $bean
     * @return array
     * @throws \Exception
     */
    private function getStageChecks(string $guidId, string $stageId, SpiceBean $bean): array
    {
        global $current_language;

        $db = DBManagerFactory::getInstance();
        $data = [];

        $checks = $db->query("SELECT sc.*, sct.text FROM spicebeanguidestages_checks sc LEFT JOIN spicebeanguidestages_check_texts sct on sc.id = sct.stage_check_id AND sct.language='$current_language' WHERE sc.spicebeanguide_id = '$guidId' AND sc.stage_id = '$stageId' ORDER BY sc.check_sequence");

        while ($check = $db->fetchByAssoc($checks)) {

            $checkResult = null;

            if(!empty($bean->id) && !empty($check['check_method'])){

                # first legacy method
                if (!empty($check['check_include']) && file_exists($check['check_include'])) {
                    require_once($check['check_include']);
                    if(class_exists($check['check_class'])){
                        $checkClass = new $check['check_class']();
                        $checkMethod = $check['check_method'];
                        $checkResult = $checkClass->$checkMethod($bean);
                    }
                } else {
                    $classInstanceAndMethod = SpiceUtils::loadExecutionClassMethod($check['check_method']);
                    $checkResult = $classInstanceAndMethod?->class->{$classInstanceAndMethod->method}($bean);
                }
            }

            $data[] = [
                'checkid' => $check['id'],
                'name' => $check['text'],
                'label' => $check['check_label'],
                'result' => $checkResult
            ];
        }

        return $data;
    }
}
