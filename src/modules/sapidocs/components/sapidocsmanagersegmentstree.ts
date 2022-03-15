/**
 * @module ModuleSAPIDOCs
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    selector: 'sapidocs-manager-segments-tree',
    templateUrl: '../templates/sapidocsmanagersegmentstree.html'
})
export class SAPIDOCsManagerSegmentsTree {

    constructor(public language: language, public sapIdocsManager: sapIdocsManager) {

    }

    /**
     * @ignore
     *
     * a trackby function for the loop
     *
     * @param index
     * @param item
     */
    public trackByFn(index, item) {
        return item.id;
    }

}

