/*
SpiceUI 2021.01.001

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
    templateUrl: './src/systemcomponents/templates/systemcheckboxgroupcheckbox.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemCheckboxGroupCheckbox implements OnChanges, AfterViewInit {
    public id = _.uniqueId('checkbox-group-checkbox-');  // needed to use inside the template for html ids... without, the click events will get confused...
    @Input() public value: any;
    @Input() public disabled = false;

    constructor(@Host() private systemCheckboxGroup: SystemCheckboxGroup, private cdRef: ChangeDetectorRef) {
        // subscribe to parent value emitter
        this.systemCheckboxGroup.valueEmitter.subscribe(() =>
            this.setCheckedValueFromGroup()
        );
    }

    /**
     * holds the checked boolean
     * @private
     */
    private _checked = false;
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
    private setCheckedValueFromGroup() {
        this._checked = (this.systemCheckboxGroup.value || []).indexOf(this.value) > -1;
        this.cdRef.detectChanges();
    }

    /**
     * set the group value on the parent
     * @private
     */
    private setGroupValue() {
        if (!this.checked && this.systemCheckboxGroup.value.indexOf(this.value) > -1) {
            this.systemCheckboxGroup.value = this.systemCheckboxGroup.value.filter(e => e != this.value);
        } else if (this.checked && this.systemCheckboxGroup.value.indexOf(this.value) == -1) {
            this.systemCheckboxGroup.value = [...this.systemCheckboxGroup.value, this.value];
        }
    }
}
