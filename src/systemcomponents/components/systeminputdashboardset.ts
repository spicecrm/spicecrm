/**
 * @module SystemComponents
 */
import {
    Component,
    forwardRef, Input,
    OnDestroy,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-input-dashboardset",
    templateUrl: "../templates/systeminputdashboardset.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDashboardset),
            multi: true
        }
    ]
})
export class SystemInputDashboardset implements OnDestroy, ControlValueAccessor {


    /**
     * to disable the checkbox
     */
    public _disabled = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public _time: any = {
        display: '',
        moment: null,
        offset: 0,
        valid: true
    };

    public _searchterm: string = '';
    public dashboardSets = [];
    public dashboardset: string = '';
    public currentdashboardset: string;
    // for the dropdown
    public clickListener: any;


    constructor(
        public language: language,
        public modal: modal,
        public backend: backend,
        public metadata: metadata
    ) {
        this.getDashboardSets();
    }


    public getDashboardSets() {
        this.backend.getRequest(`configuration/spiceui/core/module/dashboardsets`).subscribe(dashboardSets => {
            this.dashboardSets = dashboardSets;
            if (!!this.dashboardset) {
                this.currentdashboardset = this.dashboardSets.find(ds => ds.id == this.dashboardset).name;
            }
        });
    }

    get isOpen() {
        return this._searchterm != '';
    }

    get searchterm() {
        return this._searchterm;
    }

    set searchterm(st) {
        this._searchterm = st;

    }

    get dashboardsets(): any[] {
        let dashboardsets: any[] = [];
        for (let dashboardset of this.dashboardSets) {
            if (this._searchterm == '' || (this._searchterm != '' && dashboardset.name.toLowerCase().indexOf(this._searchterm.toLowerCase()) != -1)) {
                dashboardsets.push(dashboardset);
            }
        }
        return dashboardsets;
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public onBlur() {
        this._searchterm = '';
    }

    public clearField() {
        this.dashboardset = '';
        this.onChange('');
    }

    public setDashboardSet(dashboardSet) {
        this.dashboardset = dashboardSet;
        this.currentdashboardset = this.dashboardSets.find(ds => ds.id == this.dashboardset).name;
        this._searchterm = '';
        this.onChange(dashboardSet);
    }


    public trackByFn(index, item) {
        return item.id;
    }

    //
    // public keyup(_e) {
    //     switch (_e.key) {
    //         case 'Enter':
    //             this. = this._searchterm;
    //             this.onChange(this.label);
    //             this._searchterm = '';
    //             break;
    //     }
    // }


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
        this.dashboardset = value;
    }

}
