/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with percentage
 */
@Component({
    templateUrl: '../templates/reporterfieldpercentage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldPercentage implements OnInit {
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
            this.value = this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]), 2, 99) + '%';
        } else {
            this.value = '';
        }
    }
}
