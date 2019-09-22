/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'reporter-field-date',
    templateUrl: './src/modules/reports/templates/reporterfielddate.html'
})
export class ReporterFieldDate {

    private record: any = {};
    private field: any = {};

    constructor(private userpreferences: userpreferences) {

    }

    get fieldvalue() {
        try {
            if (this.record[this.field.fieldid]) {
                let date = new moment(this.record[this.field.fieldid]);
                if (date.isValid()) {
                    return date.format(this.userpreferences.getDateFormat());
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }
}
