/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'reporter-field-date',
    templateUrl: './src/modules/reports/templates/reporterfielddatetime.html'
})
export class ReporterFieldDateTime {

    private record: any = {};
    private field: any = {};

    constructor(private userpreferences: userpreferences, private session: session) {

    }

    get fieldvalue() {
        try {
            if (this.record[this.field.fieldid]) {
                let date = new moment.utc(this.record[this.field.fieldid]).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
                if (date.isValid()) {
                    return this.userpreferences.formatDateTime(date);
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
