/**
 * @module ModuleReports
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'reporter-filter-item-enum',
    templateUrl: '../templates/reporterfilteritemenum.html'
})
export class ReporterFilterItemEnum implements OnInit, OnDestroy {

    @Input() public field: string = '';
    @Input() public isMultiSelect: boolean = false;
    @Input() public wherecondition: any = {};

    public fieldName: string;
    public moduleName: string;

    public enumOptions: any[] = [];
    public _value: any = [];
    public subscription: Subscription = new Subscription();

    constructor(public metadata: metadata, public language: language, public backend: backend) {
        this.subscription = this.language.currentlanguage$.subscribe(() => {
            this.getEnumOptions();
        });
    }

    get isDisabled() {
        return this.enumOptions.length == 0;
    }


    get value() {
        return this._value;
    }

    set value(value) {
        if (this.isMultiSelect) {
            this._value = value;
            value = value.join(',');
        }
        this.wherecondition[this.field] = value;
        this.wherecondition[this.field + 'key'] = this.wherecondition[this.field];
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
        this.initializeValueArray();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public initializeValueArray() {
        const value = this.wherecondition[this.field + 'key'] ? this.wherecondition[this.field + 'key'] : this.wherecondition[this.field];
        this._value = this.isMultiSelect ? (!!value ? value.split(',') : []) : value;
    }

    public getEnumOptions() {
        // if we have module and fieldname we can get the otpions locally .. otherwise we try remote
        if (this.moduleName && this.fieldName) {
            this.enumOptions = this.language.getFieldDisplayOptions(this.moduleName, this.fieldName, true);
        } else {
            this.backend.getRequest('module/KReports/core/enumoptions', {path: this.wherecondition.path}).subscribe(options => {
                if (!options || options.length == 0) return;
                this.enumOptions = options.map(option => ({value: option.value, display: option.text}));
            });
        }
    }

    /**
     * initialize value on changes
     */
    public ngOnChanges() {
        this.initializeValueArray();
    }
}
