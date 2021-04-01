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
 * @module SystemComponents
 */
import {
    AfterViewInit,
    Component,
    ElementRef, forwardRef,
    Input,
    OnChanges, OnDestroy,
    Renderer2,
} from '@angular/core';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/** @ignore */
declare var _;

/**
 * display a custom select tag with a dropdown of grouped items/items and allow displaying the selected items as pills in the input
 */
@Component({
    selector: 'system-multiple-select',
    templateUrl: './src/systemcomponents/templates/systemmultipleselect.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemMultipleSelect),
            multi: true
        }
    ]
})
export class SystemMultipleSelect implements OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {
    /**
     * if true set the input to disabled
     */
    @Input() private disabled: boolean = false;
    /**
     * if true group values by the syntax "group{separator}item" by default true
     */
    private grouped: boolean = false;

    @Input('grouped') set groupedSetter(val) {
        this.grouped = val !== false;
    }

    /**
     * if true show the values as pills by default true
     */
    private showPills: boolean = true;

    @Input('showPills') set showPillsSetter(val) {
        this.showPills = val !== false;
    }

    /**
     * holds the input list items
     */
    @Input() public listItems: { [key: string]: string } = {};

    /**
     * holds the list height number to apply the related class to the dropdown
     */
    @Input('listHeight')
    set dropdownLengthClassSetter(length: '5' | '7' | '10') {
        this.dropdownLengthClass = !!length ? 'slds-dropdown_length-' + length : 'slds-dropdown_length-7';
    }

    /**
     * holds the group separator to be used when grouped is true
     */
    private groupSeparator: string = '_';
    @Input('groupSeparator') set groupSeparatorSetter(val) {
        this.groupSeparator = !!val ? val : '_';
    }
    /**
     * holds the created array of the list items
     */
    public parsedListItems: Array<{ display: string, value: string, items?: Array<{ display: string, value: string }> }> = [];
    /**
     * holds the input value array
     */
    public valueArray: string[] = [];
    /**
     * if true display the dropdown
     * @private
     */
    private isOpen: boolean = false;
    /**
     * holds a click listener to allow removing it
     * @private
     */
    private clickListener: any;
    /**
     * object to allow check for items selection
     * @private
     */
    private selectedItems: { [key: string]: boolean } = {};
    /**
     * holds the selected items text to display it in the inupt
     * @private
     */
    private selectedCountText: string = '0 Selected Items';
    /**
     * holds the input tag style
     * @private
     */
    private inputTagStyle: { color: string, cursor: string } = {
        color: 'transparent',
        cursor: 'pointer'
    };
    /**
     * holds the dropdown length class
     * @private
     */
    private dropdownLengthClass: string = 'slds-dropdown_length-7';
    /**
     * holds eascape key listener
     * @private
     */
    private escKeyListener: any;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (value: any[]) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private language: language) {
    }

    /**
     * call build option groups
     */
    public ngOnChanges(): void {
        this.buildOptionGroups();
    }

    /**
     * add escape key listener
     */
    public ngAfterViewInit() {
        this.subscribeToESCKeyUp();
    }

    /**
     * register the onChange function by ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * register the onTouched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * set the local valueArray by the ControlValueAccessor on ngModel change
     * @param value
     */
    public writeValue(value: any): void {
        if (value && value.length) {
            this.valueArray = value;
            this.selectedItems = _.object(value.map(val => [val, true]));
        }
        this.setSelectedCountText();
    }

    /**
     * build option groups
     * @private
     */
    private buildOptionGroups(): void {
        this.parsedListItems = [];
        let newListItems;

        if (this.grouped) {
            newListItems = {};
            // define groups
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey) && !optionKey.includes(this.groupSeparator)) {
                    newListItems[optionKey] = {
                        value: optionKey,
                        display: this.listItems[optionKey],
                        items: []
                    };
                }
            }

            // define group items
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey)) {
                    const enumValue = optionKey.split(this.groupSeparator);
                    if (enumValue.length == 2 && newListItems[enumValue[0]]) {
                        newListItems[enumValue[0]].items.push({
                            value: optionKey,
                            display: this.listItems[optionKey]
                        });
                    }
                }
            }
            this.parsedListItems = _.toArray(newListItems);
        } else {
            // define parsedListItems
            newListItems = [];
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey)) {
                    newListItems.push({
                        value: optionKey,
                        display: this.listItems[optionKey]
                    });
                }
            }
            this.parsedListItems = newListItems;
        }
    }

    /**
     * toggle open the dropdown
     * @private
     */
    private onclick(): void {
        this.isOpen = !this.isOpen;
    }

    private subscribeToESCKeyUp() {
        this.escKeyListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
            if (event.key != 'Escape') return;
            this.isOpen = false;
        });
    }

    /**
     * listen to mouse click after mouse leave to handle closing the dropdown
     * @private
     */
    private onMouseLeave(): void {
        if (this.clickListener) this.clickListener();
        if (this.isOpen) {
            this.clickListener = this.renderer
                .listen('document', 'click', (event) => this.handleCloseDropdown(event));
        }
    }

    /**
     * handle closing the dropdown on mouse click out of the container
     * @param event
     */
    public handleCloseDropdown(event: MouseEvent): void {
        const clickIsInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickIsInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    /**
     * toggle add remove item
     * @param itemValue
     * @param listGroupValue
     * @private
     */
    private toggleAddRemoveItem(itemValue: string, listGroupValue?: string): void {
        const itemValueIndex = this.valueArray.indexOf(itemValue);
        let listGroupIndex = this.valueArray.indexOf(listGroupValue);

        if (itemValueIndex > -1) {
            this.valueArray.splice(itemValueIndex, 1);
            this.selectedItems[itemValue] = false;
            if (listGroupValue && !this.groupHasItems(listGroupValue)) {
                listGroupIndex = this.valueArray.indexOf(listGroupValue);
                this.valueArray.splice(listGroupIndex, 1);
                this.selectedItems[listGroupValue] = false;
            }
        } else {
            if (listGroupValue && listGroupIndex == -1) {
                this.valueArray.push(listGroupValue);
                this.selectedItems[listGroupValue] = true;
            }
            this.valueArray.push(itemValue);
            this.selectedItems[itemValue] = true;
        }

        this.setSelectedCountText();
        this.onChange(this.valueArray);
    }

    /**
     * toggle add remove group
     * @param groupValue
     * @private
     */
    private toggleAddRemoveGroup(groupValue?: string): void {
        if (this.groupHasItems(groupValue)) return;

        const groupIndex = this.valueArray.indexOf(groupValue);

        if (groupIndex > -1) {
            this.valueArray.splice(groupIndex, 1);
            this.selectedItems[groupValue] = false;
        } else {
            this.valueArray.push(groupValue);
            this.selectedItems[groupValue] = true;
        }

        this.setSelectedCountText();
        this.onChange(this.valueArray);
    }

    /**
     * check if group has items
     * @param groupValue
     * @private
     */
    private groupHasItems(groupValue) {
        return this.valueArray.some(item => {
            const itemArray = item.split(this.groupSeparator);
            return (itemArray.length == 2 && itemArray[0] == groupValue);
        });
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFn(index, item) {
        return index;
    }

    /**
     * remove item
     * @param index
     * @param value
     * @private
     */
    private removeItem(index: number, value: string) {
        this.valueArray.splice(index, 1);
        this.selectedItems[value] = false;
        if (this.grouped && value.split(this.groupSeparator).length > 1) {
            const itemGroup = value.split(this.groupSeparator)[0];
            if (!this.groupHasItems(itemGroup)) {
                const itemGroupIndex = this.valueArray.indexOf(itemGroup);
                this.valueArray.splice(itemGroupIndex, 1);
                this.selectedItems[itemGroup] = false;
            }
        }
        this.setSelectedCountText();
        this.onChange(this.valueArray);
    }

    /**
     * set selected count text
     * @private
     */
    private setSelectedCountText(): void {
        if (this.grouped) {
            this.selectedCountText = `${this.valueArray.filter(value => value.includes(this.groupSeparator)).length} ${this.language.getLabel('LBL_SELECTED_ITEMS')}`;
        } else {
            this.selectedCountText = `${this.valueArray.length} ${this.language.getLabel('LBL_SELECTED_ITEMS')}`;
        }
    }

    /**
     * remove Escape key listener
     */
    public ngOnDestroy() {
        if (!this.escKeyListener) return;
        this.escKeyListener();
    }
}
