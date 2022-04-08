/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';

/**
 * display report record value
 */
@Component({
    selector: 'reporter-field-standard',
    templateUrl: '../templates/reporterfieldstandard.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldStandard {
    /**
     * the complete record
     */
    public record: any = {};
    /**
     * the field
     */
    public field: any = {};
}
