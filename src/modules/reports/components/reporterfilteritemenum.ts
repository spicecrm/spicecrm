/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-enum',
    templateUrl: './src/modules/reports/templates/reporterfilteritemenum.html'
})
export class ReporterFilterItemEnum implements OnInit {

    @Input() private field: string = '';
    @Input() private wherecondition: any = {};

    private enumOptions: any[] = [];

    constructor(private language: language, private backend: backend, private reporterconfig: reporterconfig) {

    }

    public ngOnInit() {
        this.backend.getRequest('KReporter/core/enumoptions', {path: this.wherecondition.path}).subscribe(options => {
            this.enumOptions = options;
        });
    }

    get isDisabled() {
        return this.enumOptions.length == 0;
    }

    get isMultiselect() {
        let isMulti = false;
        switch (this.wherecondition.operator) {
            case 'oneof':
            case 'oneofnot':
            case 'oneofnotornull':
                isMulti = true;
                break;
        }
        return isMulti;
    }

    get value() {
        return this.wherecondition[this.field + 'key'] ? this.wherecondition[this.field + 'key'] : this.wherecondition[this.field];
    }

    set value(value) {
        this.wherecondition[this.field + 'key'] = value;
        this.wherecondition[this.field] = value;
    }
}