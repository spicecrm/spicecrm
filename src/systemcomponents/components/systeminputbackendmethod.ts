/*
SpiceUI 2018.10.001

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
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";

/**
 * a generic input for a backend method ... input the class with the namespace and the system will check and retrieve the methods for the class
 */
@Component({
    selector: "system-input-backend-method",
    templateUrl: "./src/systemcomponents/templates/systeminputbackendmethod.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputBackendMethod),
            multi: true
        }
    ]
})
export class SystemInputBackendMethod implements ControlValueAccessor {

    /**
     * input to disable the input
     */
    @Input() private disabled = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * holds the concatenated value
     */
    private _value: string;

    /**
     * the current class
     */
    private _class: string = '';

    /**
     * the current method
     */
    private _method: string = '';

    /**
     * wether the class exists or not
     */
    private _classexists: boolean = false;

    /**
     * holds the methods
     */
    private _methods: string[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private backend: backend
    ) {

    }

    /**
     * truigger change detection on blur for the classname
     */
    get modelOptions() {
        return {updateOn: 'blur'};
    }

    /**
     * a getter for the fieset itself
     */
    get classname() {
        return this._class;
    }

    /**
     * a setter for the fieldset - also trigers the onchange
     *
     * @param fieldset the iod of the fieldset
     */
    set classname(classname) {
        this._class = classname;
        if(this.classname != '') {
            this.validateNamespace();
        } else {
            this._method = '';
            this._methods = [];
            this._classexists = false;
        }
        this.joinValue();
    }

    get methodname() {
        return this._method
    }

    set methodname(method) {
        this._method = method;
        this.joinValue();
    }

    /**
     * checks wether the class is valid and if public methods exist
     */
    private validateNamespace() {
        this.backend.getRequest('system/checkclass/' + btoa(this._class)).subscribe(res => {
            this._classexists = res.classexists;
            this._methods = res.methods;
        });
    }

    /**
     * splits the value
     */
    private splitValue() {
        if (this._value) {
            let elements = this._value.split('->');
            this._class = elements[0];
            this._method = elements[1];
            this.validateNamespace();
        }
    }

    private joinValue() {
        if(this._class != '') {
            this._value = this._class + '->' + this._method;
        } else {
            this._value = '';
        }

        this.onChange(this._value);
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
        if(value != this._value) {
            this._value = value;
            this.splitValue();
        }
    }

}
