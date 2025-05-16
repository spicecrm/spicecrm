/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";

/** @ignore */
declare var moment: any;

/**
 * display formatted report record value with date time
 */
@Component({
    selector: 'reporter-field-date-time-utc',
    templateUrl: '../templates/reporterfielddatetimeutc.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldDateTimeUTC {
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
