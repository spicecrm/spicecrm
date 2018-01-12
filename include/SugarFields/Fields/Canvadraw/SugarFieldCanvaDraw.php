<?php

require_once('include/SugarFields/Fields/Base/SugarFieldBase.php');

class SugarFieldCanvaDraw extends SugarFieldBase {

    function getDetailViewSmarty($parentFieldArray, $vardef, $displayParams, $tabindex) {

        $this->setup($parentFieldArray, $vardef, $displayParams, $tabindex);
        return $this->fetch(get_custom_file_if_exists('include/SugarFields/Fields/Canvadraw/DetailView.tpl'));

    }

    function getEditViewSmarty($parentFieldArray, $vardef, $displayParams, $tabindex) {
        //set canva size
        if(empty($displayParams['width'])) {
            $displayParams['width'] = 490;
        }
        if(empty($displayParams['height'])) {
            $displayParams['height'] = 220;
        }

        //set popup window size
        $displayParams['winWidth'] = round($displayParams['width']*1.10, 0);
        $displayParams['winHeight'] = round($displayParams['height']*1.5, 0);

        //set header
        $displayParams['header'] = $GLOBALS['mod_strings'][$vardef['vname']];

        //set popup label
        $displayParams['LBL_OPEN_SIGNATURE_POPUP'] = 'open';
        if(!empty($GLOBALS['app_strings']['LBL_OPEN_SIGNATURE_POPUP']))
            $displayParams['LBL_OPEN_SIGNATURE_POPUP'] = $GLOBALS['app_strings']['LBL_OPEN_SIGNATURE_POPUP'];

        //set path to modal window template
        $displayParams['modalTpl'] = get_custom_file_if_exists("include/SugarFields/Fields/Canvadraw/modal.html");
        $this->setup($parentFieldArray, $vardef, $displayParams, $tabindex);



        return $this->fetch(get_custom_file_if_exists('include/SugarFields/Fields/Canvadraw/EditView.tpl'));
    }












}
