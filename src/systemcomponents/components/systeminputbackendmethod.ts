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
    templateUrl: "../templates/systeminputbackendmethod.html",
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
    @Input() public disabled = false;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * holds the concatenated value
     */
    public _value: string;

    /**
     * the current class
     */
    public _class: string = '';

    /**
     * the current method
     */
    public _method: string = '';

    /**
     * wether the class exists or not
     */
    public _classexists: boolean = false;

    /**
     * holds the methods
     */
    public _methods: string[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public backend: backend
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
    public validateNamespace() {
        this.backend.getRequest('system/checkclass/' + btoa(this._class)).subscribe(res => {
            this._classexists = res.classexists;
            this._methods = res.methods;
        });
    }

    /**
     * splits the value
     */
    public splitValue() {
        if (this._value) {
            let elements = this._value.split('->');
            this._class = elements[0];
            this._method = elements[1];
            this.validateNamespace();
        }
    }

    public joinValue() {
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
