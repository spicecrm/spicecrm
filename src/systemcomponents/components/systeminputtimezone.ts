/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var moment: any;

/**
 * A generic input component that renders a select field with all the world timezones.
 */
@Component({
    selector: "system-input-timezone",
    templateUrl: "../templates/systeminputtimezone.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputTimezone ),
            multi: true
        }
    ]
})
export class SystemInputTimezone implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;
    @Input() public id = '';

    // for the value accessor
    public propagateChange = (_) => { 1; };
    public propagateTouch = (_) => { 1; };

    /**
     * Holds the timezone
     */
    public _timezone: string;

    /**
     * all the timezones of the world (from moment.js)
     */
    public timezones: any[] = [];

    /**
     * The offsets of the timezones (from moment.js)
     */
    public offsetTimezones: number[] = [];

    constructor() {
        // Get the timezones from moment.js:
        this.timezones = moment.tz.names();
        // Strip strange timezone names:
        this.timezones = this.timezones.filter( ( timezone: string ) => {
            return timezone.match(/^((Africa|America|Antarctica|Arctic|Asia|Atlantic|Australia|Europe|Pacific)\/.+|UTC)$/);
        });
        // Get the timezone offsets:
        this.timezones.forEach( (timezone: string) => this.offsetTimezones.push( moment.tz( timezone ).format('Z') ) );
    }

    /**
     * a getter for the timezone itself
     */
    get timezone(): string {
        return this._timezone;
    }

    /**
     * a setter for the timezone - also triggers the propagateChange
     *
     * @param companycode the timezone
     */
    set timezone( value: string ) {
        this._timezone = value;
        this.propagateChange( value );
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange( fn: any ): void {
        this.propagateChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched( fn: any ): void {
        this.propagateTouch = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue( value: string ): void {
        this._timezone = value;
    }

}
