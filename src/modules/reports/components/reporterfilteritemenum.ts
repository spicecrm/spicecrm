import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-enum',
    templateUrl: './src/modules/reports/templates/reporterfilteritemenum.html'
})
export class ReporterFilterItemEnum implements OnInit {

    @Input() field: string = '';
    @Input() wherecondition: any = {};

    enumOptions: Array<any> = [];

    constructor(private language: language, private backend: backend, private reporterconfig: reporterconfig) {

    }

    ngOnInit() {
        this.backend.getRequest('KReporter/core/enumoptions', {path: this.wherecondition.path}).subscribe(options => {
            this.enumOptions = options;
        })
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