/**
 * @module SystemComponents
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * @ignore
 */
declare var _;

/**
 * renders a checbox group
 */
@Component({
    selector: 'system-checkbox-group',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckboxGroup),
            multi: true
        }
    ]
})
export class SystemCheckboxGroup implements ControlValueAccessor, AfterViewInit {
    /**
     * emit value to children to set checked value
     */
    public valueEmitter = new EventEmitter<void>();
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (value: string[]) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;

    constructor(public cdRef: ChangeDetectorRef) {
    }

    public _value: string[] = [];

    /**
     * @return ng model value
     */
    get value(): string[] {
        return this._value;
    }

    /**
     * call ControlValueAccessor functions to update and emit changes
     * @param value
     */
    set value(value: string[]) {
        this.onChange(value);
        this.writeValue(value);
    }

    /**
     * write local value by ControlValueAccessor
     * @param value
     */
    public writeValue(value: string[]): void {
        if(value && !_.isEqual(value, this._value)) {
            this._value = _.clone(value);
            this.cdRef.detectChanges();
            this.valueEmitter.emit();
        }
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = (val) => fn(val);
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * detach the change detection from the view
     */
    public ngAfterViewInit() {
        this.cdRef.detach();
    }

    /**
     * re attach the component to the change detection
     */
    public ngOnDestroy() {
        this.cdRef.reattach();
    }
}
