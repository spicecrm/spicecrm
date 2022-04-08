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
export class ReporterFieldDate implements OnInit {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};
    /**
     * display value
     */
    public value: string = '';

    constructor(public userpreferences: userpreferences) {

    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setFormattedFieldValue();
    }

    /**
     * set formatted field value
     */
    public setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            let date = new moment.utc(this.record[this.field.fieldid]);
            if (date.isValid()) {
                this.value = date.format(this.userpreferences.getDateFormat());
            }
        }
    }
}
