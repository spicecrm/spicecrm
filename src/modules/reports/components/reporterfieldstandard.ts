/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';;

@Component({
    selector: 'reporter-field-standard',
    templateUrl: './src/modules/reports/templates/reporterfieldstandard.html'
})
export class ReporterFieldStandard {

    private record: any = {};
    private field: any = {};

    constructor() {

    }

}