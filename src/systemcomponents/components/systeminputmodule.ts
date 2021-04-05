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
import {AfterViewInit, Component, forwardRef, Input, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";
import {Subscription} from "rxjs";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "system-input-module",
    templateUrl: "./src/systemcomponents/templates/systeminputmodule.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModule),
            multi: true
        }
    ]
})
export class SystemInputModule implements ControlValueAccessor, OnDestroy {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    /**
     * if set to true also the tecnical name will be displayed
     */
    @Input() private displaytechnicalname: boolean = true;

    /**
     * for generic selections show an '*' as option
     */
    @Input() private displayAsterisk: boolean = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    private subscription: Subscription = new Subscription();
    /**
     * holds the companycoded
     */
    private _module: string;

    /**
     * the available companycodes
     */
    private _modules: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private configuration: configurationService
    ) {
        this._modules = this.metadata.getModules();
        this.sortModules();

        // resort in case of Language change
        this.subscription = this.language.currentlanguage$.subscribe((language) => {
            this.sortModules();
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private sortModules() {
        this._modules.sort((a, b) => this.language.getModuleName(a).toLowerCase() > this.language.getModuleName(b).toLowerCase() ? 1 : -1);
    }

    /**
     * a getter for the companycode itself
     */
    get module() {
        return this._module;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param companycode the id of the companycode
     */
    set module(module) {
        this._module = module;
        if (this.onChange) {
            this.onChange(module);
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
        this._module = value;
    }

}
