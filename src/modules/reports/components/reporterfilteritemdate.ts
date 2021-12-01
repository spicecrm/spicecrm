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
    templateUrl: '../templates/reporterfilteritemdate.html'
})
export class ReporterFilterItemDate implements OnInit {

    @Input() public field: string = '';
    @Input() public wherecondition: any = {};

    public fieldDate: any = new moment();

    constructor(public language: language, public model: model, public reporterconfig: reporterconfig) {

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
