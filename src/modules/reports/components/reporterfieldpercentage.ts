/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with percentage
 */
@Component({
    templateUrl: './src/modules/reports/templates/reporterfieldpercentage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldPercentage implements OnInit {
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
            this.value = this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]), 2, 99) + '%';
        } else {
            this.value = '';
        }
    }
}
