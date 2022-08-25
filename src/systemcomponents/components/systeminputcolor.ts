/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-color',
    templateUrl: '../templates/systeminputcolor.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputColor),
            multi: true
        }
    ]
})
export class SystemInputColor implements ControlValueAccessor {

    /**
     * color palette for the other calendars
     */
    public colorPalette: any[] = [
        'e3abec', 'c2dbf7', '9fd6ff', '9de7da', '9df0c0', 'fff099', 'fed49a',
        'd073e0', '86baf3', '5ebbff', '44d8be', '3be282', 'ffe654', 'ffb758',
        'bd35bd', '5779c1', '5ebbff', '00aea9', '3cba4c', 'f5bc25', 'f99221',
        '580d8c', '001970', '0a2399', '0b7477', '0b6b50', 'b67e11', 'b85d0d',
    ];

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the value
     */
    public _value: string;

    /**
     * set to true if the address inpout shoudl be strict according to the dropdown values
     */
    public strict: boolean = false;

    /**
     * indicates if the picker is open
     */
    public isOpen: boolean = false;

    /**
     * set to true to set the is_edited attribute omn the field
     */
    @Input() public isedited: boolean = false;

    constructor(public metadata: metadata, public language: language, public configuration: configurationService) {

    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (value != this._value) {
            this._value = value;
            this.onChange(value);
        }
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        this._value = value;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFnIndex(index, item) {
        return index;
    }

    public colorStyle(category){
        return {background: this._value}
    }

    public setColor(color){
        this.value = '#' + color;
        this.isOpen = false;
    }

}
