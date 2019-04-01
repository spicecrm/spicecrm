/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    templateUrl: './src/modules/reports/templates/reporterintegrationexportmask.html'
})
export class ReporterIntegrationExportMask {
    constructor(private language: language) {
    }
}
