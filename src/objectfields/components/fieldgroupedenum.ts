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
import {Component, Input, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

declare var _;

@Component({
    selector: 'field-grouped-enum',
    templateUrl: './src/objectfields/templates/fieldgroupedenum.html'
})
export class fieldGroupedEnum extends fieldGeneric implements OnInit {
    /**
     * holds the groups objects
     */
    public groups: Array<{ value: string, display: string, options: any[] }> = [];

    /**
     * the fieldconfig .. typically passed in from the fieldset
     */
    @Input() public fieldconfig: { groupSeparator?: string, columns?: string, displayCheckboxes?: boolean } = {};

    /**
     * holds the local value array
     * @private
     */
    private localValue: { valueText: string, valueArray: string[], valueDisplay: string, valueGroups: object } = {
        valueText: '',
        valueArray: [],
        valueDisplay: '',
        valueGroups: {}
    };
    /**
     * holds the columns class
     */
    public columnsClass: string = 'slds-size--1-of-4';

    /**
     * call to build the option groups and set the local values
     */
    public ngOnInit() {
        this.setColumnsClass();
        this.buildOptionGroups();
        this.setLocalValues(this.value);
        this.subscribeToLanguage();
        this.subscribeToModelChanges();
    }

    /**
     * set the columns class
     * @private
     */
    private setColumnsClass() {
        const columns = +this.fieldconfig.columns < 13 && +this.fieldconfig.columns > 0 ? this.fieldconfig.columns : '4';
        this.columnsClass = `slds-size--1-of-${columns}`;

    }

    /*
    * rebuild the option groups on language change
    * @return void
    */
    private subscribeToLanguage() {
        this.subscriptions.add(
            this.language.currentlanguage$.subscribe(() =>
                this.buildOptionGroups()
            )
        );
    }

    /**
     * set the local values
     * @private
     */
    private setLocalValues(value: string) {

        if (!value) {
            return this.localValue = {valueText: '', valueArray: [], valueDisplay: '', valueGroups: {}};
        }

        const languageOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        const valueArray = value.replace(/\^/g, '').split(',').map(v => v.trim());

        this.localValue = {
            valueText: value,
            valueArray: valueArray,
            valueDisplay: valueArray.map(v => languageOptions[v]).join(', '),
            valueGroups: {}
        };

        const separator = this.fieldconfig.groupSeparator ?? '_';

        this.localValue.valueArray.forEach(v => {
            this.localValue.valueGroups[v] = !v.includes(separator);
        });
    }

    /**
     * subscribe to model changes
     * @private
     */
    private subscribeToModelChanges() {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                if (this.localValue.valueText === data[this.fieldname]) return;
                this.setLocalValues(data[this.fieldname]);
            })
        );
    }

    /**
     * set the group item value locally and update the model value
     * @param valueArray
     * @private
     */
    private setItemValue(valueArray) {

        const value = valueArray.map(item => `^${item}^`).join(',');
        this.setLocalValues(value);
        this.value = value;
    }

    /**
     * set the group value locally and update the model value
     * @param checked
     * @param group
     * @private
     */
    private setGroupValue(checked: boolean, group: { value: string, display: string, options: any[] }) {

        let value = this.value;

        if (!checked) {

            value = this.localValue.valueArray
                .filter(v => v !== group.value)
                .map(item => `^${item}^`).join(',');

        } else if (checked && this.localValue.valueArray.indexOf(group.value) == -1) {

            value = `${this.localValue.valueText},^${group.value}^`;
        }
        this.setLocalValues(value);
        this.value = value;
    }

    /*
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.value;
    }

    /**
     * build the checkbox groups their options
     * @private
     */
    private buildOptionGroups() {

        this.groups = [];

        const languageOptions: Array<{ value: string, display: string }> = this.language.getFieldDisplayOptions(this.model.module, this.fieldname, true);
        const separator = this.fieldconfig.groupSeparator ?? '_';

        const allOptions = languageOptions.filter(o => o.value.includes(separator));

        this.groups = languageOptions.filter(o => !o.value.includes(separator))
            .map(obj => ({
                ...obj,
                options: allOptions.filter(o => o.value.startsWith(obj.value))
            }));
    }
}
