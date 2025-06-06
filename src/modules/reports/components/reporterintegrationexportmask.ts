/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    templateUrl: '../templates/reporterintegrationexportmask.html',
    standalone: false
})
export class ReporterIntegrationExportMask {
    constructor(public language: language) {
    }
}
