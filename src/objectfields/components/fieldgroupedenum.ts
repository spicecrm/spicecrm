/**
 * @module ObjectFields
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";

declare var _;

@Component({
    selector: 'field-grouped-enum',
    templateUrl: './src/objectfields/templates/fieldgroupedenum.html'
})
export class fieldGroupedEnum extends fieldGeneric implements OnInit, OnDestroy {
    private valuearray: any[] = [];
    private groups: any = {};
    private viewmodevalue: string = '';
    private languageSubscription: Subscription = new Subscription();

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
        this.languageSubscription = this.language.currentlanguage$.subscribe((newlang) => {
            this.buildOptionGroups();
        });
    }

    public ngOnInit() {
        this.buildOptionGroups();
    }

    public ngOnDestroy() {
        this.languageSubscription.unsubscribe();
    }

    get checkboxClass() {
        let ofColumns = this.fieldconfig.columns ? parseInt(this.fieldconfig.columns, 10) : 4;
        return 'slds-size--1-of-' + ofColumns;
    }

    get displayCheckboxes() {
        return !!this.fieldconfig.displaycheckboxes;
    }

    get viewModeValue() {
        if (this.viewmodevalue.length == 0 && this.value) {
            let languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
            this.viewmodevalue = this.fieldValueArray.map(item => languageOptions[item]).join(', ');
        }
        return this.viewmodevalue;
    }

    get fieldValueArray() {
        if (this.valuearray.length == 0 && this.value) {
            return this.valuearray = this.value.replace(/\^/g, '').split(',');
        }
        return this.valuearray;
    }

    private isDisabled(groupValue) {
        let disabled = false;
        this.fieldValueArray.some(item => {
            const splitted = item.split('_');
            return disabled = (splitted.length == 2 && splitted[0] == groupValue);
        });
        return disabled;
    }

    private setFieldValue(valueArray, group) {
        let groupNotExist = this.fieldValueArray.indexOf(group.value) == -1;
        let groupHasItems = valueArray.some(item => {
            const splitted = item.split('_');
            return (splitted.length == 2 && splitted[0] == group.value);
        });
        if (groupNotExist) {
            this.setGroupValue(true, group);
        }
        if (!groupHasItems) {
            this.setGroupValue(false, group);
        }
        this.value = valueArray.map(item => `^${item}^`).join(',');
    }

    private trackByFn(index, item) {
        return index;
    }

    private getGroupValue(group) {
        return this.fieldValueArray[this.fieldValueArray.indexOf(group.value)];
    }

    private setGroupValue(checked, group) {
        let newArray = this.fieldValueArray;
        let groupIndex = newArray.indexOf(group.value);
        if (checked) {
            if (groupIndex == -1) newArray.push(group.value);
        } else {
            newArray.splice(groupIndex, 1);
        }
        this.value = newArray.map(item => `^${item}^`).join(',');
    }

    private buildOptionGroups() {
        this.groups = {};
        let newGroups = {};
        let languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);

        // define groups
        for (let optionKey in languageOptions) {
            if (!optionKey.includes('_')) {
                newGroups[optionKey] = {
                    value: optionKey,
                    display: languageOptions[optionKey],
                    disabled: false,
                    options: []
                };
            }
        }

        // define group options
        for (let optionKey in languageOptions) {
            let enumValue = optionKey.split('_');
            if (enumValue.length == 2 && newGroups[enumValue[0]]) {
                newGroups[enumValue[0]].options.push({
                    value: optionKey,
                    display: languageOptions[optionKey]
                });
            }
        }

        this.groups = _.toArray(newGroups);
    }
}
