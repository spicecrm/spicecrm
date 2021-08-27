/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';

/**
 * display report record value
 */
@Component({
    selector: 'reporter-field-standard',
    templateUrl: './src/modules/reports/templates/reporterfieldstandard.html',
    changeDetection: ChangeDetectionStrategy.OnPush
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
}
