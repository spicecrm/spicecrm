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
    templateUrl: './src/objectfields/templates/fieldenummulti.html'
})
export class fieldEnumMulti extends fieldGeneric implements OnInit {
    private options: any[] = [];
    private selectedValues: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        public renderer: Renderer2
    ) {
        super(model, view, language, metadata, router);
    }

    private showSelect: boolean = false;
    clickListener: any;

    public ngOnInit() {
        this.model.data$.subscribe(
            res => {
                this.buildOptions()
            }
        );
    }


    private getValue(): string {
        let retarray: any[] = [];
        for(let selval of this.selectedValues){
            retarray.push(this.options[selval]);
        }
        return retarray.join(', ');
    }

    private getValues(){
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

    private getValueArray(): any[] {
        try {
            return this.model.data[this.fieldname].substring(1, this.model.data[this.fieldname].length - 1).split('^,^');
        } catch (e) {
            return [];
        }
    }

    private buildOptions() {
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
