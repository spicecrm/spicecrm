/**
 * @module ModuleScrum
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    selector: 'sapidocs-manager-segments-tree',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentstree.html'
})
export class SAPIDOCsManagerSegmentsTree {

    constructor(private language: language, private sapIdocsManager: sapIdocsManager) {

    }


}

