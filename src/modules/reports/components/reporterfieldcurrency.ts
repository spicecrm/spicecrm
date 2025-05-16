/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * display formatted report record value with currency
 */
@Component({
    selector: 'reporter-field-currency',
    templateUrl: '../templates/reporterfieldcurrency.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldCurrency {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};

    constructor(public currency: currency, public userpreferences: userpreferences) {

    }

    get currencyID(){
        if (!this.record[this.field.fieldid]) return;
        return this.record[this.field.fieldid + '_curid'] ?? '-99';
    }
    get recordField(){
        return this.record[this.field.fieldid];
    }
}
