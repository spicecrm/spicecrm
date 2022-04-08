/**
 * @module ModuleReports
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'reporter-filter-item-parent',
    templateUrl: '../templates/reporterfilteritemparent.html'
})
export class ReporterFilterItemParent implements OnInit, OnDestroy {

    @Input() public field: string = '';
    @Input() public wherecondition: any = {};

    public fieldName: string;
    public moduleName: string;

    public fields: any[] = [];

    public _value: string;

    public subscription: Subscription = new Subscription();

    constructor(public metadata: metadata, public language: language, public backend: backend, public model: model) {
        this.getEnumOptions();
    }

    get isDisabled() {
        return this.fields.length == 0;
    }

    get value() {
        return this._value;
    }

    set value(value) {
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
        this._value = this.wherecondition[this.field + 'key'] ? this.wherecondition[this.field + 'key'] : this.wherecondition[this.field];
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public getEnumOptions() {
        this.fields = [];
        const integrationParams = this.model.getField('integration_params');
        let fields = this.metadata.getModuleFields(integrationParams.kpublishing.subpanelModule);
        for(let field in fields) {
            this.fields.push(field);
        }
        this.fields.sort();
    }
}
