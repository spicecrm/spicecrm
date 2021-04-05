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
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: './src/objectfields/templates/fieldcolorenum.html'
})
export class fieldColorEnum  extends fieldGeneric {

    private longOptions: any = [];
    private options: any = [];
    private colors: any = [];
    private acolor: any = {'background-color': ''};


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.getOptions();
    }

    private getOptions() {
        this.longOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        let options = this.longOptions;

        if(!options || this.fieldconfig.useShort) {
            options = this.language.getDisplayOptions(this.fieldconfig.shortEnum);
        }

        this.colors = this.language.getDisplayOptions(this.fieldconfig.colorEnum);
        if(typeof this.colors !== 'undefined') {
            let colordef = '';
            colordef = this.colors[this.value];
            if (typeof colordef !== 'undefined') {
                if (colordef.substring(0, 1) != '#') {
                    colordef = '#' + colordef;
                }
            }
            this.acolor['background-color'] = colordef;
        }
        let retArray = [];
        for (let optionVal in options) {
            let arrcolor = (typeof this.colors !== 'undefined' && typeof this.colors[optionVal] !== 'undefined') ? (this.colors[optionVal].substring(0, 1) != '#' ? '#' + this.colors[optionVal] : this.colors[optionVal] ): '';
            let arrlong = (typeof this.longOptions !== 'undefined') ? this.longOptions[optionVal] : '';
            retArray.push({
                value: optionVal,
                color: arrcolor,
                display: options[optionVal],
                long: arrlong
            });
        }
        this.options = retArray;
    }

    get getColor() {
        let colordef = '';
        if (typeof this.colors != 'undefined') {
            colordef = this.colors[this.value];
            if(colordef) {
                if (colordef.substring(0, 1) != '#') {
                    colordef = '#' + colordef;
                }
            }
            this.acolor['background-color'] = colordef;
        }
        return this.acolor;
    }

    private getValue(): string {
        for (let opt of this.options) {
            if (opt.value == this.value) {
                return opt.display;
            }
        }
    }

    private changed() {
        let colordef = '';
        colordef = this.colors[this.value];
        if (typeof colordef !== 'undefined') {
            if(colordef.substring(0, 1) != '#') {
                colordef = '#' + colordef;
            }
        }
        this.acolor['background-color'] = colordef;
    }
}
