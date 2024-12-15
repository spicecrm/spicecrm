/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/** @ignore */
declare var moment: any;

/**
 * display formatted report record value with date
 */
@Component({
    selector: 'reporter-field-date',
    templateUrl: '../templates/reporterfielddate.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldDate {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};

    get date(){
        return this.record[this.field.fieldid] ?? undefined
    }
}
