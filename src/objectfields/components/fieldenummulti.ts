/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-enummulti',
    templateUrl: '../templates/fieldenummulti.html'
})
export class fieldEnumMulti extends fieldGeneric implements OnInit {
    public options: any[] = [];
    public selectedValues: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2
    ) {
        super(model, view, language, metadata, router);
    }

    public showSelect: boolean = false;
    clickListener: any;

    public ngOnInit() {
        this.model.data$.subscribe(
            res => {
                this.buildOptions()
            }
        );
    }


    public getValue(): string {
        let retarray: any[] = [];
        for(let selval of this.selectedValues){
            retarray.push(this.options[selval]);
        }
        return retarray.join(', ');
    }

    public getValues(){
        let retArray = [];

        let values = this.getValueArray();

        for(let optionVal in this.options) {
            let sel = false;
            for(let selval of this.selectedValues) {

                if(optionVal == selval){
                    sel = true;
                }
            }
            retArray.push({
                id: this.model.generateGuid(),
                value: optionVal,
                display: this.options[optionVal],
                selected: sel
            });
        }
        return retArray;
    }

    public getValueArray(): any[] {
        try {
            return this.model.getField(this.fieldname).substring(1, this.model.getField(this.fieldname).length - 1).split('^,^');
        } catch (e) {
            return [];
        }
    }

    public buildOptions() {
        // reset the options
        this.options = [];
        this.selectedValues = this.getValueArray();
        this.options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
    }


    clickedItem(val, event){
        event.stopPropagation();

        if(this.selectedValues[0] == ""){
            this.selectedValues = []; // best solution for now
        }

        var i = this.selectedValues.indexOf(val.value);
        if(i == -1) {
            if(this.selectedValues.length > 0){
                this.selectedValues.push(val.value);
            }else {
                this.selectedValues = [val.value];
            }

        }else{
            this.selectedValues.splice(i, 1);
        }

        let newValue = Object.assign([], this.selectedValues);

        let valueString = "";
        if(newValue.length > 0){
            valueString = "^" + newValue.join('^,^') + "^";
        }
        this.model.setField(this.fieldname,valueString);
    }


}
