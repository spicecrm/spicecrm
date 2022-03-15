/**
 * @module SystemComponents
 */
import {
    Component,
    forwardRef,
    Input
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";

/**
 * an input component that renders a dual combo box enabling the user to select a module and a modulefilter
 */
@Component({
    selector: "system-input-module-filter",
    templateUrl: "../templates/systeminputmodulefilter.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputModuleFilter),
            multi: true
        }
    ]
})
export class SystemInputModuleFilter implements ControlValueAccessor {
    @Input() public disabled;

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    public modules: any[] = [];
    public _modulefilters: any[] = [];
    public module: string = "";
    public _modulefilter: string = "";

    constructor(
        public language: language,
        public metadata: metadata
    ) {
        this._modulefilters = this.metadata.getModuleFilters();

        for (let moduleFilter of this._modulefilters) {
            if (!this.modules.find(item => item == moduleFilter.module)) {
                this.modules.push(moduleFilter.module);
            }
        }

        this.modules.sort();
    }

    get modulefilter() {
        return this._modulefilter;
    }

    set modulefilter(modulefilter) {
        this._modulefilter = modulefilter;
        this.onChange(modulefilter);
    }

    get modulefilters() {
        return this._modulefilters.filter(item => item.module == this.module);
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
        this._modulefilter = value;
        if (this._modulefilter) {
            this.module = this.metadata.getModuleFilter(this._modulefilter).module;
        }
    }

}
