/**
 * @module ModuleSpicePath
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {interval} from "rxjs";
import {take} from "rxjs/operators";

declare var _: any;

/**
 * spins a number up and down and outputs it number formatted
 */
@Component({
    selector: 'system-number-spinner',
    templateUrl: '../templates/systemnumberspinner.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemNumberSpinner implements OnChanges {

    /**
     * the internal held value
     */
    public _value: number = 0;

    /**
     * the number to be displayed
     */
    @Input() public value: any;

    /**
     * the steps this is running by
     */
    @Input() public steps: number = 20;

    /**
     * the animation duration in ms
     */
    @Input() public duration: number = 300;

    constructor(public userpreferences: userpreferences, public cdref: ChangeDetectorRef) {
    }

    /**
     * register on changes to trigger the counter
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        const _increment = (parseFloat(this.value) - this._value) / this.steps;
        interval(this.duration / this.steps).pipe(take(this.steps)).subscribe(cx => {
            // make sure we only increment if we still have a deviating number
            if (this._value != parseFloat(this.value)) {
                this._value += _increment;

                // check if we are close enough then set the value to the same avoiding rounding errors
                if (Math.abs(this._value - parseFloat(this.value)) < 1) {
                    this._value = parseFloat(this.value);
                }

                // trigger change detection
                this.cdref.detectChanges();
            }
        }, error => {
            // in case something happened .. just ensure we set the proper value
            this._value = parseFloat(this.value);
            // trigger change detection
            this.cdref.detectChanges();
        }, () => {
            // in case the subscription completed and we have another value
            this._value = parseFloat(this.value);
            // trigger change detection
            this.cdref.detectChanges();
        });
    }

    /**
     * returns the formatted value
     */
    get displayvalue() {
        return this.userpreferences.formatMoney(this._value, 0);
    }
}
