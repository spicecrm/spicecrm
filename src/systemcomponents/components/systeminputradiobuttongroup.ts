/**
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    SimpleChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {InputRadioOptionI} from "../interfaces/systemcomponents.interfaces";

/** @ignore */
declare var _;

/**
 * radio button group with the Lightning Design
 */
@Component({
    selector: 'system-input-radio-button-group',
    templateUrl: '../templates/systeminputradiobuttongroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRadioButtonGroup),
            multi: true
        }
    ]
})
export class SystemInputRadioButtonGroup implements ControlValueAccessor, AfterViewInit {

    /**
     * the value to be set
     */
    @Input() public inputOptions: InputRadioOptionI[] = [];
    /**
     * the value to be set
     */
    @Input() public readonly disabled: boolean = false;
    /**
     * the value to be set
     */
    public groupName: string;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (value: string) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;

    /**
     * set group name for dom
     */
    constructor(public cdRef: ChangeDetectorRef) {
        this.groupName = _.uniqueId('group-name-');
    }

    /**
     * internal value checked
     */
    public _modelValue: string;

    /**
     * @return ng model value
     */
    get modelValue(): string {
        return this._modelValue;
    }

    /**
     * call ControlValueAccessor functions to update and emit changes
     * @param value
     */
    set modelValue(value: string) {
        this.onChange(value);
        this.writeValue(value);
    }

    public ngAfterViewInit(): void {
        this.cdRef.detach();
    }

    /**
     * call set items initial values
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.inputOptions) {
            this.setItemsInitialValues();
        }
        this.cdRef.detectChanges();
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * write value by ControlValueAccessor
     * @param value
     */
    public writeValue(value: string) {
        this._modelValue = value;
        this.cdRef.detectChanges();
    }

    /**
     * set items initial value
     */
    public setItemsInitialValues() {

        this.inputOptions.forEach(inputOption => {

            if (!inputOption.id) {
                inputOption.id = _.uniqueId('input-id-');
            }

            // set title from label if the title is undefined
            if (!!inputOption.label && !inputOption.title) {
                inputOption.title = inputOption.label;
            }
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
        return item.id;
    }
}
