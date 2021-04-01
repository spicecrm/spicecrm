/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
