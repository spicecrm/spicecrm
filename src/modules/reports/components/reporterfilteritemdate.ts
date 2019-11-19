/**
 * @module ModuleReports
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {reporterconfig} from '../services/reporterconfig';

declare var moment: any;

@Component({
    selector: 'reporter-filter-item-date',
    templateUrl: './src/modules/reports/templates/reporterfilteritemdate.html'
})
export class ReporterFilterItemDate implements OnInit {

    @Input() private field: string = '';
    @Input() private wherecondition: any = {};

    private fieldDate: any = new moment();

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

    public ngOnInit(): void {
        this.fieldDate = new moment(this.wherecondition[this.field]);
    }

    get filterValue() {
        return this.fieldDate;
    }

    set filterValue(newDate) {
        this.fieldDate = newDate;
        this.wherecondition[this.field] = newDate.format('YYYY-MM-DD');
    }
}
