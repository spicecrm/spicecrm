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

@Component({
    selector: "system-input-dashboard",
    templateUrl: "../templates/systeminputdashboard.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDashboard),
            multi: true
        }
    ]
})
export class SystemInputDashboard implements OnDestroy, ControlValueAccessor {


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
    public dashboards = [];
    public dashboard: string = '';
    public currentdashboard: string;
    // for the dropdown
    public clickListener: any;


    constructor(
        public language: language,
        public modal: modal,
        public backend: backend
    ) {
        this.getDashboards();
    }

    public getDashboards() {
        this.backend.getRequest(`configuration/spiceui/core/module/dashboards`).subscribe(dashboards => {
            this.dashboards = dashboards;
            if (!!this.dashboard) {
                this.currentdashboard = this.dashboards.find(d => d.id == this.dashboard).name;
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

    get Dashboards(): any[] {
        let dashboards: any[] = [];
        for (let dashboard of this.dashboards) {
            if (this._searchterm == '' || (this._searchterm != '' && dashboard.name.toLowerCase().indexOf(this._searchterm.toLowerCase()) != -1)) {
                dashboards.push(dashboard);
            }
        }
        return dashboards;
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
        this.dashboard = '';
        this.onChange('');
    }

    public setDashboardSet(dashboard) {
        this.dashboard = dashboard;
        this.currentdashboard = this.dashboards.find(ds => ds.id == this.dashboard).name;
        this._searchterm = '';
        this.onChange(dashboard);
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
        this.dashboard = value;
    }

}
