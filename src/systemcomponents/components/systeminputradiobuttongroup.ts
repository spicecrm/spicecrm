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

declare var _;

/**
 * radio button group with the Lightning Design
 */
@Component({
    selector: 'system-input-radio-button-group',
    templateUrl: './src/systemcomponents/templates/systeminputradiobuttongroup.html',
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
    @Input() protected inputOptions: InputRadioOptionI[] = [];
    /**
     * the value to be set
     */
    @Input() protected readonly disabled: boolean = false;
    /**
     * the value to be set
     */
    protected groupName: string;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (value: string) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;

    /**
     * set group name for dom
     */
    constructor(private cdRef: ChangeDetectorRef) {
        this.groupName = _.uniqueId('group-name-');
    }

    /**
     * internal value checked
     */
    private _modelValue: string;

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
    private setItemsInitialValues() {

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
    protected trackByFn(index, item) {
        return item.id;
    }
}
