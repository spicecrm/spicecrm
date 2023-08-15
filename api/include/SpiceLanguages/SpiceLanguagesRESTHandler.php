<?php
namespace SpiceCRM\includes\SpiceLanguages;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceLanguagesRESTHandler
{
    private $db;

    function __construct()
    {
        $db = DBManagerFactory::getInstance();
        $this->db = $db;
    }

    /**
     * @throws ForbiddenException
     * @throws \Exception
     */
    public function saveLabels(array $labels)
    {
        $this->checkAdmin();

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

            SystemDeploymentCR::writeDBEntry($table, $label['id'], $data, $data['name']);

            // TRANSLATIONs
            foreach (['global', 'custom'] as $scope) {
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

                        SystemDeploymentCR::writeDBEntry($table, $trans['id'], $data, $data['translation_default']);
                    }
                }
            }
        }
        return true;
    }

    public function deleteLabel($id, $environment = 'global')
    {
        $this->checkAdmin();

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
        $this->checkAdmin();

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

    /**
     * load language labels and translations from spicereference for specified language
     * @param $params
     * @return array
     */
    public function loadSysLanguages($params)
    {
        $loader = new SpiceLanguageLoader();
        $route = "referencelanguage";
        $package = '*';

        //only 1 version makes sense for now.
        if (isset($params['version'])) {
            if (is_array($params['version'])) {
                $version = $params['version'][0];
            } else {
                $version = $params['version'];
            }
        }
        if (empty($version)) $version = "*";

        $languages = $params['languages'];
        $route = implode("/", [$route, $languages, $package, $version]);
        $results = $loader->loadDefaultConf($route, ['route' => $route, 'languages' => $languages, 'package' => $package, 'version' => $version]);
        return $results;
    }

    /**
     * restrict access to admin users
     * @throws ForbiddenException
     */
    public function checkAdmin()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!$current_user->is_admin)
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        # header("Access-Control-Allow-Origin: *");
    }

    public function getUntranslatedLabels($language, $scope)
    {
        $db = DBManagerFactory::getInstance();
        $language = $db->quote($language);
        $untranslatedLabels = [];
        $tableTranslations = $scope == 'global' ? 'syslanguagetranslations' : 'syslanguagecustomtranslations';
        $tableLabels = $scope == 'global' ? 'syslanguagelabels' : 'syslanguagecustomlabels';
        $query = "SELECT sl.id, sl.name FROM $tableLabels sl";
        $query .= " WHERE NOT EXISTS (SELECT id FROM $tableTranslations slt";
        $query .= " WHERE slt.syslanguagelabel_id = sl.id AND slt.syslanguage = '$language') ORDER BY sl.name;";
        $query = $db->query($query);

        while ($row = $this->db->fetchByAssoc($query)) {
            $untranslatedLabels[] = $row;
        }

        return $untranslatedLabels;
    }

    public function transferFromFilesToDB()
    {
        return (new SpiceLanguageFilesToDB())->transferFromFilesToDB();
    }

    /**
     * translates a set of labels using the goolge translate API
     *
     * @param $labels
     * @param $from
     * @param $to
     * @return bool|string
     */
    public function translateLabels($labels, $from = 'en', $to = 'de'){
        $spice_config = SpiceConfig::getInstance()->config;

        // ensure we have a google API key
        if(empty($spice_config['googleapi']['languagekey'])){
            throw new NotFoundException('No Google API Key stored');
        }

        // build the language URL
        $url = "https://translation.googleapis.com/language/translate/v2?key=" . $spice_config['googleapi']['languagekey'];

        // build the body
        $requestBody = json_encode([
            "source" => $from,
            "target" => $to,
            "q" => $labels
        ]);

        // make the request
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
            array(
                'Content-Type:application/json',
                'Content-Length: ' . strlen($requestBody)
            )
        );

        // return the response
        return json_decode(curl_exec($ch));
    }

    /**
     * retrieve label by name
     * @param $labelName string
     */
    public function retrieveLabelDataByName($labelName, $language = null)
    {
        $query = $this->db->query("SELECT syslanguagelabels.*, 'global' scope FROM syslanguagelabels WHERE name = '$labelName'");
        $label = $this->db->fetchByAssoc($query);
        if (!$label) {
            $query = $this->db->query("SELECT syslanguagecustomlabels.*, 'custom' scope FROM syslanguagecustomlabels WHERE name = '$labelName'");
            $label = $this->db->fetchByAssoc($query);
        }
        if (!$label) return 0;

        foreach (['global', 'custom'] as $scope) {
            $label[$scope . '_translations'] = [];
            if ($scope == 'global')
                $table = 'syslanguagetranslations';
            else
                $table = 'syslanguagecustomtranslations';

            $addWhere = '';
            if(!empty($language)){
                $addWhere.= " AND syslanguage='{$language}'";
            }
            $query = "SELECT * FROM $table WHERE syslanguagelabel_id = '{$label['id']}'".$addWhere;
            $result = $this->db->query($query);
            while ($translation = $this->db->fetchByAssoc($result)) {
                $label[$scope . '_translations'][] = $translation;
            }
        }
        return $label;
    }

    /**
     * get the translation of a label for specified language
     * @param $labelName
     * @param $language
     * @return mixed
     */
    public function getTranslationLabelDataByName($labelName, $language){
        $translation = $this->retrieveLabelDataByName($labelName, $language);
        if(!empty($translation['custom_translations'])){
            return $translation['custom_translations'][0]['translation_default'];
        }
        return $translation['global_translations'][0]['translation_default'] ?: $labelName;

    }


    /**
     * get the id of the label by label name
     * consider the scope if passed
     * @param $labelName
     * @param $scope
     * @return mixed|null
     */
    public function getLabelIdByName($labelName, $scope = null){
        // set the ource
        switch($scope) {
            case 'global':
                $from = " syslanguagelabels labels";
                break;
            case 'custom':
                $from = " syslanguagecustomlabels labels";
                break;
            default:
                $from = "(select id, name from syslanguagelabels UNION select id, name from syslanguagecustomlabels) labels";
        }

        // build query
        if($row = $this->db->fetchOne("SELECT id FROM $from WHERE name = '$labelName'")){
            return $row['id'];
        }
        return null;
    }
}
