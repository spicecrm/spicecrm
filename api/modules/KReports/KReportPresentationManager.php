<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

class KReportPresentationManager {

    // centrally keep the pluginmanager
    var $pluginManager;

    public function __construct() {

        $this->pluginManager = new KReportPluginManager();
    }
    
    // function to get the Plugin Object
    public function getPresentationPlugin($thisReport){
       $listOptions = json_decode(html_entity_decode($thisReport->presentation_params), true);
        if(!empty($listOptions['plugin']))
            $pluginObject = $this->pluginManager->getPresentationObject($listOptions['plugin']);
        else
            $pluginObject = $this->pluginManager->getPresentationObject($thisReport->listtype);
        return $pluginObject;
    }
    
    public function renderPresentation($thisReport) {
        $listOptions = json_decode(html_entity_decode($thisReport->presentation_params), true);
        if(!empty($listOptions['plugin']))
            $pluginObject = $this->pluginManager->getPresentationObject($listOptions['plugin']);
        else
            $pluginObject = $this->pluginManager->getPresentationObject($thisReport->listtype);
        return $pluginObject->display($thisReport);
    }
    
    public function getPresentationExport($thisReport, $dynamicols, $renderFields = true, $parentbean = null, $pluginName = null){
        $listOptions = json_decode(html_entity_decode($thisReport->presentation_params), true);
        if(!empty($listOptions['plugin']))
            $pluginObject = $this->pluginManager->getPresentationObject($listOptions['plugin']);
        else
            $pluginObject = $this->pluginManager->getPresentationObject($thisReport->listtype);
        return $pluginObject->getExportData($thisReport, $dynamicols, $renderFields, $parentbean, $pluginName);
    }
    
    public function getPresentationMetadata($thisReport) {
        $listOptions = json_decode(html_entity_decode($thisReport->presentation_params), true);
        if(!empty($listOptions['plugin']))
            $pluginObject = $this->pluginManager->getPresentationObject($listOptions['plugin']);
        else
            $pluginObject = $this->pluginManager->getPresentationObject($thisReport->listtype);
        return $pluginObject->getPresentationMetaData($thisReport);
    }
}
