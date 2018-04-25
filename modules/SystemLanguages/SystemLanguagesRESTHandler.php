<?php

class SystemLanguagesRESTHandler
{
    private $db;

    function __construct()
    {
        global $db;
        $this->db = $db;
    }

    public function saveLabels(array $labels)
    {
        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach ($labels as $label) {
            switch ($label['scope']) {
                case 'custom':
                    $table = 'syslanguagecustomlabels';
                    break;
                default:
                case 'global':
                    $table = 'syslanguagelabels';
                    break;
            }
            $data = $label;

            unset($data['scope'], $data['global_translations'], $data['custom_translations']);
            $id = $this->db->upsertQuery($table, ['id' => $label['id']], $data);

            // add to the CR
            if($cr){
                $cr->addDBEntry($table, $label['id'], 'U', $data['name']);
            }

            foreach(['global', 'custom'] as $scope) {
                if ($label[$scope . '_translations']) {
                    foreach ($label[$scope . '_translations'] as $trans) {
                        switch ($scope) {
                            case 'custom':
                                $table = 'syslanguagecustomtranslations';
                                break;
                            default:
                            case 'global':
                                $table = 'syslanguagetranslations';
                                break;
                        }
                        $data = $trans;
                        $this->db->upsertQuery($table, ['id' => $trans['id']], $data);

                        // add to the CR
                        if($cr){
                            $cr->addDBEntry($table, $trans['id'], 'U', $data['translation_default']);
                        }
                    }
                }
            }
        }
        return true;
    }

    public function deleteLabel($id, $environment = 'global')
    {
        switch ($environment) {
            default:
            case 'global':
                $table = 'syslanguagelabels';
                break;
            case 'custom':
                $table = 'syslanguagecustomlabels';
                break;
        }

        $sql = "DELETE FROM $table WHERE id = '$id'";
        $res = $this->db->query($sql);
        if (!$res) {
            throw new Exception($this->db->last_error);
        }

        switch ($environment) {
            default:
            case 'global':
                $table = 'syslanguagetranslations';
                break;
            case 'custom':
                $table = 'syslanguagecustomtranslations';
                break;
        }

        $sql = "DELETE FROM $table WHERE syslanguagelabel_id = '$id'";
        $res = $this->db->query($sql);
        if (!$res) {
            throw new Exception($this->db->last_error);
        }

        return true;
    }

    //url: http://localhost/spicecrm_dev/KREST/syslanguages/labels/search/bla
    public function searchLabels($search_term, $with_translations = true)
    {
        $ret = [];
        $sql = "SELECT lbl.id, lbl.name, 'global' scope 
                FROM syslanguagelabels lbl 
                LEFT JOIN syslanguagetranslations trans ON(lbl.id = trans.syslanguagelabel_id)
                LEFT JOIN syslanguagecustomtranslations ctrans ON(lbl.id = ctrans.syslanguagelabel_id)
                WHERE lbl.name LIKE '%$search_term%' OR 
                  trans.translation_default LIKE '%$search_term%' OR
                  trans.translation_short LIKE '%$search_term%' OR
                  trans.translation_long LIKE '%$search_term%'OR 
                  ctrans.translation_default LIKE '%$search_term%' OR
                  ctrans.translation_short LIKE '%$search_term%' OR
                  ctrans.translation_long LIKE '%$search_term%'
                # GROUP BY  lbl.id, lbl.name, source # needs all selected fields to be compatible with oracle, mssql etc...
                UNION (
                    SELECT lblc.id, lblc.name, 'custom' scope 
                    FROM syslanguagecustomlabels lblc 
                    LEFT JOIN syslanguagecustomtranslations transc ON(lblc.id = transc.syslanguagelabel_id)
                    WHERE lblc.name LIKE '%$search_term%' OR 
                      translation_default LIKE '%$search_term%' OR
                      translation_short LIKE '%$search_term%' OR
                      translation_long LIKE '%$search_term%'
                    # GROUP BY lblc.id, lblc.name, source # needs all selected fields to be compatible with oracle, mssql etc...
                )
                ORDER BY name ASC, scope ASC";
        //var_dump($sql);
        $res = $this->db->query($sql);
        if (!$res)
            throw new Exception($this->db->last_error);

        while ($row = $this->db->fetchByAssoc($res)) {
            if ($with_translations) {
                foreach (['global', 'custom'] as $scope) {
                    $row[$scope . '_translations'] = [];
                    if ($scope == 'global')
                        $table = 'syslanguagetranslations';
                    else
                        $table = 'syslanguagecustomtranslations';

                    $_sql = "SELECT * FROM $table WHERE syslanguagelabel_id = '{$row['id']}'";
                    $_res = $this->db->query($_sql);
                    while ($_row = $this->db->fetchByAssoc($_res)) {
                        $row[$scope . '_translations'][] = $_row;
                    }
                }
            }
            $ret[] = $row;
        }
        return $ret;
    }
}