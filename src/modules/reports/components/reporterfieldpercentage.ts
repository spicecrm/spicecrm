/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    templateUrl: './src/modules/reports/templates/reporterfieldpercentage.html'
})
export class ReporterFieldPercentage {

    private record: any = {};
    private field: any = {};

    constructor(private currency: currency, private userpreferences: userpreferences) {

    }


    private getValue() {
        if (this.record[this.field.fieldid]) {
            return this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]), 2, 99) + '%';
        } else {
            return '';
        }
    }

}