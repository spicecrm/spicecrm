/**
 * @module SystemComponents
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SystemCheckboxGroup} from "./systemcheckboxgroup";

/** @ignore */
declare var _;

/**
 * a checkbox group component, compatible with ngModel!
 * each system-checkbox-group-checkbox component clicked will add or reomove its value to the array.
 * created by: sebastian franz at 2018-08-17
 * inspired by: https://medium.com/@mihalcan/angular-multiple-check-boxes-45ad2119e115
 */
@Component({
    selector: 'system-checkbox-group-checkbox',
    templateUrl: '../templates/systemcheckboxgroupcheckbox.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemCheckboxGroupCheckbox implements OnChanges, AfterViewInit {
    public id = _.uniqueId('checkbox-group-checkbox-');  // needed to use inside the template for html ids... without, the click events will get confused...
    @Input() public value: any;
    @Input() public disabled = false;

    constructor(@Host() public systemCheckboxGroup: SystemCheckboxGroup, public cdRef: ChangeDetectorRef) {
        // subscribe to parent value emitter
        this.systemCheckboxGroup.valueEmitter.subscribe(() =>
            this.setCheckedValueFromGroup()
        );
    }

    /**
     * holds the checked boolean
     * @private
     */
    public _checked = false;
    /**
     * @return checkbox checked value
     */
    get checked(): boolean {
        return this._checked;
    }

    /**
     * set the checked value
     * @param val
     */
    set checked(val: boolean) {
        this._checked = val;
        this.setGroupValue();
    }

    /**
     * detach the component from change detection
     */
    public ngAfterViewInit() {
        this.cdRef.detectChanges();
        this.cdRef.detach();
    }

    /**
     * set the checked value from group
     */
    public ngOnChanges(changes: SimpleChanges) {
        this.setCheckedValueFromGroup();
    }

    /**
     * unsubscribe from parent subscription and re attach to the change detection
     */
    public ngOnDestroy() {
        this.cdRef.reattach();
        this.systemCheckboxGroup.valueEmitter.unsubscribe();
    }

    /**
     * set checked value from parent group value
     * @private
     */
    public setCheckedValueFromGroup() {
        this._checked = (this.systemCheckboxGroup.value || []).indexOf(this.value) > -1;
        this.cdRef.detectChanges();
    }

    /**
     * set the group value on the parent
     * @private
     */
    public setGroupValue() {
        if (!this.checked && this.systemCheckboxGroup.value.indexOf(this.value) > -1) {
            this.systemCheckboxGroup.value = this.systemCheckboxGroup.value.filter(e => e != this.value);
        } else if (this.checked && this.systemCheckboxGroup.value.indexOf(this.value) == -1) {
            this.systemCheckboxGroup.value = [...this.systemCheckboxGroup.value, this.value];
        }
    }
}
