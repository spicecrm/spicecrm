/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";

@Component({
    selector: 'sapidocs-monitor',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmonitor.html'
})
export class SAPIDOCsMonitor {

    constructor(private language: language) {
    }

}

