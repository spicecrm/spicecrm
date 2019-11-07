/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-enum',
    templateUrl: './src/modules/reports/templates/reporterfilteritemenum.html'
})
export class ReporterFilterItemEnum implements OnInit {

    @Input() private field: string = '';
    @Input() private wherecondition: any = {};

    private fieldName: string;
    private moduleName: string;

    private enumOptions: any[] = [];

    constructor(private metadata: metadata, private language: language, private backend: backend, private reporterconfig: reporterconfig) {
        this.language.currentlanguage$.subscribe((language) => {
            this.getEnumOptions();
        });
    }

    public ngOnInit() {
        let pathArray = this.wherecondition.path.split('::');

        // get the entries in the path
        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        this.fieldName = fieldArray[1];

        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                this.moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                this.moduleName = field.module;
                break;
        }

        // get the enum options
        this.getEnumOptions();

    }

    private getEnumOptions() {
        // if we have module and fieldname we can get the otpions locally .. otherwise we try remote
        if (this.moduleName && this.fieldName) {
            this.enumOptions = this.language.getFieldDisplayOptions(this.moduleName, this.fieldName, true);
        } else {
            this.backend.getRequest('KReporter/core/enumoptions', {path: this.wherecondition.path}).subscribe(options => {
                this.enumOptions = options;
            });
        }
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