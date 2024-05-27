/**
 * @module ModuleSpicePriceDetermination
 */
import {AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {SpicePriceDeterminationConfiguratorService} from "../services/spicepricedeterminationconfigurator.service";
import {language} from "../../../services/language.service";

/**
 * a generic input that renders a select with the companycodes
 */
@Component({
    selector: "spice-price-determination-configurator-inout-conitiontype",
    templateUrl: "../templates/spicepricedeterminationconfiguratorinputconditiontype.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePriceDeterminationConfiguratorInputConditiontype),
            multi: true
        }
    ]
})
export class SpicePriceDeterminationConfiguratorInputConditiontype implements ControlValueAccessor, OnInit {

    /**
     * input to disable the input
     */
    @Input() public disabled = false;

    public conditionTypes: {id: string, name: string}[] = [];

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * holds the companycoded
     */
    public _conditionType: {id: string, name: string};

    /**
     * holds the companycoded
     */
    public _conditionTyp: {id: string, name: string};

    constructor(
        public cs: SpicePriceDeterminationConfiguratorService,
        public language: language
    ) {

    }

    public ngOnInit() {
        this.conditionTypes = this.cs.conditionTypes.map(ct => {
            return {
                id: ct.id,
                name: this.getConditonTypeName(ct)
            }
        })
    }

    /**
     * a getter for the companycode itself
     */
    get conditionType() {
        return this._conditionType;
    }

    /**
     * a setter for the companycode - also trigers the onchange
     *
     * @param module
     */
    set conditionType(conDitionType: {id: string, name: string}) {
        this._conditionType = conDitionType;
        if (this.onChange) {
            this.onChange(conDitionType?.id);
        }
    }

    public getConditonTypeName(ct){
        return ct.label ? this.language.getLabel(ct.label) : this.language.getLabel(ct.name);
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
        this._conditionType = {id: value, name: value ? this.getConditonTypeName(this.cs.conditionTypes.find(c => c.id == value)) : value};
    }

}
