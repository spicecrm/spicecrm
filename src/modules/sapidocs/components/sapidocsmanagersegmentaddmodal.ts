/**
 * @module ModuleScrum
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentaddmodal.html'
})
export class SAPIDOCsManagerSegmentAddModal {

    private self: any;

    constructor(private language: language, private sapIdocsManager: sapIdocsManager) {

    }

    private close(){
        this.self.destroy();
    }

}

