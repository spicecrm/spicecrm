/**
 * @module ObjectFields
 */
import {Component, Input, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

declare var _;

@Component({
    selector: 'field-grouped-enum',
    templateUrl: '../templates/fieldgroupedenum.html'
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
    public localValue: { valueText: string, valueArray: string[], valueDisplay: string, valueGroups: object } = {
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
    public setColumnsClass() {
        const columns = +this.fieldconfig.columns < 13 && +this.fieldconfig.columns > 0 ? this.fieldconfig.columns : '4';
        this.columnsClass = `slds-size--1-of-${columns}`;

    }

    /*
    * rebuild the option groups on language change
    * @return void
    */
    public subscribeToLanguage() {
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
    public setLocalValues(value: string) {

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
    public subscribeToModelChanges() {
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
    public setItemValue(valueArray) {

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
    public setGroupValue(checked: boolean, group: { value: string, display: string, options: any[] }) {

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
    public trackByFn(index, item) {
        return item.value;
    }

    /**
     * build the checkbox groups their options
     * @private
     */
    public buildOptionGroups() {

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
