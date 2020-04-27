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
    templateUrl: './src/modules/reports/templates/reporterfielddate.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldDate implements OnInit {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: string = '';

    constructor(private userpreferences: userpreferences) {

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
    private setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            let date = new moment.utc(this.record[this.field.fieldid]);
            if (date.isValid()) {
                this.value = date.format(this.userpreferences.getDateFormat());
            }
        }
    }
}
