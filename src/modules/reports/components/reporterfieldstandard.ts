/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';

@Component({
    selector: 'reporter-field-standard',
    templateUrl: './src/modules/reports/templates/reporterfieldstandard.html'
})
export class ReporterFieldStandard {

    /**
     * the complete record
     */
    private record: any = {};

    /**
     * the field
     */
    private field: any = {};

    constructor() {}
}
