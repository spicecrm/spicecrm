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
    templateUrl: '../templates/systemmultipleselect.html',
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
    @Input() public disabled: boolean = false;
    /**
     * if true group values by the syntax "group{separator}item" by default true
     */
    public grouped: boolean = false;

    @Input('grouped') set groupedSetter(val) {
        this.grouped = val !== false;
    }

    /**
     * if true show the values as pills by default true
     */
    public showPills: boolean = true;

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
    public groupSeparator: string = '_';
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
    public isOpen: boolean = false;
    /**
     * holds a click listener to allow removing it
     * @private
     */
    public clickListener: any;
    /**
     * object to allow check for items selection
     * @private
     */
    public selectedItems: { [key: string]: boolean } = {};
    /**
     * holds the selected items text to display it in the inupt
     * @private
     */
    public selectedCountText: string = '0 Selected Items';
    /**
     * holds the input tag style
     * @private
     */
    public inputTagStyle: { color: string, cursor: string } = {
        color: 'transparent',
        cursor: 'pointer'
    };
    /**
     * holds the dropdown length class
     * @private
     */
    public dropdownLengthClass: string = 'slds-dropdown_length-7';
    /**
     * holds eascape key listener
     * @private
     */
    public escKeyListener: any;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (value: any[]) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;

    constructor(public elementRef: ElementRef,
                public renderer: Renderer2,
                public language: language) {
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
    public buildOptionGroups(): void {
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
    public onclick(): void {
        this.isOpen = !this.isOpen;
    }

    public subscribeToESCKeyUp() {
        this.escKeyListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
            if (event.key != 'Escape') return;
            this.isOpen = false;
        });
    }

    /**
     * listen to mouse click after mouse leave to handle closing the dropdown
     * @private
     */
    public onMouseLeave(): void {
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
    public toggleAddRemoveItem(itemValue: string, listGroupValue?: string): void {
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
    public toggleAddRemoveGroup(groupValue?: string): void {
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
    public groupHasItems(groupValue) {
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
    public trackByFn(index, item) {
        return index;
    }

    /**
     * remove item
     * @param index
     * @param value
     * @private
     */
    public removeItem(index: number, value: string) {
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
    public setSelectedCountText(): void {
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
