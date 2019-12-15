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
    public groups: any[] = [];
    public options: any[] = [];
    private hasGroupItems = false;
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
        this.subscribeToLanguage();
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

    /*
    * rebuild the option groups on language change
    * @return void
    */
    private subscribeToLanguage() {
        this.languageSubscription = this.language.currentlanguage$.subscribe((newlang) => {
            this.buildOptionGroups();
        });
    }

    /*
    * disable the group value if one of its items is checked
    * @param groupValue
    * @return bool
    */
    private isDisabled(groupValue) {
        let disabled = false;
        this.fieldValueArray.some(item => {
            const splitted = item.split('_');
            return disabled = (splitted.length == 2 && splitted[0] == groupValue);
        });
        return disabled;
    }

    /*
    * set the field value and add the group value of the group item if it is not set
    * @param valueArray
    * @param group
    * @return void
    */
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
        this.viewmodevalue = '';
        this.value = valueArray.map(item => `^${item}^`).join(',');
    }

    /*
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return index;
    }

    /*
    * @param group
    * @return groupValue
    */
    private getGroupValue(group) {
        return this.fieldValueArray[this.fieldValueArray.indexOf(group.value)];
    }

    /*
    * @param checked
    * @param group
    * @return void
    */
    private setGroupValue(checked, group) {
        let newArray = this.fieldValueArray;
        let groupIndex = newArray.indexOf(group.value);
        if (checked) {
            if (groupIndex == -1) newArray.push(group.value);
        } else {
            newArray.splice(groupIndex, 1);
        }
        this.viewmodevalue = '';
        this.value = newArray.map(item => `^${item}^`).join(',');
    }

    /*
    * build the checkbox groups and their items
    * @return void
    */
    private buildOptionGroups() {
        this.hasGroupItems = false;
        this.groups = [];
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
            } else {
                this.hasGroupItems = true;
            }
        }

        // define group options
        for (let optionKey in languageOptions) {
            if (!this.hasGroupItems) {
                this.options.push({
                    value: optionKey,
                    display: languageOptions[optionKey]
                });
            } else {
                let enumValue = optionKey.split('_');
                if (enumValue.length == 2 && newGroups[enumValue[0]]) {
                    newGroups[enumValue[0]].options.push({
                        value: optionKey,
                        display: languageOptions[optionKey]
                    });
                }
            }

        }

        this.groups = _.toArray(newGroups);
    }
}
