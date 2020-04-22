/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    selector: 'sapidocs-manager',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanager.html',
    providers: [sapIdocsManager]
})
export class SAPIDOCsManager {

    private segments: any[];
    private segmentrelations: any[];

    constructor(private language: language, private backend: backend, private sapIdocsManager: sapIdocsManager) {

    }

}

